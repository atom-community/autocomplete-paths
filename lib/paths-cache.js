import { EventEmitter } from "events"
import minimatch from "minimatch"
import { Directory, File } from "atom"
import { dirname } from "path"
import { union, dedent } from "./utils"
import { globifyPath, globifyDirectory, globifyGitIgnoreFile } from "globify-gitignore"
import glob from "fast-glob"
import * as chokidar from "chokidar"

export default class PathsCache extends EventEmitter {
  constructor() {
    super()

    const rebuildCacheBound = this.rebuildCache.bind(this)
    this._projectChangeWatcher = atom.project.onDidChangePaths(rebuildCacheBound)

    const _onDidChangeFilesBound = this._onDidChangeFiles.bind(this)
    this._projectWatcher = atom.project.onDidChangeFiles(_onDidChangeFilesBound)

    this._repositories = []
    // TODO remove _filePathsByProjectDirectory and only use _filePathsByDirectory
    this._filePathsByProjectDirectory = new Map()
    this._filePathsByDirectory = new Map()
    this._fileWatchersByDirectory = new Map()
    this._allIgnoredGlobByDirectory = new Map()
    this.updateConfig()
  }

  updateConfig() {
    this.config = {
      excludeVcsIgnoredPaths: atom.config.get("core.excludeVcsIgnoredPaths"),
      ignoreSubmodules: atom.config.get("autocomplete-paths.ignoreSubmodules"),
      shouldIgnoredNames: atom.config.get("autocomplete-paths.ignoredNames"),
      ignoredNames: atom.config.get("core.ignoredNames"),
      ignoredPatterns: atom.config.get("autocomplete-paths.ignoredPatterns"),
      maxFileCount: atom.config.get("autocomplete-paths.maxFileCount"),
      followSymlinks: atom.config.get("autocomplete-paths.followSymlinks"),
    }
  }

  /**
   * Rebuilds the paths cache
   *
   * @returns {Promise<string[][]>}
   */
  async rebuildCache() {
    this.dispose()

    this._cancelled = false
    this.emit("rebuild-cache")

    await this._cacheProjectPathsAndRepositories()
    const results = await this._cachePaths()

    await this._addWatchers()

    this.emit("rebuild-cache-done")
    return results
  }

  /**
   * Returns the file paths for the given project directory with the given (optional) relative path
   *
   * @param {Directory} projectDirectory
   * @param {string | null} [relativeToPath=null] Default is `null`
   * @returns {string[]}
   */
  getFilePathsForProjectDirectory(projectDirectory, relativeToPath = null) {
    const filePaths = this._filePathsByProjectDirectory.get(projectDirectory.path) || []
    if (relativeToPath) {
      return filePaths.filter((filePath) => filePath.indexOf(relativeToPath) === 0)
    }
    return filePaths
  }

  /**
   * Disposes this PathsCache
   *
   * @param {boolean} isPackageDispose
   */
  dispose(isPackageDispose) {
    this._fileWatchersByDirectory.forEach(async (watcher) => {
      await watcher.close()
    })
    this._fileWatchersByDirectory.clear()
    this._filePathsByProjectDirectory.clear()
    this._filePathsByDirectory.clear()
    this._repositories = []
    if (this._projectWatcher) {
      this._projectWatcher.dispose()
      this._projectWatcher = null
    }
    if (isPackageDispose && this._projectChangeWatcher) {
      this._projectChangeWatcher.dispose()
      this._projectChangeWatcher = null
    }
  }

