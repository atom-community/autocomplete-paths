path = require('path')

describe 'Autocomplete Snippets', ->
  [workspaceElement, completionDelay, editor, editorView, autocompleteManager, didAutocomplete] = []

  beforeEach ->
    runs ->
      didAutocomplete = false
      # Set to live completion
      atom.config.set('autocomplete-plus.enableAutoActivation', true)
      # Set the completion delay
      completionDelay = 100
      atom.config.set('autocomplete-plus.autoActivationDelay', completionDelay)
      completionDelay += 100 # Rendering delay
      workspaceElement = atom.views.getView(atom.workspace)
      jasmine.attachToDOM(workspaceElement)

    waitsForPromise ->
      atom.workspace.open('sample.js').then (e) ->
        editor = e
        editorView = atom.views.getView(editor)

    waitsForPromise ->
      atom.packages.activatePackage('language-javascript')

    waitsForPromise -> atom.packages.activatePackage('autocomplete-plus').then (a) ->
      autocompleteManager = a.mainModule.autocompleteManager
      autocompleteManager.onDidAutocomplete ->
        didAutocomplete = true

    waitsForPromise ->
      atom.packages.activatePackage('autocomplete-paths')

  describe 'when autocomplete-plus is enabled', ->
    it 'shows autocompletions when typing ./', ->
      runs ->
        expect(editorView.querySelector('.autocomplete-plus')).not.toExist()

        editor.moveToBottom()
        editor.insertText('.')
        editor.insertText('/')

        advanceClock(completionDelay)

      waitsFor ->
        didAutocomplete is true

      runs ->
        expect(editorView.querySelector('.autocomplete-plus')).toExist()
        expect(editorView.querySelector('.autocomplete-plus span.word')).toHaveText('linkeddir/')
        expect(editorView.querySelector('.autocomplete-plus span.label')).toHaveText('Dir')

    it 'does not crash when typing an invalid folder', ->
      runs ->
        expect(editorView.querySelector('.autocomplete-plus')).not.toExist()

        editor.moveToBottom()
        editor.insertText('./sample.js')
        editor.insertText('/')

        advanceClock(completionDelay)

      waitsFor ->
        didAutocomplete is true

    it 'does not crash when autocompleting symlinked paths', ->
      runs ->
        expect(editorView.querySelector('.autocomplete-plus')).not.toExist()

        editor.moveToBottom()
        editor.insertText(c) for c in './linkedir'

        advanceClock(completionDelay)

      waitsFor ->
        didAutocomplete is true

      runs ->
        # Select linkeddir/
        didAutocomplete = false
        suggestionListView = atom.views.getView(autocompleteManager.suggestionList)
        atom.commands.dispatch(suggestionListView, 'autocomplete-plus:confirm')
        advanceClock(completionDelay)

      waitsFor ->
        didAutocomplete is true

      runs ->
        # Select .gitkeep
        didAutocomplete = false
        suggestionListView = atom.views.getView(autocompleteManager.suggestionList)
        atom.commands.dispatch(suggestionListView, 'autocomplete-plus:confirm')
        advanceClock(completionDelay + 1000)
