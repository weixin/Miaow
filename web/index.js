const webpack = require('webpack');
const process = require('process');


module.exports = {
  build: () => new Promise((resolve, reject) => {
    makeInstance().run((err, stats) => {
      printWebpackStats(err, stats);
      resolve();
    });
  }),
  watch: (cb) => {
    makeInstance().watch({}, (err, stats) => {
      printWebpackStats(err, stats);
      if (cb) {
        cb(err, stats);
      }
    });
  },
};


function makeInstance() {
  let oldcwd = process.cwd();
  process.chdir(__dirname);
  let config = require('./webpack.config.js');
  let inst = webpack(config);
  process.chdir(oldcwd);
  return inst;
}

function printWebpackStats(err, stats) {
  if (err) {
    console.error(err);
  }
  if (stats) {
    console.log(stats.toString({
      modules: false,
      colors: true,
    }));
  }
};
