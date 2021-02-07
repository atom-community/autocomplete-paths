"use babel"
/* global atom */

import { EventEmitter } from "events"
import path from "path"
import { intersection, flatten, max } from "underscore"
import slash from "slash"
import PathsCache from "./paths-cache"
import { score, filter } from "zadeh"
import DefaultScopes from "./config/default-scopes"
import OptionScopes from "./config/option-scopes"

export default class PathsProvider extends EventEmitter {
  constructor() {
    super()
    this.reloadScopes()

    this._pathsCache = new PathsCache()
    this._isReady = false

    this._onRebuildCache = this._onRebuildCache.bind(this)
    this._onRebuildCacheDone = this._onRebuildCacheDone.bind(this)

    this._pathsCache.on("rebuild-cache", this._onRebuildCache)
    this._pathsCache.on("rebuild-cache-done", this._onRebuildCacheDone)
  }

  /**
   * Reloads the scopes
   */
  reloadScopes() {
    this._scopes = atom.config.get("autocomplete-paths.scopes").slice(0) || []

    if (!atom.config.get("autocomplete-paths.ignoreBuiltinScopes")) {
      this._scopes = this._scopes.concat(DefaultScopes)
    }

    for (var key in OptionScopes) {
      if (atom.config.get(`autocomplete-paths.${key}`)) {
        this._scopes = this._scopes.slice(0).concat(OptionScopes[key])
      }
    }
  }

  /**
   * Gets called when the PathsCache is starting to rebuild the cache
   * @private
   */
  _onRebuildCache() {
    this.emit("rebuild-cache")
  }

  /**
   * Gets called when the PathsCache is done rebuilding the cache
   * @private
   */
  _onRebuildCacheDone() {
    this.emit("rebuild-cache-done")
  }

  /**
   * Checks if the given scope config matches the given request
   * @param  {Object} scope
   * @param  {Object} request
   * @return {Array} The match object
   * @private
   */
  _scopeMatchesRequest(scope, request) {
    const sourceScopes = Array.isArray(scope.scopes) ? scope.scopes : [scope.scopes]

    // Check if the scope descriptors match
    const scopeMatches = intersection(request.scopeDescriptor.getScopesArray(), sourceScopes).length > 0
    if (!scopeMatches) return false

    // Check if the line matches the prefixes
    const line = this._getLineTextForRequest(request)

    let lineMatch = null
    const scopePrefixes = Array.isArray(scope.prefixes) ? scope.prefixes : [scope.prefixes]
    scopePrefixes.forEach((prefix) => {
      const regex = new RegExp(prefix, "i")
      lineMatch = lineMatch || line.match(regex)
    })

    return lineMatch
  }

  /**
   * Returns the whole line text for the given request
   * @param  {Object} request
   * @return {String}
   * @private
   */
  _getLineTextForRequest(request) {
    const { editor, bufferPosition } = request
    return editor.getTextInRange([[bufferPosition.row, 0], bufferPosition])
  }

