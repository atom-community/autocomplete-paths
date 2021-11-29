import { EventEmitter } from "events"
import path from "path"
import { intersection, flatten, max } from "underscore"
import slash from "slash"
import PathsCache from "./paths-cache"
import { score, filter } from "zadeh"
import { DefaultScopes } from "./config/default-scopes"
import { OptionScopes } from "./config/option-scopes"

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

  /** Reloads the scopes */
  reloadScopes() {
    this._scopes = atom.config.get("autocomplete-paths.scopes").slice(0) || []

    if (!atom.config.get("autocomplete-paths.ignoreBuiltinScopes")) {
      this._scopes = this._scopes.concat(DefaultScopes)
    }

    for (const key in OptionScopes) {
      if (atom.config.get(`autocomplete-paths.${key}`)) {
        this._scopes = this._scopes.slice(0).concat(OptionScopes[key])
      }
    }
  }

  /**
   * Gets called when the PathsCache is starting to rebuild the cache
   *
   * @private
   */
  _onRebuildCache() {
    this.emit("rebuild-cache")
  }

  /**
   * Gets called when the PathsCache is done rebuilding the cache
   *
   * @private
   */
  _onRebuildCacheDone() {
    this.emit("rebuild-cache-done")
  }

  /**
   * Returns the suggestions for the given scope and the given request
   *
   * @private
   * @param {Object} scope
   * @param {Object} request
   * @returns {Promise}
   */
  _getSuggestionsForScope(scope, request, match) {
    const line = _getLineTextForRequest(request)
    const pathPrefix = line.substr(match.index + match[0].length)
    const trailingSlashPresent = pathPrefix.match(/[/\\|]$/)
    const directoryGiven = pathPrefix.indexOf("./") === 0 || pathPrefix.indexOf("../") === 0
    const parsedPathPrefix = path.parse(pathPrefix)

    // path.parse ignores trailing slashes, so we handle this manually
    if (trailingSlashPresent) {
      parsedPathPrefix.dir = path.join(parsedPathPrefix.dir, parsedPathPrefix.base)
      parsedPathPrefix.base = ""
      parsedPathPrefix.name = ""
    }

    const projectDirectory = _getProjectDirectory(request.editor)
    if (!projectDirectory) {
      return Promise.resolve([])
    }
    const currentDirectory = path.dirname(request.editor.getPath())

    const requestedDirectoryPath = path.resolve(currentDirectory, parsedPathPrefix.dir)

    let files = directoryGiven
      ? this._pathsCache.getFilePathsForProjectDirectory(projectDirectory, requestedDirectoryPath)
      : this._pathsCache.getFilePathsForProjectDirectory(projectDirectory)

    const fuzzyMatcher = directoryGiven ? parsedPathPrefix.base : pathPrefix

    const { extensions } = scope
    if (extensions) {
      const regex = new RegExp(`.(${extensions.join("|")})$`)
      files = files.filter((pth) => regex.test(pth))
    }

    if (fuzzyMatcher) {
      files = filter(files, fuzzyMatcher, {
        maxResults: 10,
      })
    }

    const showImagePreview = atom.config.get("autocomplete-paths.imagePreview")
    const imgRegex = /\.(png|svg|jpg|jpeg|jfif|pjpeg|pjp|gif|apng|ico|cur)$/

    const suggestions = files.map((pathName) => {
      let text = pathName
      const normalizeSlashes = atom.config.get("autocomplete-paths.normalizeSlashes")
      const absolutePath = path.resolve(path.dirname(request.editor.getPath()), pathName)
      const projectRelativePath = atom.project.relativizePath(text)[1]
      let displayText = projectRelativePath
      if (directoryGiven) {
        displayText = path.relative(requestedDirectoryPath, text)
      }
      if (normalizeSlashes) {
        displayText = slash(displayText)
      }

      // Relativize path to current file if necessary
      let relativePath = path.relative(path.dirname(request.editor.getPath()), text)
      if (normalizeSlashes) {
        relativePath = slash(relativePath)
      }
      if (scope.relative !== false) {
        text = relativePath
        if (scope.includeCurrentDirectory !== false) {
          if (text[0] !== ".") {
            text = `./${text}`
          }
        }
      }

      if (scope.projectRelativePath) {
        text = slash(projectRelativePath)
      }

      // Replace stuff if necessary
      if (scope.replaceOnInsert) {
        // let originalPathName = text
        scope.replaceOnInsert.forEach(([from, to]) => {
          const regex = new RegExp(from)
          if (regex.test(text)) {
            text = text.replace(regex, to)
          }
        })
      }

      // Calculate distance to file
      const distanceToFile = relativePath.split(path.sep).length

      const iconHTML =
        showImagePreview && imgRegex.test(absolutePath)
          ? `<image style="background-position: center; background-repeat: no-repeat; background-size: contain; background-image: url(${absolutePath}); height:29px; width:29px;"></image>`
          : '<i class="icon-file-code"></i>'
      return {
        text,
        replacementPrefix: pathPrefix,
        displayText,
        type: "import",
        iconHTML,
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
   *
   * @param {Object} request
   * @returns {Promise}
   */
  async getSuggestions(request) {
    const matches = this._scopes
      .map((scope) => [scope, _scopeMatchesRequest(scope, request)])
      .filter((result) => result[1]) // Filter scopes that match
    const promises = matches.map(([scope, match]) => this._getSuggestionsForScope(scope, request, match))

    const suggestions = flatten(await Promise.all(promises))
    if (!suggestions.length) {
      return false
    }
    return suggestions
  }

  /**
   * Rebuilds the cache
   *
   * @returns {Promise}
   */
  async rebuildCache() {
    const result = await this._pathsCache.rebuildCache()
    this._isReady = true
    return result
  }

  isReady() {
    return this._isReady
  }

  // eslint-disable-next-line class-methods-use-this
  get suggestionPriority() {
    return atom.config.get("autocomplete-paths.suggestionPriority")
  }

  get fileCount() {
    return atom.project.getDirectories().reduce((accumulated, directory) => {
      const filePaths = this._pathsCache.getFilePathsForProjectDirectory(directory)
      return accumulated + filePaths.length
    }, 0)
  }

  /** Disposes this provider */
  dispose() {
    this._pathsCache.removeListener("rebuild-cache", this._onRebuildCache)
    this._pathsCache.removeListener("rebuild-cache-done", this._onRebuildCacheDone)
    this._pathsCache.dispose(true)
  }
}

PathsProvider.prototype.selector = "*"
PathsProvider.prototype.inclusionPriority = 1

/**
 * Checks if the given scope config matches the given request
 *
 * @private
 * @param {Object} scope
 * @param {Object} request
 * @returns {Array} The match object
 */
function _scopeMatchesRequest(scope, request) {
  const sourceScopes = Array.isArray(scope.scopes) ? scope.scopes : [scope.scopes]

  // Check if the scope descriptors match
  const scopeMatches = intersection(request.scopeDescriptor.getScopesArray(), sourceScopes).length > 0
  if (!scopeMatches) {
    return false
  }

  // Check if the line matches the prefixes
  const line = _getLineTextForRequest(request)

  let lineMatch = null
  const scopePrefixes = Array.isArray(scope.prefixes) ? scope.prefixes : [scope.prefixes]
  scopePrefixes.forEach((prefix) => {
    const regex = new RegExp(prefix, "i")
    lineMatch = lineMatch || line.match(regex)
  })

  return lineMatch
}

/**
 * Returns the project directory that contains the file opened in the given editor
 *
 * @private
 * @param {TextEditor} editor
 * @returns {Directory}
 */
function _getProjectDirectory(editor) {
  const filePath = editor.getBuffer().getPath()
  let projectDirectory = null
  atom.project.getDirectories().forEach((directory) => {
    if (directory.contains(filePath)) {
      projectDirectory = directory
    }
  })
  return projectDirectory
}

/**
 * Returns the whole line text for the given request
 *
 * @private
 * @param {Object} request
 * @returns {String}
 */
function _getLineTextForRequest(request) {
  const { editor, bufferPosition } = request
  return editor.getTextInRange([[bufferPosition.row, 0], bufferPosition])
}
