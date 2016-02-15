'use babel'
/* global atom */

import recursiveReaddir from 'recursive-readdir'

export default class PathsCache {
  constructor () {
    this._isPathIgnored = this._isPathIgnored.bind(this)
    this._projects = {}
    this._repositories = {}
    this._paths = {}
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

    const directories = atom.project.getDirectories()
    return Promise.all(directories.map(atom.project.repositoryForDirectory.bind(atom.project)))
      .then((repositories) => {
        this._repositories = repositories.filter((r) => !!r)
      })
  }

  /**
   * Gets all paths from all project directories
   * @return {Promise}
   */
  _getAllPaths () {
    return Promise.all(this._projectPaths.map((path) => {
      return new Promise((resolve, reject) => {
        recursiveReaddir(path, [this._isPathIgnored], (err, paths) => {
          if (err) return reject(err)
          resolve(paths)
        })
      })
    }))
  }

  /**
   * Caches the files for the given project path
   * @param  {String} projectPath
   * @return {Promise}
   * @private
   */
  _cacheProjectFiles (projectPath) {
    this._paths[projectPath] = []
    return new Promise((resolve, reject) => {
      recursiveReaddir(projectPath, [this._isPathIgnored], (err, paths) => {
        if (err) return reject(err)
        this._paths[projectPath] = paths
        resolve()
      })
    })
  }

  /**
   * Rebuilds the paths cache
   */
  rebuildCache () {
    return this._cacheProjectPathsAndRepositories()
      .then(() => {
        return Promise.all(
          this._projectPaths.map((projectPath) => {
            return this._cacheProjectFiles(projectPath)
          })
        )
      })
  }

  getPathsForProjectPath (projectPath) { return this._paths[projectPath] }
  getProjectPaths () { return this._projectPaths }
}
