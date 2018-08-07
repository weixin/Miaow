#!/usr/bin/env node
const {spawn} = require('child_process');
const process = require('process');

run();

async function run() {
  let watchMode = process.argv.includes('--watch');
  const web = require('./web');

  if (!watchMode) {
    await web.build();
    await skpmBuild();
  } else {
    let firstRun = true;
    // watch changes to the web app
    web.watch((err, stats) => {
      skpmBuild(firstRun ? ['--watch'] : []);
      firstRun = false;
    });
  }
}


function skpmBuild(args) {
  return new Promise((resolve, reject) => {
    const skpmBuild = spawn('skpm-build', args);
    skpmBuild.stdout.pipe(process.stdout);
    skpmBuild.stderr.pipe(process.stderr);
    skpmBuild.on('close', (code) => resolve());
  });
}
