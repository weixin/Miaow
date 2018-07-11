# run-sketch-plugin

Run a Sketch plugin.

```js
import runSketchPlugin from 'run-sketch-plugin';

runSketchPlugin({
  commandIdentifier: 'main',
  bundleURL: 'path/to/bundle.sketchplugin',
}).then({ stderr, stdout }) => {
  console.log(stdout)
}
```