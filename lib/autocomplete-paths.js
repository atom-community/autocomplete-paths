"use babel"
export { config } from "./config"
import PathsProvider from "./paths-provider"
import { CompositeDisposable } from "atom"
import { OptionScopes } from "./config/option-scopes"

const subscriptions = new CompositeDisposable()
let _provider
let _statusBar
let _statusBarInterval
let _statusBarTile
let _statusBarElement
let _displayStatusBarItemOnConsumption

export function activate() {
  subscriptions.add(
    atom.commands.add("atom-workspace", {
      "autocomplete-paths:rebuild-cache": () => {
        _provider.rebuildCache()
      },
    })
  )

  const cacheOptions = [
    "core.ignoredNames",
    "core.excludeVcsIgnoredPaths",
    "autocomplete-paths.ignoreSubmodules",
    "autocomplete-paths.ignoredNames",
    "autocomplete-paths.ignoredPatterns",
    "autocomplete-paths.maxFileCount",
  ]
  cacheOptions.forEach((cacheOption) => {
    subscriptions.add(
      atom.config.observe(cacheOption, () => {
        if (!_provider) {
          return
        }
        _provider._pathsCache.updateConfig()
        _provider.rebuildCache()
      })
    )
  })

  const scopeOptions = ["autocomplete-paths.scopes"]
  for (const key in OptionScopes) {
    scopeOptions.push(`autocomplete-paths.${key}`)
  }
  scopeOptions.forEach((scopeOption) => {
    subscriptions.add(
      atom.config.observe(scopeOption, () => {
        if (!_provider) {
          return
        }
        _provider.reloadScopes()
      })
    )
  })
}

export function deactivate() {
  if (_statusBarInterval) {
    clearInterval(_statusBarInterval)
  }
  subscriptions.dispose()
  if (_provider) {
    _provider.dispose(true)
    _provider = null
  }
  if (_statusBarTile) {
    _statusBarTile.destroy()
    _statusBarTile = null
  }
}

/**
 * Invoked when the status bar becomes available
 * @param  {StatusBar} statusBar
 */
export function consumeStatusBar(statusBar) {
  _statusBar = statusBar
  if (_displayStatusBarItemOnConsumption) {
    _displayStatusBarTile()
  }
}

/**
 * Displays the status bar tile
 */
function _displayStatusBarTile() {
  if (!_statusBar) {
    _displayStatusBarItemOnConsumption = true
    return
  }
  if (_statusBarTile) {
    return
  }

  _statusBarElement = document.createElement("autocomplete-paths-status-bar")
  _statusBarElement.innerHTML = "Rebuilding paths cache..."
  _statusBarTile = _statusBar.addRightTile({
    item: _statusBarElement,
    priority: 100,
  })
  if (!_provider) {
    // TODO check why we need this check
    getProvider()
    if (!_provider) {
      return
    }
  }
  _statusBarInterval = setInterval(() => {
    const fileCount = _provider.fileCount
    if (fileCount > 0) {
      _statusBarElement.innerHTML = `Rebuilding paths cache... ${fileCount} files`
    }
  }, 500)
}

/**
 * Hides the status bar tile
 */
function _hideStatusBarTile() {
  if (_statusBarInterval) {
    clearInterval(_statusBarInterval)
  }
  _statusBarTile && _statusBarTile.destroy()
  _statusBarTile = null
  _statusBarElement = null
}

export function getProvider() {
  if (!_provider) {
    _provider = new PathsProvider()
    _provider.on("rebuild-cache", () => {
      _displayStatusBarTile()
    })
    _provider.on("rebuild-cache-done", () => {
      _hideStatusBarTile()
    })
    _provider.rebuildCache()
  }
  return _provider
}
