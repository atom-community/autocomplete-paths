RSVP = require 'rsvp'
fs = require 'fs'

module.exports = (path) ->
  promise = new RSVP.Promise (resolve, reject) ->
    fs.stat path, (err, stat) ->
      if err
        return reject err
      return resolve stat
  return promise
