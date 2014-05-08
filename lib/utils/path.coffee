_ = require "underscore-plus"
_path = require "path"

# Create a copy of the original path module
path = _.extend {}, _path

# Add our fancy stuff
path.resolve = (paths...) ->
  result = _path.resolve.apply _path, paths

  # `path.resolve` swallows trailing slashes.
  # Re-add the trailing slash
  lastPath = paths.pop()
  if lastPath[lastPath.length - 1] is path.sep
    result += path.sep

  return result

path.dirname = (p) ->
  parts = p.split path.sep

  if parts.length is 2
    return path.sep

  # Kill the last part
  result = parts.slice(0, parts.length - 1).join path.sep
  result = path.normalize result
  return result

path.basename = (p) ->
  parts = p.split path.sep

  # Return the last part
  return parts[parts.length - 1]

path.join = (paths...) ->
  return paths.join path.sep

module.exports = path
