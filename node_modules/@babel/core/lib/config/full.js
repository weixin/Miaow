"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loadFullConfig;

var _util = require("./util");

var context = _interopRequireWildcard(require("../index"));

var _plugin = _interopRequireDefault(require("./plugin"));

var _item = require("./item");

var _configChain = require("./config-chain");

function _traverse() {
  var data = _interopRequireDefault(require("@babel/traverse"));

  _traverse = function _traverse() {
    return data;
  };

  return data;
}

var _caching = require("./caching");

var _options = require("./validation/options");

var _plugins = require("./validation/plugins");

var _configApi = _interopRequireDefault(require("./helpers/config-api"));

var _partial = _interopRequireDefault(require("./partial"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function loadFullConfig(inputOpts) {
  var result = (0, _partial.default)(inputOpts);

  if (!result) {
    return null;
  }

  var options = result.options,
      context = result.context;
  var optionDefaults = {};
  var passes = [[]];

  try {
    var plugins = options.plugins,
        presets = options.presets;

    if (!plugins || !presets) {
      throw new Error("Assertion failure - plugins and presets exist");
    }

    var ignored = function recurseDescriptors(config, pass) {
      var plugins = config.plugins.map(function (descriptor) {
        return loadPluginDescriptor(descriptor, context);
      });
      var presets = config.presets.map(function (descriptor) {
        return {
          preset: loadPresetDescriptor(descriptor, context),
          pass: descriptor.ownPass ? [] : pass
        };
      });

      if (presets.length > 0) {
        passes.splice.apply(passes, [1, 0].concat(presets.map(function (o) {
          return o.pass;
        }).filter(function (p) {
          return p !== pass;
        })));

        for (var _iterator = presets, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
          var _ref2;

          if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref2 = _iterator[_i++];
          } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref2 = _i.value;
          }

          var _ref3 = _ref2;
          var preset = _ref3.preset,
              _pass = _ref3.pass;
          if (!preset) return true;

          var _ignored = recurseDescriptors({
            plugins: preset.plugins,
            presets: preset.presets
          }, _pass);

          if (_ignored) return true;
          preset.options.forEach(function (opts) {
            (0, _util.mergeOptions)(optionDefaults, opts);
          });
        }
      }

      if (plugins.length > 0) {
        pass.unshift.apply(pass, plugins);
      }
    }({
      plugins: plugins.map(function (item) {
        var desc = (0, _item.getItemDescriptor)(item);

        if (!desc) {
          throw new Error("Assertion failure - must be config item");
        }

        return desc;
      }),
      presets: presets.map(function (item) {
        var desc = (0, _item.getItemDescriptor)(item);

        if (!desc) {
          throw new Error("Assertion failure - must be config item");
        }

        return desc;
      })
    }, passes[0]);

    if (ignored) return null;
  } catch (e) {
    if (!/^\[BABEL\]/.test(e.message)) {
      e.message = "[BABEL] " + (context.filename || "unknown") + ": " + e.message;
    }

    throw e;
  }

  var opts = optionDefaults;
  (0, _util.mergeOptions)(opts, options);
  opts.plugins = passes[0];
  opts.presets = passes.slice(1).filter(function (plugins) {
    return plugins.length > 0;
  }).map(function (plugins) {
    return {
      plugins: plugins
    };
  });
  opts.passPerPreset = opts.presets.length > 0;
  return {
    options: opts,
    passes: passes
  };
}

var loadDescriptor = (0, _caching.makeWeakCache)(function (_ref4, cache) {
  var value = _ref4.value,
      options = _ref4.options,
      dirname = _ref4.dirname,
      alias = _ref4.alias;
  if (options === false) throw new Error("Assertion failure");
  options = options || {};
  var item = value;

  if (typeof value === "function") {
    var api = Object.assign({}, context, (0, _configApi.default)(cache));

    try {
      item = value(api, options, dirname);
    } catch (e) {
      if (alias) {
        e.message += " (While processing: " + JSON.stringify(alias) + ")";
      }

      throw e;
    }
  }

  if (!item || typeof item !== "object") {
    throw new Error("Plugin/Preset did not return an object.");
  }

  if (typeof item.then === "function") {
    throw new Error("You appear to be using an async plugin, " + "which your current version of Babel does not support." + "If you're using a published plugin, " + "you may need to upgrade your @babel/core version.");
  }

  return {
    value: item,
    options: options,
    dirname: dirname,
    alias: alias
  };
});

function loadPluginDescriptor(descriptor, context) {
  if (descriptor.value instanceof _plugin.default) {
    if (descriptor.options) {
      throw new Error("Passed options to an existing Plugin instance will not work.");
    }

    return descriptor.value;
  }

  return instantiatePlugin(loadDescriptor(descriptor, context), context);
}

var instantiatePlugin = (0, _caching.makeWeakCache)(function (_ref5, cache) {
  var value = _ref5.value,
      options = _ref5.options,
      dirname = _ref5.dirname,
      alias = _ref5.alias;
  var pluginObj = (0, _plugins.validatePluginObject)(value);
  var plugin = Object.assign({}, pluginObj);

  if (plugin.visitor) {
    plugin.visitor = _traverse().default.explode(Object.assign({}, plugin.visitor));
  }

  if (plugin.inherits) {
    var inheritsDescriptor = {
      name: undefined,
      alias: alias + "$inherits",
      value: plugin.inherits,
      options: options,
      dirname: dirname
    };
    var inherits = cache.invalidate(function (data) {
      return loadPluginDescriptor(inheritsDescriptor, data);
    });
    plugin.pre = chain(inherits.pre, plugin.pre);
    plugin.post = chain(inherits.post, plugin.post);
    plugin.manipulateOptions = chain(inherits.manipulateOptions, plugin.manipulateOptions);
    plugin.visitor = _traverse().default.visitors.merge([inherits.visitor || {}, plugin.visitor || {}]);
  }

  return new _plugin.default(plugin, options, alias);
});

var loadPresetDescriptor = function loadPresetDescriptor(descriptor, context) {
  return (0, _configChain.buildPresetChain)(instantiatePreset(loadDescriptor(descriptor, context)), context);
};

var instantiatePreset = (0, _caching.makeWeakCache)(function (_ref6) {
  var value = _ref6.value,
      dirname = _ref6.dirname,
      alias = _ref6.alias;
  return {
    options: (0, _options.validate)("preset", value),
    alias: alias,
    dirname: dirname
  };
});

function chain(a, b) {
  var fns = [a, b].filter(Boolean);
  if (fns.length <= 1) return fns[0];
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    for (var _iterator2 = fns, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref7;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref7 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref7 = _i2.value;
      }

      var fn = _ref7;
      fn.apply(this, args);
    }
  };
}