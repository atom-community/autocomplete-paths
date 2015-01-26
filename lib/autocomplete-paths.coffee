module.exports =
  registration: null
  pathsProvider: null

  activate: ->
    PathsProvider = require('./paths-provider')
    @pathsProvider = new PathsProvider()
    @registration = atom.services.provide('autocomplete.provider', '1.0.0', {provider: @pathsProvider})

  deactivate: ->
    @registration?.dispose()
    @registration = null
    @pathsProvider?.dispose()
    @pathsProvider = null
