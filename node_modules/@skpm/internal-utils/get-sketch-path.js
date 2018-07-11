const fs = require('fs')
const path = require('path')
const childProcess = require('child_process')
const { get: getConfig } = require('./tool-config')

function appInfoForKey(app, key) {
  const plistPath = path.join(app, 'Contents', 'Info.plist')
  const result = childProcess.execSync(
    `/usr/libexec/PlistBuddy -c "Print :'${key}'" "${plistPath}"`,
    {
      encoding: 'utf8',
    }
  )

  return result.trim()
}

function pathToAppsWithId(id) {
  return childProcess.execSync(`mdfind kMDItemCFBundleIdentifier == '${id}'`, {
    encoding: 'utf8',
  })
}

// attempts to find an app with Sketch Xcode's bundle id inside the derived data folder
function pathToLatestXCodeBuild() {
  const output = pathToAppsWithId('com.bohemiancoding.sketch3.xcode')
  const apps = output.split('\n')
  return apps.find(app => app.indexOf('/DerivedData/') !== -1)
}

function pathToLatestApp() {
  const output = pathToAppsWithId('com.bohemiancoding.sketch3')
  let latest = {
    version: -1,
  }
  const apps = output.split('\n')
  apps.forEach(app => {
    if (!app) {
      // empty line so bail out
      return
    }
    const version = appInfoForKey(app, 'CFBundleVersion')
    if (version > latest.version) {
      latest = {
        version,
        app,
      }
    }
  })
  if (latest.app) {
    return latest.app
  }
  return undefined
}

const CACHE = {}

module.exports = function getSketchPath(app) {
  if (CACHE[app || 'undefined']) {
    return CACHE[app || 'undefined']
  }
  let appPath = app
  const useXCode = app === 'xcode'
  const useLatest = app === 'latest'

  // start by trying to find a xcode build
  if ((!appPath && !useLatest) || useXCode) {
    appPath = pathToLatestXCodeBuild()
    if (useXCode && !appPath) {
      console.error('Xcode build not found.')
      process.exit(1)
    }
  }

  // if there is no xcode build, try to find the latest version
  if (!appPath || useLatest) {
    appPath = pathToLatestApp()
    if (useLatest && !appPath) {
      console.error('Latest build not found.')
      process.exit(1)
    }
  }

  // resort to use a hardcoded path
  if (!appPath) {
    appPath = getConfig().sketchApp
  }

  if (!fs.existsSync(appPath)) {
    console.error(
      `No Sketch application found${appPath ? ` at ${appPath}` : ''}.`
    )
    process.exit(1)
  }

  CACHE[app || 'undefined'] = appPath

  return appPath
}

module.exports.pathToLatestXCodeBuild = pathToLatestXCodeBuild
module.exports.pathToLatestApp = pathToLatestApp
