/** @babel */

function waitsFor(escapeFunction, timeoutError = null, escapeTime = null) {
  return new Promise((resolve, reject) => {
    // check the escapeFunction every millisecond so as soon as it is met we can escape the function
    const interval = setInterval(function () {
      if (escapeFunction()) {
        clearMe()
        resolve()
      }
    }, 1)

    // in case we never reach the escapeFunction, we will time out at the escapeTime
    const timeOut = escapeTime
      ? setTimeout(function () {
          clearMe()
          reject(timeoutError)
        }, escapeTime)
      : null

    // clear the interval and the timeout
    function clearMe() {
      clearInterval(interval)
      clearTimeout(timeOut)
    }
  })
}

const COMPLETION_DELAY = 100

describe("autocomplete-paths", () => {
  let editor, provider
  const getSuggestions = () => {
    const cursor = editor.getLastCursor()
    const start = cursor.getBeginningOfCurrentWordBufferPosition()
    const end = cursor.getBufferPosition()
    const prefix = editor.getTextInRange([start, end])
    const request = {
      editor,
      bufferPosition: end,
      scopeDescriptor: cursor.getScopeDescriptor(),
      prefix,
    }
    return provider.getSuggestions(request)
  }

  beforeEach(async () => {
    atom.config.set("autocomplete-plus.enableAutoActivation", true)
    atom.config.set("autocomplete-plus.autoActivationDelay", COMPLETION_DELAY)
    atom.config.set("autocomplete-paths.ignoredPatterns", ["**/tests"])

    const workspaceElement = atom.views.getView(atom.workspace)
    jasmine.attachToDOM(workspaceElement)

    await Promise.all([
      atom.workspace.open("sample.js").then((e) => {
        editor = e
      }),
      atom.packages.activatePackage("language-javascript"),
      atom.packages.activatePackage("autocomplete-paths"),
      atom.packages.activatePackage("autocomplete-plus"),
      atom.packages.activatePackage("status-bar"),
    ])

    provider = atom.packages.getActivePackage("autocomplete-paths").mainModule.getProvider()
    await waitsFor(() => provider.isReady())
  })

  it("triggers when text before cursor matches one of the scopes", async () => {
    editor.setText("require('t")
    editor.setCursorBufferPosition([0, Infinity])
    const suggestions = await getSuggestions()

    expect(suggestions).toHaveLength(2)
  })

  it("only displays files relevant to the matching scope", async () => {
    await atom.packages.activatePackage("language-javascript")
    editor.setText("require('t")
    editor.setCursorBufferPosition([0, Infinity])
    const suggestions = await getSuggestions()

    expect(suggestions).toHaveLength(2)
    expect(suggestions[0].displayText).toBe("somedir/testfile.js")
    expect(suggestions[1].displayText).toBe("somedir/testdir/nested-test-file.js")
  })

  it("removes the extension when accepting a JS import suggestion", async () => {
    await atom.packages.activatePackage("language-javascript")
    const editorView = atom.views.getView(editor)
    editor.setText("require('")
    editor.moveToBottom()
    editor.insertText("t")
    editor.insertText("e")
    editor.insertText("s")

    await waitsFor(() => editorView.querySelector(".autocomplete-plus"), "autocomplete view to appear", 1000)

    atom.commands.dispatch(editorView, "autocomplete-plus:confirm")

    expect(editor.getText()).toEqual("require('./somedir/testfile")
  })
})
