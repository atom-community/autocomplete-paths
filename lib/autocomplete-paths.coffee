module.exports =
  provider: null
  ready: false

  config:
    normalizeSlashes:
      title: 'Normalize Slashes'
      description: 'Converts backslashes to forward slashes'
      type: 'boolean'
      default: false

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
