describe 'Issue 11', ->
  [workspaceElement, completionDelay, editor, editorView, pathsMain, autocompleteMain, autocompleteManager] = []

  beforeEach ->
    runs ->
      # Set to live completion
      atom.config.set('autocomplete-plus.enableAutoActivation', true)
      # Set the completion delay
      completionDelay = 100
      atom.config.set('autocomplete-plus.autoActivationDelay', completionDelay)
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
      atom.workspace.open('').then (e) ->
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

  describe 'when an editor with no path is opened', ->
    it 'does not have issues', ->
      runs ->
        expect(editorView.querySelector('.autocomplete-plus')).not.toExist()

        editor.moveToBottom()
        editor.insertText('/')

        advanceClock(completionDelay)

      waitsFor ->
        autocompleteManager.displaySuggestions.calls.length is 1

      runs ->
        expect(editorView.querySelector('.autocomplete-plus')).not.toExist()
