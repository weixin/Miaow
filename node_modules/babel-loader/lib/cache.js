"use strict";

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

/**
 * Filesystem Cache
 *
 * Given a file and a transform function, cache the result into files
 * or retrieve the previously cached files if the given file is already known.
 *
 * @see https://github.com/babel/babel-loader/issues/34
 * @see https://github.com/babel/babel-loader/pull/41
 */
const fs = require("fs");

const os = require("os");

const path = require("path");

const zlib = require("zlib");

const crypto = require("crypto");

const mkdirpOrig = require("mkdirp");

const findCacheDir = require("find-cache-dir");

const promisify = require("util.promisify");

const transform = require("./transform"); // Lazily instantiated when needed


let defaultCacheDirectory = null;
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const gunzip = promisify(zlib.gunzip);
const gzip = promisify(zlib.gzip);
const mkdirp = promisify(mkdirpOrig);
/**
 * Read the contents from the compressed file.
 *
 * @async
 * @params {String} filename
 */

const read =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* (filename) {
    const data = yield readFile(filename);
    const content = yield gunzip(data);
    return JSON.parse(content);
  });

  return function read(_x) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Write contents into a compressed file.
 *
 * @async
 * @params {String} filename
 * @params {String} result
 */


const write =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(function* (filename, result) {
    const content = JSON.stringify(result);
    const data = yield gzip(content);
    return yield writeFile(filename, data);
  });

  return function write(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * Build the filename for the cached file
 *
 * @params {String} source  File source code
 * @params {Object} options Options used
 *
 * @return {String}
 */


const filename = function (source, identifier, options) {
  const hash = crypto.createHash("SHA1");
  const contents = JSON.stringify({
    source,
    options,
    identifier
  });
  hash.end(contents);
  return hash.read().toString("hex") + ".json.gz";
};
/**
 * Handle the cache
 *
 * @params {String} directory
 * @params {Object} params
 */


const handleCache =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(function* (directory, params) {
    const {
      source,
      options = {},
      cacheIdentifier,
      cacheDirectory
    } = params;
    const fallback = typeof cacheDirectory !== "string" && directory !== os.tmpdir(); // Make sure the directory exists.

    try {
      yield mkdirp(directory);
    } catch (err) {
      if (fallback) {
        return handleCache(os.tmpdir(), params);
      }

      throw err;
    }

    const file = path.join(directory, filename(source, cacheIdentifier, options));

    try {
      // No errors mean that the file was previously cached
      // we just need to return it
      return yield read(file);
    } catch (err) {} // Otherwise just transform the file
    // return it to the user asap and write it in cache


    const result = yield transform(source, options);

    try {
      yield write(file, result);
    } catch (err) {
      if (fallback) {
        // Fallback to tmpdir if node_modules folder not writable
        return handleCache(os.tmpdir(), params);
      }

      throw err;
    }

    return result;
  });

  return function handleCache(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * Retrieve file from cache, or create a new one for future reads
 *
 * @async
 * @param  {Object}   params
 * @param  {String}   params.directory  Directory to store cached files
 * @param  {String}   params.identifier Unique identifier to bust cache
 * @param  {String}   params.source   Original contents of the file to be cached
 * @param  {Object}   params.options  Options to be given to the transform fn
 * @param  {Function} params.transform  Function that will transform the
 *                                      original file and whose result will be
 *                                      cached
 *
 * @example
 *
 *   cache({
 *     directory: '.tmp/cache',
 *     identifier: 'babel-loader-cachefile',
 *     source: *source code from file*,
 *     options: {
 *       experimental: true,
 *       runtime: true
 *     },
 *     transform: function(source, options) {
 *       var content = *do what you need with the source*
 *       return content;
 *     }
 *   }, function(err, result) {
 *
 *   });
 */


module.exports =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(function* (params) {
    let directory;

    if (typeof params.cacheDirectory === "string") {
      directory = params.cacheDirectory;
    } else {
      if (defaultCacheDirectory === null) {
        defaultCacheDirectory = findCacheDir({
          name: "babel-loader"
        }) || os.tmpdir();
      }

      directory = defaultCacheDirectory;
    }

    return yield handleCache(directory, params);
  });

  return function (_x6) {
    return _ref4.apply(this, arguments);
  };
}();