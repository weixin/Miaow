"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generateCode;

function _convertSourceMap() {
  var data = _interopRequireDefault(require("convert-source-map"));

  _convertSourceMap = function _convertSourceMap() {
    return data;
  };

  return data;
}

function _sourceMap() {
  var data = _interopRequireDefault(require("source-map"));

  _sourceMap = function _sourceMap() {
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generateCode(pluginPasses, file) {
  var opts = file.opts,
      ast = file.ast,
      shebang = file.shebang,
      code = file.code,
      inputMap = file.inputMap;
  var results = [];

  for (var _iterator = pluginPasses, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var plugins = _ref;

    for (var _iterator2 = plugins, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref2;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref2 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref2 = _i2.value;
      }

      var plugin = _ref2;
      var generatorOverride = plugin.generatorOverride;

      if (generatorOverride) {
        var _result2 = generatorOverride(ast, opts.generatorOpts, code, _generator().default);

        if (_result2 !== undefined) results.push(_result2);
      }
    }
  }

  var result;

  if (results.length === 0) {
    result = (0, _generator().default)(ast, opts.generatorOpts, code);
  } else if (results.length === 1) {
    result = results[0];

    if (typeof result.then === "function") {
      throw new Error("You appear to be using an async parser plugin, " + "which your current version of Babel does not support. " + "If you're using a published plugin, " + "you may need to upgrade your @babel/core version.");
    }
  } else {
    throw new Error("More than one plugin attempted to override codegen.");
  }

  var _result = result,
      outputCode = _result.code,
      outputMap = _result.map;

  if (shebang) {
    outputCode = shebang + "\n" + outputCode;
  }

  if (outputMap && inputMap) {
    outputMap = mergeSourceMap(inputMap.toObject(), outputMap);
  }

  if (opts.sourceMaps === "inline" || opts.sourceMaps === "both") {
    outputCode += "\n" + _convertSourceMap().default.fromObject(outputMap).toComment();
  }

  if (opts.sourceMaps === "inline") {
    outputMap = null;
  }

  return {
    outputCode: outputCode,
    outputMap: outputMap
  };
}

function mergeSourceMap(inputMap, map) {
  var inputMapConsumer = new (_sourceMap().default.SourceMapConsumer)(inputMap);
  var outputMapConsumer = new (_sourceMap().default.SourceMapConsumer)(map);
  var mergedGenerator = new (_sourceMap().default.SourceMapGenerator)({
    file: inputMapConsumer.file,
    sourceRoot: inputMapConsumer.sourceRoot
  });
  var source = outputMapConsumer.sources[0];
  inputMapConsumer.eachMapping(function (mapping) {
    var generatedPosition = outputMapConsumer.generatedPositionFor({
      line: mapping.generatedLine,
      column: mapping.generatedColumn,
      source: source
    });

    if (generatedPosition.column != null) {
      mergedGenerator.addMapping({
        source: mapping.source,
        original: mapping.source == null ? null : {
          line: mapping.originalLine,
          column: mapping.originalColumn
        },
        generated: generatedPosition,
        name: mapping.name
      });
    }
  });
  var mergedMap = mergedGenerator.toJSON();
  inputMap.mappings = mergedMap.mappings;
  return inputMap;
}