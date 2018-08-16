"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var PluginPass = function () {
  function PluginPass(file, key, options) {
    this._map = new Map();
    this.key = key;
    this.file = file;
    this.opts = options || {};
    this.filename = typeof file.opts.filename === "string" ? file.opts.filename : undefined;
  }

  var _proto = PluginPass.prototype;

  _proto.set = function set(key, val) {
    this._map.set(key, val);
  };

  _proto.get = function get(key) {
    return this._map.get(key);
  };

  _proto.addHelper = function addHelper(name) {
    return this.file.addHelper(name);
  };

  _proto.addImport = function addImport() {
    return this.file.addImport();
  };

  _proto.getModuleName = function getModuleName() {
    return this.file.getModuleName();
  };

  _proto.buildCodeFrameError = function buildCodeFrameError(node, msg, Error) {
    return this.file.buildCodeFrameError(node, msg, Error);
  };

  return PluginPass;
}();

exports.default = PluginPass;