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
    this.subscriptions.add(atom.config.observe('autocomplete-paths.scopes', value => {
      if (!this._provider) return
      this._provider.reloadScopes()
    }))
  },

  deactivate: function () {
    this.subscriptions.dispose()
    if (this._provider) {
      this._provider.dispose()
      this._provider = null
    }
    if (this._statusBarTile) {
      this._statusBarTile.destroy()
      this._statusBarTile = null
    }
  },

  /**
   * Invoked when the status bar becomes available
   * @param  {StatusBar} statusBar
   */
  consumeStatusBar: function (statusBar) {
    this._statusBar = statusBar
    if (this._displayStatusBarItemOnConsumption) {
      this._displayStatusBarTile()
    }
  },

  /**
   * Displays the status bar tile
   */
  _displayStatusBarTile () {
    if (!this._statusBar) {
      this._displayStatusBarItemOnConsumption = true
      return
    }
    if (this._statusBarTile) return

    const statusBarElement = document.createElement('autocomplete-paths-status-bar')
    statusBarElement.innerHTML = 'Rebuilding paths cache...'
    this._statusBarTile = this._statusBar.addRightTile({ item: statusBarElement, priority: 100 })
  },

  /**
   * Hides the status bar tile
   */
  _hideStatusBarTile () {
    this._statusBarTile && this._statusBarTile.destroy()
    this._statusBarTile = null
  },

  getProvider: function () {
    if (!this._provider) {
      this._provider = new PathsProvider()
      this._provider.on('rebuild-cache', () => {
        this._displayStatusBarTile()
      })
      this._provider.on('rebuild-cache-done', () => {
        this._hideStatusBarTile()
      })
      this._provider.rebuildCache()
    }
    return this._provider
  }
}
