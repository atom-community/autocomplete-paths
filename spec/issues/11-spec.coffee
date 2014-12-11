describe "Issue 11", ->
  [activationPromise, completionDelay, editor, editorView] = []

  beforeEach ->
    # Enable live autocompletion
    atom.config.set "autocomplete-plus.enableAutoActivation", true

    # Set the completion delay
    completionDelay = 100
    atom.config.set "autocomplete-plus.autoActivationDelay", completionDelay
    completionDelay += 100 # Rendering delay

    waitsForPromise ->
      activationPromise = atom.packages.activatePackage("autocomplete-paths")
        .then => atom.packages.activatePackage("autocomplete-plus")

    workspaceElement = atom.views.getView(atom.workspace)
    jasmine.attachToDOM(workspaceElement)

    waitsForPromise -> atom.workspace.open().then (e) ->
      editor = e

    runs ->
      editorView = atom.views.getView(editor)

  it "Works in editors which have no path", ->
    runs ->
      expect(editorView.querySelector(".autocomplete-plus")).not.toExist()

      editor.moveToBottom()
      editor.insertText "/"

      advanceClock completionDelay

      expect(editorView.querySelector(".autocomplete-plus")).not.toExist()
