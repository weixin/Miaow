module.exports = function () {
  return typeof coscript !== 'undefined' && coscript.createFiber
}
