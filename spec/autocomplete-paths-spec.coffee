# Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
#
# To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
# or `fdescribe`). Remove the `f` to unfocus the block.

describe "AutocompletePaths", ->
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

    waitsForPromise -> atom.workspace.open("sample.js").then (e) ->
      editor = e

    runs ->
      editorView = atom.views.getView(editor)

  it "shows autocompletions when typing ./", ->
    runs ->
      expect(editorView.querySelector(".autocomplete-plus")).not.toExist()

      editor.moveToBottom()
      editor.insertText "."
      editor.insertText "/"

      advanceClock completionDelay

      expect(editorView.querySelector(".autocomplete-plus")).toExist()
      expect(editorView.querySelectorAll(".autocomplete-plus span.word")[0]).toHaveText "linkeddir/"
      expect(editorView.querySelectorAll(".autocomplete-plus span.label")[0]).toHaveText "Dir"

  it "does not crash when typing an invalid folder", ->
    runs ->
      expect(editorView.querySelector(".autocomplete-plus")).not.toExist()

      editor.moveToBottom()
      editor.insertText "./sample.js"
      editor.insertText "/"

      advanceClock completionDelay

  it "does not crash when autocompleting symlinked paths", ->
    [autocomplete] = []

    waitsForPromise ->
      activationPromise
        .then (pkg) =>
          autocomplete = pkg.mainModule

    runs ->
      expect(editorView.querySelector(".autocomplete-plus")).not.toExist()

      editor.moveToBottom()
      editor.insertText c for c in "./linkedir"

      advanceClock completionDelay

      autocompleteView = autocomplete.autocompleteViews[0]

      # Select linkeddir/
      atom.commands.dispatch autocompleteView, "autocomplete-plus:confirm"
      advanceClock completionDelay

      # Select .gitkeep
      atom.commands.dispatch autocompleteView, "autocomplete-plus:confirm"
