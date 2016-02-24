'use babel'
/* global atom */

import { EventEmitter } from 'events'
import readdirp from 'readdirp'
import PathWatcher from 'pathwatcher'

export default class PathsCache extends EventEmitter {
  constructor () {
    super()
    this._isPathIgnored = this._isPathIgnored.bind(this)
    this._repositories = {}
    this._projects = {}
    this._pathWatchers = []
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
    const watcher = PathWatcher.watch(path, (event, path) => {
      this.rebuildCache()
    })
    this._pathWatchers.push(watcher)
  }

  /**
   * Caches the files for the given project path
   * @param  {String} projectPath
   * @return {Promise}
   * @private
   */
  _cacheProjectFiles (projectPath) {
    this._watchDirectory(projectPath)
    return new Promise((resolve, reject) => {
      readdirp({ root: projectPath, lstat: true }, (err, res) => {
        if (err) return reject(err)

        let { directories, files } = res
        directories = directories.map((d) => d.fullPath)
        directories
          .filter((d) => !this._isPathIgnored(d))
          .forEach((d) => this._watchDirectory(d))

        const paths = files
          .map((f) => f.fullPath)
          .filter((p) => !this._isPathIgnored(p))

        this._projects[projectPath] = {
          directories,
          paths
        }
        resolve(this._projects[projectPath].paths)
      })
    })
  }

  /**
   * Rebuilds the paths cache
   */
  rebuildCache () {
    this.emit('rebuild-cache')
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

  getPathsForProjectPath (projectPath) { return this._projects[projectPath].paths }
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