  /**
   * Checks if the given path is ignored
   *
   * @private
   * @param {string} path
   * @returns {boolean}
   */
  _isPathIgnored(path) {
    if (
      this.config.excludeVcsIgnoredPaths &&
      this._repositories.some((repository) => {
        return repository.isPathIgnored(path)
      })
    ) {
      return true
    }

    if (
      this.config.ignoreSubmodules &&
      this._repositories.some((repository) => {
        return repository.isSubmodule(path)
      })
    ) {
      return true
    }

    if (
      this.config.shouldIgnoredNames &&
      this.config.ignoredNames.some((ignoredName) => {
        return minimatch(path, ignoredName, { matchBase: true, dot: true })
      })
    ) {
      return true
    }

    if (
      this.config.ignoredPatterns &&
      this.config.ignoredPatterns.some((ignoredPattern) => {
        return minimatch(path, ignoredPattern, { dot: true })
      })
    ) {
      return true
    }

    return false
  }

  /**
   * Caches the project paths and repositories
   *
   * @private
   */
  async _cacheProjectPathsAndRepositories() {
    this._projectDirectories = atom.project.getDirectories()

    // get the repositories asynchronously
    const projectNum = this._projectDirectories.length
    const repositoriesP = new Array(projectNum)
    for (let i = 0; i < projectNum; i++) {
      repositoriesP[i] = atom.project.repositoryForDirectory(this._projectDirectories[i])
    }
    const repositories = await Promise.all(repositoriesP)
    this._repositories = repositories.filter((r) => r !== null) // filter out non-repository directories
  }

  /**
   * Add watchers for all the projectDirectories
   *
   * @private
   * @returns {Promise<void>}
   */
  async _addWatchers() {
    await Promise.all(
      this._projectDirectories.map((projectDirectory) => this._addWatcherForDirectory(projectDirectory))
    )
  }

  /**
   * Add a watcher for the projectDirectory
   *
   * @private
   * @param {Directory} projectDirectory
   */
  async _addWatcherForDirectory(projectDirectory) {
    // close if already added
    let watcher = this._fileWatchersByDirectory.get(projectDirectory)
    if (watcher !== undefined && typeof watcher.close === "function") {
      await watcher.close()
    }
    // add a watcher to run `this._onDirectoryChanged`
    const projectPath = projectDirectory.getPath()
    if (this._filePathsByProjectDirectory.get(projectPath).length >= this.config.maxFileCount) {
      console.warn(dedent`autocomplete-paths: Maximum file count of ${this.config.maxFileCount} has been exceeded,
        so the subequent changes in the project are not tracked.
        See these link to learn more:
        https://github.com/atom-community/autocomplete-paths/wiki/Troubleshooting#maximum-file-limit-exceeded
        https://github.com/atom-community/autocomplete-paths/issues/270
      `)
      return
    }
    const ignored = this._allIgnoredGlobByDirectory.get(projectDirectory.path)
    // TODO smarter handling of directory changes
    // TODO get paths from the watcher itself
    // TODO track gitignore file
    watcher = chokidar
      .watch([projectPath, ...ignored], {
        persistent: true,
        ignoreInitial: true, // do not run the listeners on the initial scan
        followSymlinks: this.config.followSymlinks,
        interval: 1000,
        binaryInterval: 1000,
      })
      .on("add", (addedFile) => {
        // we should track it too!
        // if (basename(addedFile) === ".gitignore") {
        //   // if a gitignore file is added re-process the folder
        //   this.onRemoveDir(projectDirectory, removedDir)
        //   this.onAddDir(projectDirectory, removedDir)
        //   return
        // }
        this.onAddFile(projectDirectory, addedFile)
      })
      .on("unlink", (removedFile) => {
        this.onRemoveFile(projectDirectory, removedFile)
      })
      .on("addDir", (addedDir) => {
        this.onAddDir(addedDir)
      })
      .on("unlinkDir", (removedDir) => {
        this.onRemoveDir(projectDirectory, removedDir)
      })
    this._fileWatchersByDirectory.set(projectDirectory, watcher)
  }

  /**
   * @param projectDirectory {Directory}
   * @param addedFile {string}
   */
  onAddFile(projectDirectory, addedFile) {
    const filePaths = this._filePathsByProjectDirectory.get(projectDirectory.path)
    filePaths.push(addedFile)
    this._filePathsByProjectDirectory.set(projectDirectory.path, filePaths)
  }

