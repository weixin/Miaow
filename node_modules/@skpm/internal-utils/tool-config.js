const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const objectAssign = require('object-assign')
const homedir = require('os').homedir()

const CONFIG_PATH = path.join(homedir, '.skpmrc')
const DEFAULT_CONFIG = {
  sketchPath: '/Applications/Sketch.app',
  pluginDirectory: `${homedir}/Library/Application Support/com.bohemiancoding.sketch3/Plugins/`,
  logsLocation: `${homedir}/Library/Logs/com.bohemiancoding.sketch3/Plugin Output.log`,
  plugins: {},
}

module.exports = {
  get() {
    if (!fs.existsSync(CONFIG_PATH)) {
      return DEFAULT_CONFIG
    }
    return objectAssign(
      {},
      DEFAULT_CONFIG,
      yaml.safeLoad(fs.readFileSync(CONFIG_PATH, 'utf8'))
    )
  },

  save(config) {
    // only save the config which is not the default
    const configToSave = Object.keys(config).reduce(
      (prev, k) => {
        if (config[k] !== DEFAULT_CONFIG[k]) {
          prev[k] = config[k]
        }
        return prev
      },
      { plugins: config.plugins }
    )
    fs.writeFileSync(CONFIG_PATH, yaml.safeDump(configToSave), 'utf8')
  },

  delete() {
    fs.unlinkSync(CONFIG_PATH)
  },
}
