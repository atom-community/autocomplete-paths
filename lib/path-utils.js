import path from "path"
/** Converts given path to Posix (replacing \\ with /)
 * @param {string} givenPath   Path to convert
 * @returns {string}          Converted filepath
 */
export function posixifyPath(givenPath) {
  return path.normalize(givenPath).replace(/\\/g, "/")
}
