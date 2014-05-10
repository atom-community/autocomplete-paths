{WorkspaceView} = require "atom"

describe "Issue 8", ->
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

  it "allows relative path completion without ./", ->
    waitsForPromise ->
      activationPromise

    runs ->
      editorView = atom.workspaceView.getActiveView()
      editorView.attachToDom()
      editor = editorView.getEditor()

      expect(editorView.find(".autocomplete-plus")).not.toExist()

      editor.moveCursorToBottom()
      editor.insertText "linkeddir"
      editor.insertText "/"

      advanceClock completionDelay

      expect(editorView.find(".autocomplete-plus")).toExist()
      expect(editorView.find(".autocomplete-plus span.word:eq(0)")).toHaveText ".gitkeep"
      expect(editorView.find(".autocomplete-plus span.label:eq(0)")).toHaveText "File"
