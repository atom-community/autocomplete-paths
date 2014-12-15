describe "Issue 8", ->
  [workspaceElement, completionDelay, editor, editorView] = []

  beforeEach ->
    runs ->
      # Set to live completion
      atom.config.set "autocomplete-plus.enableAutoActivation", true
      # Set the completion delay
      completionDelay = 100
      atom.config.set "autocomplete-plus.autoActivationDelay", completionDelay
      completionDelay += 100 # Rendering delay

    waitsForPromise ->
      atom.workspace.open('sample.js').then (e) ->
        editor = e
        editorView = atom.views.getView(editor)

    runs ->
      workspaceElement = atom.views.getView(atom.workspace)
      jasmine.attachToDOM(workspaceElement)

    waitsForPromise -> atom.packages.activatePackage('autocomplete-plus')

    waitsForPromise -> atom.packages.activatePackage("autocomplete-paths")

  describe "when autocomplete-plus is enabled", ->

    it "allows relative path completion without ./", ->
      runs ->
        expect(editorView.querySelector(".autocomplete-plus")).not.toExist()

        editor.moveToBottom()
        editor.insertText "linkeddir"
        editor.insertText "/"

        advanceClock completionDelay
        expect(editorView.querySelector(".autocomplete-plus")).toExist()
        expect(editorView.querySelector(".autocomplete-plus span.word")).toHaveText ".gitkeep"
        expect(editorView.querySelector(".autocomplete-plus span.label")).toHaveText "File"
