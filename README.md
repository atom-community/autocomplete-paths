# autocomplete+ paths suggestions [![Build Status](https://travis-ci.org/atom-community/autocomplete-paths.svg?branch=master)](https://travis-ci.org/atom-community/autocomplete-paths)

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/atom-community/autocomplete-paths?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[View the changelog](https://github.com/atom-community/autocomplete-paths/blob/master/CHANGELOG.md)

Adds path autocompletion to autocomplete+ depending on scope and prefix. Supports custom scopes defined by the user.

![autocomplete-paths](http://fs5.directupload.net/images/160215/5tdhz7c4.gif)

## Features

* Support for JavaScript, CoffeeScript, TypeScript, PHP, SASS, LESS, Stylus, CSS, C, C++, Lua, Ruby and Python
* Very efficient thanks to caching and incremental cache rebuilds (incremental builds are [disabled for Windows](https://github.com/atom/node-pathwatcher/issues/70). Please use the `Rebuild Cache` command.)
* Easily extendable

## Installation

You can install autocomplete-paths using the Preferences pane.

## Defining scopes

`autocomplete-paths` triggers whenever a scope matches the current cursor position and scope
descriptor. Here is an example for a JavaScript-Scope that supports the ES6 'import' syntax as
well as the CommonJS `require()` syntax and the RequireJS `define()` syntax:

```js
{
  scopes: ['source.js'], // Only triggers in JS files
  prefixes: [
    'import\\s+.*?from\\s+[\'"]', // import foo from '
    'require\\([\'"]', // require('
    'define\\(\\[?[\'"]' // define([' or define('
  ],
  extensions: ['js', 'jsx', 'ts', 'coffee'], // Only shows JS / TS / Coffee files
  relative: true, // Inserts relative paths only - defaults to true
  includeCurrentDirectory: true, // Include './' in path - defaults to true
  projectRelativePath: false, // Includes full relative path starting after the project directory
  replaceOnInsert: [ // Replaces the file extensions on insert
    ['.jsx?$', ''],
    ['.ts$', ''],
    ['.coffee$', '']
  ]
}
```

You can add custom scopes by adding them to your `config.cson` file:

```coffee
"autocomplete-paths":
  scopes: [
    { ... },
    { ... },
  ]
```
