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
      Provider = (require './paths-provider').ProviderClass(@autocomplete.Provider, @autocomplete.Suggestion)
      return unless Provider?
      @editorSubscription = atom.workspace.observeTextEditors((editor) => @registerProvider(Provider, editor))

  ###
   * Registers a Provider for an editor
  ###
  registerProvider: (Provider, editor) ->
    return unless Provider?
    return unless editor?
    editorView = atom.views.getView(editor)
    return unless editorView?
    if not editorView.mini
      provider = new Provider(editor)
      @autocomplete.registerProviderForEditor(provider, editor)
      @providers.push(provider)

  ###
   * Cleans everything up, unregisters all Provider instances
  ###
  deactivate: ->
    @editorSubscription?.dispose()
    @editorSubscription = null

    @providers.forEach (provider) => @autocomplete.unregisterProvider(provider)
    @providers = []
