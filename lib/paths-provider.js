'use babel'
/* global atom */

import { EventEmitter } from 'events'
import path from 'path'
import _ from 'underscore-plus'
import slash from 'slash'
import PathsCache from './paths-cache'
import fuzzaldrin from 'fuzzaldrin-plus'
import DefaultScopes from './config/default-scopes'

export default class PathsProvider extends EventEmitter {
  constructor () {
    super()
    this.reloadScopes()

    this._pathsCache = new PathsCache()
    this._isReady = false

    this._onRebuildCache = this._onRebuildCache.bind(this)
    this._onRebuildCacheDone = this._onRebuildCacheDone.bind(this)

    this._pathsCache.on('rebuild-cache', this._onRebuildCache)
    this._pathsCache.on('rebuild-cache-done', this._onRebuildCacheDone)
  }

  /**
   * Reloads the scopes
   */
  reloadScopes () {
    this._scopes = atom.config.get('autocomplete-paths.scopes')
    this._scopes = DefaultScopes.concat(this._scopes)
  }

  /**
   * Gets called when the PathsCache is starting to rebuild the cache
   * @private
   */
  _onRebuildCache () {
    this.emit('rebuild-cache')
  }

  /**
   * Gets called when the PathsCache is done rebuilding the cache
   * @private
   */
  _onRebuildCacheDone () {
    this.emit('rebuild-cache-done')
  }

  /**
   * Checks if the given scope config matches the given request
   * @param  {Object} scope
   * @param  {Object} request
   * @return {Boolean}
   * @private
   */
  _scopeMatchesRequest (scope, request) {
    const sourceScopes = Array.isArray(scope.scopes)
      ? scope.scopes
      : [scope.scopes]

    // Check if the scope descriptors match
    const scopeMatches = _.intersection(
      request.scopeDescriptor.getScopesArray(),
      sourceScopes
    ).length > 0
    if (!scopeMatches) return false

    // Check if the line matches the prefixes
    const { editor, bufferPosition } = request
    const line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition])

    let lineMatches = false
    const scopePrefixes = Array.isArray(scope.prefixes)
      ? scope.prefixes
      : [scope.prefixes]
    scopePrefixes.forEach(prefix => {
      const regex = new RegExp(prefix, 'i')
      if (regex.test(line)) {
        lineMatches = true
      }
    })

    return lineMatches
  }

  /**
   * Returns the suggestions for the given scope and the given request
   * @param  {Object} scope
   * @param  {Object} request
   * @return {Promise}
   * @private
   */
  _getSuggestionsForScope (scope, request) {
    const projectDirectory = this._getProjectDirectory(request.editor)
    if (!projectDirectory) return Promise.resolve([])

    let files = this._pathsCache.getFilePathsForProjectDirectory(projectDirectory)
    const { extensions } = scope
    if (extensions) {
      const regex = new RegExp(`.(${extensions.join('|')})$`)
      files = files.filter(path => regex.test(path))
    }

    files = fuzzaldrin.filter(files, request.prefix, {
      maxResults: 10
    })

    let suggestions = files.map(pathName => {
      if (atom.config.get('autocomplete-paths.normalizeSlashes')) {
        pathName = slash(pathName)
      }

      let displayText = atom.project.relativizePath(pathName)[1]

      // Relativize path if necessary
      const relativePath = path.relative(path.dirname(request.editor.getPath()), pathName)
      if (scope.relative !== false) {
        pathName = relativePath
        if (scope.includeCurrentDirectory !== false) {
          if (pathName[0] !== '.') {
            pathName = `./${pathName}`
          }
        }
      }

      // Replace stuff if necessary
      if (scope.replaceOnInsert) {
        scope.replaceOnInsert.forEach(([from, to]) => {
          const regex = new RegExp(from)
          pathName = pathName.replace(regex, to)
        })
      }

      // Calculate distance to file
      const distanceToFile = relativePath.split(path.sep).length

      return {
        text: pathName,
        displayText,
        type: 'import',
        iconHTML: '<i class="icon-file-code"></i>',
        score: fuzzaldrin.score(displayText, request.prefix),
        distanceToFile
      }
    })

    // Modify score to incorporate distance
    const suggestionsCount = suggestions.length
    if (suggestions.length) {
      const maxDistance = _.max(suggestions, s => s.distanceToFile).distanceToFile
      suggestions.forEach((s, i) => {
        s.score = (suggestionsCount - i) + (maxDistance - s.distanceToFile)
      })

      // Sort again
      suggestions.sort((a, b) => b.score - a.score)
    }

    return Promise.resolve(suggestions)
  }

  /**
   * Returns the suggestions for the given request
   * @param  {Object} request
   * @return {Promise}
   */
  getSuggestions (request) {
    const scopes = this._scopes.filter(scope => this._scopeMatchesRequest(scope, request))
    const promises = scopes.map(scope => this._getSuggestionsForScope(scope, request))
    return Promise.all(promises)
      .then(suggestions => {
        suggestions = _.flatten(suggestions)
        if (!suggestions.length) return false
        return suggestions
      })
  }

  /**
   * Rebuilds the cache
   * @return {Promise}
   */
  rebuildCache () {
    return this._pathsCache.rebuildCache()
      .then(result => {
        this._isReady = true
        return result
      })
  }

  /**
   * Returns the project directory that contains the file opened in the given editor
   * @param  {TextEditor} editor
   * @return {Directory}
   * @private
   */
  _getProjectDirectory (editor) {
    const filePath = editor.getBuffer().getPath()
    let projectDirectory = null
    atom.project.getDirectories().forEach(directory => {
      if (directory.contains(filePath)) {
        projectDirectory = directory
      }
    })
    return projectDirectory
  }

  isReady () { return this._isReady }

  /**
   * Disposes this provider
   */
  dispose () {
    this._pathsCache.removeListener('rebuild-cache', this._onRebuildCache)
    this._pathsCache.removeListener('rebuild-cache-done', this._onRebuildCacheDone)
    this._pathsCache.dispose()
  }
}

PathsProvider.prototype.selector = '*'
PathsProvider.prototype.inclusionPriority = 1
