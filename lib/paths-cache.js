'use babel'
/* global atom */

import { EventEmitter } from 'events'
import fs from 'fs'
import gitIgnoreParser from 'git-ignore-parser';
import path from 'path'
import _ from 'underscore-plus'
import minimatch from 'minimatch'
import { Directory, File } from 'atom'
import { execPromise } from './utils'

export default class PathsCache extends EventEmitter {
  constructor () {
    super()

    this._projectChangeWatcher = atom.project.onDidChangePaths(() => this.rebuildCache())

    this._repositories = []
    this._filePathsByProjectDirectory = new Map()
    this._filePathsByDirectory = new Map()
    this._fileWatchersByDirectory = new Map()
  }

  /**
   * Checks if the given path is ignored
   * @param  {String}  path
   * @return {Boolean}
   * @private
   */
  _isPathIgnored (path) {
    let ignored = false
    if (atom.config.get('core.excludeVcsIgnoredPaths')) {
      this._repositories.forEach(repository => {
        if (ignored) return
        const ignoreSubmodules = atom.config.get('autocomplete-paths.ignoreSubmodules')
        const isIgnoredSubmodule = ignoreSubmodules && repository.isSubmodule(path)
        if (repository.isPathIgnored(path) || isIgnoredSubmodule) {
          ignored = true
        }
      })
    }

    if (atom.config.get('autocomplete-paths.ignoredNames')) {
      const ignoredNames = atom.config.get('core.ignoredNames')
      ignoredNames.forEach(ignoredName => {
        if (ignored) return
        ignored = ignored || minimatch(path, ignoredName, { matchBase: true, dot: true })
      })
    }

    const ignoredPatterns = atom.config.get('autocomplete-paths.ignoredPatterns')
    if (ignoredPatterns) {
      ignoredPatterns.forEach(ignoredPattern => {
        if (ignored) return
        ignored = ignored || minimatch(path, ignoredPattern, { dot: true })
      })
    }

    return ignored
  }

  /**
   * Caches the project paths and repositories
   * @return {Promise}
   * @private
   */
  _cacheProjectPathsAndRepositories () {
    this._projectDirectories = atom.project.getDirectories()

    return Promise.all(this._projectDirectories
      .map(atom.project.repositoryForDirectory.bind(atom.project))
    ).then(repositories => {
      this._repositories = repositories.filter(r => r)
    })
  }

  /**
   * Invoked when the content of the given `directory` has changed
   * @param  {Directory} projectDirectory
   * @param  {Directory} directory
   * @private
   */
  _onDirectoryChanged (projectDirectory, directory) {
    this._removeFilePathsForDirectory(projectDirectory, directory)
    this._cleanWatchersForDirectory(directory)
    this._cacheDirectoryFilePaths(projectDirectory, directory)
  }

  /**
   * Removes all watchers inside the given directory
   * @param  {Directory} directory
   * @private
   */
  _cleanWatchersForDirectory (directory) {
    this._fileWatchersByDirectory.forEach((watcher, otherDirectory) => {
      if (directory.contains(otherDirectory.path)) {
        watcher.dispose()
        this._fileWatchersByDirectory.delete(otherDirectory)
      }
    })
  }

  /**
   * Removes all cached file paths in the given directory
   * @param  {Directory} projectDirectory
   * @param  {Directory} directory
   * @private
   */
  _removeFilePathsForDirectory (projectDirectory, directory) {
    let filePaths = this._filePathsByProjectDirectory.get(projectDirectory.path)
    if (!filePaths) return

    filePaths = filePaths.filter(path => !directory.contains(path))
    this._filePathsByProjectDirectory.set(projectDirectory.path, filePaths)

    this._filePathsByDirectory.delete(directory.path)
  }

