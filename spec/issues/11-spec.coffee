describe 'Issue 11', ->
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

    waitsForPromise ->
      atom.workspace.open('').then (e) ->
        editor = e
        editorView = atom.views.getView(editor)

    waitsForPromise ->
      atom.packages.activatePackage('language-javascript')

    runs ->
      workspaceElement = atom.views.getView(atom.workspace)
      jasmine.attachToDOM(workspaceElement)

    waitsForPromise -> atom.packages.activatePackage('autocomplete-plus').then (a) ->
      autocompleteManager = a.mainModule.autocompleteManager
      autocompleteManager.onDidAutocomplete ->
        didAutocomplete = true

    waitsForPromise ->
      atom.packages.activatePackage('autocomplete-paths')

  describe 'when an editor with no path is opened', ->
    it 'does not have issues', ->
      runs ->
        expect(editorView.querySelector('.autocomplete-plus')).not.toExist()

        editor.moveToBottom()
        editor.insertText('/')

        advanceClock(completionDelay)

      waitsFor ->
        didAutocomplete is true

      runs ->
        expect(editorView.querySelector('.autocomplete-plus')).not.toExist()
