'use babel'
/* global atom */

import { EventEmitter } from 'events'
import path from 'path'
import _ from 'underscore-plus'
import minimatch from 'minimatch'
import { Directory, File } from 'atom'

export default class PathsCache extends EventEmitter {
  constructor () {
    super()

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
    if (!path) {
      return this._buildInitialCache()
    } else {
      return this._rebuildCacheForPath(path)
    }
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
   * Rebuilds the cache for the given path
   * @param  {String} directoryPath
   * @return {Promise}
   * @private
   */
  _rebuildCacheForPath (directoryPath) {
    const projectPath = this._getProjectPathForPath(directoryPath)
    const subPath = path.relative(projectPath, directoryPath)
    return this._cacheProjectFiles(projectPath, subPath, true)
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

  getFilePathsForDirectory (directory) {
    return this._filePathsByDirectory.get(directory.path) || []
  }

  /**
   * Disposes this PathsCache
   */
  dispose () {
    this._fileWatchersByDirectory.forEach((watcher, directory) => {
      watcher.dispose()
    })
    this._fileWatchersByDirectory = new Map()
    this._filePathsByProjectDirectory = new Map()
    this._filePathsByDirectory = new Map()
    this._repositories = []
  }
}
