'use babel'
/* global atom */

import { EventEmitter } from 'events'
import fs from 'fs'
import gitIgnoreParser from 'git-ignore-parser';
import spawn from 'await-spawn';
import _ from 'underscore-plus'
import minimatch from 'minimatch'
import { Directory, File } from 'atom'
import { union } from './utils'
import { execFile as execFileCallbacked } from 'child_process'
import { promisify } from 'util'
const execFile = promisify(execFileCallbacked)

export default class PathsCache extends EventEmitter {
  constructor () {
    super()

    const rebuildCacheBound = this.rebuildCache.bind(this)
    this._projectChangeWatcher = atom.project.onDidChangePaths(rebuildCacheBound)

    const _onDidChangeFilesBound = this._onDidChangeFiles.bind(this)
    this._projectWatcher = atom.project.onDidChangeFiles(_onDidChangeFilesBound)

    this._repositories = []
    this._filePathsByProjectDirectory = new Map()
    this._filePathsByDirectory = new Map()
    this._fileWatchersByDirectory = new Map()

    this.updateConfig()
  }

  updateConfig() {
    this.config = {
      excludeVcsIgnoredPaths: atom.config.get('core.excludeVcsIgnoredPaths'),
      ignoreSubmodules: atom.config.get('autocomplete-paths.ignoreSubmodules'),
      shouldIgnoredNames: atom.config.get('autocomplete-paths.ignoredNames'),
      ignoredNames: atom.config.get('core.ignoredNames'),
      ignoredPatterns: atom.config.get('autocomplete-paths.ignoredPatterns'),
      maxFileCount: atom.config.get('autocomplete-paths.maxFileCount')
    }
  }

