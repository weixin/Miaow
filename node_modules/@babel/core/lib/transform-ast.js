"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _config = _interopRequireDefault(require("./config"));

var _transformation = require("./transformation");

var _transformAstSync = _interopRequireDefault(require("./transform-ast-sync"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var transformFromAst = function transformFromAst(ast, code, opts, callback) {
  if (typeof opts === "function") {
    opts = undefined;
    callback = opts;
  }

  if (callback === undefined) return (0, _transformAstSync.default)(ast, code, opts);
  var cb = callback;
  process.nextTick(function () {
    var cfg;

    try {
      cfg = (0, _config.default)(opts);
      if (cfg === null) return cb(null, null);
    } catch (err) {
      return cb(err);
    }

    if (!ast) return cb(new Error("No AST given"));
    (0, _transformation.runAsync)(cfg, code, ast, cb);
  });
};

exports.default = transformFromAst;