"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parse;

var _config = _interopRequireDefault(require("./config"));

var _normalizeFile = _interopRequireDefault(require("./transformation/normalize-file"));

var _normalizeOpts = _interopRequireDefault(require("./transformation/normalize-opts"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(code, opts) {
  var config = (0, _config.default)(opts);

  if (config === null) {
    return null;
  }

  var file = (0, _normalizeFile.default)(config.passes, (0, _normalizeOpts.default)(config), code);
  return file.ast;
}