import path from "path"
import { promises } from "fs"
const { readFile } = promises

import { unique } from "./utils"

/** Converts given path to Posix (replacing \\ with /)
 * @param {string} givenPath   Path to convert
 * @returns {string}          Converted filepath
 */
export function posixifyPath(givenPath) {
  return path.normalize(givenPath).replace(/\\/g, "/")
}

/** Converts given path to Posix (replacing \\ with /) and removing ending slashes
 * @param {string} givenPath   Path to convert
 * @returns {string}          Converted filepath
 */
export function posixifyPathNormalized(givenPath) {
  return posixifyPath(givenPath).replace(/[/\\]$/, "")
}

/**
 * @param {string} givenPath The given path to be globified
 * @param {string} givenDirectory [process.cwd()]  The cwd to use to resolve relative pathnames
 * @returns {string | [string, string]} The glob path or the file path itself
 */
export function globifyPath(givenPath, givenDirectory = process.cwd()) {
  return globifyGitIgnoreEntry(posixifyPath(givenPath), givenDirectory)
}

/**
 * Globifies a directory
 * @param {string} givenDirectory The given directory to be globified
 */
export function globifyDirectory(givenDirectory) {
  return `${posixifyPathNormalized(givenDirectory)}/**`
}

/**
 * Parse and globy the `.gitingore` file that exists in a directry
 * @param {string} gitIgnoreDirectory The given directory that has the `.gitignore` file
 * @returns {Promise<Array<string>>} an array of glob patterns
 */
export async function globifyGitIgnoreFile(gitIgnoreDirectory) {
  return globifyGitIgnore(await readFile(path.join(gitIgnoreDirectory, ".gitignore"), "utf-8"), gitIgnoreDirectory)
}

/**
 * Read `.gitingore` file from a directry
 * @param {string} gitIgnoreContent the content of the gitignore file
 * @param {string | undefined} gitIgnoreDirectory the directory of gitignore
 * @returns {Array<string>} an array of glob patterns
 */
export function globifyGitIgnore(gitIgnoreContent, gitIgnoreDirectory = undefined) {
  const gitIgnoreEntries = gitIgnoreContent
    .split("\n")
    // Remove empty lines and comments.
    .filter((entry) => !(isWhitespace(entry) || isGitIgnoreComment(entry, "#")))
    // Remove surrounding whitespace
    .map((entry) => trimWhiteSpace(entry))

  const gitIgnoreEntriesNum = gitIgnoreEntries.length

  let globEntries = new Array(gitIgnoreEntriesNum)

  for (let iEntry = 0; iEntry < gitIgnoreEntriesNum; iEntry++) {
    const globifyOutput = globifyGitIgnoreEntry(gitIgnoreEntries[iEntry], gitIgnoreDirectory)

    // Check if `globifyGitIgnoreEntry` returns a pair or a string
    if (typeof globifyOutput === "string") {
      // string
      globEntries[iEntry] = globifyOutput // Place the entry in the output array
    } else {
      // pair
      globEntries[iEntry] = globifyOutput[0] // Place the entry in the output array
      globEntries.push(globifyOutput[1]) // Push the additional entry
    }
  }

  // unique in the end
  return unique(globEntries)
}

/**
 * @param {string} gitIgnoreEntry one git ignore entry (it expects a valid non-comment gitignore entry with no surrounding whitespace)
 * @param {string | undefined} gitIgnoreDirectory the directory of gitignore
 * @returns {string | [string, string]} the equivilant glob
 */
function globifyGitIgnoreEntry(gitIgnoreEntry, gitIgnoreDirectory) {
  // output glob entry
  let entry = gitIgnoreEntry

  // Process the entry beginning

  // '!' in .gitignore means to force include the pattern
  // remove "!" to allow the processing of the pattern and swap ! in the end of the loop
  let forceInclude = false
  if (entry[0] === "!") {
    entry = entry.substring(1)
    forceInclude = true
  }

  // If there is a separator at the beginning or middle (or both) of the pattern,
  // then the pattern is relative to the directory level of the particular .gitignore file itself

  if (entry[0] === "/") {
    // Patterns starting with '/' in gitignore are considred relative to the project directory while glob
    // treats them as relative to the OS root directory.
    // So we trim the slash to make it relative to project folder from glob perspective.
    entry = entry.substring(1)
  } else {
    // Process the middle

    if (entry.indexOf("/") === -1) {
      if (!entry.startsWith("**/")) {
        // Patterns that don't have `/` are '**/' from glob perspective (can match at any level)
        entry = `**/${entry}`
      }
    }
  }

  // prepend the absolute root directory
  if (gitIgnoreDirectory) {
    entry = `${posixifyPath(gitIgnoreDirectory)}/${entry}`
  }

  // swap !
  entry = forceInclude ? entry : `!${entry}`

  // Process the entry ending

  if (entry.endsWith("/")) {
    // If there is a separator at the end of the pattern then it only matches directories
    // in glob this is equal to `directry/**`
    entry = `${entry}**`
  } else {
    // unless already ends with /**
    if (!entry.endsWith("/**")) {
      // the pattern can match both files and directories
      // so we should include both `entry` and `entry/**`
      return [entry, `${entry}/**`]
    }
  }

  return entry
}

function isWhitespace(str) {
  return /^\s*$/.test(str)
}

/**
 * A line starting with # serves as a comment.
 * Put a backslash ("\") in front of the first hash for patterns that begin with a hash.
 */
function isGitIgnoreComment(pattern) {
  return pattern[0] === "#"
}

/**
 * Trailing spaces should be removed unless they are quoted with backslash ("\ ").
 */
function trimTrailingWhitespace(str) {
  if (!/\\\s+$/.test(str)) {
    // No escaped trailing whitespace, remove
    return str.replace(/\s+$/, "")
  } else {
    // Trailing whitespace detected, remove only the backslash
    return str.replace(/\\(\s+)$/, "$1")
  }
}

/** Remove leading whitespace */
function trimLeadingWhiteSpace(str) {
  return str.replace(/^\s+/, "")
}

/** Remove whitespace from a gitignore entry */
function trimWhiteSpace(str) {
  return trimLeadingWhiteSpace(trimTrailingWhitespace(str))
}
