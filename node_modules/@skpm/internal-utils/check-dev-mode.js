const chalk = require('chalk')
const { exec } = require('./exec')

module.exports = function testDevMode() {
  const command = (action, value) =>
    `/usr/bin/defaults ${action} ~/Library/Preferences/com.bohemiancoding.sketch3.plist AlwaysReloadScript ${value}`

  return exec(command('read', ''), { encoding: 'utf8' })
    .then(({ stdout }) => (stdout || '').trim() === '1')
    .catch(() => false) // if reading fails, assume that it's not enabled
    .then(enabled => {
      if (!enabled) {
        const yesno = require('yesno')
        console.log(
          `The Sketch developer mode is not enabled ${chalk.dim(
            '(http://developer.sketchapp.com/introduction/preferences/#always-reload-scripts-before-running)'
          )}.`
        )
        return new Promise((resolve, reject) => {
          yesno.ask('Do you want to enable it? (y/N)', false, ok => {
            if (ok) {
              exec(command('write', '-bool YES'))
                .then(() =>
                  exec(
                    '/usr/bin/defaults write com.bohemiancoding.sketch3 WebKitDeveloperExtras -bool true'
                  )
                )
                .then(() =>
                  console.log(
                    `${chalk.green('success')} Sketch developer mode enabled`
                  )
                )
                .then(resolve)
                .catch(reject)
            } else {
              resolve()
            }
          })
        })
      }

      return 'Already enabled'
    })
    .catch(err => {
      console.log(
        `${chalk.red('error')} Error while enabling the Sketch developer mode.`
      )
      console.log((err || {}).body || err)
      console.log(`${chalk.blue('info')} Continuing...`)
    })
}