  /**
   * @param projectDirectory {Directory}
   * @param removedFile {string}
   */
  onRemoveFile(projectDirectory, removedFile) {
    /** @type {string[]} */
    const filePaths = this._filePathsByProjectDirectory.get(projectDirectory.path)

    // delete the removed file
    const fileIndex = filePaths.indexOf(removedFile)
    delete filePaths[fileIndex]
    this._filePathsByProjectDirectory.set(projectDirectory.path, filePaths)
  }

  /** @param addedDir {string} */
  async onAddDir(addedDir) {
    await this._cachePathsForDirectoryWithGlob(addedDir)
  }

  /**
   * @param projectDirectory {Directory}
   * @param removedDir {string}
   */
  onRemoveDir(projectDirectory, removedDir) {
    const directory = new Directory(removedDir)
    this._removeFilePathsForDirectory(projectDirectory, directory)
  }

  /**
   * Invoked when the content of the given `directory` has changed
   *
   * @private
   * @param {Directory} projectDirectory
   * @param {Directory} directory
   * @returns {Promise<void>}
   */
  async _onDirectoryChanged(projectDirectory, directory) {
    this.emit("rebuild-cache")
    this._removeFilePathsForDirectory(projectDirectory, directory)
    this._cleanWatchersForDirectory(directory)
    await this._cachePathsForDirectory(projectDirectory, directory)
    this.emit("rebuild-cache-done")
  }

  /**
   * Removes all watchers inside the given directory
   *
   * @private
   * @param {Directory} directory
   */
  _cleanWatchersForDirectory(directory) {
    // TODO promise all
    this._fileWatchersByDirectory.forEach(async (watcher, otherDirectory) => {
      if (directory.contains(otherDirectory.path)) {
        await await watcher.close()
        this._fileWatchersByDirectory.delete(otherDirectory)
      }
    })
  }

  /**
   * Removes all cached file paths in the given directory
   *
   * @private
   * @param {Directory} projectDirectory
   * @param {Directory} directory
   */
  _removeFilePathsForDirectory(projectDirectory, directory) {
    let filePaths = this._filePathsByProjectDirectory.get(projectDirectory.path)
    if (!filePaths) {
      return
    }

    filePaths = filePaths.filter((path) => !directory.contains(path))
    this._filePathsByProjectDirectory.set(projectDirectory.path, filePaths)

    this._filePathsByDirectory.delete(directory.path)
  }

  _onDidChangeFiles(events) {
    events
      .filter((event) => event.action !== "modified")
      .forEach((event) => {
        if (!this._projectDirectories) {
          return
        }

        const { action, path, oldPath } = event

        const projectDirectory = this._projectDirectories.find((pd) => path.indexOf(pd.path) === 0)

        if (!projectDirectory) {
          return
        }
        const directoryPath = projectDirectory.path
        const ignored = this._isPathIgnored(path)

        if (ignored) {
          return
        }

        const files = this._filePathsByProjectDirectory.get(directoryPath) || []

        switch (action) {
          case "created":
            files.push(path)
            break

          case "deleted": {
            const i = files.indexOf(path)
            if (i > -1) {
              files.splice(i, 1)
            }
            break
          }
          case "renamed": {
            const j = files.indexOf(oldPath)
            if (j > -1) {
              files[j] = path
            }
            break
          }
          default: {
            console.error(`unkown _onDidChangeFiles action: ${action}`)
            break
          }
        }

        if (!this._filePathsByProjectDirectory.has(directoryPath)) {
          this._filePathsByProjectDirectory.set(directoryPath, files)
        }
      })
  }

  /**
   * Caches file paths with Glob or Atom
   *
   * @private
   * @returns {Promise<((string)[])[]}
   */
  _cachePaths() {
    try {
      return this._cachePathsWithGlob()
    } catch (e) {
      console.error(e)
      return this._cachePathsWithAtom()
    }
  }