  /**
   * Caches file paths for the given directory
   * @param  {Directory} projectDirectory
   * @param  {Directory} directory
   * @return {Promise}
   * @private
   */
  _cacheDirectoryFilePaths (projectDirectory, directory) {
    if (this._cancelled) return Promise.resolve([])

    if (process.platform !== 'win32') {
      let watcher = this._fileWatchersByDirectory.get(directory)
      if (!watcher) {
        watcher = directory.onDidChange(() =>
          this._onDirectoryChanged(projectDirectory, directory)
        )
        this._fileWatchersByDirectory.set(directory, watcher)
      }
    }

    return this._getDirectoryEntries(directory)
      .then(entries => {
        if (this._cancelled) return Promise.resolve([])

        // Filter: Files that are not ignored
        const filePaths = entries
          .filter(entry => entry instanceof File)
          .map(entry => entry.path)
          .filter(path => !this._isPathIgnored(path))

        // Merge file paths into existing array (which contains *all* file paths)
        let filePathsArray = this._filePathsByProjectDirectory.get(projectDirectory.path) || []
        const newPathsCount = filePathsArray.length + filePaths.length

        const maxFileCount = atom.config.get('autocomplete-paths.maxFileCount')
        if (newPathsCount > maxFileCount && !this._cancelled) {
          atom.notifications.addError('autocomplete-paths', {
            description: `Maximum file count of ${maxFileCount} has been exceeded. Path autocompletion will not work in this project.<br /><br /><a href="https://github.com/atom-community/autocomplete-paths/wiki/Troubleshooting#maximum-file-limit-exceeded">Click here to learn more.</a>`,
            dismissable: true
          })

          this._filePathsByProjectDirectory.clear()
          this._filePathsByDirectory.clear()
          this._cancelled = true
          this.emit('rebuild-cache-done')
          return
        }

        this._filePathsByProjectDirectory.set(projectDirectory.path,
          _.union(filePathsArray, filePaths)
        )

        // Merge file paths into existing array (which contains file paths for a specific directory)
        filePathsArray = this._filePathsByDirectory.get(directory.path) || []
        this._filePathsByDirectory.set(directory.path,
          _.union(filePathsArray, filePaths)
        )

        const directories = entries
          .filter(entry => entry instanceof Directory)
          .filter(entry => !this._isPathIgnored(entry.path))

        return Promise.all(directories.map(directory =>
          this._cacheDirectoryFilePaths(projectDirectory, directory)
        ))
      })
  }

  /**
   * Promisified version of Directory#getEntries
   * @param  {Directory} directory
   * @return {Promise}
   * @private
   */
  _getDirectoryEntries (directory) {
    return new Promise((resolve, reject) => {
      directory.getEntries((err, entries) => {
        if (err) return reject(err)
        resolve(entries)
      })
    })
  }

  /**
   * Rebuilds the paths cache
   */
  rebuildCache (path = null) {
    this.dispose()

    this._cancelled = false
    this.emit('rebuild-cache')

    return execPromise('find --version')
      .then(
        // `find` is available
        () => this._buildInitialCacheWithFind(),
        // `find` is not available
        () => this._buildInitialCache()
      )
  }

  /**
   * Builds the initial file cache
   * @return {Promise}
   * @private
   */
  _buildInitialCache () {
    return this._cacheProjectPathsAndRepositories()
      .then(() => {
        return Promise.all(
          this._projectDirectories.map(projectDirectory => {
            return this._cacheDirectoryFilePaths(projectDirectory, projectDirectory)
          })
        )
      })
      .then(result => {
        this.emit('rebuild-cache-done')
        return result
      })
  }

  /**
   * Returns the project path for the given file / directory pathName
   * @param  {String} pathName
   * @return {String}
   * @private
   */
  _getProjectPathForPath (pathName) {
    const projects = this._projectPaths
    for (let i = 0; i < projects.length; i++) {
      const projectPath = projects[i]
      if (pathName.indexOf(projectPath) === 0) {
        return projectPath
      }
    }
    return false
  }

  /**
   * Returns the file paths for the given project directory with the given (optional) relative path
   * @param  {Directory} projectDirectory
   * @param  {String} [relativeToPath=null]
   * @return {String[]}
   */
  getFilePathsForProjectDirectory (projectDirectory, relativeToPath = null) {
    let filePaths = this._filePathsByProjectDirectory.get(projectDirectory.path) || []
    if (relativeToPath) {
      return filePaths.filter(filePath => filePath.indexOf(relativeToPath) === 0)
    }
    return filePaths
  }

