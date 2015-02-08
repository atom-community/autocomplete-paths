module.exports =
  registration: null
  pathsProvider: null

  config:
    fileExtensionsExclude:
      title: 'File Extensions to Exclude'
      description: 'A comma seperated list of sources to exclude the file extension in autocomplete results.'
      type: 'array'
      default: []
      items:
        type: 'string'

  activate: ->
    PathsProvider = require('./paths-provider')
    @pathsProvider = new PathsProvider()
    @registration = atom.services.provide('autocomplete.provider', '1.0.0', {provider: @pathsProvider})

  deactivate: ->
    @registration?.dispose()
    @registration = null
    @pathsProvider?.dispose()
    @pathsProvider = null
