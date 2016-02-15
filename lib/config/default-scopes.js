'use babel'

export default [
  {
    scopes: ['source.js', 'source.js.jsx', 'source.coffee', 'source.coffee.jsx', 'source.ts', 'source.tsx'],
    prefixes: [
      'import\\s+.*?from\\s+[\'"]', // import foo from './foo'
      'require\\([\'"]', // require('./foo')
      'define\\(\\[?[\'"]' // define(['./foo']) or define('./foo')
    ],
    extensions: ['js', 'jsx', 'ts', 'tsx', 'coffee'],
    relative: true,
    replaceOnInsert: [
      ['.jsx?$', ''],
      ['.ts$', ''],
      ['.coffee$', '']
    ]
  },
  {
    scopes: ['source.php'],
    prefixes: [
      'require_once\\([\'"]', // require_once('foo.php')
      'include\\([\'"]' // include('./foo.php')
    ],
    extensions: ['php'],
    relative: true
  },
  {
    scopes: ['source.sass', 'source.scss', 'source.less', 'source.stylus'],
    prefixes: [
      '@import[\\(|\\s+]?[\'"]' // @import 'foo' or @import('foo')
    ],
    extensions: ['sass', 'scss', 'css'],
    relative: true
  },
  {
    scopes: ['source.css'],
    prefixes: [
      '@import\s+[\'"]?', // @import 'foo.css'
      '@import\s+url\\([\'"]?' // @import url('foo.css')
    ],
    extensions: ['css'],
    relative: true
  },
  {
    scopes: ['source.css', 'source.sass', 'source.less', 'source.scss', 'source.stylus'],
    prefixes: [
      'url\\([\'"]?'
    ],
    extensions: ['png', 'gif', 'jpeg', 'jpg', 'woff', 'ttf', 'svg', 'otf'],
    relative: true
  }
]
