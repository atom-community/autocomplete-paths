module.exports =
  editorSubscription: null
  providers: []
  autocomplete: null

  ###
   * Activates the package
  ###
  activate: ->
    atom.packages.activatePackage('autocomplete-plus').then (pkg) =>
      @autocomplete = pkg.mainModule
      return unless @autocomplete?
      PathsProvider = (require './paths-provider').ProviderClass(@autocomplete.Provider, @autocomplete.Suggestion)
      return unless PathsProvider?
      @editorSubscription = atom.workspace.observeTextEditors((editor) => @registerProvider(PathsProvider, editor))

  ###
   * Registers a Provider for each editor
  ###
  registerProvider: (PathsProvider, editor) ->
    return unless editor?
    editorView = atom.views.getView(editor)
    return unless editorView?
    if not editorView.mini
      provider = new PathsProvider(editor)
      @autocomplete.registerProviderForEditor(provider, editor)
      @providers.push(provider)

  ###
   * Cleans everything up, unregisters all SnippetProvider instances
  ###
  deactivate: ->
    @editorSubscription?.dispose()
    @editorSubscription = null

    @providers.forEach (provider) => @autocomplete.unregisterProvider(provider)
    @providers = []
