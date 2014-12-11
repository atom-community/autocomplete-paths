_ = require "underscore-plus"
PathsProvider = require "./paths-provider"

module.exports =
  editorSubscription: null
  providers: []
  autocomplete: null

  ###
   * Registers a PathsProvider for each editor view
  ###
  activate: ->
    atom.packages.activatePackage("autocomplete-plus")
      .then (pkg) =>
        @autocomplete = pkg.mainModule
        @registerProviders()

  ###
   * Registers a PathsProvider for each editor view
  ###
  registerProviders: ->
    @editorSubscription = atom.workspace.observeTextEditors (editor) =>
      provider = new PathsProvider editor

      @autocomplete.registerProviderForEditor provider, editor

      @providers.push provider

  ###
   * Cleans everything up, unregisters all PathsProvider instances
  ###
  deactivate: ->
    @editorSubscription?.dispose()
    @editorSubscription = null

    @providers.forEach (provider) =>
      @autocomplete.unregisterProvider provider

    @providers = []
