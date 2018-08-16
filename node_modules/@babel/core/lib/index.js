"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Plugin = Plugin;
Object.defineProperty(exports, "File", {
  enumerable: true,
  get: function get() {
    return _file.default;
  }
});
Object.defineProperty(exports, "buildExternalHelpers", {
  enumerable: true,
  get: function get() {
    return _buildExternalHelpers.default;
  }
});
Object.defineProperty(exports, "resolvePlugin", {
  enumerable: true,
  get: function get() {
    return _files.resolvePlugin;
  }
});
Object.defineProperty(exports, "resolvePreset", {
  enumerable: true,
  get: function get() {
    return _files.resolvePreset;
  }
});
Object.defineProperty(exports, "version", {
  enumerable: true,
  get: function get() {
    return _package.version;
  }
});
Object.defineProperty(exports, "getEnv", {
  enumerable: true,
  get: function get() {
    return _environment.getEnv;
  }
});
Object.defineProperty(exports, "traverse", {
  enumerable: true,
  get: function get() {
    return _traverse().default;
  }
});
Object.defineProperty(exports, "template", {
  enumerable: true,
  get: function get() {
    return _template().default;
  }
});
Object.defineProperty(exports, "loadPartialConfig", {
  enumerable: true,
  get: function get() {
    return _config.loadPartialConfig;
  }
});
Object.defineProperty(exports, "loadOptions", {
  enumerable: true,
  get: function get() {
    return _config.loadOptions;
  }
});
Object.defineProperty(exports, "OptionManager", {
  enumerable: true,
  get: function get() {
    return _config.OptionManager;
  }
});
Object.defineProperty(exports, "createConfigItem", {
  enumerable: true,
  get: function get() {
    return _item.createConfigItem;
  }
});
Object.defineProperty(exports, "transform", {
  enumerable: true,
  get: function get() {
    return _transform.default;
  }
});
Object.defineProperty(exports, "transformSync", {
  enumerable: true,
  get: function get() {
    return _transformSync.default;
  }
});
Object.defineProperty(exports, "transformFile", {
  enumerable: true,
  get: function get() {
    return _transformFile.default;
  }
});
Object.defineProperty(exports, "transformFileSync", {
  enumerable: true,
  get: function get() {
    return _transformFileSync.default;
  }
});
Object.defineProperty(exports, "transformFromAst", {
  enumerable: true,
  get: function get() {
    return _transformAst.default;
  }
});
Object.defineProperty(exports, "transformFromAstSync", {
  enumerable: true,
  get: function get() {
    return _transformAstSync.default;
  }
});
Object.defineProperty(exports, "parse", {
  enumerable: true,
  get: function get() {
    return _parse.default;
  }
});
exports.types = exports.DEFAULT_EXTENSIONS = void 0;

var _file = _interopRequireDefault(require("./transformation/file/file"));

var _buildExternalHelpers = _interopRequireDefault(require("./tools/build-external-helpers"));

var _files = require("./config/files");

var _package = require("../package.json");

var _environment = require("./config/helpers/environment");

function _types() {
  var data = _interopRequireWildcard(require("@babel/types"));

  _types = function _types() {
    return data;
  };

  return data;
}

Object.defineProperty(exports, "types", {
  enumerable: true,
  get: function get() {
    return _types();
  }
});

function _traverse() {
  var data = _interopRequireDefault(require("@babel/traverse"));

  _traverse = function _traverse() {
    return data;
  };

  return data;
}

function _template() {
  var data = _interopRequireDefault(require("@babel/template"));

  _template = function _template() {
    return data;
  };

  return data;
}

var _config = require("./config");

var _item = require("./config/item");

var _transform = _interopRequireDefault(require("./transform"));

var _transformSync = _interopRequireDefault(require("./transform-sync"));

var _transformFile = _interopRequireDefault(require("./transform-file"));

var _transformFileSync = _interopRequireDefault(require("./transform-file-sync"));

var _transformAst = _interopRequireDefault(require("./transform-ast"));

var _transformAstSync = _interopRequireDefault(require("./transform-ast-sync"));

var _parse = _interopRequireDefault(require("./parse"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Plugin(alias) {
  throw new Error("The (" + alias + ") Babel 5 plugin is being run with an unsupported Babel version.");
}

var DEFAULT_EXTENSIONS = Object.freeze([".js", ".jsx", ".es6", ".es", ".mjs"]);
exports.DEFAULT_EXTENSIONS = DEFAULT_EXTENSIONS;