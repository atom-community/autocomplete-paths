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
