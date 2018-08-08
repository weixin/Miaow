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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/issues.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/common.js":
/*!***********************!*\
  !*** ./src/common.js ***!
  \***********************/
/*! exports provided: _, dialog, errorDialog, initDefaults, uploadContext, paste, rgb, saveDefaults, request, networkRequest, zip, encodeData, get, post, getConfig, openUrlInBrowser, createRadioButtons, createRadioButtons2, createArtboard, hexToRgb, unique, SMPanel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_", function() { return _; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dialog", function() { return dialog; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "errorDialog", function() { return errorDialog; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initDefaults", function() { return initDefaults; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "uploadContext", function() { return uploadContext; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "paste", function() { return paste; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rgb", function() { return rgb; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "saveDefaults", function() { return saveDefaults; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "request", function() { return request; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "networkRequest", function() { return networkRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "zip", function() { return zip; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "encodeData", function() { return encodeData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "get", function() { return get; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "post", function() { return post; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getConfig", function() { return getConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "openUrlInBrowser", function() { return openUrlInBrowser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createRadioButtons", function() { return createRadioButtons; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createRadioButtons2", function() { return createRadioButtons2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createArtboard", function() { return createArtboard; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hexToRgb", function() { return hexToRgb; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "unique", function() { return unique; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SMPanel", function() { return SMPanel; });
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var kPluginDomain;
var iconQueryUrl = 'http://123.207.94.56:3000';
var loginKey = "com.sketchplugins.wechat.iconLogin";
function _(context) {
  var i18nKey = "com.sketchplugins.wechat.i18n";
  var lang = NSUserDefaults.standardUserDefaults().objectForKey(i18nKey);

  if (lang == undefined) {
    var macOSVersion = NSDictionary.dictionaryWithContentsOfFile("/System/Library/CoreServices/SystemVersion.plist").objectForKey("ProductVersion") + "";
    lang = NSUserDefaults.standardUserDefaults().objectForKey("AppleLanguages").objectAtIndex(0);
    lang = macOSVersion >= "10.12" ? lang.split("-").slice(0, -1).join("-") : lang;

    if (lang.indexOf('zh') > -1) {
      lang = 'zhCN';
    } else {
      lang = 'enUS';
    }

    NSUserDefaults.standardUserDefaults().setObject_forKey(lang, i18nKey);
  }

  if (encodeURIComponent(lang.toString()).length != 4) {
    lang = 'enUS';
    NSUserDefaults.standardUserDefaults().setObject_forKey(lang, i18nKey);
  }

  function get_(json, context) {
    var manifestPath = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Resources").URLByAppendingPathComponent("i18n").URLByAppendingPathComponent(json + ".json").path();
    var jsonData = NSData.dataWithContentsOfFile(manifestPath);
    jsonData = NSString.alloc().initWithData_encoding(jsonData, NSUTF8StringEncoding);
    return JSON.parse(jsonData);
  }

  var i18Content = {};
  i18Content = get_(lang, context);
  return i18Content;
}
;
function dialog(context) {
  var iconImage = NSImage.alloc().initByReferencingFile(context.plugin.urlForResourceNamed("icon.png").path());
  var alert = COSAlertWindow.new();

  if (iconImage) {
    alert.setIcon(iconImage);
  }

  return alert;
}
function errorDialog(context, content) {
  var iconImage = NSImage.alloc().initByReferencingFile(context.plugin.urlForResourceNamed("icon.png").path());
  var alert = COSAlertWindow.new();

  if (iconImage) {
    alert.setIcon(iconImage);
  }

  alert.addButtonWithTitle(_(context).checkForUpdate.m9);
  alert.setMessageText(_(context).checkForUpdate.m10);
  alert.setInformativeText(content);
  return alert.runModal();
}
function initDefaults(pluginDomain, initialValues) {
  kPluginDomain = pluginDomain;
  var defaults = NSUserDefaults.standardUserDefaults().objectForKey(kPluginDomain);
  var defaultValues = {};
  var dVal;

  for (var key in defaults) {
    defaultValues[key] = defaults[key];
  }

  for (var key in initialValues) {
    dVal = defaultValues[key];
    if (dVal == nil) defaultValues[key] = initialValues[key];
  }

  return defaultValues;
}
function uploadContext(context) {
  var contextNow = context;
  contextNow.document = NSDocumentController.sharedDocumentController().currentDocument();
  contextNow.selection = context.document.selectedLayers().layers();
  return contextNow;
}
function paste(text) {
  var pasteBoard = NSPasteboard.generalPasteboard();
  pasteBoard.declareTypes_owner(NSArray.arrayWithObject(NSPasteboardTypeString), nil);
  pasteBoard.setString_forType(text, NSPasteboardTypeString);
}
function rgb(a) {
  var sColor = a.toLowerCase();

  if (sColor.length === 4) {
    var sColorNew = "#";

    for (var i = 1; i < 4; i += 1) {
      sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
    }

    sColor = sColorNew;
  } //处理六位的颜色值


  var sColorChange = [];

  for (var i = 1; i < 7; i += 2) {
    sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
  }

  return sColorChange;
}
function saveDefaults(newValues) {}
function request(args) {
  var aara = [args];
  var task = NSTask.alloc().init();
  task.setLaunchPath("/usr/bin/curl");
  task.setArguments(aara);
  var outputPipe = NSPipe.pipe();
  task.setStandardOutput(outputPipe);
  task.launch();
  var responseData = outputPipe.fileHandleForReading().readDataToEndOfFile();
  return responseData;
}
function networkRequest(args) {
  var task = NSTask.alloc().init();
  task.setLaunchPath("/usr/bin/curl");
  task.setArguments(args);
  var outputPipe = NSPipe.pipe();
  task.setStandardOutput(outputPipe);
  task.launch();
  var responseData = outputPipe.fileHandleForReading().readDataToEndOfFile();
  return responseData;
} // zip(['-q','-r','-m','-o','-j','/Users/liuxinyu/Desktop/123.zip','/Users/liuxinyu/Desktop/123'])

function zip(args) {
  var task = NSTask.alloc().init();
  task.setLaunchPath("/usr/bin/zip");
  task.setArguments(args);
  var outputPipe = NSPipe.pipe();
  task.setStandardOutput(outputPipe);
  task.launch();
}
function encodeData(jsonData) {
  var result = {};

  for (var o in jsonData) {
    result[o] = _typeof(jsonData) != 'object' ? encodeURIComponent(jsonData[o]) : encodeData(jsonData[o]);
  }

  return result;
}
function get(args) {
  var sig = NSUserDefaults.standardUserDefaults().objectForKey(loginKey);
  var returnData = networkRequest([iconQueryUrl + args[0] + '?sig=' + sig + '&' + args[1]]);
  var jsonData = NSString.alloc().initWithData_encoding(returnData, NSUTF8StringEncoding);
  jsonData = JSON.parse(jsonData);

  if (jsonData.status == 200) {
    return jsonData;
  } else {
    errorDialog(context, jsonData.msg);
    return jsonData;
  }
}
function post(args) {
  var sig = NSUserDefaults.standardUserDefaults().objectForKey(loginKey);
  var returnData = networkRequest(['-d', 'sig=' + sig + '&' + args[1], iconQueryUrl + args[0]]);
  var jsonData = NSString.alloc().initWithData_encoding(returnData, NSUTF8StringEncoding);
  jsonData = JSON.parse(jsonData);

  if (jsonData.status == 200) {
    return jsonData;
  } else {
    errorDialog(context, jsonData.msg);
    return jsonData;
  }
}
function getConfig(json, context) {
  var manifestPath = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent(json + ".json").path();
  return NSJSONSerialization.JSONObjectWithData_options_error(NSData.dataWithContentsOfFile(manifestPath), NSJSONReadingMutableContainers, nil);
}
function openUrlInBrowser(url) {
  NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString(url));
}
function createRadioButtons(options, selectedItem) {
  var ui = NSRadioButton;
  var type = NSRadioModeMatrix;
  var rows = Math.ceil(options.length / 2);
  var columns = options.length < 2 ? 1 : 2;
  var selectedRow = Math.floor(selectedItem / 2);
  var selectedColumn = selectedItem - selectedRow * 2;
  var buttonCell = NSButtonCell.alloc().init();
  buttonCell.setButtonType(ui);
  var buttonMatrix = NSMatrix.alloc().initWithFrame_mode_prototype_numberOfRows_numberOfColumns(NSMakeRect(20.0, 20.0, 300.0, rows * 25), type, buttonCell, rows, columns);
  buttonMatrix.setCellSize(NSMakeSize(140, 20));

  for (var i = 0; i < options.length; i++) {
    buttonMatrix.cells().objectAtIndex(i).setTitle(options[i]);
    buttonMatrix.cells().objectAtIndex(i).setTag(i);
  }

  if (rows * columns > options.length) {
    buttonMatrix.cells().objectAtIndex(options.length).setTransparent(true);
    buttonMatrix.cells().objectAtIndex(options.length).setEnabled(false);
  }

  buttonMatrix.selectCellAtRow_column(selectedRow, selectedColumn);
  return buttonMatrix;
}
function createRadioButtons2(options, selectedItem) {
  var ui = NSRadioButton;
  var type = NSRadioModeMatrix;
  var rows = Math.ceil(options.length / 3);
  var columns = 3;
  var selectedRow = Math.floor(selectedItem / 3);
  var selectedColumn = selectedItem - selectedRow * 3;
  var buttonCell = NSButtonCell.alloc().init();
  buttonCell.setButtonType(ui);
  var buttonMatrix = NSMatrix.alloc().initWithFrame_mode_prototype_numberOfRows_numberOfColumns(NSMakeRect(20.0, 20.0, 300.0, rows * 25), type, buttonCell, rows, columns);
  buttonMatrix.setCellSize(NSMakeSize(90, 20));

  for (var i = 0; i < options.length; i++) {
    buttonMatrix.cells().objectAtIndex(i).setTitle(options[i]);
    buttonMatrix.cells().objectAtIndex(i).setTag(i);
  }

  if (rows * columns > options.length) {
    buttonMatrix.cells().objectAtIndex(options.length).setTransparent(true);
    buttonMatrix.cells().objectAtIndex(options.length).setEnabled(false);
  }

  buttonMatrix.selectCellAtRow_column(selectedRow, selectedColumn);
  return buttonMatrix;
}
function createArtboard(context, obj) {
  var doc = context.document;
  var artboard = new MSArtboardGroup();
  artboard.setName(obj.name);
  var frame = artboard.frame();
  frame.setX(obj.x);
  frame.setY(obj.y);
  frame.setWidth(obj.width);
  frame.setHeight(obj.height);
  doc.currentPage().addLayer(artboard);
  return artboard;
}
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (result) {
    result = {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };
  } else {
    result = null;
  }

  return result;
}
function unique(a) {
  var res = [];

  for (var i = 0, len = a.length; i < len; i++) {
    var item = a[i];

    for (var j = 0, jLen = res.length; j < jLen; j++) {
      if (res[j] === item) break;
    }

    if (j === jLen) res.push(item);
  }

  return res;
}

function MochaJSDelegate(selectorHandlerDict) {
  var uniqueClassName = "MochaJSDelegate_DynamicClass_" + NSUUID.UUID().UUIDString();
  var delegateClassDesc = MOClassDescription.allocateDescriptionForClassWithName_superclass_(uniqueClassName, NSObject);
  delegateClassDesc.registerClass(); //  Handler storage

  var handlers = {}; //  Define interface

  this.setHandlerForSelector = function (selectorString, func) {
    var handlerHasBeenSet = selectorString in handlers;
    var selector = NSSelectorFromString(selectorString);
    handlers[selectorString] = func;

    if (!handlerHasBeenSet) {
      /*
          For some reason, Mocha acts weird about arguments:
          https://github.com/logancollins/Mocha/issues/28
           We have to basically create a dynamic handler with a likewise dynamic number of predefined arguments.
      */
      var dynamicHandler = function dynamicHandler() {
        var functionToCall = handlers[selectorString];
        if (!functionToCall) return;
        return functionToCall.apply(delegateClassDesc, arguments);
      };

      var args = [],
          regex = /:/g;

      while (match = regex.exec(selectorString)) {
        args.push("arg" + args.length);
      }

      dynamicFunction = eval("(function(" + args.join(",") + "){ return dynamicHandler.apply(this, arguments); })");
      delegateClassDesc.addInstanceMethodWithSelector_function_(selector, dynamicFunction);
    }
  };

  this.removeHandlerForSelector = function (selectorString) {
    delete handlers[selectorString];
  };

  this.getHandlerForSelector = function (selectorString) {
    return handlers[selectorString];
  };

  this.getAllHandlers = function () {
    return handlers;
  };

  this.getClass = function () {
    return NSClassFromString(uniqueClassName);
  };

  this.getClassInstance = function () {
    return NSClassFromString(uniqueClassName).new();
  }; //  Conveience


  if (_typeof(selectorHandlerDict) == "object") {
    for (var selectorString in selectorHandlerDict) {
      this.setHandlerForSelector(selectorString, selectorHandlerDict[selectorString]);
    }
  }
}

