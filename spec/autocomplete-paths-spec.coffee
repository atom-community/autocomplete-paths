describe "AutocompleteSnippets", ->
  [workspaceElement, completionDelay, editor, editorView, autocompleteManager, mainModule] = []

  beforeEach ->
    runs ->
      # Set to live completion
      atom.config.set('autocomplete-plus.enableAutoActivation', true)
      # Set the completion delay
      completionDelay = 100
      atom.config.set('autocomplete-plus.autoActivationDelay', completionDelay)
      completionDelay += 100 # Rendering delay

    waitsForPromise ->
      atom.workspace.open('sample.js').then (e) ->
        editor = e
        editorView = atom.views.getView(editor)

    runs ->
      workspaceElement = atom.views.getView(atom.workspace)
      jasmine.attachToDOM(workspaceElement)

    waitsForPromise -> atom.packages.activatePackage('autocomplete-plus').then (a) ->
      mainModule = a.mainModule
      autocompleteManager = mainModule.autocompleteManagers[0]

    waitsForPromise -> atom.packages.activatePackage('autocomplete-paths')

  describe "when autocomplete-plus is enabled", ->
    it "shows autocompletions when typing ./", ->
      runs ->
        expect(editorView.querySelector('.autocomplete-plus')).not.toExist()

        editor.moveToBottom()
        editor.insertText('.')
        editor.insertText('/')

        advanceClock(completionDelay)

        expect(editorView.querySelector('.autocomplete-plus')).toExist()
        expect(editorView.querySelector('.autocomplete-plus span.word')).toHaveText('linkeddir/')
        expect(editorView.querySelector('.autocomplete-plus span.label')).toHaveText('Dir')

    it "does not crash when typing an invalid folder", ->
      runs ->
        expect(editorView.querySelector('.autocomplete-plus')).not.toExist()

        editor.moveToBottom()
        editor.insertText('./sample.js')
        editor.insertText('/')

        advanceClock(completionDelay)

    it "does not crash when autocompleting symlinked paths", ->
      runs ->
        expect(editorView.querySelector('.autocomplete-plus')).not.toExist()

        editor.moveToBottom()
        editor.insertText(c) for c in './linkedir'

        advanceClock(completionDelay)

        # Select linkeddir/
        atom.commands.dispatch('autocomplete-plus:confirm')
        advanceClock(completionDelay)

        # Select .gitkeep
        atom.commands.dispatch('autocomplete-plus:confirm')
