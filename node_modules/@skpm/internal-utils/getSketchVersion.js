const path = require('path')
const exec = require('./exec')
const getSketchPath = require('./get-sketch-path')

const regex = /sketchtool Version ((\d|\.)+) \(\d+\)/
function extractVersion(string) {
  return regex.exec(string)[1]
}

const CACHED_VERSION = {}

function getSketchVersion(app) {
  return exec
    .execFile(
      path.join(
        getSketchPath(app),
        '/Contents/Resources/sketchtool/bin/sketchtool'
      ),
      ['-v']
    )
    .then(({ stdout }) => {
      let version = extractVersion(stdout)
      const pointNumbers = version.split('.').length
      if (pointNumbers === 1) {
        version += '.0.0'
      } else if (pointNumbers === 2) {
        version += '.0'
      }
      return version
    })
    .catch(() => undefined)
}

module.exports = function getSketchVersionWithCache(app) {
  if (CACHED_VERSION[app || 'undefined']) {
    return CACHED_VERSION[app || 'undefined']
  }
  return getSketchVersion(app).then(version => {
    CACHED_VERSION[app || 'undefined'] = version
    return version
  })
}