; //  sketch-measure
//  common.js
//  github https://github.com/utom/sketch-measure
//  Created by utom

function SMPanel(options) {
  coscript.setShouldKeepAround(true);
  var self = this,
      result = false;
  options.url = encodeURI("file://" + options.url);
  var frame = NSMakeRect(0, 0, options.width, options.height + 32),
      titleBgColor = NSColor.colorWithRed_green_blue_alpha(0.945, 0.945, 0.945, 1),
      contentBgColor = NSColor.colorWithRed_green_blue_alpha(0.945, 0.945, 0.945, 1);

  if (options.identifier) {
    var threadDictionary = NSThread.mainThread().threadDictionary();

    if (threadDictionary[options.identifier]) {
      return false;
    }
  }

  var Panel = NSPanel.alloc().init();
  Panel.setTitleVisibility(NSWindowTitleHidden);
  Panel.setTitlebarAppearsTransparent(true);
  Panel.standardWindowButton(NSWindowCloseButton).setHidden(options.hiddenClose);
  Panel.standardWindowButton(NSWindowMiniaturizeButton).setHidden(true);
  Panel.standardWindowButton(NSWindowZoomButton).setHidden(true);
  Panel.setFrame_display(frame, false);
  Panel.setBackgroundColor(contentBgColor);
  var contentView = Panel.contentView();
  var webView = WebView.alloc().initWithFrame(NSMakeRect(options.showX ? options.showX : 0, options.showY ? options.showY : 0, options.width, options.height));
  var windowObject = webView.windowScriptObject(),
      delegate = new MochaJSDelegate({
    "webView:didFinishLoadForFrame:": function webViewDidFinishLoadForFrame(webView, webFrame) {
      var SMAction = ["function SMAction(hash, data){", "if(data){", "window.SMData = encodeURI(JSON.stringify(data));", "}", "window.location.hash = hash;", "}"].join(""),
          DOMReady = ["$(", "function(){", "init(" + JSON.stringify(options.data) + ")", "}", ");"].join("");
      windowObject.evaluateWebScript(SMAction);
      windowObject.evaluateWebScript(DOMReady);
    },
    "webView:didChangeLocationWithinPageForFrame:": function webViewDidChangeLocationWithinPageForFrame(webView, webFrame) {
      var request = NSURL.URLWithString(webView.mainFrameURL()).fragment();

      if (request == "submit") {
        var data = JSON.parse(decodeURI(windowObject.valueForKey("SMData")));
        options.callback(data);
        result = true;
      } else if (request == "close") {
        if (!options.floatWindow) {
          Panel.orderOut(nil);
          NSApp.stopModal();
        } else {
          Panel.close();
        }

        threadDictionary.removeObjectForKey(options.identifier);
      } else if (request == 'submitandclose') {
        var data = JSON.parse(decodeURI(windowObject.valueForKey("SMData")));
        var closeflag = options.callback(data);
        result = true;

        if (closeflag) {
          if (!options.floatWindow) {
            Panel.orderOut(nil);
            NSApp.stopModal();
          } else {
            Panel.close();
          }

          threadDictionary.removeObjectForKey(options.identifier);
        }
      } else if (request == 'file') {
        var panel = NSOpenPanel.openPanel();
        panel.setCanChooseDirectories(false);
        panel.setCanCreateDirectories(false);
        panel.setAllowedFileTypes(["sketch", "json"]);
        panel.setAllowsOtherFileTypes(false);
        panel.setExtensionHidden(false);
        var clicked = panel.runModal();

        if (clicked != NSFileHandlingPanelOKButton) {
          windowObject.evaluateWebScript("inputFile('" + '' + "')");
          return;
        }

        var firstURL = panel.URLs().objectAtIndex(0);
        var unformattedURL = NSString.stringWithFormat(firstURL);
        var file_path = unformattedURL.stringByRemovingPercentEncoding();
        windowObject.evaluateWebScript("inputFile('" + file_path + "')");
        windowObject.evaluateWebScript("window.location.hash = '';");
      } else if (request == 'login') {
        var data = JSON.parse(decodeURI(windowObject.valueForKey("SMData")));
        options.loginCallback(data, windowObject);
      } else if (request == 'pushdata') {
        var data = JSON.parse(decodeURI(windowObject.valueForKey("SMData")));
        options.pushdataCallback(data, windowObject);
      } // windowObject.evaluateWebScript("window.location.hash = '';");

    }
  });
  contentView.setWantsLayer(true);
  contentView.layer().setFrame(contentView.frame());
  contentView.layer().setCornerRadius(6);
  contentView.layer().setMasksToBounds(true);
  webView.setBackgroundColor(contentBgColor);
  webView.setFrameLoadDelegate_(delegate.getClassInstance());
  webView.setMainFrameURL_(options.url);
  contentView.addSubview(webView);
  var closeButton = Panel.standardWindowButton(NSWindowCloseButton);
  closeButton.setCOSJSTargetFunction(function (sender) {
    var request = NSURL.URLWithString(webView.mainFrameURL()).fragment();

    if (options.closeCallback) {
      options.closeCallback();
    }

    if (options.identifier) {
      threadDictionary.removeObjectForKey(options.identifier);
    }

    self.wantsStop = true;

    if (options.floatWindow) {
      Panel.close();
    } else {
      Panel.orderOut(nil);
      NSApp.stopModal();
    }
  });
  closeButton.setAction("callAction:");
  var titlebarView = contentView.superview().titlebarViewController().view(),
      titlebarContainerView = titlebarView.superview();
  closeButton.setFrameOrigin(NSMakePoint(8, 8));
  titlebarContainerView.setFrame(NSMakeRect(0, options.height, options.width, 32));
  titlebarView.setFrameSize(NSMakeSize(options.width, 32));
  titlebarView.setTransparent(true);
  titlebarView.setBackgroundColor(titleBgColor);
  titlebarContainerView.superview().setBackgroundColor(titleBgColor);

  if (options.floatWindow) {
    Panel.becomeKeyWindow();
    Panel.setLevel(NSFloatingWindowLevel);

    if (!options.showX || !options.showY) {
      Panel.center();
    }

    Panel.makeKeyAndOrderFront(nil);

    if (options.identifier) {
      threadDictionary[options.identifier] = Panel;
    }

    return webView;
  } else {
    if (options.identifier) {
      threadDictionary[options.identifier] = Panel;
    }

    NSApp.runModalForWindow(Panel);
  }

  return windowObject;
}

/***/ }),

/***/ "./src/issues.js":
/*!***********************!*\
  !*** ./src/issues.js ***!
  \***********************/
/*! exports provided: issuesAction */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "issuesAction", function() { return issuesAction; });
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common */ "./src/common.js");

function issuesAction(context) {
  Object(_common__WEBPACK_IMPORTED_MODULE_0__["openUrlInBrowser"])("https://github.com/weixin/wesketch/issues");
}
;

/***/ })

/******/ });
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['onRun'] = __skpm_run.bind(this, 'default')

//# sourceMappingURL=issues.js.map