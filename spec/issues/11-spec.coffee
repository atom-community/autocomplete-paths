{WorkspaceView} = require "atom"

describe "Issue 11", ->
	[activationPromise, completionDelay] = []

	beforeEach ->
		# Enable live autocompletion
		atom.config.set "autocomplete-plus.enableAutoActivation", true

		# Set the completion delay
		completionDelay = 100
		atom.config.set "autocomplete-plus.autoActivationDelay", completionDelay
		completionDelay += 100 # Rendering delay

		# Open an editor which has no path
		atom.workspaceView = new WorkspaceView
		atom.workspaceView.openSync()
		atom.workspaceView.simulateDomAttachment()
		
		activationPromise = atom.packages.activatePackage("autocomplete-paths")
			.then => atom.packages.activatePackage("autocomplete-plus")

	it "Works in editors which have no path", ->
		waitsForPromise ->
			activationPromise

		runs ->
			editorView = atom.workspaceView.getActiveView()
			editorView.attachToDom()
			editor = editorView.getEditor()

			expect(editorView.find(".autocomplete-plus")).not.toExist()

			editor.moveCursorToBottom()
			editor.insertText "/"

			advanceClock completionDelay

			expect(editorView.find(".autocomplete-plus")).not.toExist()
