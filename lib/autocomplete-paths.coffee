module.exports =
  provider: null
  ready: false

  config:
    fileExtensionsExclude:
      title: 'File Extensions to Exclude'
      description: 'A comma seperated list of sources to exclude the file extension in autocomplete results.'
      type: 'array'
      default: []
      items:
        type: 'string'

  activate: ->
    @ready = true

  deactivate: ->
    @provider = null

  getProvider: ->
    return @provider if @provider?
    PathsProvider = require('./paths-provider')
    @provider = new PathsProvider()
    return @provider

  provide: ->
    return {provider: @getProvider()}
