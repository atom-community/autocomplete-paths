_ = require "underscore-plus"
_path = require "path"

# Create a copy of the original path module
path = _.extend {}, _path

# Add our fancy stuff
path.normalize = (p) ->
  if path.sep is "\\"
    return p.replace /\\\\/g, "\\"
  else if path.sep is "/"
    return p.replace /\/\//g, "\/"

path.resolve = (paths...) ->
  result = _path.resolve.apply _path, paths

  # `path.resolve` swallows trailing slashes.
  # Re-add the trailing slash
  lastPath = paths.pop()
  if lastPath[lastPath.length - 1] is path.sep and
    result[result.length - 1] isnt path.sep
      result += path.sep

  return result

path.dirname = (p) ->
  parts = p.split path.sep

  # Kill the last part
  result = parts.slice(0, parts.length - 1)
  if result.length is 1
    result.push ""
  return result.join path.sep

path.basename = (p) ->
  parts = p.split path.sep

  # Return the last part
  return parts[parts.length - 1]

path.join = (paths...) ->
  return paths.join path.sep

module.exports = path
