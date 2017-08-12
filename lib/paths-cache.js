'use babel'
/* global atom */

import { EventEmitter } from 'events'
import path from 'path'
import _ from 'underscore-plus'
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
    this._repositories.forEach(repository => {
      if (repository.isPathIgnored(path)) {
        ignored = true
      }
    })
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
    let filePaths = this._filePathsByProjectDirectory.get(projectDirectory)
    if (!filePaths) return

    filePaths = filePaths.filter(path => !directory.contains(path))
    this._filePathsByProjectDirectory.set(projectDirectory, filePaths)

    this._filePathsByDirectory.delete(directory)
  }

  /**
   * Caches file paths for the given directory
   * @param  {Directory} projectDirectory
   * @param  {Directory} directory
   * @return {Promise}
   * @private
   */
  _cacheDirectoryFilePaths (projectDirectory, directory) {
    let watcher = this._fileWatchersByDirectory.get(directory)
    if (!watcher) {
      watcher = directory.onDidChange(() =>
        this._onDirectoryChanged(projectDirectory, directory)
      )
      this._fileWatchersByDirectory.set(directory, watcher)
    }

    return this._getDirectoryEntries(directory)
      .then(entries => {
        // Filter: Files that are not ignored
        const filePaths = entries
          .filter(entry => entry instanceof File)
          .map(entry => entry.path)
          .filter(path => !this._isPathIgnored(path))

        // Merge file paths into existing array (which contains *all* file paths)
        let filePathsArray = this._filePathsByProjectDirectory.get(projectDirectory) || []
        const newPathsCount = filePathsArray.length + filePaths.length

        const maxFileCount = atom.config.get('autocomplete-paths.maxFileCount')
        if (newPathsCount > maxFileCount) {
          atom.notifications.addError(`Maximum file count of ${maxFileCount} has been exceeded. autocomplete-paths will not work in this project.`)
          this._filePathsByProjectDirectory.clear()
          this._filePathsByDirectory.clear()
          return
        }

        this._filePathsByProjectDirectory.set(projectDirectory,
          _.union(filePathsArray, filePaths)
        )

        // Merge file paths into existing array (which contains file paths for a specific directory)
        filePathsArray = this._filePathsByDirectory.get(directory) || []
        this._filePathsByDirectory.set(directory,
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

  getFilePathsForProjectDirectory (projectDirectory) {
    return this._filePathsByProjectDirectory.get(projectDirectory) || []
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
