{WorkspaceView} = require "atom"

# Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
#
# To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
# or `fdescribe`). Remove the `f` to unfocus the block.

describe "AutocompleteSnippets", ->
  [activationPromise, completionDelay] = []

  beforeEach ->
    # Enable live autocompletion
    atom.config.set "autocomplete-plus.enableAutoActivation", true

    # Set the completion delay
    completionDelay = 100
    atom.config.set "autocomplete-plus.autoActivationDelay", completionDelay
    completionDelay += 100 # Rendering delay

    atom.workspaceView = new WorkspaceView
    atom.workspaceView.openSync "sample.js"
    atom.workspaceView.simulateDomAttachment()
    activationPromise = atom.packages.activatePackage("autocomplete-paths")
      .then => atom.packages.activatePackage("autocomplete-plus")

  it "shows autocompletions when typing ./", ->
    waitsForPromise ->
      activationPromise

    runs ->
      editorView = atom.workspaceView.getActiveView()
      editorView.attachToDom()
      editor = editorView.getEditor()

      expect(editorView.find(".autocomplete-plus")).not.toExist()

      editor.moveCursorToBottom()
      editor.insertText "."
      editor.insertText "/"

      advanceClock completionDelay

      expect(editorView.find(".autocomplete-plus")).toExist()
      expect(editorView.find(".autocomplete-plus span.word:eq(0)")).toHaveText "linkeddir/"
      expect(editorView.find(".autocomplete-plus span.label:eq(0)")).toHaveText "Dir"

  it "does not crash when typing an invalid folder", ->
    waitsForPromise ->
      activationPromise

    runs ->
      editorView = atom.workspaceView.getActiveView()
      editorView.attachToDom()
      editor = editorView.getEditor()

      expect(editorView.find(".autocomplete-plus")).not.toExist()

      editor.moveCursorToBottom()
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
      editorView = atom.workspaceView.getActiveView()
      editorView.attachToDom()
      editor = editorView.getEditor()

      expect(editorView.find(".autocomplete-plus")).not.toExist()

      editor.moveCursorToBottom()
      editor.insertText c for c in "./linkedir"

      advanceClock completionDelay

      autocompleteView = autocomplete.autocompleteViews[0]

      # Select linkeddir/
      autocompleteView.trigger "autocomplete-plus:confirm"
      advanceClock completionDelay

      # Select .gitkeep
      autocompleteView.trigger "autocomplete-plus:confirm"
