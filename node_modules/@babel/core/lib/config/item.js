"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createItemFromDescriptor = createItemFromDescriptor;
exports.createConfigItem = createConfigItem;
exports.getItemDescriptor = getItemDescriptor;

function _path() {
  var data = _interopRequireDefault(require("path"));

  _path = function _path() {
    return data;
  };

  return data;
}

var _configDescriptors = require("./config-descriptors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createItemFromDescriptor(desc) {
  return new ConfigItem(desc);
}

function createConfigItem(value, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$dirname = _ref.dirname,
      dirname = _ref$dirname === void 0 ? "." : _ref$dirname,
      type = _ref.type;

  var descriptor = (0, _configDescriptors.createDescriptor)(value, _path().default.resolve(dirname), {
    type: type,
    alias: "programmatic item"
  });
  return createItemFromDescriptor(descriptor);
}

function getItemDescriptor(item) {
  if (item instanceof ConfigItem) {
    return item._descriptor;
  }

  return undefined;
}

var ConfigItem = function ConfigItem(descriptor) {
  this._descriptor = descriptor;
  Object.defineProperty(this, "_descriptor", {
    enumerable: false
  });

  if (this._descriptor.options === false) {
    throw new Error("Assertion failure - unexpected false options");
  }

  this.value = this._descriptor.value;
  this.options = this._descriptor.options;
  this.dirname = this._descriptor.dirname;
  this.name = this._descriptor.name;
  this.file = this._descriptor.file ? {
    request: this._descriptor.file.request,
    resolved: this._descriptor.file.resolved
  } : undefined;
  Object.freeze(this);
};

Object.freeze(ConfigItem.prototype);