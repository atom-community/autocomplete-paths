'use babel'
/* global atom */

import { EventEmitter } from 'events'
import path from 'path'
import readdirp from 'readdirp'
import PathWatcher from 'pathwatcher'
import _ from 'underscore-plus'

export default class PathsCache extends EventEmitter {
  constructor () {
    super()
    this._isPathIgnored = this._isPathIgnored.bind(this)
    this._repositories = {}
    this._projects = {}
    this._pathWatchers = []
    this._projectPaths = []
    this._repositories = []
  }

  /**
   * Checks if the given path is ignored
   * @param  {String}  path
   * @return {Boolean}
   * @private
   */
  _isPathIgnored (path) {
    let ignored = false
    this._repositories.forEach((repository) => {
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
    this._projectPaths = atom.project.getPaths()
    this._repositories = atom.project.getRepositories()

    return Promise.resolve()
  }

  /**
   * Watches the directory at the given path
   * @param  {String} path
   */
  _watchDirectory (path) {
    const watcher = PathWatcher.watch(path, (event, changedPath) => {
      if (event !== 'delete') {
        this._removeEntriesForDirectory(path, { recursive: false })

        watcher.close()
        this._pathWatchers = _.without(this._pathWatchers, watcher)

        this.rebuildCache(path)
      } else {
        this._removeEntriesForDirectory(path, { recursive: true })
        watcher.close()
        this._pathWatchers = _.without(this._pathWatchers, watcher)
      }
    })
    this._pathWatchers.push(watcher)
  }

  _removeEntriesForDirectory (directoryPath) {
    this._projectPaths.forEach(projectPath => {
      const { directories, files } = this._projects[projectPath]

      const filter = (entry) => entry.indexOf(directoryPath) !== 0
      this._projects[projectPath].directories = directories.filter(filter)
      this._projects[projectPath].files = files.filter(filter)
    })
  }

  /**
   * Caches the files for the given project path
   * @param  {String} projectPath
   * @return {Promise}
   * @private
   */
  _cacheProjectFiles (projectPath, subPath = '/', extend = false) {
    const actualPath = path.join(projectPath, subPath)

    const filter = (item) => !this._isPathIgnored(item.fullPath)

    this._watchDirectory(actualPath)
    return new Promise((resolve, reject) => {
      readdirp({
        root: actualPath,
        lstat: true,
        fileFilter: filter,
        directoryFilter: filter
      }, (err, res) => {
        if (err) return reject(err)

        let { directories, files } = res
        directories = directories.map((d) => d.fullPath)
        directories
          .filter((d) => !this._isPathIgnored(d))
          .forEach((d) => this._watchDirectory(d))

        files = files
          .map((f) => f.fullPath)
          .filter((p) => !this._isPathIgnored(p))

        if (!extend || !this._projects[projectPath]) {
          // We're doing a fresh index or full re-indexing
          this._projects[projectPath] = {
            directories,
            files
          }
        } else {
          // We're indexing a sub-directory, so we need to add new directories and/or files
          this._projects[projectPath].directories = _.union(
            this._projects[projectPath].directories,
            directories
          )
          this._projects[projectPath].files = _.union(
            this._projects[projectPath].files,
            files
          )
        }
        resolve()
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
    this._closeAllPathWatchers()
    return this._cacheProjectPathsAndRepositories()
      .then(() => {
        return Promise.all(
          this._projectPaths.map((projectPath) => {
            return this._cacheProjectFiles(projectPath)
          })
        )
      })
      .then((result) => {
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

  getFilesForProjectPath (projectPath) { return this._projects[projectPath].files }
  getDirectoriesForProjectPath (projectPath) { return this._projects[projectPath].directories }
  getProjectPaths () { return this._projectPaths }

  /**
   * Closes all path watchers
   * @private
   */
  _closeAllPathWatchers () {
    this._pathWatchers.forEach((pw) => pw.close())
    this._pathWatchers = []
  }

  /**
   * Disposes this PathsCache
   */
  dispose () {
    this._closeAllPathWatchers()
  }
}
