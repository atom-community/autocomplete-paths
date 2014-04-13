{Range}  = require "atom"
{Provider, Suggestion} = require "autocomplete-plus"
fuzzaldrin = require "fuzzaldrin"
_ = require "underscore-plus"
path = require "path"
fs = require "fs"

module.exports =
class PathsProvider extends Provider
  wordRegex: /(\.+)?\/([a-zA-Z0-9\.\/_-]+)?/g
  exclusive: true
  buildSuggestions: ->
    selection = @editor.getSelection()
    prefix = @prefixOfSelection selection
    return unless prefix.length

    suggestions = @findSuggestionsForPrefix prefix
    return unless suggestions.length
    return suggestions

  findSuggestionsForPrefix: (prefix) ->
    basePath = path.dirname @editor.getPath()

    prefixFileName = path.basename prefix
    prefixBasePath = path.dirname prefix

    # path.basename returns the last portion of a path, but
    # never "nothing" (in case of a trailing slash)
    # In this case, add the filename to the path and let
    # the filename be empty
    if prefix.match /[\/|\\]$/
      prefixBasePath = path.join prefixBasePath, prefixFileName
      prefixFileName = ""

    prefixPath = path.resolve basePath, prefixBasePath
    fullPrefixPath = path.resolve basePath, prefix

    stat = fs.statSync prefixPath
    return [] unless stat.isDirectory()

    files = fs.readdirSync prefixPath
    results = fuzzaldrin.filter files, prefixFileName

    suggestions = for result in results
      filePath = path.resolve basePath, prefixPath, result
      stat = fs.statSync filePath
      if stat.isDirectory()
        label = "Dir"
        result += "/"
      else
        label = "File"

      # Skip if result path and prefix path are the same
      continue if filePath is fullPrefixPath

      # If base path starts with a ., add
      # another slash to the result path
      resultPath = prefixBasePath
      unless resultPath.match /[\/|\\]$/
        resultPath += path.sep

      new Suggestion this,
        word: result
        prefix: prefix
        label: label
        data:
          body: resultPath + result

    return suggestions

  confirm: (suggestion) ->
    selection = @editor.getSelection()
    startPosition = selection.getBufferRange().start
    buffer = @editor.getBuffer()

    # Replace the prefix with the body
    cursorPosition = @editor.getCursorBufferPosition()
    buffer.delete Range.fromPointWithDelta(cursorPosition, 0, -suggestion.prefix.length)
    @editor.insertText suggestion.data.body

    # Move the cursor behind the body
    suffixLength = suggestion.data.body.length - suggestion.prefix.length
    @editor.setSelectedBufferRange [startPosition, [startPosition.row, startPosition.column + suffixLength]]

    setTimeout(=>
      @editorView.trigger "autocomplete-plus:activate"
    , 100)

    return false # Don't fall back to the default behavior
