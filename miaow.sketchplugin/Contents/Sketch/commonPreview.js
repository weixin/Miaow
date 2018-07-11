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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/commonPreview.js");
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
    var manifestPath = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("i18n").URLByAppendingPathComponent(json + ".json").path();
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

  for (i = 0; i < options.length; i++) {
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

  for (i = 0; i < options.length; i++) {
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

/***/ "./src/commonPreview.js":
/*!******************************!*\
  !*** ./src/commonPreview.js ***!
  \******************************/
/*! exports provided: getConnectionsInPage, getConnectionsLinkInPage, buildPreview, setIndex, setDialog, setFixed, setBacks, setNoBuild, clearPreview, hidePreview */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getConnectionsInPage", function() { return getConnectionsInPage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getConnectionsLinkInPage", function() { return getConnectionsLinkInPage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "buildPreview", function() { return buildPreview; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setIndex", function() { return setIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setDialog", function() { return setDialog; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setFixed", function() { return setFixed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setBacks", function() { return setBacks; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setNoBuild", function() { return setNoBuild; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "clearPreview", function() { return clearPreview; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hidePreview", function() { return hidePreview; });
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common */ "./src/common.js");

var previewKey = "com.sketchplugins.wechat.preview.w";
var previewWrapKey = "com.sketchplugins.wechat.previewwrap";
var kPluginDomain = "com.sketchplugins.wechat.link";
function getConnectionsInPage(page) {
  var connectionsLayerPredicate = NSPredicate.predicateWithFormat("userInfo != nil && function(userInfo, 'valueForKeyPath:', %@).isConnectionsContainer == true", previewWrapKey);
  return page.children().filteredArrayUsingPredicate(connectionsLayerPredicate).firstObject();
}
function getConnectionsLinkInPage(page) {
  var connectionsLayerPredicate = NSPredicate.predicateWithFormat("userInfo != nil && function(userInfo, 'valueForKeyPath:', %@).isConnectionsContainer == true", kPluginDomain);
  return page.children().filteredArrayUsingPredicate(connectionsLayerPredicate).firstObject();
}
function buildPreview(context) {
  var newPreviewObject = {
    index: {},
    dialog: {},
    fixed: {},
    back: {},
    noBuild: {}
  };
  var buildLayers = [];
  var linkLayersPredicate = NSPredicate.predicateWithFormat("userInfo != nil && function(userInfo, 'valueForKeyPath:', %@).fixedMain != nil", previewKey);
  var fixedObject = context.document.currentPage().children().filteredArrayUsingPredicate(linkLayersPredicate);

  for (var i = 0; i < fixedObject.length; i++) {
    var selection = fixedObject[i];
    var direction = context.command.valueForKey_onLayer_forPluginIdentifier("direction", selection, previewKey);
    var x = selection.absoluteRect().x();
    var y = selection.absoluteRect().y();
    var svg = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg width="418" height="219" viewBox="0 0 418 219" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><rect id="rectangle-2-a" width="417.282" height="218.764" x="160" y="252"/></defs><g fill="none" fill-rule="evenodd" transform="translate(-160 -252)"><use fill="#FFFAAC" fill-opacity=".354" xlink:href="#rectangle-2-a"/><rect width="416.282" height="217.764" x="160.5" y="252.5" stroke="#F3E31A"/></g></svg>';
    svg = NSString.stringWithString(svg);
    svg = svg.dataUsingEncoding(NSUTF8StringEncoding);
    var svgImporter = MSSVGImporter.svgImporter();
    svgImporter.prepareToImportFromData(svg);
    var importedSVGLayer = svgImporter.importAsLayer();
    var svgFrame = importedSVGLayer.frame();
    var fixedKey = '#_*fixed__' + direction;
    fixedKey = fixedKey + '#';
    importedSVGLayer.name = fixedKey + selection.objectID();
    svgFrame.setX(x);
    svgFrame.setX(y);
    svgFrame.setWidth(selection.rect().size.width);
    svgFrame.setHeight(selection.rect().size.height);
    newPreviewObject.fixed[selection.objectID()] = {
      main: selection.objectID(),
      direction: decodeURIComponent(encodeURIComponent(direction)),
      vs: importedSVGLayer.objectID()
    };
    buildLayers.push(importedSVGLayer);
  }

  linkLayersPredicate = NSPredicate.predicateWithFormat("userInfo != nil && function(userInfo, 'valueForKeyPath:', %@).backMain != nil", previewKey);
  var backObject = context.document.currentPage().children().filteredArrayUsingPredicate(linkLayersPredicate);

  for (var i = 0; i < backObject.length; i++) {
    var selection = backObject[i];
    var x = selection.absoluteRect().x();
    var y = selection.absoluteRect().y();
    var svg = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><rect id="rectangle-4-a" width="132.777" height="85.05" x="1" y="117" rx="100"/></defs><g fill="none" fill-rule="evenodd" transform="translate(-1 -117)"><use fill="#FF7979" fill-opacity=".3" xlink:href="#rectangle-4-a"/><rect width="131.777" height="84.05" x="1.5" y="117.5" stroke="#FF7C82" rx="100"/></g></svg>';
    svg = NSString.stringWithString(svg);
    svg = svg.dataUsingEncoding(NSUTF8StringEncoding);
    var svgImporter = MSSVGImporter.svgImporter();
    svgImporter.prepareToImportFromData(svg);
    var importedSVGLayer = svgImporter.importAsLayer();
    var svgFrame = importedSVGLayer.frame();
    var backKey = '#_*back__#';
    importedSVGLayer.name = backKey + selection.objectID();
    svgFrame.setX(x);
    svgFrame.setX(y);
    svgFrame.setWidth(selection.rect().size.width);
    svgFrame.setHeight(selection.rect().size.height);
    newPreviewObject.back[selection.objectID()] = {
      main: selection.objectID(),
      vs: importedSVGLayer.objectID()
    };
    buildLayers.push(importedSVGLayer);
  }

  linkLayersPredicate = NSPredicate.predicateWithFormat("userInfo != nil && function(userInfo, 'valueForKeyPath:', %@).noBuildMain != nil", previewKey);
  var noBuildObject = context.document.currentPage().children().filteredArrayUsingPredicate(linkLayersPredicate);

  for (var i = 0; i < noBuildObject.length; i++) {
    var selection = noBuildObject[i];
    var x = selection.absoluteRect().x();
    var y = selection.absoluteRect().y();
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="68" height="72" viewBox="0 0 68 72"><defs><rect id="rectangle-2-a" width="68" height="72" x="204" y="243"/><mask id="rectangle-2-b" width="68" height="72" x="0" y="0" fill="#fff"><use xlink:href="#rectangle-2-a"/></mask></defs><use fill="none" fill-rule="evenodd" stroke="#F00" stroke-dasharray="5" stroke-width="2" mask="url(#rectangle-2-b)" transform="translate(-204 -243)" xlink:href="#rectangle-2-a"/></svg>';
    svg = NSString.stringWithString(svg);
    svg = svg.dataUsingEncoding(NSUTF8StringEncoding);
    var svgImporter = MSSVGImporter.svgImporter();
    svgImporter.prepareToImportFromData(svg);
    var importedSVGLayer = svgImporter.importAsLayer();
    var svgFrame = importedSVGLayer.frame();
    var backKey = '#_*noBuild__#';
    importedSVGLayer.name = backKey + selection.objectID();
    svgFrame.setX(x);
    svgFrame.setX(y);
    svgFrame.setWidth(selection.rect().size.width);
    svgFrame.setHeight(selection.rect().size.height);
    newPreviewObject.noBuild[selection.objectID()] = {
      main: selection.objectID(),
      vs: importedSVGLayer.objectID()
    };
    buildLayers.push(importedSVGLayer);
  }

  linkLayersPredicate = NSPredicate.predicateWithFormat("userInfo != nil && function(userInfo, 'valueForKeyPath:', %@).dialogMain != nil", previewKey);
  var dialogObject = context.document.currentPage().children().filteredArrayUsingPredicate(linkLayersPredicate);

  for (var i = 0; i < dialogObject.length; i++) {
    var selection = dialogObject[i];
    var direction = context.command.valueForKey_onLayer_forPluginIdentifier("direction", selection, previewKey);
    var rx = selection.rect().size.width / 414;

    if (rx < 1) {
      rx = 1;
    }

    var width = 39 * rx;
    var height = 39 * rx;
    var x = selection.absoluteRect().x() + selection.rect().size.width - width;
    var y = selection.absoluteRect().y() - height; // 删除页面中所有

    var svg = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg width="39" height="39" viewBox="0 0 39 39"><g fill="none"><path fill="#9BABBD" d="M0.812234279,39 L31.1877657,39 C31.6365252,39 32,38.6344946 32,38.1877657 L32,31.647611 L30.3755314,31.647611 L30.3755314,37.3755314 L1.62243797,37.3755314 L1.62243797,8.62446856 L6.8713381,8.62446856 C6.86891724,7.54148952 6.86891724,7 6.8713381,7 L0.812234279,7 C0.36347484,7 0,7.36550543 0,7.81223428 L0,38.1877657 C2.25440299e-16,38.6344946 0.36347484,39 0.812234279,39 Z"/><path fill="#387FD2" d="M32.7130911,7.00001409 L34.8523116,4.86079105 C35.0492295,4.663873 35.0492295,4.34460659 34.8523116,4.14771671 C34.6553938,3.95079866 34.3361559,3.95079866 34.1392381,4.14771671 L31.9999894,6.28696791 L29.8607407,4.14768854 C29.6638229,3.95077049 29.3445851,3.95077049 29.1476672,4.14768854 C28.9507776,4.34460659 28.9507776,4.663873 29.1476672,4.86076288 L31.2869159,6.99998591 L29.1476672,9.13923712 C28.9507776,9.33615517 28.9507776,9.65542158 29.1476672,9.85231146 C29.3445851,10.0492295 29.6638229,10.0492295 29.8607407,9.85231146 L31.9999894,7.71306026 L34.1392381,9.85231146 C34.3361278,10.0492295 34.6553938,10.0492295 34.8523116,9.85231146 C35.0492295,9.65539341 35.0492295,9.33615517 34.8523116,9.13923712 L32.7130911,7.00001409 Z"/><path fill="#387FD2" d="M7.81223428,32 L38.1877657,32 C38.6365252,32 39,31.6344946 39,31.1877657 L39,0.812234279 C39,0.36347484 38.6365252,0 38.1877657,0 L7.81223428,0 C7.36347484,0 7,0.365505425 7,0.812234279 L7,31.1877657 C7,31.6344946 7.36347484,32 7.81223428,32 Z M8.62243797,1.62446856 L37.3755314,1.62446856 L37.3755314,30.3735009 L8.62243797,30.3735009 L8.62243797,1.62446856 Z"/></g></svg>';
    svg = NSString.stringWithString(svg);
    svg = svg.dataUsingEncoding(NSUTF8StringEncoding);
    var svgImporter = MSSVGImporter.svgImporter();
    svgImporter.prepareToImportFromData(svg);
    var importedSVGLayer = svgImporter.importAsLayer();
    var svgFrame = importedSVGLayer.frame();
    var dialogKey = '#_*dialog__';
    importedSVGLayer.name = dialogKey + direction + selection.objectID();
    svgFrame.setX(x);
    svgFrame.setX(y);
    svgFrame.setWidth(selection.rect().size.width);
    svgFrame.setHeight(selection.rect().size.height);
    newPreviewObject.dialog[selection.objectID()] = {
      main: selection.objectID(),
      direction: decodeURIComponent(encodeURIComponent(direction)),
      vs: importedSVGLayer.objectID()
    };
    buildLayers.push(importedSVGLayer);
  }

  var linkLayersPredicate = NSPredicate.predicateWithFormat("userInfo != nil && function(userInfo, 'valueForKeyPath:', %@).indexMain != nil", previewKey);
  var indexObject = context.document.currentPage().children().filteredArrayUsingPredicate(linkLayersPredicate);
  var commonPreviewIndexKey = '#_*index__#';

  for (var i = 0; i < indexObject.length; i++) {
    var selection = indexObject[i];
    var rx = selection.rect().size.width / 414;

    if (rx < 1) {
      rx = 1;
    }

    var width = 97 * rx;
    var height = 97 * rx;
    var x = selection.absoluteRect().x() - width - 10;
    var y = selection.absoluteRect().y() + 100; // 删除页面中所有

    var svg = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg width="97" height="97" viewBox="0 0 97 97"><defs><linearGradient id="group-a" x1="50%" x2="50%" y1="100%" y2="36.603%"><stop offset="0%" stop-color="#5998E0" stop-opacity="0"/><stop offset="30.973%" stop-color="#5998E0" stop-opacity=".519"/><stop offset="100%" stop-color="#5998E0"/></linearGradient></defs><g fill="none" fill-rule="evenodd" transform="translate(-2 -31)"><g fill-rule="nonzero" transform="rotate(45 23.396 58.338)"><path fill="#5998E0" d="M66.509544,23.521668 C66.0610101,23.521668 65.698452,23.1582988 65.698452,22.710576 L65.698452,0.811092 C65.698452,0.363369216 66.0610101,0 66.509544,0 C66.9580779,0 67.320636,0.363369216 67.320636,0.811092 L67.320636,22.710576 C67.320636,23.1582988 66.9580779,23.521668 66.509544,23.521668 Z"/><path fill="#5998E0" d="M66.509544,1.622184 L44.61006,1.622184 C44.1615261,1.622184 43.798968,1.25881478 43.798968,0.811092 C43.798968,0.363369216 44.1615261,0 44.61006,0 L66.509544,0 C66.9580779,0 67.320636,0.363369216 67.320636,0.811092 C67.320636,1.25881478 66.9580779,1.622184 66.509544,1.622184 Z"/><path fill="url(#group-a)" d="M0.760529288,65.4132226 L65.9361019,0.237649956 C66.2532389,-0.079487016 66.7658491,-0.079487016 67.082986,0.237649956 C67.400123,0.554786928 67.400123,1.06739707 67.082986,1.38453404 L1.90741338,66.5601067 L0.760529288,65.4132226 Z"/></g><text fill="#5998E0" font-family="PingFangSC-Regular, PingFang SC" font-size="12"><tspan x="14" y="41">Start</tspan></text></g></svg>';
    svg = NSString.stringWithString(svg);
    svg = svg.dataUsingEncoding(NSUTF8StringEncoding);
    var svgImporter = MSSVGImporter.svgImporter();
    svgImporter.prepareToImportFromData(svg);
    var importedSVGLayer = svgImporter.importAsLayer();
    var svgFrame = importedSVGLayer.frame();
    importedSVGLayer.name = commonPreviewIndexKey + selection.objectID();
    svgFrame.setX(x);
    svgFrame.setX(y);
    svgFrame.setWidth(selection.rect().size.width);
    svgFrame.setHeight(selection.rect().size.height);
    newPreviewObject.index[selection.objectID()] = {
      main: selection.objectID(),
      vs: importedSVGLayer.objectID()
    };
    buildLayers.push(importedSVGLayer);
  }

  var connectionsGroup = getConnectionsInPage(context.document.currentPage());

  if (connectionsGroup) {
    connectionsGroup.removeFromParent();
  }

  var connectionsGroup = MSLayerGroup.new();
  context.document.currentPage().addLayers([connectionsGroup]);
  context.document.currentPage().addLayers(buildLayers);

  for (var i = 0; i < buildLayers.length; i++) {
    buildLayers[i].moveToLayer_beforeLayer(connectionsGroup, connectionsGroup);
  }

  connectionsGroup.resizeToFitChildrenWithOption(1);
  connectionsGroup.setName("Preview");
  connectionsGroup.setIsLocked(1);
  connectionsGroup.moveToLayer_beforeLayer(context.document.currentPage(), context.document.currentPage());
  context.command.setValue_forKey_onLayer_forPluginIdentifier(true, "isConnectionsContainer", connectionsGroup, previewWrapKey);

  for (var i = 0; i < context.selection.length; i++) {
    context.selection[i].select_byExpandingSelection(false, false);
  }

  ;
  return newPreviewObject;
}
function setIndex(context) {
  var i18 = Object(_common__WEBPACK_IMPORTED_MODULE_0__["_"])(context).commonPreview;

  if (context.selection.length == 0) {
    return Object(_common__WEBPACK_IMPORTED_MODULE_0__["errorDialog"])(context, i18.m1);
  } else {
    var selection = context.selection[0];

    if (selection.className() != 'MSArtboardGroup') {
      return Object(_common__WEBPACK_IMPORTED_MODULE_0__["errorDialog"])(context, i18.m1);
    }

    var linkLayersPredicate = NSPredicate.predicateWithFormat("userInfo != nil && function(userInfo, 'valueForKeyPath:', %@).indexMain != nil", previewKey);
    var indexObject = context.document.currentPage().children().filteredArrayUsingPredicate(linkLayersPredicate);

    for (var i = 0; i < indexObject.length; i++) {
      context.command.setValue_forKey_onLayer_forPluginIdentifier(nil, "indexMain", indexObject[i], previewKey);
    }

    context.command.setValue_forKey_onLayer_forPluginIdentifier(selection.objectID(), "indexMain", selection, previewKey);
    buildPreview(context);
  }
}
function setDialog(context) {
  var i18 = Object(_common__WEBPACK_IMPORTED_MODULE_0__["_"])(context).commonPreview;

  var fx = 0;

  function chooseDialog() {
    var settingsWindow = Object(_common__WEBPACK_IMPORTED_MODULE_0__["dialog"])(context);
    settingsWindow.addButtonWithTitle(i18.m2);
    settingsWindow.addButtonWithTitle(i18.m3);
    settingsWindow.setMessageText(i18.m4);
    var ButtonList = [i18.m5, i18.m6, i18.m7, i18.m8, i18.m9];
    fx = Object(_common__WEBPACK_IMPORTED_MODULE_0__["createRadioButtons"])(ButtonList, 0);
    settingsWindow.addAccessoryView(fx);
    return settingsWindow.runModal();
  }

  if (context.selection.length == 0) {
    return Object(_common__WEBPACK_IMPORTED_MODULE_0__["errorDialog"])(context, i18.m1);
  } else {
    var selection = context.selection[0];

    if (selection.className() != 'MSArtboardGroup') {
      return Object(_common__WEBPACK_IMPORTED_MODULE_0__["errorDialog"])(context, i18.m1);
    }

    if (chooseDialog() != '1000') {
      return;
    }

    fx = fx.selectedCell();
    var index = fx.tag();
    var direction = '';

    if (index == 0) {
      direction = 'b';
    } else if (index == 1) {
      direction = 't';
    } else if (index == 2) {
      direction = 'l';
    } else if (index == 3) {
      direction = 'r';
    }

    context.command.setValue_forKey_onLayer_forPluginIdentifier(selection.objectID(), "dialogMain", selection, previewKey);
    context.command.setValue_forKey_onLayer_forPluginIdentifier(direction, "direction", selection, previewKey);
    buildPreview(context);
  }
}
function setFixed(context) {
  var i18 = Object(_common__WEBPACK_IMPORTED_MODULE_0__["_"])(context).commonPreview;

  var fx = 0;

  function chooseDialog2() {
    var settingsWindow = Object(_common__WEBPACK_IMPORTED_MODULE_0__["dialog"])(context);
    settingsWindow.addButtonWithTitle(i18.m2);
    settingsWindow.addButtonWithTitle(i18.m3);
    settingsWindow.setMessageText(i18.m10);
    var ButtonList = [i18.m11, i18.m12];
    fx = Object(_common__WEBPACK_IMPORTED_MODULE_0__["createRadioButtons"])(ButtonList, 0);
    settingsWindow.addAccessoryView(fx);
    return settingsWindow.runModal();
  }

  function chooseDialog(n) {
    var settingsWindow = Object(_common__WEBPACK_IMPORTED_MODULE_0__["dialog"])(context);
    settingsWindow.addButtonWithTitle(i18.m2);
    settingsWindow.addButtonWithTitle(i18.m3);
    settingsWindow.setMessageText(i18.m14 + n + i18.m15);
    return settingsWindow.runModal();
  }

  var setFixed_ = function setFixed_(context, selection) {
    context.command.setValue_forKey_onLayer_forPluginIdentifier(selection.objectID(), "fixedMain", selection, previewKey);
    context.command.setValue_forKey_onLayer_forPluginIdentifier(direction, "direction", selection, previewKey);
  };

  if (context.selection.length == 0) {
    return Object(_common__WEBPACK_IMPORTED_MODULE_0__["errorDialog"])(context, i18.m13);
  } else {
    var selection = context.selection[0];

    if (selection.className() == 'MSArtboardGroup') {
      return Object(_common__WEBPACK_IMPORTED_MODULE_0__["errorDialog"])(context, i18.m13);
    }

    if (!chooseDialog2()) {
      return;
    }

    fx = fx.selectedCell();
    var index = fx.tag();
    var direction = 't';

    if (index == 0) {
      direction = 't';
    } else if (index == 1) {
      direction = 'b';
    }

    var lengthD = 0;
    var saveDom = [];

    for (var i = 0; i < context.document.currentPage().children().length; i++) {
      if (encodeURIComponent(context.document.currentPage().children()[i].name()) == encodeURIComponent(selection.name())) {
        lengthD++;
        saveDom.push(context.document.currentPage().children()[i]);
      }
    }

    if (lengthD != 1 && chooseDialog(lengthD) != '1000') {
      setFixed_(context, selection);
    } else {
      for (var i = 0; i < saveDom.length; i++) {
        setFixed_(context, saveDom[i]);
      }
    }

    buildPreview(context);
  }
}
function setBacks(context) {
  var i18 = Object(_common__WEBPACK_IMPORTED_MODULE_0__["_"])(context).commonPreview;

  var setBack_ = function setBack_(context, selection) {
    context.command.setValue_forKey_onLayer_forPluginIdentifier(selection.objectID(), "backMain", selection, previewKey);
  };

  var fx = 0;

  function chooseDialog(n) {
    var settingsWindow = Object(_common__WEBPACK_IMPORTED_MODULE_0__["dialog"])(context);
    settingsWindow.addButtonWithTitle(i18.m2);
    settingsWindow.addButtonWithTitle(i18.m3);
    settingsWindow.setMessageText(i18.m14 + n + i18.m15);
    return settingsWindow.runModal();
  }

  if (context.selection.length == 0) {
    return Object(_common__WEBPACK_IMPORTED_MODULE_0__["errorDialog"])(context, i18.m10);
  } else {
    var selection = context.selection[0];

    if (selection.className() == 'MSArtboardGroup') {
      return Object(_common__WEBPACK_IMPORTED_MODULE_0__["errorDialog"])(context, i18.m10);
    }

    var lengthD = 0;
    var saveDom = [];

    for (var i = 0; i < context.document.currentPage().children().length; i++) {
      if (encodeURIComponent(context.document.currentPage().children()[i].name()) == encodeURIComponent(selection.name())) {
        lengthD++;
        saveDom.push(context.document.currentPage().children()[i]);
      }
    }

    if (lengthD != 1 && chooseDialog(lengthD) != '1000') {
      setBack_(context, selection);
    } else {
      for (var i = 0; i < saveDom.length; i++) {
        setBack_(context, saveDom[i]);
      }
    }
  }

  buildPreview(context);
}
function setNoBuild(context) {
  var i18 = Object(_common__WEBPACK_IMPORTED_MODULE_0__["_"])(context).commonPreview;

  var setNoBuild_ = function setNoBuild_(context, selection) {
    context.command.setValue_forKey_onLayer_forPluginIdentifier(selection.objectID(), "noBuildMain", selection, previewKey);
  };

  var fx = 0;

  function chooseDialog(n) {
    var settingsWindow = Object(_common__WEBPACK_IMPORTED_MODULE_0__["dialog"])(context);
    settingsWindow.addButtonWithTitle(i18.m2);
    settingsWindow.addButtonWithTitle(i18.m3);
    settingsWindow.setMessageText(i18.m14 + n + i18.m15);
    return settingsWindow.runModal();
  }

  if (context.selection.length == 0) {
    return Object(_common__WEBPACK_IMPORTED_MODULE_0__["errorDialog"])(context, i18.m10);
  } else {
    var selection = context.selection[0];

    if (selection.className() == 'MSArtboardGroup') {
      return Object(_common__WEBPACK_IMPORTED_MODULE_0__["errorDialog"])(context, i18.m10);
    }

    var lengthD = 0;
    var saveDom = [];

    for (var i = 0; i < context.document.currentPage().children().length; i++) {
      if (encodeURIComponent(context.document.currentPage().children()[i].name()) == encodeURIComponent(selection.name())) {
        lengthD++;
        saveDom.push(context.document.currentPage().children()[i]);
      }
    }

    if (lengthD != 1 && chooseDialog(lengthD) != '1000') {
      setNoBuild_(context, selection);
    } else {
      for (var i = 0; i < saveDom.length; i++) {
        setNoBuild_(context, saveDom[i]);
      }
    }
  }

  buildPreview(context);
}
function clearPreview(context) {
  var i18 = Object(_common__WEBPACK_IMPORTED_MODULE_0__["_"])(context).commonPreview;

  var domKey = ['backMain', 'fixedMain', 'dialogMain', 'indexMain', 'noBuildMain'];

  if (context.selection.length == 0) {
    return Object(_common__WEBPACK_IMPORTED_MODULE_0__["errorDialog"])(context, i18.m16);
  }

  for (var i = 0; i < context.selection.length; i++) {
    for (var k = 0; k < domKey.length; k++) {
      context.command.setValue_forKey_onLayer_forPluginIdentifier(nil, domKey[k], context.selection[i], previewKey);
    }
  }

  buildPreview(context);
  context.document.showMessage(i18.m17);
}
function hidePreview(context) {
  var connectionsGroup = getConnectionsInPage(context.document.currentPage());
  var connectionsGroup2 = getConnectionsLinkInPage(context.document.currentPage());

  if (connectionsGroup) {
    if (connectionsGroup.isVisible()) {
      connectionsGroup.setIsVisible(false);

      if (connectionsGroup2) {
        connectionsGroup2.setIsVisible(false);
      }
    } else {
      connectionsGroup.setIsVisible(true);

      if (connectionsGroup2) {
        connectionsGroup2.setIsVisible(true);
      }
    }
  }
}

/***/ })

/******/ });
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['setIndex'] = __skpm_run.bind(this, 'setIndex');
that['onRun'] = __skpm_run.bind(this, 'default');
that['setDialog'] = __skpm_run.bind(this, 'setDialog');
that['setFixed'] = __skpm_run.bind(this, 'setFixed');
that['setBacks'] = __skpm_run.bind(this, 'setBacks');
that['setNoBuild'] = __skpm_run.bind(this, 'setNoBuild');
that['clearPreview'] = __skpm_run.bind(this, 'clearPreview');
that['hidePreview'] = __skpm_run.bind(this, 'hidePreview')

//# sourceMappingURL=commonPreview.js.map