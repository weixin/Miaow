var timeout = require('./timeout')
var interval = require('./interval')
var immediate = require('./immediate')

module.exports = {
  setTimeout: timeout.setTimeout,
  clearTimeout: timeout.clearTimeout,
  setImmediate: immediate.setImmediate,
  clearImmediate: immediate.clearImmediate,
  setInterval: interval.setInterval,
  clearInterval: interval.clearInterval
}
