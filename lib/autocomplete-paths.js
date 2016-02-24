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
    if (this._provider) {
      this._provider.dispose()
      this._provider = null
    }
    if (this._statusBarTile) {
      this._statusBarTile.destroy()
      this._statusBarTile = null
    }
  },

  consumeStatusBar: function (statusBar) {
    this._statusBar = statusBar
  },

  /**
   * Displays the status bar tile
   */
  _displayStatusBarTile () {
    if (!this._statusBar) return

    const statusBarElement = document.createElement('autocomplete-paths-status-bar')
    statusBarElement.innerHTML = 'Rebuilding paths cache...'
    this._statusBarTile = this._statusBar.addLeftTile({ item: statusBarElement, priority: 100 })
  },

  /**
   * Hides the status bar tile
   */
  _hideStatusBarTile () {
    this._statusBarTile && this._statusBarTile.destroy()
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
