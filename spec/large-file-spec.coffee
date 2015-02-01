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
      atom.workspace.open('zlargesample.json').then (e) ->
        editor = e
        editorView = atom.views.getView(editor)

    waitsForPromise ->
      atom.packages.activatePackage('language-javascript')

    waitsForPromise -> atom.packages.activatePackage('autocomplete-plus').then (a) ->
      autocompleteManager = a.mainModule.autocompleteManager
      spyOn(autocompleteManager, 'runAutocompletion').andCallThrough()
      spyOn(autocompleteManager, 'showSuggestions').andCallThrough()
      spyOn(autocompleteManager, 'showSuggestionList').andCallThrough()
      spyOn(autocompleteManager, 'hideSuggestionList').andCallThrough()
      autocompleteManager.onDidAutocomplete ->
        didAutocomplete = true

    waitsForPromise ->
      atom.packages.activatePackage('autocomplete-paths')

  afterEach ->
    didAutocomplete = false
    jasmine.unspy(autocompleteManager, 'runAutocompletion')
    jasmine.unspy(autocompleteManager, 'showSuggestions')
    jasmine.unspy(autocompleteManager, 'showSuggestionList')
    jasmine.unspy(autocompleteManager, 'hideSuggestionList')

  describe 'when opening a large file', ->
    it 'provides suggestions in a timely way', ->
      runs ->
        expect(editorView.querySelector('.autocomplete-plus')).not.toExist()

        editor.moveToBottom()
        editor.insertText('h')
        advanceClock(completionDelay)

      waitsFor ->
        autocompleteManager.showSuggestions.calls.length is 1

      runs ->
        editor.insertText('t')
        advanceClock(completionDelay)

      waitsFor ->
        autocompleteManager.showSuggestions.calls.length is 2

      runs ->
        editor.insertText('t')
        advanceClock(completionDelay)

      waitsFor ->
        autocompleteManager.showSuggestions.calls.length is 3

      runs ->
        editor.insertText('p')
        advanceClock(completionDelay)

      waitsFor ->
        autocompleteManager.showSuggestions.calls.length is 4

      runs ->
        editor.insertText('s')
        advanceClock(completionDelay)

      waitsFor ->
        autocompleteManager.showSuggestions.calls.length is 5
