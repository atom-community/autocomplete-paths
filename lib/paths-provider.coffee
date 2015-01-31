{Range}  = require('atom')
fuzzaldrin = require('fuzzaldrin')
path = require('path')
fs = require('fs')

module.exports =
class PathsProvider
  id: 'autocomplete-paths-pathsprovider'
  selector: '*'
  wordRegex: /[a-zA-Z0-9\.\/_-]*\/[a-zA-Z0-9\.\/_-]*/g
  cache: []

  requestHandler: (options = {}) =>
    return [] unless options.editor? and options.buffer? and options.cursor?
    editorPath = options.editor?.getPath()
    return [] unless editorPath?.length
    basePath = path.dirname(editorPath)
    return [] unless basePath?

    prefix = @prefixForCursor(options.editor, options.buffer, options.cursor, options.position)
    return [] unless prefix.length

    suggestions = @findSuggestionsForPrefix(options.editor, basePath, prefix)
    return [] unless suggestions.length
    return suggestions

  prefixForCursor: (editor, buffer, cursor, position) =>
    return '' unless buffer? and cursor?
    start = @getBeginningOfCurrentWordBufferPosition(editor, position, {wordRegex: @wordRegex})
    end = cursor.getBufferPosition()
    return '' unless start? and end?
    buffer.getTextInRange(new Range(start, end))

  getBeginningOfCurrentWordBufferPosition: (editor, position, options = {}) ->
    return unless position?
    allowPrevious = options.allowPrevious ? true
    currentBufferPosition = position
    scanRange = [[currentBufferPosition.row, 0], currentBufferPosition]
    beginningOfWordPosition = null
    editor.backwardsScanInBufferRange (options.wordRegex), scanRange, ({range, stop}) ->
      if range.end.isGreaterThanOrEqual(currentBufferPosition) or allowPrevious
        beginningOfWordPosition = range.start
      if not beginningOfWordPosition?.isEqual(currentBufferPosition)
        stop()

    if beginningOfWordPosition?
      beginningOfWordPosition
    else if allowPrevious
      [currentBufferPosition.row, 0]
    else
      currentBufferPosition

  findSuggestionsForPrefix: (editor, basePath, prefix) ->
    return [] unless basePath?

    prefixPath = path.resolve(basePath, prefix)

    if prefix.endsWith('/')
      directory = prefixPath
      prefix = ''
    else
      if basePath is prefixPath
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
        label = 'File'
      else
        continue

      suggestion =
        word: result
        prefix: prefix
        label: label
        data:
          body: result
      if suggestion.label isnt 'File'
        suggestion.onDidConfirm = ->
          atom.commands.dispatch(atom.views.getView(editor), 'autocomplete-plus:activate')

      suggestion
    return suggestions

  dispose: =>
    @editor = null
    @basePath = null
