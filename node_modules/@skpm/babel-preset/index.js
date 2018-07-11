const defaultTargets = {
  safari: 8,
}

function buildTargets(options) {
  return Object.assign({}, defaultTargets, options.additionalTargets)
}

module.exports = function buildSkpmPreset(api, options) {
  const transpileTargets =
    (options && options.targets) || buildTargets(options || {})

  const debug =
    options && typeof options.debug === 'boolean' ? !!options.debug : false

  return {
    presets: [
      require('@babel/preset-env').default(api, {
        debug,
        modules: false,
        targets: transpileTargets,
      }),
      require('@babel/preset-react'),
    ],
  }
}
