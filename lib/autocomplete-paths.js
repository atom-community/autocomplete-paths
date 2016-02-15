'use babel'
/* global atom */

import Config from './config'
import PathsProvider from './paths-provider'
import { CompositeDisposable } from 'atom'

export default {
  config: Config,
  subscriptions: null,

  activate: function () {
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'autocomplete-paths:rebuild-cache': () => {
        this._provider.rebuildCache()
      }
    }))
  },

  deactivate: function () {
    this.subscriptions.dispose()
  },

  getProvider: function () {
    if (!this._provider) {
      this._provider = new PathsProvider()
    }
    return this._provider
  }
}
