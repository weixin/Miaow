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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/iconQ.js");
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

/***/ "./src/iconQ.js":
/*!**********************!*\
  !*** ./src/iconQ.js ***!
  \**********************/
/*! exports provided: iconQRun */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "iconQRun", function() { return iconQRun; });
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common */ "./src/common.js");


function iconQ(context) {
  var i18 = Object(_common__WEBPACK_IMPORTED_MODULE_0__["_"])(context).iconQ;

  var ga = new Analytics(context);
  var usualKey = "com.sketchplugins.wechat.iconusual";
  var loginKey = "com.sketchplugins.wechat.iconLogin";
  var loginNameKey = "com.sketchplugins.wechat.iconLoginName";
  var iconSaveKey = "com.sketchplugins.wechat.baseicon";
  var iconVersionKey = "com.sketchplugins.wechat.baseiconversion";
  var projectChooseKey = "com.sketchplugins.wechat.saveprojectchoose";
  var categoryChooseKey = "com.sketchplugins.wechat.savecategorychoose";
  var sig = NSUserDefaults.standardUserDefaults().objectForKey(loginKey);
  var returnData = Object(_common__WEBPACK_IMPORTED_MODULE_0__["networkRequest"])([Object(_common__WEBPACK_IMPORTED_MODULE_0__["getConfig"])('config', context).VERSION]);
  var jsonData = NSString.alloc().initWithData_encoding(returnData, NSUTF8StringEncoding);
  jsonData = JSON.parse(jsonData);
  var currentVersion = jsonData.currentIconVersion;

  function choiceSVG(context) {
    var svgList = [];

    for (var i = 0; i < context.selection.count(); i++) {
      var rect;

      if (context.selection[i].className() == 'MSArtboardGroup' || context.selection[i].className() == 'MSLayerGroup') {
        var sketch = context.api();
        var myStyle = new sketch.Style();
        myStyle.fills = ['rgba(255,255,255,0)'];
        myStyle.borders = ['rgba(255,255,255,0)'];
        sketch.selectedDocument.selectedPage.newShape({
          frame: new sketch.Rectangle(context.selection[i].absoluteRect().x(), context.selection[i].absoluteRect().y(), context.selection[i].rect().size.width, context.selection[i].rect().size.height),
          style: myStyle,
          name: '__tc__' + context.selection[i].objectID()
        });
        var child = context.document.currentPage().children();

        for (var k = 0; k < child.length; k++) {
          if (child[k].name() == '__tc__' + context.selection[i].objectID()) {
            child[k].moveToLayer_beforeLayer(context.selection[i], context.selection[i]);
            child[k].select_byExpandingSelection(false, false);
            rect = child[k];
            break;
          }
        }

        var flagk = 0;

        for (var k = 0; k < context.selection[i].layers().length; k++) {
          if (context.selection[i].layers()[flagk].name() != '__tc__' + context.selection[i].objectID()) {
            context.selection[i].layers()[flagk].moveToLayer_beforeLayer(context.selection[i], context.selection[i]);
          } else {
            flagk++;
          }
        }
      }

      var slice = MSExportRequest.exportRequestsFromExportableLayer(context.selection[i]).firstObject();
      slice.scale = '1';
      slice.format = 'svg';
      var save = NSSavePanel.savePanel();
      var savePath = save.URL().path() + '.svg';
      context.document.saveArtboardOrSlice_toFile(slice, savePath);
      var content = NSData.dataWithContentsOfURL(NSURL.URLWithString('file:///' + encodeURIComponent(savePath)));
      var string = NSString.alloc().initWithData_encoding(content, NSUTF8StringEncoding);
      svgList.push({
        content: encodeURIComponent(string),
        name: encodeURIComponent(context.selection[i].name().toString().replace(/\s+/g, '_'))
      });
      var fm = NSFileManager.defaultManager();
      fm.removeItemAtPath_error(savePath, nil);

      if (context.selection[i].className() == 'MSArtboardGroup' || context.selection[i].className() == 'MSLayerGroup') {
        rect.removeFromParent();
      }
    }

    return svgList;
  }

  function getSvg() {
    return Object(_common__WEBPACK_IMPORTED_MODULE_0__["post"])(['/users/getFiles']);
  }

  function queryProjectIcon(projectid) {
    var r = Object(_common__WEBPACK_IMPORTED_MODULE_0__["post"])(['/users/queryIconByProId', 'projectid=' + projectid]);
    return r;
  }

  function queryTypeIcon(categoryid) {
    var r = Object(_common__WEBPACK_IMPORTED_MODULE_0__["post"])(['/users/queryIconByCateId', 'categoryid=' + categoryid]);
    return r;
  }

  function iconLogin(data) {
    var r = Object(_common__WEBPACK_IMPORTED_MODULE_0__["post"])(['/users/login', 'username=' + data.username + '&password=' + data.password]);

    if (r.status == 200) {
      NSUserDefaults.standardUserDefaults().setObject_forKey(data.username, loginNameKey);
    }

    return r;
  }

  function iconRegister(data) {
    var r = Object(_common__WEBPACK_IMPORTED_MODULE_0__["post"])(['/users/register', 'username=' + data.username + '&password=' + data.password + '&mail=' + data.mail]);

    if (r.status == 200) {
      NSUserDefaults.standardUserDefaults().setObject_forKey(data.username, loginNameKey);
    }

    return r;
  }

  function addMember(data) {
    var r = Object(_common__WEBPACK_IMPORTED_MODULE_0__["post"])(['/users/addMember', 'key=' + data.invitedKey]);
    return r;
  }

  function getLogin() {
    return Object(_common__WEBPACK_IMPORTED_MODULE_0__["post"])(['/users/login']);
  }

  function queryProject() {
    var r = Object(_common__WEBPACK_IMPORTED_MODULE_0__["post"])(['/users/queryProject']);
    return r;
  }

  function version_check(data) {
    var r = Object(_common__WEBPACK_IMPORTED_MODULE_0__["post"])(['/users/version_check', 'projectid=' + data.projectid + '&list=' + JSON.stringify(data.list)]);
    return r;
  }

  function uploadIconFunc(data) {
    return Object(_common__WEBPACK_IMPORTED_MODULE_0__["post"])(['/users/single_upload', 'name=' + data.name + '&content=' + data.content + '&projectid=' + data.project + '&categoryid=' + data.type + '&author=' + data.author]);
  }

  function uploadIconsFunc(data) {
    return Object(_common__WEBPACK_IMPORTED_MODULE_0__["post"])(['/users/batch_upload', 'list=' + JSON.stringify(data)]);
  }

  function addProject(data) {
    return Object(_common__WEBPACK_IMPORTED_MODULE_0__["post"])(['/users/createProject', 'projectname=' + data.projectName]);
  }

  function deleteProject(data) {
    return Object(_common__WEBPACK_IMPORTED_MODULE_0__["post"])(['/users/deleteProject', 'projectid=' + data.projectid]);
  }

  function queryIconByName(data) {
    return Object(_common__WEBPACK_IMPORTED_MODULE_0__["post"])(['/users/queryIconByName', 'name=' + data.name + '&projectid=' + data.projectid]);
  }

  function addCategory(data) {
    return Object(_common__WEBPACK_IMPORTED_MODULE_0__["post"])(['/users/createCategory', 'projectid=' + data.projectId + '&categoryname=' + data.categoryName]);
  }

  function deleteIcon(data) {
    return Object(_common__WEBPACK_IMPORTED_MODULE_0__["post"])(['/users/deleteIcon', 'list=' + JSON.stringify([data])]);
  }

  function downloadZip(data) {
    return Object(_common__WEBPACK_IMPORTED_MODULE_0__["get"])(['/users/createZip', 'projectid=' + data.projectId + '&id=' + encodeURIComponent(JSON.stringify(data.ids))]);
  }

  var svgtitle = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>';
  var pluginSketch = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("library").path();
  var baseSvg;

  if (!NSUserDefaults.standardUserDefaults().objectForKey(iconSaveKey) || NSUserDefaults.standardUserDefaults().objectForKey(iconVersionKey) != currentVersion) {
    baseSvg = getSvg().data;
    NSUserDefaults.standardUserDefaults().setObject_forKey(currentVersion, iconVersionKey);
    NSUserDefaults.standardUserDefaults().setObject_forKey(baseSvg, iconSaveKey);
  } else {
    baseSvg = NSUserDefaults.standardUserDefaults().objectForKey(iconSaveKey);
    var encodeBaseSvg = [];

    for (var i = 0; i < baseSvg.length; i++) {
      encodeBaseSvg.push({
        author: decodeURIComponent(encodeURIComponent(baseSvg[i].author)),
        content: decodeURIComponent(encodeURIComponent(baseSvg[i].content)),
        name: decodeURIComponent(encodeURIComponent(baseSvg[i].name))
      });
    }

    ;
    baseSvg = encodeBaseSvg;
  }

  var isLogin;

  if (!NSUserDefaults.standardUserDefaults().objectForKey(loginKey) || NSUserDefaults.standardUserDefaults().objectForKey(loginKey).length() != 32) {
    isLogin = false;
  } else {
    isLogin = getLogin();
  }

  var initData = {
    data: baseSvg,
    isLogin: isLogin,
    i18: i18
  };

  if (isLogin == false || isLogin.status != 200) {
    initData.isLogin = false;
  } else {
    var username = NSUserDefaults.standardUserDefaults().objectForKey(loginNameKey);
    var b = '';
    b += username;
    initData.nametest = b;
    var project = queryProject().list;
    initData.project = project;
    initData.chooseProject = encodeURIComponent(NSUserDefaults.standardUserDefaults().objectForKey(projectChooseKey) || '');
    initData.chooseCategory = encodeURIComponent(NSUserDefaults.standardUserDefaults().objectForKey(categoryChooseKey) || '');
    initData.isLogin = true;
  }

  Object(_common__WEBPACK_IMPORTED_MODULE_0__["SMPanel"])({
    url: pluginSketch + "/panel/icon.html",
    width: 560,
    height: 580,
    data: initData,
    hiddenClose: false,
    floatWindow: true,
    identifier: "icon",
    callback: function callback(data) {
      if (data.type == 'link') {
        Object(_common__WEBPACK_IMPORTED_MODULE_0__["openUrlInBrowser"])(data.link);
        return;
      } else if (data.type == 'public' || data.type == 'private') {
        var nowcontext = Object(_common__WEBPACK_IMPORTED_MODULE_0__["uploadContext"])(context);
        var page = nowcontext.document.currentPage();
        data.name = data.name.replace('.svg', '');
        page.setCurrentArtboard(null);
        var logo = data.content;
        logo = svgtitle + logo.replace('xmlns="http://www.w3.org/2000/svg"', 'version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"').replace(/<title>.*?<\/title>/, '');
        logo = NSString.stringWithString(logo);
        logo = logo.dataUsingEncoding(NSUTF8StringEncoding);
        var svgImporter = MSSVGImporter.svgImporter();
        svgImporter.prepareToImportFromData(logo);
        var importedSVGLayer = svgImporter.importAsLayer();
        var svgFrame = importedSVGLayer.frame();
        importedSVGLayer.name = data.name;

        if (data.type == 'public') {
          var oldWidth = svgFrame.width();
          var oldHeight = svgFrame.height();
          svgFrame.setWidth(data.width);
          svgFrame.setHeight(data.width * oldHeight / oldWidth);
          var children = importedSVGLayer.children();
          var colorToReplace = Object(_common__WEBPACK_IMPORTED_MODULE_0__["hexToRgb"])(data.color);

          for (var j = 0; j < children.length; j++) {
            if (children[j].className() == 'MSShapeGroup') {
              var fill = children[j].style().fills().firstObject();
              fill.color = MSColor.colorWithRed_green_blue_alpha(colorToReplace.r / 255, colorToReplace.g / 255, colorToReplace.b / 255, 1.0);
            }
          }
        } else {}

        page.addLayers([importedSVGLayer]);

        if (nowcontext.selection.length > 0) {
          svgFrame.setX(nowcontext.selection[0].absoluteRect().x());
          svgFrame.setY(nowcontext.selection[0].absoluteRect().y());
          nowcontext.document.showMessage(i18.m1 + ' ' + nowcontext.selection[0].name());

          for (var i = 0; i < nowcontext.selection.length; i++) {
            nowcontext.selection[i].select_byExpandingSelection(false, false);
          }
        } else {
          var contentDrawView = nowcontext.document.contentDrawView() || nowcontext.document.currentView();
          var midX = parseInt(Math.round((contentDrawView.frame().size.width / 2 - contentDrawView.horizontalRuler().baseLine()) / contentDrawView.zoomValue()));
          var midY = parseInt(Math.round((contentDrawView.frame().size.height / 2 - contentDrawView.verticalRuler().baseLine()) / contentDrawView.zoomValue()));
          var x = parseInt(midX - data.width / 2);
          var y = parseInt(midY - data.height / 2);
          svgFrame.setX(x);
          svgFrame.setY(y);
          nowcontext.document.showMessage(i18.m2);
        }

        importedSVGLayer.select_byExpandingSelection(true, true);

        if (ga) {
          if (data.type == 'public') {
            ga.sendEvent('icon', 'public');
          } else {
            ga.sendEvent('icon', 'private');
          }
        }
      } else if (data.type == 'loginout') {
        NSUserDefaults.standardUserDefaults().setObject_forKey('', loginNameKey);
        NSUserDefaults.standardUserDefaults().setObject_forKey('', loginKey);
        NSUserDefaults.standardUserDefaults().setObject_forKey('', categoryChooseKey);
        NSUserDefaults.standardUserDefaults().setObject_forKey('', projectChooseKey);
      } else if (data.type == 'code') {
        Object(_common__WEBPACK_IMPORTED_MODULE_0__["paste"])(data.code);
        Object(_common__WEBPACK_IMPORTED_MODULE_0__["errorDialog"])(context, i18.m17 + data.code + i18.m18);
      } else if (data.type == 'share') {
        var d = downloadZip(data);
        var address = 'http://sketch.weapi.io:3000/users/downloadZip?' + 'svgname=' + d.data.svgZipName + '&' + 'pngname=' + d.data.pngZipName + '&' + 'remark=' + data.message;
        Object(_common__WEBPACK_IMPORTED_MODULE_0__["paste"])(address);
        Object(_common__WEBPACK_IMPORTED_MODULE_0__["errorDialog"])(context, i18.m19 + address + i18.m18);
      } else if (data.type == 'displayDialog') {
        Object(_common__WEBPACK_IMPORTED_MODULE_0__["errorDialog"])(context, data.data);
      }
    },
    loginCallback: function loginCallback(data, windowObject) {
      var result;

      if (data.action == 'login') {
        result = iconLogin(data);
      } else if (data.action == 'register') {
        result = iconRegister(data);
      } else if (data.action == 'addProject') {
        if (data.projectName == '') {
          windowObject.evaluateWebScript("window.location.hash = '';");
          return Object(_common__WEBPACK_IMPORTED_MODULE_0__["errorDialog"])(context, i18.m20);
        } else {
          result = addProject(data);

          if (result.status == 200) {
            Object(_common__WEBPACK_IMPORTED_MODULE_0__["errorDialog"])(context, i18.m21);
          }
        }
      } else if (data.action == 'addCategory') {
        if (data.categoryName == '') {
          windowObject.evaluateWebScript("window.location.hash = '';");
          return Object(_common__WEBPACK_IMPORTED_MODULE_0__["errorDialog"])(context, i18.m20);
        } else {
          result = addCategory(data);

          if (result.status == 200) {
            Object(_common__WEBPACK_IMPORTED_MODULE_0__["errorDialog"])(context, i18.m21);
          }
        }
      } else if (data.action == 'addMember') {
        if (data.invitedKey == '') {
          windowObject.evaluateWebScript("window.location.hash = '';");
          return Object(_common__WEBPACK_IMPORTED_MODULE_0__["errorDialog"])(context, i18.m20);
        } else {
          result = addMember(data);

          if (result.status == 200) {
            Object(_common__WEBPACK_IMPORTED_MODULE_0__["errorDialog"])(context, i18.m21);
          }
        }
      } else if (data.action == 'deleteProject') {
        var settingsWindow = Object(_common__WEBPACK_IMPORTED_MODULE_0__["dialog"])(context);
        settingsWindow.addButtonWithTitle(i18.m28);
        settingsWindow.addButtonWithTitle(i18.m29);
        settingsWindow.setMessageText(i18.m67);
        settingsWindow.setInformativeText(i18.m69);

        if (settingsWindow.runModal() == "1000") {
          var result = deleteProject(data);

          if (result.status == 200) {
            Object(_common__WEBPACK_IMPORTED_MODULE_0__["errorDialog"])(context, i18.m68);
          }
        } else {
          return;
        }
      }

      if (result.status == 200) {
        if (result.sig) {
          NSUserDefaults.standardUserDefaults().setObject_forKey(result.sig, loginKey);
          var username = NSUserDefaults.standardUserDefaults().objectForKey(loginNameKey);
          var b = '';
          b += username;
          result.nametest = b;
        }

        var project = queryProject().list;
        result.project = project;
        windowObject.evaluateWebScript("sLogin(" + JSON.stringify(result) + ")");
        windowObject.evaluateWebScript("window.location.hash = '';");
      } else {
        windowObject.evaluateWebScript("window.location.hash = '';");
      }
    },
    pushdataCallback: function pushdataCallback(data, windowObject) {
      if (data.action == 'boardsvg') {
        var newContext = Object(_common__WEBPACK_IMPORTED_MODULE_0__["uploadContext"])(context);

        if (newContext.selection.length == 0) {
          windowObject.evaluateWebScript("window.location.hash = '';");
          return Object(_common__WEBPACK_IMPORTED_MODULE_0__["errorDialog"])(context, i18.m22);
        }

        var svg = choiceSVG(newContext);
        var namelist = [];

        for (var i = 0; i < svg.length; i++) {
          namelist.push(svg[i].name);
        }

        var version = version_check({
          projectid: data.projectid,
          list: namelist
        }).list;

        for (var i = 0; i < version.length; i++) {
          svg[i].version = version[i].version;
        }

        windowObject.evaluateWebScript("boardsvg(" + JSON.stringify(svg) + ")");
        windowObject.evaluateWebScript("window.location.hash = '';");
      } else if (data.action == 'filesvg') {
        var panel = NSOpenPanel.openPanel();
        panel.setCanChooseDirectories(false);
        panel.setAllowsMultipleSelection(true);
        panel.setAllowedFileTypes(["svg"]);
        panel.setAllowsOtherFileTypes(false);
        panel.setExtensionHidden(false);
        var clicked = panel.runModal();

        if (clicked != NSFileHandlingPanelOKButton) {
          return;
        }

        var urls = panel.URLs();
        var svg = [];

        for (var i = 0; i < urls.length; i++) {
          var unformattedURL = NSString.stringWithFormat(urls[i]);
          var file_path = unformattedURL.stringByRemovingPercentEncoding();
          var theResponseData = Object(_common__WEBPACK_IMPORTED_MODULE_0__["request"])(file_path);
          var theText = NSString.alloc().initWithData_encoding(theResponseData, NSUTF8StringEncoding);
          svg.push({
            content: encodeURIComponent(theText),
            name: file_path.substr(file_path.lastIndexOf('/') + 1).replace('.svg', '')
          });
        }

        var namelist = [];

        for (var i = 0; i < svg.length; i++) {
          namelist.push(svg[i].name);
        }

        var version = version_check({
          projectid: data.projectid,
          list: namelist
        }).list;

        for (var i = 0; i < version.length; i++) {
          svg[i].version = version[i].version;
        }

        windowObject.evaluateWebScript("filesvg(" + JSON.stringify(svg) + ")");
        windowObject.evaluateWebScript("window.location.hash = '';");
      } else if (data.action == 'version') {
        var version = version_check(data);
        windowObject.evaluateWebScript("versionCheck(" + JSON.stringify(version.list) + ")");
        windowObject.evaluateWebScript("window.location.hash = '';");
      } else if (data.action == 'upload') {
        var upload = function upload(uploaddata) {
          for (var i = 0; i < uploaddata.length; i++) {
            uploaddata[i].name = encodeURIComponent(uploaddata[i].name);
            uploaddata[i].content = encodeURIComponent(uploaddata[i].content);
          }

          var result = uploadIconsFunc(uploaddata);

          if (result.status == 200) {
            Object(_common__WEBPACK_IMPORTED_MODULE_0__["errorDialog"])(context, i18.m23);
          }

          return result;
        };

        if (data.version > 0) {
          var settingsWindow = Object(_common__WEBPACK_IMPORTED_MODULE_0__["dialog"])(context);
          settingsWindow.addButtonWithTitle(i18.m24);
          settingsWindow.addButtonWithTitle(i18.m25);
          settingsWindow.setMessageText(i18.m26);
          settingsWindow.addTextLabelWithValue(data.version + i18.m27);
          var runModals = settingsWindow.runModal();

          if (runModals == '1000') {
            var uploadReturn = upload(data.data);
            windowObject.evaluateWebScript("uploadReturn(" + JSON.stringify(uploadReturn) + ")");
            windowObject.evaluateWebScript("window.location.hash = '';");
          }
        } else {
          var uploadReturn = upload(data.data);
          windowObject.evaluateWebScript("uploadReturn(" + JSON.stringify(uploadReturn) + ")");
          windowObject.evaluateWebScript("window.location.hash = '';");
        }
      } else if (data.action == 'history') {
        var result = queryIconByName(data);
        windowObject.evaluateWebScript("pushdata3(" + JSON.stringify(result) + ")");
        windowObject.evaluateWebScript("window.location.hash = '';");
      } else if (data.action == 'delete') {
        var settingsWindow = Object(_common__WEBPACK_IMPORTED_MODULE_0__["dialog"])(context);
        settingsWindow.addButtonWithTitle(i18.m28);
        settingsWindow.addButtonWithTitle(i18.m29);
        settingsWindow.setMessageText(i18.m30);
        var response = settingsWindow.runModal();

        if (response == "1000") {
          deleteIcon(data.deleteid);
          var result = queryProjectIcon(data.projectid);
          windowObject.evaluateWebScript("pushdata(" + JSON.stringify(result) + ")");
          windowObject.evaluateWebScript("window.location.hash = '';");
        }
      } else {
        var result = {};

        if (data.type == 'type') {
          result = queryTypeIcon(data.id);
          NSUserDefaults.standardUserDefaults().setObject_forKey(data.pid, categoryChooseKey);
          NSUserDefaults.standardUserDefaults().setObject_forKey(data.id, categoryChooseKey);
        } else {
          result = queryProjectIcon(data.id);
          NSUserDefaults.standardUserDefaults().setObject_forKey('', categoryChooseKey);
          NSUserDefaults.standardUserDefaults().setObject_forKey(data.id, projectChooseKey);
        }

        windowObject.evaluateWebScript("pushdata(" + JSON.stringify(result) + ")");
        windowObject.evaluateWebScript("window.location.hash = '';");
      }
    }
  });
  if (ga) ga.sendEvent('icon', 'open');
}

function iconQRun(context) {
  iconQ(context);
}

/***/ })

/******/ });
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['iconQRun'] = __skpm_run.bind(this, 'iconQRun');
that['onRun'] = __skpm_run.bind(this, 'default')

//# sourceMappingURL=iconQ.js.map