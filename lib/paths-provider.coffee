{Range}  = require 'atom'
fuzzaldrin = require 'fuzzaldrin'
path = require 'path'
fs = require 'fs'

module.exports =
ProviderClass: (Provider, Suggestion)  ->
  class PathsProvider extends Provider
    wordRegex: /[a-zA-Z0-9\.\/_-]*\/[a-zA-Z0-9\.\/_-]*/g
    exclusive: true
    buildSuggestions: ->
      selection = @editor.getLastSelection()
      prefix = @prefixOfSelection(selection)
      return unless prefix.length

      suggestions = @findSuggestionsForPrefix(prefix)
      return unless suggestions.length
      return suggestions

    findSuggestionsForPrefix: (prefix) ->
      editorPath = @editor.getPath()
      return [] unless editorPath

      basePath = path.dirname(editorPath)
      prefixPath = path.resolve(basePath, prefix)

      if prefix.endsWith('/')
        directory = prefixPath
        prefix = ""
      else
        if basePath == prefixPath
          directory = prefixPath
        else
          directory = path.dirname(prefixPath)
        prefix = path.basename(prefix)

      # Is this actually a directory?
      try
        stat = fs.statSync(directory)
        return [] unless stat.isDirectory()
      catch e
        return []

      # Get files
      try
        files = fs.readdirSync(directory)
      catch e
        return []
      results = fuzzaldrin.filter(files, prefix)

      suggestions = for result in results
        resultPath = path.resolve(directory, result)

        # Check for type
        try
          stat = fs.statSync(resultPath)
        catch e
          continue
        if stat.isDirectory()
          label = 'Dir'
          result += path.sep
        else if stat.isFile()
          label = "File"
        else
          continue

        new Suggestion this,
          word: result
          prefix: prefix
          label: label
          data:
            body: result

      return suggestions

    confirm: (suggestion) ->
      selection = @editor.getSelection()
      startPosition = selection.getBufferRange().start
      buffer = @editor.getBuffer()

      # Replace the prefix with the body
      cursorPosition = @editor.getCursorBufferPosition()
      buffer.delete(Range.fromPointWithDelta(cursorPosition, 0, -suggestion.prefix.length))
      @editor.insertText(suggestion.data.body)

      if suggestion.label != "File"
        setTimeout(=>
          atom.commands.dispatch(atom.views.getView(@editor), 'autocomplete-plus:activate')
        , 100)

      return false # Don't fall back to the default behavior
