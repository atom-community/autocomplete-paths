2.12.10 (November 24 2020)
===================

* Handle when a project is not git repository ([#239](https://github.com/atom-community/autocomplete-paths/pull/239))

2.12.9 (November 11 2020)
===================

* Entries filtering performance optimization ([#238](https://github.com/atom-community/autocomplete-paths/pull/238))

2.12.8 (November 11 2020)
===================

* Call the correct updateConfig

2.12.7 (November 11 2020)
===================

* General improvements (asyncify, Parcel, refactor, dead-code remove) ([#237](https://github.com/atom-community/autocomplete-paths/pull/237))

2.12.6 (November 10 2020)
===================

* Refactoring in default scopes ([#234](https://github.com/atom-community/autocomplete-paths/pull/234))
* Bump dependencies ([#236](https://github.com/atom-community/autocomplete-paths/pull/236))

2.12.5 (November 4 2020)
===================

* Add more extensions to HTML ([#197](https://github.com/atom-community/autocomplete-paths/pull/197))

2.12.4 (November 4 2020)
===================

* Update fuzzaldrin-plus-fast to 1.1.1 ([#232](https://github.com/atom-community/autocomplete-paths/pull/232))

2.12.3 (November 4 2020)
===================

* Add javascript to default scopes to support tree-sitter syntax ([#203](https://github.com/atom-community/autocomplete-paths/pull/203))
* Use native fuzzaldrin plus fast ([#230](https://github.com/atom-community/autocomplete-paths/pull/230))
* Add normalized slashes for projectRelativePath ([#226](https://github.com/atom-community/autocomplete-paths/pull/226))
* Add default woff2 extension support ([#180](https://github.com/atom-community/autocomplete-paths/pull/180))
* Do not display StatusBarTile if no provider ([#233](https://github.com/atom-community/autocomplete-paths/pull/233))
* Fix leftover interval timer ([#185](https://github.com/atom-community/autocomplete-paths/pull/185))

2.12.2 (January 9 2018)
===================

* Fixes less scope ([#198](https://github.com/atom-community/autocomplete-paths/pull/198)) - thanks [@guoshencheng](https://github.com/guoshencheng)

2.12.1 (October 13 2017)
===================

* Fixes uninitialized files - thanks [@avaly](https://github.com/avaly)

2.12.0 (October 9 2017)
===================

Thanks a lot to [@avaly](https://github.com/avaly) for the following contributions:

* Fixes support for switching projects
* Adds support for project-relative paths autocompletion
* Shows cache file count in status bar
* Adds a `ignoredPatterns` option that specifies ignored files
* Uses `find` system command if possible which improves performance
* Uses new file watcher API introduced in Atom 1.21.0

2.11.0 (September 3 2017)
===================

* Adds option for HTML autocompletion
* Fixes `replaceOnInsert` logic for requests that match multiple regexes
* Regards `core.excludeVcsIgnoredPaths` option
* Better support for `.vue` files. Splits CSS and JS handling into separate scopes.

2.10.1 (September 2 2017)
===================

* Adds option to ignore submodules

2.8.2 (September 1 2017)
===================

* Fixes memory leak in PathsCache which caused the `maximum file count` message after a couple
  of cache rebuilds

2.8.1 (August 24 2017)
===================

* Fixes memory leak in PathsCache, which now uses strings as keys instead of `Directory` instances
* Includes prefix config for unnamed ES6 imports
* Includes support for .vue files

2.8.0 (August 15 2017)
===================

* User scopes override default scopes now


2.7.0 (August 15 2017)
===================

* Actually stop indexing when cancelling due to maximum file count
* Hide status bar item when indexing has been cancelled

2.6.0 (August 14 2017)
===================

* Disabled directory watching / incremental builds for Windows, fixing freezes
* Fix `normalizeSlashes` option for Windows

2.5.0 (August 13 2017)
===================

* Support for `core.ignoreNames` option
* Fix `currentDirectory` handling

2.4.0 (August 12 2017)
===================

* Support for relative paths - now only suggests paths in the given directory (e.g. `./lib/`)
* Strip directory paths from suggestions, if possible

2.3.0 (August 12 2017)
===================

* Exposing provider's `suggestionPriority`

2.2.0 (August 12 2017)
===================

* Added a file limit that should fix application freezing

2.1.0 (August 11 2017)
===================

* Backwards slashes are now replaced with forward slashes in windows, if possible.
* Got rid of `readdirp` and `pathwatcher` dependencies. Instead, we are now using atom's
  integrated `pathwatcher` by using the exposed `Directory` and `File` classes. This also
  fixes installation issues on machines that don't have the necessary compilation tools
  installed
* Added support for coffeescript's `require ""` syntax

2.0.2 (August 11 2017)
===================

* Upgraded `fuzzaldrin-plus`, `readdirp` and `pathwatchers`, resulting in better
  cross-platform support and stability

2.0.1 (August 11 2017)
===================

* Avoid synchronous I/O with GitRepository
* Fix non-git projects

2.0.0 (August 11 2017)
===================

* Paths are now cached on startup or using the 'Rebuild Cache' command
* Cache is rebuilt incrementally when files are renamed / deleted / added
* autocomplete-paths now shows all relevant files, depending on the scope descriptor and prefix
* See [the default scopes](lib/config/default-scopes) for examples on how to define scopes

0.5.0 (May 10 2014)
===================

* Fixed path regex. ([#8](https://github.com/atom-community/autocomplete-paths/pull/8))

0.4.0 (May 8 2014)
==================

* Fixed path normalization

0.3.0 (May 8 2014)
==================

* Rewrote the whole plugin, fixed a lot of bugs

0.2.0 (Apr 11 2014)
===================

* Minor bugfix

0.1.0 (Apr 11 2014)
===================

* Initial release
