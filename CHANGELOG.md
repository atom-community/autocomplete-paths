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

* Fixed path regex. (#8)

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
