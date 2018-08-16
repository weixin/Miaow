"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function helpers() {
  var data = _interopRequireWildcard(require("@babel/helpers"));

  helpers = function helpers() {
    return data;
  };

  return data;
}

function _generator() {
  var data = _interopRequireDefault(require("@babel/generator"));

  _generator = function _generator() {
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

function t() {
  var data = _interopRequireWildcard(require("@babel/types"));

  t = function t() {
    return data;
  };

  return data;
}

var _templateObject = _taggedTemplateLiteralLoose(["\n    (function (root, factory) {\n      if (typeof define === \"function\" && define.amd) {\n        define(AMD_ARGUMENTS, factory);\n      } else if (typeof exports === \"object\") {\n        factory(COMMON_ARGUMENTS);\n      } else {\n        factory(BROWSER_ARGUMENTS);\n      }\n    })(UMD_ROOT, function (FACTORY_PARAMETERS) {\n      FACTORY_BODY\n    });\n  "]);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _taggedTemplateLiteralLoose(strings, raw) { if (!raw) { raw = strings.slice(0); } strings.raw = raw; return strings; }

var buildUmdWrapper = function buildUmdWrapper(replacements) {
  return (0, _template().default)(_templateObject)(replacements);
};

function buildGlobal(whitelist) {
  var namespace = t().identifier("babelHelpers");
  var body = [];
  var container = t().functionExpression(null, [t().identifier("global")], t().blockStatement(body));
  var tree = t().program([t().expressionStatement(t().callExpression(container, [t().conditionalExpression(t().binaryExpression("===", t().unaryExpression("typeof", t().identifier("global")), t().stringLiteral("undefined")), t().identifier("self"), t().identifier("global"))]))]);
  body.push(t().variableDeclaration("var", [t().variableDeclarator(namespace, t().assignmentExpression("=", t().memberExpression(t().identifier("global"), namespace), t().objectExpression([])))]));
  buildHelpers(body, namespace, whitelist);
  return tree;
}

function buildModule(whitelist) {
  var body = [];
  var refs = buildHelpers(body, null, whitelist);
  body.unshift(t().exportNamedDeclaration(null, Object.keys(refs).map(function (name) {
    return t().exportSpecifier(t().cloneNode(refs[name]), t().identifier(name));
  })));
  return t().program(body, [], "module");
}

function buildUmd(whitelist) {
  var namespace = t().identifier("babelHelpers");
  var body = [];
  body.push(t().variableDeclaration("var", [t().variableDeclarator(namespace, t().identifier("global"))]));
  buildHelpers(body, namespace, whitelist);
  return t().program([buildUmdWrapper({
    FACTORY_PARAMETERS: t().identifier("global"),
    BROWSER_ARGUMENTS: t().assignmentExpression("=", t().memberExpression(t().identifier("root"), namespace), t().objectExpression([])),
    COMMON_ARGUMENTS: t().identifier("exports"),
    AMD_ARGUMENTS: t().arrayExpression([t().stringLiteral("exports")]),
    FACTORY_BODY: body,
    UMD_ROOT: t().identifier("this")
  })]);
}

function buildVar(whitelist) {
  var namespace = t().identifier("babelHelpers");
  var body = [];
  body.push(t().variableDeclaration("var", [t().variableDeclarator(namespace, t().objectExpression([]))]));
  var tree = t().program(body);
  buildHelpers(body, namespace, whitelist);
  body.push(t().expressionStatement(namespace));
  return tree;
}

function buildHelpers(body, namespace, whitelist) {
  var getHelperReference = function getHelperReference(name) {
    return namespace ? t().memberExpression(namespace, t().identifier(name)) : t().identifier("_" + name);
  };

  var refs = {};
  helpers().list.forEach(function (name) {
    if (whitelist && whitelist.indexOf(name) < 0) return;
    var ref = refs[name] = getHelperReference(name);

    var _helpers$get = helpers().get(name, getHelperReference, ref),
        nodes = _helpers$get.nodes;

    body.push.apply(body, nodes);
  });
  return refs;
}

function _default(whitelist, outputType) {
  if (outputType === void 0) {
    outputType = "global";
  }

  var tree;
  var build = {
    global: buildGlobal,
    module: buildModule,
    umd: buildUmd,
    var: buildVar
  }[outputType];

  if (build) {
    tree = build(whitelist);
  } else {
    throw new Error("Unsupported output type " + outputType);
  }

  return (0, _generator().default)(tree).code;
}