  /**
   * Caches file paths for the given directory with Glob or Atom
   *
   * @private
   * @param {Directory} projectDirectory
   * @param {Directory} directory
   * @returns {Promise}
   */
  _cachePathsForDirectory(projectDirectory, directory) {
    try {
      return this._cachePathsForDirectoryWithGlob(directory.path)
    } catch (e) {
      // fallback to Atom
      console.error(e)
      return this._cachePathsForDirectoryWithAtom(projectDirectory, directory)
    }
  }

  /*
   ██████  ██       ██████  ██████
  ██       ██      ██    ██ ██   ██
  ██   ███ ██      ██    ██ ██████
  ██    ██ ██      ██    ██ ██   ██
   ██████  ███████  ██████  ██████
  */

  /**
   * Builds the file cache with `glob`
   *
   * @private
   * @returns {Promise<string[][]>}
   */
  async _cachePathsWithGlob() {
    const result = await Promise.all(
      this._projectDirectories.map((projectDirectory) => this._cachePathsForDirectoryWithGlob(projectDirectory.path))
    )
    return result
  }

  /**
   * Returns a list of ignore patterns for a directory
   *
   * @private
   * @param {string} directoryPath
   * @returns {Promise<string[]>} An array of glob patterns
   */
  async _getIgnoredPatternsGlob(directoryPath) {
    const patterns = []

    if (this.config.shouldIgnoredNames) {
      patterns.push(...this.config.ignoredNames)
    }

    if (this.config.ignoredPatterns) {
      patterns.push(...this.config.ignoredPatterns)
    }

    const patternsNum = patterns.length

    const globEntries = new Array(patternsNum)

    for (let iEntry = 0; iEntry < patternsNum; iEntry++) {
      // eslint-disable-next-line no-await-in-loop
      const globifyOutput = await globifyPath(patterns[iEntry], directoryPath)

      // Check if `globifyPath` returns a pair or a string
      if (typeof globifyOutput === "string") {
        // string
        globEntries[iEntry] = globifyOutput // Place the entry in the output array
      } else {
        // pair
        globEntries[iEntry] = globifyOutput[0] // Place the entry in the output array
        globEntries.push(globifyOutput[1]) // Push the additional entry
      }
    }
    return globEntries
  }

  /**
   * Returns the glob pattern of all gitignore files in a directory
   *
   * @private
   * @param {string} rootDirectory
   * @param {string[]} ignoredPatternsGlob
   * @returns {Promise<string[]>} An array of glob patterns
   */
  async _getAllGitIgnoreGlob(rootDirectory, ignoredPatternsGlob) {
    if (this.config.excludeVcsIgnoredPaths) {
      // get gitignore files
      const gitignoreFiles = await glob(
        ["**/.gitignore", ...ignoredPatternsGlob],
        // glob options
        {
          dot: true,
          cwd: rootDirectory,
          onlyFiles: true,
          absolute: true,
          followSymbolicLinks: this.config.followSymlinks,
        }
      )
      return (
        await Promise.all(gitignoreFiles.map((gitignoreFile) => _getDirectoryGitIgnoreGlob(dirname(gitignoreFile))))
      ).flat()
    }
    return []
  }

  /**
   * Get all ignored glob using `this._getGitIgnoreGlob` and `this._getIgnoredPatternsGlob`
   *
   * @param {string} directoryPath The given directory path
   * @returns {Promise<string[]>}
   */
  async _getAllIgnoredGlob(directoryPath) {
    const ignoredPatternsGlob = await this._getIgnoredPatternsGlob(directoryPath)
    const gitignoreGlob = await this._getAllGitIgnoreGlob(directoryPath, ignoredPatternsGlob)
    return [...gitignoreGlob, ...ignoredPatternsGlob]
  }

