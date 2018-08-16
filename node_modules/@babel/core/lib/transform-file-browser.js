"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformFile;

function transformFile(filename, opts, callback) {
  if (opts === void 0) {
    opts = {};
  }

  if (typeof opts === "function") {
    callback = opts;
  }

  callback(new Error("Transforming files is not supported in browsers"), null);
}