import path from "path"
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