  /**
   * Populates cache for the given directory
   *
   * @private
   * @param {string} directoryPath The given directory path
   * @returns {Promise<string[]>}
   */
  async _cachePathsForDirectoryWithGlob(directoryPath) {
    const directoryGlob = globifyDirectory(directoryPath)
    const allIgnoredGlob = await this._getAllIgnoredGlob(directoryPath)
    this._allIgnoredGlobByDirectory.set(directoryPath, allIgnoredGlob)
    const files = await glob(
      [directoryGlob, ...allIgnoredGlob],
      // glob options
      {
        dot: true,
        cwd: directoryPath,
        onlyFiles: true,
        followSymbolicLinks: this.config.followSymlinks,
      }
    )
    this._filePathsByProjectDirectory.set(directoryPath, files)
    return files
  }

  /*
  ███████  █████  ██      ██      ██████   █████   ██████ ██   ██
  ██      ██   ██ ██      ██      ██   ██ ██   ██ ██      ██  ██
  █████   ███████ ██      ██      ██████  ███████ ██      █████
  ██      ██   ██ ██      ██      ██   ██ ██   ██ ██      ██  ██
  ██      ██   ██ ███████ ███████ ██████  ██   ██  ██████ ██   ██
  */

  /**
   * Builds the file cache using Atom
   *
   * @private
   * @returns {Promise<string[][]>}
   */
  async _cachePathsWithAtom() {
    const result = await Promise.all(
      this._projectDirectories.map((projectDirectory) => {
        return this._cachePathsForDirectoryWithAtom(projectDirectory, projectDirectory)
      })
    )
    return result
  }

  /**
   * Caches file paths for the given directory with Atom
   *
   * @private
   * @param {Directory} projectDirectory
   * @param {Directory} directory
   * @returns {Promise<string[]>}
   */
  async _cachePathsForDirectoryWithAtom(projectDirectory, directory) {
    if (this._cancelled) {
      return []
    }

    const entries = await this._getDirectoryEntries(directory)
    if (this._cancelled) {
      return []
    }

    // Filter: Files and Directories that are not ignored
    const filePaths = []
    const directories = []
    for (let i = 0, len = entries.length; i < len; i++) {
      const entry = entries[i]
      if (entry instanceof File && !this._isPathIgnored(entry.path)) {
        filePaths.push(entry.path)
      } else if (entry instanceof Directory && !this._isPathIgnored(entry.path)) {
        directories.push(entry)
      }
    }

    // Merge file paths into existing array (which contains *all* file paths)
    let filePathsArray = this._filePathsByProjectDirectory.get(projectDirectory.path) || []
    const newPathsCount = filePathsArray.length + filePaths.length

    if (newPathsCount > this.config.maxFileCount && !this._cancelled) {
      atom.notifications.addError("autocomplete-paths", {
        description: `Maximum file count of ${this.config.maxFileCount} has been exceeded. Path autocompletion will not work in this project.<br /><br /><a href="https://github.com/atom-community/autocomplete-paths/wiki/Troubleshooting#maximum-file-limit-exceeded">Click here to learn more.</a>`,
        dismissable: true,
      })

      this._filePathsByProjectDirectory.clear()
      this._filePathsByDirectory.clear()
      this._cancelled = true
      return
    }

    this._filePathsByProjectDirectory.set(projectDirectory.path, union(filePathsArray, filePaths))

    // Merge file paths into existing array (which contains file paths for a specific directory)
    filePathsArray = this._filePathsByDirectory.get(directory.path) || []
    this._filePathsByDirectory.set(directory.path, union(filePathsArray, filePaths))

    return Promise.all(directories.map((dir) => this._cachePathsForDirectoryWithAtom(projectDirectory, dir)))
  }
}

/**
 * Returns the glob pattern of a gitignore of a directory
 *
 * @private
 * @param {string} directoryPath
 * @returns {Promise<string[]>} An array of glob patterns
 */
function _getDirectoryGitIgnoreGlob(directoryPath) {
  try {
    return globifyGitIgnoreFile(directoryPath)
  } catch (err) {
    // .gitignore does not exist for this directory, ignoring
    return []
  }
}
