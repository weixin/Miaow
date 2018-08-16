"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function helpers() {
  var data = _interopRequireWildcard(require("@babel/helpers"));

  helpers = function helpers() {
    return data;
  };

  return data;
}

function _traverse() {
  var data = _interopRequireWildcard(require("@babel/traverse"));

  _traverse = function _traverse() {
    return data;
  };

  return data;
}

function _codeFrame() {
  var data = require("@babel/code-frame");

  _codeFrame = function _codeFrame() {
    return data;
  };

  return data;
}

function t() {
  var data = _interopRequireWildcard(require("@babel/types"));

  t = function t() {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var errorVisitor = {
  enter: function enter(path, state) {
    var loc = path.node.loc;

    if (loc) {
      state.loc = loc;
      path.stop();
    }
  }
};

var File = function () {
  function File(options, _ref) {
    var code = _ref.code,
        ast = _ref.ast,
        shebang = _ref.shebang,
        inputMap = _ref.inputMap;
    this._map = new Map();
    this.declarations = {};
    this.path = null;
    this.ast = {};
    this.metadata = {};
    this.hub = new (_traverse().Hub)(this);
    this.code = "";
    this.shebang = "";
    this.inputMap = null;
    this.opts = options;
    this.code = code;
    this.ast = ast;
    this.shebang = shebang;
    this.inputMap = inputMap;
    this.path = _traverse().NodePath.get({
      hub: this.hub,
      parentPath: null,
      parent: this.ast,
      container: this.ast,
      key: "program"
    }).setContext();
    this.scope = this.path.scope;
  }

  var _proto = File.prototype;

  _proto.set = function set(key, val) {
    this._map.set(key, val);
  };

  _proto.get = function get(key) {
    return this._map.get(key);
  };

  _proto.has = function has(key) {
    return this._map.has(key);
  };

  _proto.getModuleName = function getModuleName() {
    var _opts = this.opts,
        filename = _opts.filename,
        _opts$filenameRelativ = _opts.filenameRelative,
        filenameRelative = _opts$filenameRelativ === void 0 ? filename : _opts$filenameRelativ,
        moduleId = _opts.moduleId,
        _opts$moduleIds = _opts.moduleIds,
        moduleIds = _opts$moduleIds === void 0 ? !!moduleId : _opts$moduleIds,
        getModuleId = _opts.getModuleId,
        sourceRootTmp = _opts.sourceRoot,
        _opts$moduleRoot = _opts.moduleRoot,
        moduleRoot = _opts$moduleRoot === void 0 ? sourceRootTmp : _opts$moduleRoot,
        _opts$sourceRoot = _opts.sourceRoot,
        sourceRoot = _opts$sourceRoot === void 0 ? moduleRoot : _opts$sourceRoot;
    if (!moduleIds) return null;

    if (moduleId != null && !getModuleId) {
      return moduleId;
    }

    var moduleName = moduleRoot != null ? moduleRoot + "/" : "";

    if (filenameRelative) {
      var sourceRootReplacer = sourceRoot != null ? new RegExp("^" + sourceRoot + "/?") : "";
      moduleName += filenameRelative.replace(sourceRootReplacer, "").replace(/\.(\w*?)$/, "");
    }

    moduleName = moduleName.replace(/\\/g, "/");

    if (getModuleId) {
      return getModuleId(moduleName) || moduleName;
    } else {
      return moduleName;
    }
  };

  _proto.resolveModuleSource = function resolveModuleSource(source) {
    return source;
  };

  _proto.addImport = function addImport() {
    throw new Error("This API has been removed. If you're looking for this " + "functionality in Babel 7, you should import the " + "'@babel/helper-module-imports' module and use the functions exposed " + " from that module, such as 'addNamed' or 'addDefault'.");
  };

  _proto.addHelper = function addHelper(name) {
    var _this = this;

    var declar = this.declarations[name];
    if (declar) return t().cloneNode(declar);
    var generator = this.get("helperGenerator");
    var runtime = this.get("helpersNamespace");

    if (generator) {
      var res = generator(name);
      if (res) return res;
    } else if (runtime) {
      return t().memberExpression(t().cloneNode(runtime), t().identifier(name));
    }

    var uid = this.declarations[name] = this.scope.generateUidIdentifier(name);
    var dependencies = {};

    for (var _iterator = helpers().getDependencies(name), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref2;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref2 = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref2 = _i.value;
      }

      var dep = _ref2;
      dependencies[dep] = this.addHelper(dep);
    }

    var _helpers$get = helpers().get(name, function (dep) {
      return dependencies[dep];
    }, uid, Object.keys(this.scope.getAllBindings())),
        nodes = _helpers$get.nodes,
        globals = _helpers$get.globals;

    globals.forEach(function (name) {
      if (_this.path.scope.hasBinding(name, true)) {
        _this.path.scope.rename(name);
      }
    });
    nodes.forEach(function (node) {
      node._compact = true;
    });
    this.path.unshiftContainer("body", nodes);
    this.path.get("body").forEach(function (path) {
      if (nodes.indexOf(path.node) === -1) return;
      if (path.isVariableDeclaration()) _this.scope.registerDeclaration(path);
    });
    return uid;
  };

  _proto.addTemplateObject = function addTemplateObject() {
    throw new Error("This function has been moved into the template literal transform itself.");
  };

  _proto.buildCodeFrameError = function buildCodeFrameError(node, msg, Error) {
    if (Error === void 0) {
      Error = SyntaxError;
    }

    var loc = node && (node.loc || node._loc);
    msg = this.opts.filename + ": " + msg;

    if (!loc && node) {
      var state = {
        loc: null
      };
      (0, _traverse().default)(node, errorVisitor, this.scope, state);
      loc = state.loc;
      var txt = "This is an error on an internal node. Probably an internal error.";
      if (loc) txt += " Location has been estimated.";
      msg += " (" + txt + ")";
    }

    if (loc) {
      var _opts$highlightCode = this.opts.highlightCode,
          highlightCode = _opts$highlightCode === void 0 ? true : _opts$highlightCode;
      msg += "\n" + (0, _codeFrame().codeFrameColumns)(this.code, {
        start: {
          line: loc.start.line,
          column: loc.start.column + 1
        }
      }, {
        highlightCode: highlightCode
      });
    }

    return new Error(msg);
  };

  return File;
}();

exports.default = File;