  /**
   * Checks if the given path is ignored
   * @param  {String}  path
   * @return {Boolean}
   * @private
   */
  _isPathIgnored (path) {
    let ignored = false
    if (this.config.excludeVcsIgnoredPaths) {
      this._repositories.forEach(repository => {
        if (ignored) return
        const isIgnoredSubmodule = this.config.ignoreSubmodules && repository.isSubmodule(path)
        if (repository.isPathIgnored(path) || isIgnoredSubmodule) {
          ignored = true
        }
      })
    }

    if (this.config.shouldIgnoredNames) {
      this.config.ignoredNames.forEach(ignoredName => {
        if (ignored) return
        ignored = ignored || minimatch(path, ignoredName, { matchBase: true, dot: true })
      })
    }

    if (this.config.ignoredPatterns) {
      this.config.ignoredPatterns.forEach(ignoredPattern => {
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
  async _cacheProjectPathsAndRepositories () {
    this._projectDirectories = atom.project.getDirectories()

    // get the repositories asynchronously
    const projectNum = this._projectDirectories.length
    let repositoriesP = new Array(projectNum)
    for (let i = 0; i < projectNum; i++) {
      repositoriesP[i] = atom.project.repositoryForDirectory(this._projectDirectories[i])
    }
    const repositories = await Promise.all(repositoriesP)
    this._repositories = repositories.filter(r => r !== null) // filter out non-repository directories
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
  async _cacheDirectoryFilePaths (projectDirectory, directory) {
    if (this._cancelled) return []

    if (process.platform !== 'win32') {
      let watcher = this._fileWatchersByDirectory.get(directory)
      if (!watcher) {
        watcher = directory.onDidChange(() =>
          this._onDirectoryChanged(projectDirectory, directory)
        )
        this._fileWatchersByDirectory.set(directory, watcher)
      }
    }
    const entries = await this._getDirectoryEntries(directory)
    if (this._cancelled) return []

    // Filter: Files and Directories that are not ignored
    let filePaths = []
    let directories = []
    for (let i = 0, len = entries.length; i < len; i++) {
      const entry = entries[i]
      if (entry instanceof File && !this._isPathIgnored(entry.path)) {
        filePaths.push(entry.path)
      } else if (entry instanceof Directory && !this._isPathIgnored(entry.path)) {
        directories.push(entry)
      }
    }

    // Merge file paths into existing array (which contains *all* file paths)
    let filePathsArray = this._filePathsByProjectDirectory.get(projectDirectory.path) || []
    const newPathsCount = filePathsArray.length + filePaths.length

    if (newPathsCount > this.config.maxFileCount && !this._cancelled) {
      atom.notifications.addError('autocomplete-paths', {
        description: `Maximum file count of ${this.config.maxFileCount} has been exceeded. Path autocompletion will not work in this project.<br /><br /><a href="https://github.com/atom-community/autocomplete-paths/wiki/Troubleshooting#maximum-file-limit-exceeded">Click here to learn more.</a>`,
        dismissable: true
      })

      this._filePathsByProjectDirectory.clear()
      this._filePathsByDirectory.clear()
      this._cancelled = true
      this.emit('rebuild-cache-done')
      return
    }

    this._filePathsByProjectDirectory.set(projectDirectory.path,
      union(filePathsArray, filePaths)
    )

    // Merge file paths into existing array (which contains file paths for a specific directory)
    filePathsArray = this._filePathsByDirectory.get(directory.path) || []
    this._filePathsByDirectory.set(directory.path,
      union(filePathsArray, filePaths)
    )

    return Promise.all(directories.map(directory =>
      this._cacheDirectoryFilePaths(projectDirectory, directory)
    ))
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
  rebuildCache () {
    this.dispose()

    this._cancelled = false
    this.emit('rebuild-cache')

    // `find` works
    return this._buildInitialCacheWithFind().catch(() => {
      // fallback to `findless` method
      return this._buildInitialCache()
    })
  }

  /**
   * Builds the initial file cache
   * @return {Promise}
   * @private
   */
  async _buildInitialCache () {
    await this._cacheProjectPathsAndRepositories()
    const result = await Promise.all(
      this._projectDirectories.map(projectDirectory => {
        return this._cacheDirectoryFilePaths(projectDirectory, projectDirectory)
      })
    )
    this.emit('rebuild-cache-done')
    return result
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
    this._fileWatchersByDirectory.forEach((watcher) => {
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
  async _buildInitialCacheWithFind() {
    await this._cacheProjectPathsAndRepositories()
    const result = await Promise.all(
      this._projectDirectories.map(this._populateCacheFor.bind(this))
    );

    this.emit('rebuild-cache-done');
    return result;
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

    if (this.config.shouldIgnoredNames) {
      this.config.ignoredNames.forEach(pattern => patterns.push(pattern));
    }

    if (this.config.excludeVcsIgnoredPaths) {
      try {
        const gitIgnore = fs.readFileSync(directoryPath + '/.gitignore', 'utf-8');
        gitIgnoreParser(gitIgnore).forEach(pattern => patterns.push(pattern));
      }
      catch(err) {
        // .gitignore does not exist for this directory, ignoring
      }
    }

    if (this.config.ignoredPatterns) {
      this.config.ignoredPatterns.forEach(pattern => patterns.push(pattern));
    }

    return patterns;
  }

  /**
   * Populates cache for a project directory
   * @param  {Directory} projectDirectory
   * @return {Promise}
   * @private
   */
  async _populateCacheFor(projectDirectory) {
    const directoryPath = projectDirectory.path;

    const ignorePatterns = this._getIgnorePatterns(directoryPath);
    const ignorePatternsForFind = ignorePatterns.map(
      pattern => pattern
        .replace(/\./g, '\\.')
        .replace(/\*/g, '.*')
    );

    let files = []
    if (process.platform === 'win32') {
      const { stdout } = await execFile(
        'dir',
        [
          '/A', // Show all files
          '/S', // Include all subfolders
          '/B', // Bare format (no heading, file sizes or summary)
          directoryPath
        ], {shell: true, maxBuffer: 10000*10000})

      const rawFiles = stdout.split(/\r?\n/)

      const ignorePatternRegexp =  new RegExp(ignorePatternsForFind.join("|"))

      // filter files that are not ignored
      for (let i = 0, len = rawFiles.length; i < len; i++) {
        const file = rawFiles[i]
        if (file !== "" && !file.match(ignorePatternRegexp)) {
          files.push(file)
        }
      }
      
    } else {
      const ignorePattern = '\'.*\\(' + ignorePatternsForFind.join('\\|') + '\\).*\'';
      stdout = await spawn(
        'find',
        [
          '-L',
          directoryPath + '/',
          '-type', 'f',
          '-not', '-regex', ignorePattern,
        ])
        files = _.compact(stdout.toString().split('\n'));
    }

    this._filePathsByProjectDirectory.set(directoryPath, files);

    return files;
  }
}


/**
 * Returns the project path for the given file / directory pathName
 * @param {Array<string>} projects the paths of the projects (this._projectPaths)
 * @param  {String} pathName
 * @return {String}
 * @private
 */
function getProjectPathForPath (projects, pathName) {
  for (let i = 0; i < projects.length; i++) {
    const projectPath = projects[i]
    if (pathName.indexOf(projectPath) === 0) {
      return projectPath
    }
  }
  return false
}
