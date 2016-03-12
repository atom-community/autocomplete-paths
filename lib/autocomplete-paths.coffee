module.exports =
  provider: null
  ready: false

  config:
    relativeRoot:
      title: 'Make absolute paths relative to the project'
      type: 'boolean'
      default: true

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