  /**
   * Disposes this PathsCache
   */
  dispose(isPackageDispose) {
    this._fileWatchersByDirectory.forEach((watcher, directory) => {
      watcher.dispose()
    })
    this._fileWatchersByDirectory = new Map()
    this._filePathsByProjectDirectory = new Map()
    this._filePathsByDirectory = new Map()
    this._repositories = []
    if (this._projectWatcher) {
      this._projectWatcher.dispose()
      this._projectWatcher = null
    }
    if (isPackageDispose && this._projectChangeWatcher) {
      this._projectChangeWatcher.dispose()
      this._projectChangeWatcher = null
    }
  }

  //
  // Cache with `find`
  //

  /**
   * Builds the initial file cache with `find`
   * @return {Promise}
   * @private
   */
  _buildInitialCacheWithFind() {
    return this._cacheProjectPathsAndRepositories()
      .then(() => {
        this._projectWatcher = atom.project.onDidChangeFiles(this._onDidChangeFiles.bind(this))

        return Promise.all(
          this._projectDirectories.map(this._populateCacheFor.bind(this))
        );
      })
      .then(result => {
        this.emit('rebuild-cache-done');
        return result;
      });
  }

  _onDidChangeFiles(events) {
    events
      .filter(event => event.action !== 'modified')
      .forEach(event => {
        if (!this._projectDirectories) {
          return;
        }

        const { action, path, oldPath } = event;

        const projectDirectory = this._projectDirectories
          .find(projectDirectory => path.indexOf(projectDirectory.path) === 0);

        if (!projectDirectory) {
          return;
        }
        const directoryPath = projectDirectory.path;
        const ignored = this._isPathIgnored(path);

        if (ignored) {
          return;
        }

        const files = this._filePathsByProjectDirectory.get(directoryPath) || [];

        switch (action) {
          case 'created':
            files.push(path);
            break;

          case 'deleted':
            const i = files.indexOf(path);
            if (i > -1) {
              files.splice(i, 1);
            }
            break;

          case 'renamed':
            const j = files.indexOf(oldPath);
            if (j > -1) {
              files[j] = path;
            }
            break;
        }

        if (!this._filePathsByProjectDirectory.has(directoryPath)) {
          this._filePathsByProjectDirectory.set(directoryPath, files);
        }
      });
  }

  /**
   * Returns a list of ignore patterns for a directory
   * @param  {String} directoryPath
   * @return {String[]}
   * @private
   */
  _getIgnorePatterns(directoryPath) {
    const patterns = [];

    if (atom.config.get('autocomplete-paths.ignoredNames')) {
      atom.config.get('core.ignoredNames').forEach(pattern => patterns.push(pattern));
    }

    if (atom.config.get('core.excludeVcsIgnoredPaths')) {
      try {
        const gitIgnore = fs.readFileSync(directoryPath + '/.gitignore', 'utf-8');
        gitIgnoreParser(gitIgnore).forEach(pattern => patterns.push(pattern));
      }
      catch(err) {
        // .gitignore does not exist for this directory, ignoring
      }
    }

    const ignoredPatterns = atom.config.get('autocomplete-paths.ignoredPatterns');
    if (ignoredPatterns) {
      ignoredPatterns.forEach(pattern => patterns.push(pattern));
    }

    return patterns;
  }

  /**
   * Populates cache for a project directory
   * @param  {Directory} projectDirectory
   * @return {Promise}
   * @private
   */
  _populateCacheFor(projectDirectory) {
    const directoryPath = projectDirectory.path;

    const ignorePatterns = this._getIgnorePatterns(directoryPath);
    const ignorePatternsForFind = ignorePatterns.map(
      pattern => pattern
        .replace(/\./g, '\\.')
        .replace(/\*/g, '.*')
    );
    const ignorePattern = '\'.*\\(' + ignorePatternsForFind.join('\\|') + '\\).*\'';

    const cmd = [
      'find',
      '-L',
      directoryPath + '/',
      '-type', 'f',
      '-not', '-regex', ignorePattern,
    ].join(' ');

    return execPromise(cmd, {
      maxBuffer: 1024 * 1024,
    }).then(stdout => {
      const files = _.compact(stdout.split('\n'));

      this._filePathsByProjectDirectory.set(directoryPath, files);

      return files;
    });
  }
}
