const { exec } = require('child_process');
const coscript = require('coscript');

const makeCommand = ({ bundleURL, identifier }) => {
  const delegate = 'COScript.app("Sketch").delegate()';
  const url = `NSURL.fileURLWithPath("${bundleURL}")`;
  return `${delegate}.runPluginCommandWithIdentifier_fromBundleAtURL("${identifier}", ${url})`;
};

const runPluginCommand = options =>
  new Promise((resolve, reject) => {
    exec(`"${coscript}" -e '${makeCommand(options)}'`, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      }

      resolve({ stdout, stderr });
    });
  });

module.exports = runPluginCommand;
