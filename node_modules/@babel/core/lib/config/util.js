"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeOptions = mergeOptions;

function mergeOptions(target, source) {
  var _arr = Object.keys(source);

  for (var _i = 0; _i < _arr.length; _i++) {
    var k = _arr[_i];

    if (k === "parserOpts" && source.parserOpts) {
      var parserOpts = source.parserOpts;
      var targetObj = target.parserOpts = target.parserOpts || {};
      mergeDefaultFields(targetObj, parserOpts);
    } else if (k === "generatorOpts" && source.generatorOpts) {
      var generatorOpts = source.generatorOpts;

      var _targetObj = target.generatorOpts = target.generatorOpts || {};

      mergeDefaultFields(_targetObj, generatorOpts);
    } else {
      var val = source[k];
      if (val !== undefined) target[k] = val;
    }
  }
}

function mergeDefaultFields(target, source) {
  var _arr2 = Object.keys(source);

  for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
    var k = _arr2[_i2];
    var val = source[k];
    if (val !== undefined) target[k] = val;
  }
}