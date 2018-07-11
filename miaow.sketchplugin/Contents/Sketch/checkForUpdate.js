var that = this;
function __skpm_run (key, context) {
  that.context = context;

var exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/checkForUpdate.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/checkForUpdate.js":
/*!*******************************!*\
  !*** ./src/checkForUpdate.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module build failed (from ./node_modules/babel-loader/lib/index.js):\nSyntaxError: /Users/doubleluo/Documents/WeSketch/src/checkForUpdate.js: Unexpected token, expected \",\" (9:27)\n\n   7 | \t}\n   8 | \tvar returnData = networkRequest([getConfig('config', context).VERSION])\n>  9 | \tvar jsonData = [[NSString alloc] initWithData: returnData encoding: NSUTF8StringEncoding];\n     | \t                          ^\n  10 | \tjsonData = JSON.parse(jsonData);\n  11 | \tvar currentVersion = jsonData.currentVersion,\n  12 | \t\tmessage = jsonData.message,\n    at _class.raise (/Users/doubleluo/Documents/WeSketch/node_modules/@babel/parser/lib/index.js:3893:15)\n    at _class.unexpected (/Users/doubleluo/Documents/WeSketch/node_modules/@babel/parser/lib/index.js:5222:16)\n    at _class.expect (/Users/doubleluo/Documents/WeSketch/node_modules/@babel/parser/lib/index.js:5210:28)\n    at _class.parseExprList (/Users/doubleluo/Documents/WeSketch/node_modules/@babel/parser/lib/index.js:6941:14)\n    at _class.parseExprAtom (/Users/doubleluo/Documents/WeSketch/node_modules/@babel/parser/lib/index.js:6259:30)\n    at _class.parseExprAtom (/Users/doubleluo/Documents/WeSketch/node_modules/@babel/parser/lib/index.js:3594:52)\n    at _class.parseExprSubscripts (/Users/doubleluo/Documents/WeSketch/node_modules/@babel/parser/lib/index.js:5898:21)\n    at _class.parseMaybeUnary (/Users/doubleluo/Documents/WeSketch/node_modules/@babel/parser/lib/index.js:5877:21)\n    at _class.parseExprOps (/Users/doubleluo/Documents/WeSketch/node_modules/@babel/parser/lib/index.js:5786:21)\n    at _class.parseMaybeConditional (/Users/doubleluo/Documents/WeSketch/node_modules/@babel/parser/lib/index.js:5758:21)\n    at _class.parseMaybeAssign (/Users/doubleluo/Documents/WeSketch/node_modules/@babel/parser/lib/index.js:5705:21)\n    at _class.parseExprListItem (/Users/doubleluo/Documents/WeSketch/node_modules/@babel/parser/lib/index.js:6965:18)\n    at _class.parseExprList (/Users/doubleluo/Documents/WeSketch/node_modules/@babel/parser/lib/index.js:6945:22)\n    at _class.parseExprAtom (/Users/doubleluo/Documents/WeSketch/node_modules/@babel/parser/lib/index.js:6259:30)\n    at _class.parseExprAtom (/Users/doubleluo/Documents/WeSketch/node_modules/@babel/parser/lib/index.js:3594:52)\n    at _class.parseExprSubscripts (/Users/doubleluo/Documents/WeSketch/node_modules/@babel/parser/lib/index.js:5898:21)");

/***/ })

/******/ });
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['onRun'] = __skpm_run.bind(this, 'default')

//# sourceMappingURL=checkForUpdate.js.map