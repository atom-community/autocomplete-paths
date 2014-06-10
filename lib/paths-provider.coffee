{Range}  = require "atom"
{Provider, Suggestion} = require "autocomplete-plus"
fuzzaldrin = require "fuzzaldrin"
_ = require "underscore-plus"
path = require "./utils/path"
fs = require "fs"

module.exports =
class PathsProvider extends Provider
  wordRegex: /[a-zA-Z0-9\.\/_-]*\/[a-zA-Z0-9\.\/_-]*/g
  exclusive: true
  buildSuggestions: ->
    selection = @editor.getSelection()
    prefix = @prefixOfSelection selection
    return unless prefix.length

    suggestions = @findSuggestionsForPrefix prefix
    return unless suggestions.length
    return suggestions

  findSuggestionsForPrefix: (prefix) ->
    editorPath = @editor.getPath()
    return [] unless editorPath

    basePath = path.dirname editorPath
    prefixPath = path.resolve basePath, prefix

    directory = path.dirname prefixPath

    # Check if directory exists
    exists = fs.existsSync directory
    return [] unless exists

    # Is this actually a directory?
    stat = fs.statSync directory
    return [] unless stat.isDirectory()

    # Get files
    try
      files = fs.readdirSync directory
    catch e
      return []
    prefixFilename = path.basename prefixPath
    results = fuzzaldrin.filter files, prefixFilename

    suggestions = for result in results
      resultPath = path.resolve directory, result

      # Check for type
      stat = fs.statSync resultPath
      if stat.isDirectory()
        label = "Dir"
        result += "/"
      else if stat.isFile()
        label = "File"
      else
        continue

      prefixDirectory = path.dirname prefix
      body = path.join prefixDirectory, result
      body = path.normalize body

      continue if body is prefix

      new Suggestion this,
        word: result
        prefix: prefix
        label: label
        data:
          body: body

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
