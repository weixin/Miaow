# CocoaScript binary

Available in npm for convenience. Original repo: https://github.com/ccgus/CocoaScript

## Usage

```js
var child_process = require('child_process');
var coscript = require('coscript');

child_process.exec(coscript + ' -e "print(\\"test\\")"', function (error, stdout, stderr) {
  // callback
});
```
