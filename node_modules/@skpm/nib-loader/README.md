[![npm][npm]][npm-url]
[![node][node]][node-url]

<div align="center">
  <h1>Nib Loader</h1>
  <p>Instructs webpack to compile and emit the required XIB or NIB as file and to return an function to interact with it.</p>
</div>

<h2 align="center">Install</h2>

```bash
npm install --save-dev @skpm/nib-loader
```

<h2 align="center"><a href="https://webpack.js.org/concepts/loaders">Usage</a></h2>

By default the filename of the resulting file is the MD5 hash of the file's contents with the original extension of the required resource.

```js
import NibUI from './file.xib'

var nib = NibUI({
  'handleRename:': function(sender) {
    console.log('renamed')
  },
})

nib.button.setTitle('title set at runtime')

let dialog = NSAlert.alloc().init()
dialog.setAccessoryView(nib.getRoot())
dialog.runModal()
```

**webpack.config.js**
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(xib|nib)$/,
        use: [
          {
            loader: '@skpm/nib-loader',
            options: {}
          }
        ]
      }
    ]
  }
}
```

Emits `file.nib` as file in the output directory and returns a function that takes an object which will be used to create the File Owner Class (see [Cocoascript-class](https://github.com/darknoon/cocoascript-class) for more information about this object).

The function returns an object with 2 methods:

- `getRoot` which returns the root view
- `getOwner` which returns the File Owner Class instance

The object will also be populated with the Views that have a Identifier set.

<h2 align="center">Options</h2>

Same as [file-loader](https://github.com/skpm/file-loader).

[npm]: https://img.shields.io/npm/v/@skpm/nib-loader.svg
[npm-url]: https://npmjs.com/package/@skpm/nib-loader

[node]: https://img.shields.io/node/v/@skpm/nib-loader.svg
[node-url]: https://nodejs.org
