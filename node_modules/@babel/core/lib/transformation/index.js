"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runAsync = runAsync;
exports.runSync = runSync;

function _traverse() {
  var data = _interopRequireDefault(require("@babel/traverse"));

  _traverse = function _traverse() {
    return data;
  };

  return data;
}

var _pluginPass = _interopRequireDefault(require("./plugin-pass"));

var _blockHoistPlugin = _interopRequireDefault(require("./block-hoist-plugin"));

var _normalizeOpts = _interopRequireDefault(require("./normalize-opts"));

var _normalizeFile = _interopRequireDefault(require("./normalize-file"));

var _generate = _interopRequireDefault(require("./file/generate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function runAsync(config, code, ast, callback) {
  var result;

  try {
    result = runSync(config, code, ast);
  } catch (err) {
    return callback(err);
  }

  return callback(null, result);
}

function runSync(config, code, ast) {
  var file = (0, _normalizeFile.default)(config.passes, (0, _normalizeOpts.default)(config), code, ast);
  transformFile(file, config.passes);
  var opts = file.opts;

  var _ref = opts.code !== false ? (0, _generate.default)(config.passes, file) : {},
      outputCode = _ref.outputCode,
      outputMap = _ref.outputMap;

  return {
    metadata: file.metadata,
    options: opts,
    ast: opts.ast === true ? file.ast : null,
    code: outputCode === undefined ? null : outputCode,
    map: outputMap === undefined ? null : outputMap,
    sourceType: file.ast.program.sourceType
  };
}

function transformFile(file, pluginPasses) {
  for (var _iterator = pluginPasses, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref2;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref2 = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref2 = _i.value;
    }

    var pluginPairs = _ref2;
    var passPairs = [];
    var passes = [];
    var visitors = [];

    for (var _iterator2 = pluginPairs.concat([(0, _blockHoistPlugin.default)()]), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref3;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref3 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref3 = _i2.value;
      }

      var plugin = _ref3;
      var pass = new _pluginPass.default(file, plugin.key, plugin.options);
      passPairs.push([plugin, pass]);
      passes.push(pass);
      visitors.push(plugin.visitor);
    }

    for (var _i3 = 0; _i3 < passPairs.length; _i3++) {
      var _passPairs$_i = passPairs[_i3],
          _plugin = _passPairs$_i[0],
          _pass = _passPairs$_i[1];
      var fn = _plugin.pre;

      if (fn) {
        var result = fn.call(_pass, file);

        if (isThenable(result)) {
          throw new Error("You appear to be using an plugin with an async .pre, " + "which your current version of Babel does not support." + "If you're using a published plugin, you may need to upgrade " + "your @babel/core version.");
        }
      }
    }

    var visitor = _traverse().default.visitors.merge(visitors, passes, file.opts.wrapPluginVisitorMethod);

    (0, _traverse().default)(file.ast, visitor, file.scope);

    for (var _i4 = 0; _i4 < passPairs.length; _i4++) {
      var _passPairs$_i2 = passPairs[_i4],
          _plugin2 = _passPairs$_i2[0],
          _pass2 = _passPairs$_i2[1];
      var _fn = _plugin2.post;

      if (_fn) {
        var _result = _fn.call(_pass2, file);

        if (isThenable(_result)) {
          throw new Error("You appear to be using an plugin with an async .post, " + "which your current version of Babel does not support." + "If you're using a published plugin, you may need to upgrade " + "your @babel/core version.");
        }
      }
    }
  }
}

function isThenable(val) {
  return !!val && (typeof val === "object" || typeof val === "function") && typeof val.then === "function";
}