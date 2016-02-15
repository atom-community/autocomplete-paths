'use babel'
/* global atom */

import _ from 'underscore-plus'
import path from 'path'
import PathsCache from './paths-cache'
import fuzzaldrin from 'fuzzaldrin-plus'
import DefaultScopes from './config/default-scopes'

export default class PathsProvider {
  constructor () {
    this._scopes = atom.config.get('autocomplete-paths.scopes')
    this._scopes = DefaultScopes.concat(this._scopes)
    this._pathsCache = new PathsCache()
    this._pathsCache.rebuildCache()
      .catch((e) => {
        throw e
      })
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
    scopePrefixes.forEach((prefix) => {
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
    let paths = this._pathsCache.getPaths()

    const { extensions } = scope
    if (extensions) {
      const regex = new RegExp(`\.(${extensions.join('|')})$`)
      paths = paths.filter((path) => regex.test(path))
    }

    paths = fuzzaldrin.filter(paths, request.prefix)

    const suggestions = paths.map((pathName) => {
      let displayText = atom.project.relativizePath(pathName)[1]

      // Relativize path if necessary
      if (scope.relative) {
        pathName = path.relative(path.dirname(request.editor.getPath()), pathName)
        if (pathName[0] !== '.') {
          pathName = `./${pathName}`
        }
      }

      // Replace stuff if necessary
      if (scope.replaceOnInsert) {
        scope.replaceOnInsert.forEach(([from, to]) => {
          const regex = new RegExp(from)
          pathName = pathName.replace(regex, to)
        })
      }

      return {
        text: pathName,
        displayText,
        type: 'import',
        iconHTML: '<i class="icon-file-code"></i>'
      }
    })
    return Promise.resolve(suggestions)
  }

  /**
   * Returns the suggestions for the given request
   * @param  {Object} request
   * @return {Promise}
   */
  getSuggestions (request) {
    const scopes = this._scopes.filter((scope) => this._scopeMatchesRequest(scope, request))
    const promises = scopes.map((scope) => this._getSuggestionsForScope(scope, request))
    return Promise.all(promises)
      .then((suggestions) => {
        return _.flatten(suggestions)
      })
  }

  rebuildCache () {
    return this._pathsCache.rebuildCache()
  }
}

PathsProvider.prototype.selector = '*'
PathsProvider.prototype.inclusionPriority = 1
PathsProvider.prototype.excludeLowerPriority = true
