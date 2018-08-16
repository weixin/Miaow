"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;
exports.getDependencies = getDependencies;
exports.default = exports.list = void 0;

function _traverse() {
  var data = _interopRequireDefault(require("@babel/traverse"));

  _traverse = function _traverse() {
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

var _helpers = _interopRequireDefault(require("./helpers"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makePath(path) {
  var parts = [];

  for (; path.parentPath; path = path.parentPath) {
    parts.push(path.key);
    if (path.inList) parts.push(path.listKey);
  }

  return parts.reverse().join(".");
}

function getHelperMetadata(file) {
  var globals = new Set();
  var localBindingNames = new Set();
  var dependencies = new Map();
  var exportName;
  var exportPath;
  var exportBindingAssignments = [];
  var importPaths = [];
  var importBindingsReferences = [];
  (0, _traverse().default)(file, {
    ImportDeclaration: function ImportDeclaration(child) {
      var name = child.node.source.value;

      if (!_helpers.default[name]) {
        throw child.buildCodeFrameError("Unknown helper " + name);
      }

      if (child.get("specifiers").length !== 1 || !child.get("specifiers.0").isImportDefaultSpecifier()) {
        throw child.buildCodeFrameError("Helpers can only import a default value");
      }

      var bindingIdentifier = child.node.specifiers[0].local;
      dependencies.set(bindingIdentifier, name);
      importPaths.push(makePath(child));
    },
    ExportDefaultDeclaration: function ExportDefaultDeclaration(child) {
      var decl = child.get("declaration");

      if (decl.isFunctionDeclaration()) {
        if (!decl.node.id) {
          throw decl.buildCodeFrameError("Helpers should give names to their exported func declaration");
        }

        exportName = decl.node.id.name;
      }

      exportPath = makePath(child);
    },
    ExportAllDeclaration: function ExportAllDeclaration(child) {
      throw child.buildCodeFrameError("Helpers can only export default");
    },
    ExportNamedDeclaration: function ExportNamedDeclaration(child) {
      throw child.buildCodeFrameError("Helpers can only export default");
    },
    Statement: function Statement(child) {
      if (child.isModuleDeclaration()) return;
      child.skip();
    }
  });
  (0, _traverse().default)(file, {
    Program: function Program(path) {
      var bindings = path.scope.getAllBindings();
      Object.keys(bindings).forEach(function (name) {
        if (name === exportName) return;
        if (dependencies.has(bindings[name].identifier)) return;
        localBindingNames.add(name);
      });
    },
    ReferencedIdentifier: function ReferencedIdentifier(child) {
      var name = child.node.name;
      var binding = child.scope.getBinding(name, true);

      if (!binding) {
        globals.add(name);
      } else if (dependencies.has(binding.identifier)) {
        importBindingsReferences.push(makePath(child));
      }
    },
    AssignmentExpression: function AssignmentExpression(child) {
      var left = child.get("left");
      if (!(exportName in left.getBindingIdentifiers())) return;

      if (!left.isIdentifier()) {
        throw left.buildCodeFrameError("Only simple assignments to exports are allowed in helpers");
      }

      var binding = child.scope.getBinding(exportName);

      if (binding && binding.scope.path.isProgram()) {
        exportBindingAssignments.push(makePath(child));
      }
    }
  });
  if (!exportPath) throw new Error("Helpers must default-export something.");
  exportBindingAssignments.reverse();
  return {
    globals: Array.from(globals),
    localBindingNames: Array.from(localBindingNames),
    dependencies: dependencies,
    exportBindingAssignments: exportBindingAssignments,
    exportPath: exportPath,
    exportName: exportName,
    importBindingsReferences: importBindingsReferences,
    importPaths: importPaths
  };
}

function permuteHelperAST(file, metadata, id, localBindings, getDependency) {
  if (localBindings && !id) {
    throw new Error("Unexpected local bindings for module-based helpers.");
  }

  if (!id) return;
  var localBindingNames = metadata.localBindingNames,
      dependencies = metadata.dependencies,
      exportBindingAssignments = metadata.exportBindingAssignments,
      exportPath = metadata.exportPath,
      exportName = metadata.exportName,
      importBindingsReferences = metadata.importBindingsReferences,
      importPaths = metadata.importPaths;
  var dependenciesRefs = {};
  dependencies.forEach(function (name, id) {
    dependenciesRefs[id.name] = typeof getDependency === "function" && getDependency(name) || id;
  });
  var toRename = {};
  var bindings = new Set(localBindings || []);
  localBindingNames.forEach(function (name) {
    var newName = name;

    while (bindings.has(newName)) {
      newName = "_" + newName;
    }

    if (newName !== name) toRename[name] = newName;
  });

  if (id.type === "Identifier" && exportName !== id.name) {
    toRename[exportName] = id.name;
  }

  (0, _traverse().default)(file, {
    Program: function Program(path) {
      var exp = path.get(exportPath);
      var imps = importPaths.map(function (p) {
        return path.get(p);
      });
      var impsBindingRefs = importBindingsReferences.map(function (p) {
        return path.get(p);
      });
      var decl = exp.get("declaration");

      if (id.type === "Identifier") {
        if (decl.isFunctionDeclaration()) {
          exp.replaceWith(decl);
        } else {
          exp.replaceWith(t().variableDeclaration("var", [t().variableDeclarator(id, decl.node)]));
        }
      } else if (id.type === "MemberExpression") {
        if (decl.isFunctionDeclaration()) {
          exportBindingAssignments.forEach(function (assignPath) {
            var assign = path.get(assignPath);
            assign.replaceWith(t().assignmentExpression("=", id, assign.node));
          });
          exp.replaceWith(decl);
          path.pushContainer("body", t().expressionStatement(t().assignmentExpression("=", id, t().identifier(exportName))));
        } else {
          exp.replaceWith(t().expressionStatement(t().assignmentExpression("=", id, decl.node)));
        }
      } else {
        throw new Error("Unexpected helper format.");
      }

      Object.keys(toRename).forEach(function (name) {
        path.scope.rename(name, toRename[name]);
      });

      for (var _iterator = imps, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var _path = _ref;

        _path.remove();
      }

      for (var _iterator2 = impsBindingRefs, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref2;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref2 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref2 = _i2.value;
        }

        var _path2 = _ref2;
        var node = t().cloneNode(dependenciesRefs[_path2.node.name]);

        _path2.replaceWith(node);
      }

      path.stop();
    }
  });
}

var helperData = {};

function loadHelper(name) {
  if (!helperData[name]) {
    if (!_helpers.default[name]) throw new ReferenceError("Unknown helper " + name);

    var fn = function fn() {
      return t().file(_helpers.default[name]());
    };

    var metadata = getHelperMetadata(fn());
    helperData[name] = {
      build: function build(getDependency, id, localBindings) {
        var file = fn();
        permuteHelperAST(file, metadata, id, localBindings, getDependency);
        return {
          nodes: file.program.body,
          globals: metadata.globals
        };
      },
      dependencies: metadata.dependencies
    };
  }

  return helperData[name];
}

function get(name, getDependency, id, localBindings) {
  return loadHelper(name).build(getDependency, id, localBindings);
}

function getDependencies(name) {
  return Array.from(loadHelper(name).dependencies.values());
}

var list = Object.keys(_helpers.default).map(function (name) {
  return name.replace(/^_/, "");
}).filter(function (name) {
  return name !== "__esModule";
});
exports.list = list;
var _default = get;
exports.default = _default;