  /**
   * Returns the suggestions for the given scope and the given request
   * @param  {Object} scope
   * @param  {Object} request
   * @return {Promise}
   * @private
   */
  _getSuggestionsForScope(scope, request, match) {
    const line = this._getLineTextForRequest(request)
    const pathPrefix = line.substr(match.index + match[0].length)
    const trailingSlashPresent = pathPrefix.match(/[/|\\]$/)
    const directoryGiven = pathPrefix.indexOf("./") === 0 || pathPrefix.indexOf("../") === 0
    const parsedPathPrefix = path.parse(pathPrefix)

    // path.parse ignores trailing slashes, so we handle this manually
    if (trailingSlashPresent) {
      parsedPathPrefix.dir = path.join(parsedPathPrefix.dir, parsedPathPrefix.base)
      parsedPathPrefix.base = ""
      parsedPathPrefix.name = ""
    }

    const projectDirectory = this._getProjectDirectory(request.editor)
    if (!projectDirectory) return Promise.resolve([])
    const currentDirectory = path.dirname(request.editor.getPath())

    const requestedDirectoryPath = path.resolve(currentDirectory, parsedPathPrefix.dir)

    let files = directoryGiven
      ? this._pathsCache.getFilePathsForProjectDirectory(projectDirectory, requestedDirectoryPath)
      : this._pathsCache.getFilePathsForProjectDirectory(projectDirectory)

    const fuzzyMatcher = directoryGiven ? parsedPathPrefix.base : pathPrefix

    const { extensions } = scope
    if (extensions) {
      const regex = new RegExp(`.(${extensions.join("|")})$`)
      files = files.filter((path) => regex.test(path))
    }

    if (fuzzyMatcher) {
      files = filter(files, fuzzyMatcher, {
        maxResults: 10,
      })
    }

    let suggestions = files.map((pathName) => {
      const normalizeSlashes = atom.config.get("autocomplete-paths.normalizeSlashes")

      const projectRelativePath = atom.project.relativizePath(pathName)[1]
      let displayText = projectRelativePath
      if (directoryGiven) {
        displayText = path.relative(requestedDirectoryPath, pathName)
      }
      if (normalizeSlashes) {
        displayText = slash(displayText)
      }

      // Relativize path to current file if necessary
      let relativePath = path.relative(path.dirname(request.editor.getPath()), pathName)
      if (normalizeSlashes) relativePath = slash(relativePath)
      if (scope.relative !== false) {
        pathName = relativePath
        if (scope.includeCurrentDirectory !== false) {
          if (pathName[0] !== ".") {
            pathName = `./${pathName}`
          }
        }
      }

      if (scope.projectRelativePath) {
        pathName = slash(projectRelativePath)
      }

      // Replace stuff if necessary
      if (scope.replaceOnInsert) {
        // let originalPathName = pathName
        scope.replaceOnInsert.forEach(([from, to]) => {
          const regex = new RegExp(from)
          if (regex.test(pathName)) {
            pathName = pathName.replace(regex, to)
          }
        })
      }

      // Calculate distance to file
      const distanceToFile = relativePath.split(path.sep).length
      return {
        text: pathName,
        replacementPrefix: pathPrefix,
        displayText,
        type: "import",
        iconHTML: '<i class="icon-file-code"></i>',
        score: score(displayText, request.prefix),
        distanceToFile,
      }
    })

    // Modify score to incorporate distance
    const suggestionsCount = suggestions.length
    if (suggestions.length) {
      const maxDistance = max(suggestions, (s) => s.distanceToFile).distanceToFile
      suggestions.forEach((s, i) => {
        s.score = suggestionsCount - i + (maxDistance - s.distanceToFile)
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
  async getSuggestions(request) {
    const matches = this._scopes
      .map((scope) => [scope, this._scopeMatchesRequest(scope, request)])
      .filter((result) => result[1]) // Filter scopes that match
    const promises = matches.map(([scope, match]) => this._getSuggestionsForScope(scope, request, match))

    const suggestions = flatten(await Promise.all(promises))
    if (!suggestions.length) return false
    return suggestions
  }

  /**
   * Rebuilds the cache
   * @return {Promise}
   */
  async rebuildCache() {
    const result = await this._pathsCache.rebuildCache()
    this._isReady = true
    return result
  }

  /**
   * Returns the project directory that contains the file opened in the given editor
   * @param  {TextEditor} editor
   * @return {Directory}
   * @private
   */
  _getProjectDirectory(editor) {
    const filePath = editor.getBuffer().getPath()
    let projectDirectory = null
    atom.project.getDirectories().forEach((directory) => {
      if (directory.contains(filePath)) {
        projectDirectory = directory
      }
    })
    return projectDirectory
  }

  isReady() {
    return this._isReady
  }

  get suggestionPriority() {
    return atom.config.get("autocomplete-paths.suggestionPriority")
  }

  get fileCount() {
    return atom.project.getDirectories().reduce((accumulated, directory) => {
      const filePaths = this._pathsCache.getFilePathsForProjectDirectory(directory)
      return accumulated + filePaths.length
    }, 0)
  }

  /**
   * Disposes this provider
   */
  dispose() {
    this._pathsCache.removeListener("rebuild-cache", this._onRebuildCache)
    this._pathsCache.removeListener("rebuild-cache-done", this._onRebuildCacheDone)
    this._pathsCache.dispose(true)
  }
}

PathsProvider.prototype.selector = "*"
PathsProvider.prototype.inclusionPriority = 1
