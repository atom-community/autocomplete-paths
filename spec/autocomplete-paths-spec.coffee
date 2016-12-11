path = require('path')

describe 'Autocomplete Snippets', ->
  [workspaceElement, completionDelay, editor, editorView, pathsMain, autocompleteMain, autocompleteManager] = []

  testConfig = {
    'autocomplete-plus.enableAutoActivation': true
    'autocomplete-plus.minimumWordLength': -1
    'autocomplete-plus.autoActivationDelay': 100
  }

  beforeEach ->
    runs ->
      Object.keys(testConfig).forEach (key) ->
        atom.config.set(key, testConfig[key])

      completionDelay = 100
      completionDelay += 100 # Rendering delay
      workspaceElement = atom.views.getView(atom.workspace)
      jasmine.attachToDOM(workspaceElement)

      autocompletePlusPkg = atom.packages.loadPackage('autocomplete-plus')
      autocompletePlusPkg.requireMainModule()
      autocompleteMain = autocompletePlusPkg.mainModule

      spyOn(autocompleteMain, 'consumeProvider').andCallThrough()

      pathPkg = atom.packages.loadPackage('autocomplete-paths')
      pathPkg.requireMainModule()
      pathsMain = pathPkg.mainModule

      spyOn(pathsMain, 'provide').andCallThrough()

    waitsForPromise ->
      atom.workspace.open('sample.js').then (e) ->
        editor = e
        editorView = atom.views.getView(editor)

    waitsForPromise ->
      atom.packages.activatePackage('language-javascript')

    waitsForPromise ->
      atom.packages.activatePackage('autocomplete-plus')

    waitsFor ->
      autocompleteMain.autocompleteManager?.ready

    runs ->
      autocompleteManager = autocompleteMain.autocompleteManager
      spyOn(autocompleteManager, 'findSuggestions').andCallThrough()
      spyOn(autocompleteManager, 'displaySuggestions').andCallThrough()
      spyOn(autocompleteManager, 'showSuggestionList').andCallThrough()
      spyOn(autocompleteManager, 'hideSuggestionList').andCallThrough()

    waitsForPromise ->
      atom.packages.activatePackage('autocomplete-paths')

    waitsFor ->
      pathsMain.provide.calls.length is 1

    waitsFor ->
      autocompleteMain.consumeProvider.calls.length is 1

  afterEach ->
    jasmine.unspy(autocompleteMain, 'consumeProvider')
    jasmine.unspy(pathsMain, 'provide')
    jasmine.unspy(autocompleteManager, 'findSuggestions')
    jasmine.unspy(autocompleteManager, 'displaySuggestions')
    jasmine.unspy(autocompleteManager, 'showSuggestionList')
    jasmine.unspy(autocompleteManager, 'hideSuggestionList')

  describe 'when autocomplete-plus is enabled', ->
    it 'shows autocompletions when typing ./', ->
      runs ->
        expect(editorView.querySelector('.autocomplete-plus')).not.toExist()

        editor.moveToBottom()
        editor.insertText('.')
        editor.insertText('/')

        advanceClock(completionDelay)

      waitsFor ->
        autocompleteManager.displaySuggestions.calls.length is 1

      runs ->
        expect(editorView.querySelector('.autocomplete-plus')).toExist()
        expect(editorView.querySelector('.autocomplete-plus .word')).toHaveText('linkeddir')
        expect(editorView.querySelector('.autocomplete-plus .right-label')).toHaveText('Dir')

    it 'does not crash when typing an invalid folder', ->
      runs ->
        expect(editorView.querySelector('.autocomplete-plus')).not.toExist()

        editor.moveToBottom()
        editor.insertText('./sample.js')
        editor.insertText('/')

        advanceClock(completionDelay)

      waitsFor ->
        autocompleteManager.displaySuggestions.calls.length is 1

    it 'does not crash when autocompleting symlinked paths', ->
      runs ->
        expect(editorView.querySelector('.autocomplete-plus')).not.toExist()

        editor.moveToBottom()
        editor.insertText(c) for c in './linkeddir'

        advanceClock(completionDelay)

      waitsFor ->
        autocompleteManager.displaySuggestions.calls.length is 1

      runs ->
        # Select linkeddir
        atom.commands.dispatch(editorView, 'autocomplete-plus:confirm')
        advanceClock(completionDelay)

        editor.insertText('/')
        advanceClock(completionDelay)

      waitsFor ->
        autocompleteManager.displaySuggestions.calls.length is 2

      runs ->
        # Select .gitkeep
        atom.commands.dispatch(editorView, 'autocomplete-plus:confirm')
        advanceClock(completionDelay + 1000)

    it 'allows relative path completion without ./', ->
      runs ->
        expect(editorView.querySelector('.autocomplete-plus')).not.toExist()

        editor.moveToBottom()
        editor.insertText('linkeddir')
        editor.insertText('/')

        advanceClock(completionDelay)

      waitsFor ->
        autocompleteManager.displaySuggestions.calls.length is 1

      runs ->
        expect(editorView.querySelector('.autocomplete-plus')).toExist()
        expect(editorView.querySelector('.autocomplete-plus .word')).toHaveText('.gitkeep')
        expect(editorView.querySelector('.autocomplete-plus .right-label')).toHaveText('File')
