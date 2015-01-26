{Range}  = require 'atom'
fuzzaldrin = require 'fuzzaldrin'
path = require 'path'
fs = require 'fs'

module.exports =
class PathsProvider
  id: 'autocomplete-paths-pathsprovider'
  selector: '*'
  wordRegex: /[a-zA-Z0-9\.\/_-]*\/[a-zA-Z0-9\.\/_-]*/g

  requestHandler: (options) ->
    return [] unless options?.editor? and options?.buffer? and options?.cursor?
    prefix = @prefixForCursor(options.buffer, options.cursor)
    return [] unless prefix.length

    suggestions = @findSuggestionsForPrefix(options.editor, prefix)
    return [] unless suggestions.length
    return suggestions

  prefixForCursor: (buffer, cursor) =>
    return '' unless buffer? and cursor?
    start = cursor.getBeginningOfCurrentWordBufferPosition({wordRegex: @wordRegex})
    end = cursor.getBufferPosition()
    return '' unless start? and end?
    buffer.getTextInRange(new Range(start, end))

  findSuggestionsForPrefix: (editor, prefix) ->
    return unless editor?
    editorPath = editor.getPath()
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

      suggestion =
        word: result
        prefix: prefix
        label: label
        data:
          body: result
      if suggestion.label != "File"
        suggestion.onDidConfirm = =>
          atom.commands.dispatch(atom.views.getView(editor), 'autocomplete-plus:activate')

      suggestion
    return suggestions

  dispose: =>
    # Clean up?
