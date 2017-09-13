'use babel'
/* global atom, expect, describe, beforeEach, it, waitsForPromise, waitsFor, runs, advanceClock, jasmine */

const COMPLETION_DELAY = 100

describe('autocomplete-paths', () => {
  let [ editor, provider ] = []
  const getSuggestions = () => {
    const cursor = editor.getLastCursor()
    const start = cursor.getBeginningOfCurrentWordBufferPosition()
    const end = cursor.getBufferPosition()
    const prefix = editor.getTextInRange([start, end])
    const request = {
      editor,
      bufferPosition: end,
      scopeDescriptor: cursor.getScopeDescriptor(),
      prefix
    }
    return provider.getSuggestions(request)
  }

  beforeEach(() => {
    atom.config.set('autocomplete-plus.enableAutoActivation', true)
    atom.config.set('autocomplete-plus.autoActivationDelay', COMPLETION_DELAY)
    atom.config.set('autocomplete-paths.ignoredPatterns', ['**/tests'])

    let workspaceElement = atom.views.getView(atom.workspace)
    jasmine.attachToDOM(workspaceElement)

    waitsForPromise(() =>
      Promise.all([
        atom.workspace.open('sample.js')
          .then((e) => {
            editor = e
          }),
        atom.packages.activatePackage('language-javascript'),
        atom.packages.activatePackage('autocomplete-paths'),
        atom.packages.activatePackage('autocomplete-plus'),
        atom.packages.activatePackage('status-bar')
      ])
    )
    runs(() => {
      provider = atom.packages.getActivePackage('autocomplete-paths').mainModule.getProvider()
    })
    waitsFor(() => provider.isReady())
  })

  it('triggers when text before cursor matches one of the scopes', () => {
    runs(() => {
      editor.setText('require(\'t')
      editor.setCursorBufferPosition([0, Infinity])
    })
    waitsForPromise(() => getSuggestions()
      .then((suggestions) => {
        expect(suggestions).toHaveLength(4)
      }))
  })

  it('only displays files relevant to the matching scope', () => {
    waitsForPromise(() => atom.packages.activatePackage('language-javascript'))
    runs(() => {
      editor.setText('require(\'t')
      editor.setCursorBufferPosition([0, Infinity])
    })
    waitsForPromise(() => getSuggestions()
      .then((suggestions) => {
        expect(suggestions).toHaveLength(4)
        expect(suggestions[0].displayText).toBe('somedir/testfile.js')
        expect(suggestions[1].displayText).toBe('linkeddir/testfile.js')
        expect(suggestions[2].displayText).toBe('somedir/testdir/nested-test-file.js')
        expect(suggestions[3].displayText).toBe('linkeddir/testdir/nested-test-file.js')
      }))
  })

  it('removes the extension when accepting a JS import suggestion', () => {
    let editorView
    waitsForPromise(() => atom.packages.activatePackage('language-javascript'))
    runs(() => {
      editorView = atom.views.getView(editor)
      editor.setText('require(\'')
      editor.moveToBottom()
      editor.insertText('t')
      editor.insertText('e')
      editor.insertText('s')

      advanceClock(COMPLETION_DELAY)
    })
    waitsFor('autocomplete view to appear', 1000, () => {
      return editorView.querySelector('.autocomplete-plus')
    })
    runs(() => {
      atom.commands.dispatch(editorView, 'autocomplete-plus:confirm')

      expect(editor.getText()).toEqual('require(\'./somedir/testfile')
    })
  })
})
