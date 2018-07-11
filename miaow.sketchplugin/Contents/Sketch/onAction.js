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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/onAction.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/onAction.js":
/*!*************************!*\
  !*** ./src/onAction.js ***!
  \*************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _toolbar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toolbar */ "./src/toolbar.js");

var selectionDom = "com.sketchplugins.wechat.selectionDom";
var selectionDom1 = "com.sketchplugins.wechat.selectionDom1";
var selectionDom2 = "com.sketchplugins.wechat.selectionDom2";
var toolbarAutoShow = "com.sketchplugins.wechat.toolbarautoshow";
var updateAutoShow = "com.sketchplugins.wechat.updateAutoShow";

var onSelectionChanged = function onSelectionChanged(context) {
  var action = context.actionContext;
  var document = action.document;
  var selection = action.newSelection;
  var count = selection.count();
  var message = '';
  var saveMessage = [];

  if (count == 1 || count == 2) {
    var oldSelection = NSUserDefaults.standardUserDefaults().objectForKey(selectionDom) || '';

    if (count == 1) {
      message = selection[0].objectID();
      context.command.setValue_forKey_onLayer_forPluginIdentifier(selection[0].objectID(), "selection1", selection[0], selectionDom1);
    } else if (count == 2) {
      for (var i = 0; i < count; i++) {
        if (oldSelection == selection[i].objectID()) {
          saveMessage.unshift(selection[i]);
        } else {
          saveMessage.push(selection[i]);
        }
      }

      message = saveMessage[0].objectID() + ',' + saveMessage[1].objectID();
    }

    NSUserDefaults.standardUserDefaults().setObject_forKey(message, selectionDom);
  }

  if (saveMessage.length == 2) {
    context.command.setValue_forKey_onLayer_forPluginIdentifier(saveMessage[0].objectID(), "selection1", saveMessage[0], selectionDom1);
    context.command.setValue_forKey_onLayer_forPluginIdentifier(saveMessage[1].objectID(), "selection2", saveMessage[1], selectionDom2);
  }
};

var onOpenDocument = function onOpenDocument(context) {
  var toolbarAuto = NSUserDefaults.standardUserDefaults().objectForKey(toolbarAutoShow) || '';

  if (toolbarAuto != 'false') {
    Object(_toolbar__WEBPACK_IMPORTED_MODULE_0__["toolbar"])(context, true);
  }
};

/***/ }),

/***/ "./src/toolbar.js":
/*!************************!*\
  !*** ./src/toolbar.js ***!
  \************************/
/*! exports provided: toolbar */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toolbar", function() { return toolbar; });
// @import 'common.js';
// @import 'flag.js';
// @import 'link.js';
// @import 'fontReplace.js';
// @import 'fontCharacters.js';
// @import 'textReplace.js';
// @import 'colorReplace.js';
// @import 'iconQ.js';
// @import 'syncUIkit.js';
// @import 'syncColor.js';
// @import 'exportSlice.js';
// @import 'codeStyle.js';
// @import 'codeColor.js';
// @import 'previewToolbar.js';
// @import 'sortingLayers.js';
function toolbar(context, auto) {
  var i18 = _(context).toolbar;

  var i18nKey = "com.sketchplugins.wechat.i18n";
  var lang = NSUserDefaults.standardUserDefaults().objectForKey(i18nKey);
  var prefix = '-' + lang.toString();
  var toolbarAutoShow = "com.sketchplugins.wechat.toolbarautoshow";
  var toolbarAuto = NSUserDefaults.standardUserDefaults().objectForKey(toolbarAutoShow) || '';
  var pluginSketch = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("library");

  function getImage(size, name) {
    var isRetinaDisplay = NSScreen.mainScreen().backingScaleFactor() > 1 ? true : false;
    var suffix = isRetinaDisplay ? '@2x' : '';
    var imageURL = pluginSketch.URLByAppendingPathComponent("toolbar").URLByAppendingPathComponent(name + suffix + '.png');
    var image = NSImage.alloc().initWithContentsOfURL(imageURL);
    return image;
  }

  function addImage(rect, name) {
    var view = NSImageView.alloc().initWithFrame(rect),
        image = getImage(rect.size, name);
    view.setImage(image);
    return view;
  }

  function addButton(rect, name, callAction) {
    var button = NSButton.alloc().initWithFrame(rect),
        image = getImage(rect.size, name);
    button.setImage(image);
    button.setBordered(false);
    button.sizeToFit();
    button.setButtonType(NSMomentaryChangeButton);
    button.setCOSJSTargetFunction(callAction);
    button.setAction("callAction:");
    return button;
  }

  var manifestPath = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("manifest.json").path(),
      manifest = NSJSONSerialization.JSONObjectWithData_options_error(NSData.dataWithContentsOfFile(manifestPath), NSJSONReadingMutableContainers, nil),
      commands = manifest.commands;
  var obj = [];

  for (var i = 0; i < commands.length; i++) {
    if (commands[i].istool == 'true') {
      obj.push(commands[i].identifier);
    }
  }

  var identifier = "com.sketchplugins.wechat.toolbar",
      threadDictionary = NSThread.mainThread().threadDictionary(),
      Toolbar = threadDictionary[identifier];

  if (!Toolbar) {
    coscript.setShouldKeepAround(true);
    Toolbar = NSPanel.alloc().init();
    Toolbar.setStyleMask(NSTitledWindowMask + NSFullSizeContentViewWindowMask);
    Toolbar.setBackgroundColor(NSColor.colorWithRed_green_blue_alpha(1, 1, 1, 1));
    Toolbar.setTitleVisibility(NSWindowTitleHidden);
    Toolbar.setTitlebarAppearsTransparent(true);
    var toolbarwidth = obj.length * 56 + 65;
    var locationx = 0;
    locationx = NSScreen.mainScreen().frame().size.height - 162;
    Toolbar.setFrame_display(NSMakeRect(285, locationx, toolbarwidth, 85), false);
    Toolbar.setMovableByWindowBackground(true);
    Toolbar.becomeKeyWindow();
    Toolbar.setLevel(NSFloatingWindowLevel);
    obj = obj.join(',');
    var contentView = Toolbar.contentView();
    var closeButton = addButton(NSMakeRect(20, 53, 11, 11), "close", function (sender) {
      coscript.setShouldKeepAround(false);
      threadDictionary.removeObjectForKey(identifier);
      Toolbar.close();

      if (toolbarAuto != 'false') {
        var settingsWindow = dialog(context);
        settingsWindow.addButtonWithTitle(i18.m1);
        settingsWindow.addButtonWithTitle(i18.m2);
        settingsWindow.setMessageText(i18.m3);
        settingsWindow.addTextLabelWithValue(i18.m4);
        settingsWindow.addTextLabelWithValue(i18.m5);
        var response = settingsWindow.runModal();

        if (response == "1000") {
          NSUserDefaults.standardUserDefaults().setObject_forKey('true', toolbarAutoShow);
        } else {
          NSUserDefaults.standardUserDefaults().setObject_forKey('false', toolbarAutoShow);
        }
      }
    });
    contentView.addSubview(closeButton); // var wikiButton = addButton(NSMakeRect(60, 40, 15, 15), "wiki",
    //     function (sender) {
    //         openUrlInBrowser('https://github.com/weixin/wesketch/wiki');
    //     });
    // contentView.addSubview(wikiButton);

    var miaowButton = addButton(NSMakeRect(0, 11, 120, 66), "miaow", function (sender) {
      openUrlInBrowser('https://github.com/weixin/wesketch');
    });
    contentView.addSubview(miaowButton);
    var xlocation = 50;

    if (obj.indexOf('link') > -1) {
      var linkButton = addButton(NSMakeRect(xlocation + 3, 19, 46, 46), "link" + prefix, function (sender) {
        var nowcontext = uploadContext(context);
        getLink(nowcontext);
      });
      contentView.addSubview(linkButton);
      xlocation = xlocation + 56;
    }

    if (obj.indexOf('flag') > -1) {
      var flagButton = addButton(NSMakeRect(xlocation + 3, 19, 46, 46), "flag" + prefix, function (sender) {
        var nowcontext = uploadContext(context);
        getFlag(nowcontext);
      });
      contentView.addSubview(flagButton);
      xlocation = xlocation + 56;
    }

    if (obj.indexOf('sortingLayers') > -1) {
      var flagButton = addButton(NSMakeRect(xlocation + 3, 19, 46, 46), "sorting" + prefix, function (sender) {
        var nowcontext = uploadContext(context);
        sortingLayers(nowcontext);
      });
      contentView.addSubview(flagButton);
      xlocation = xlocation + 56;
    }

    if (obj.indexOf('iconQ') > -1) {
      var iconButton = addButton(NSMakeRect(xlocation + 3, 19, 46, 46), "icon" + prefix, function (sender) {
        var nowcontext = uploadContext(context);
        iconQ(nowcontext);
      });
      contentView.addSubview(iconButton);
      xlocation = xlocation + 56;
    }

    if (obj.indexOf('syncuikit') > -1) {
      var syncuiButton = addButton(NSMakeRect(xlocation + 3, 19, 46, 46), "syncui" + prefix, function (sender) {
        var nowcontext = uploadContext(context);
        syncUIkit(nowcontext);
      });
      contentView.addSubview(syncuiButton);
      xlocation = xlocation + 56;
    }

    if (obj.indexOf('synccolor') > -1) {
      var synccolorButton = addButton(NSMakeRect(xlocation + 3, 19, 46, 46), "synccolor" + prefix, function (sender) {
        var nowcontext = uploadContext(context);
        syncColor(nowcontext);
      });
      contentView.addSubview(synccolorButton);
      xlocation = xlocation + 56;
    }

    if (obj.indexOf('textReplace') > -1) {
      var textButton = addButton(NSMakeRect(xlocation + 3, 19, 46, 46), "text" + prefix, function (sender) {
        var nowcontext = uploadContext(context);
        textReplace(nowcontext);
      });
      contentView.addSubview(textButton);
      xlocation = xlocation + 56;
    }

    if (obj.indexOf('colorReplace') > -1) {
      var colorButton = addButton(NSMakeRect(xlocation + 3, 19, 46, 46), "color" + prefix, function (sender) {
        var nowcontext = uploadContext(context);
        colorReplace(nowcontext);
      });
      contentView.addSubview(colorButton);
      xlocation = xlocation + 56;
    }

    if (obj.indexOf('fontReplace') > -1) {
      var fontButton = addButton(NSMakeRect(xlocation + 3, 19, 46, 46), "font" + prefix, function (sender) {
        var nowcontext = uploadContext(context);
        fontReplace(nowcontext);
      });
      contentView.addSubview(fontButton);
      xlocation = xlocation + 56;
    }

    if (obj.indexOf('fontCharacters') > -1) {
      var fontButton = addButton(NSMakeRect(xlocation + 3, 19, 47, 46), "fontCharacters" + prefix, function (sender) {
        var nowcontext = uploadContext(context);
        fontCharacters(nowcontext);
      });
      contentView.addSubview(fontButton);
      xlocation = xlocation + 55;
    }

    if (obj.indexOf('exportSlice') > -1) {
      var cutButton = addButton(NSMakeRect(xlocation + 3, 19, 46, 46), "cut" + prefix, function (sender) {
        var nowcontext = uploadContext(context);
        exportSlice(nowcontext);
      });
      contentView.addSubview(cutButton);
      xlocation = xlocation + 56;
    }

    if (obj.indexOf('codeColor') > -1) {
      var codecolorButton = addButton(NSMakeRect(xlocation + 3, 19, 46, 46), "codecolor" + prefix, function (sender) {
        var nowcontext = uploadContext(context);
        codeC(nowcontext);
      });
      contentView.addSubview(codecolorButton);
      xlocation = xlocation + 56;
    }

    if (obj.indexOf('codeStyle') > -1) {
      var codestyleButton = addButton(NSMakeRect(xlocation + 3, 19, 46, 46), "codestyle" + prefix, function (sender) {
        var nowcontext = uploadContext(context);
        codeS(nowcontext);
      });
      contentView.addSubview(codestyleButton);
      xlocation = xlocation + 56;
    }

    if (obj.indexOf('previewToolbar') > -1) {
      var previewToolbarButton = addButton(NSMakeRect(xlocation + 3, 19, 46, 46), "preview" + prefix, function (sender) {
        var nowcontext = uploadContext(context);
        previewToolbar(nowcontext);
      });
      contentView.addSubview(previewToolbarButton);
      xlocation = xlocation + 56;
    }

    threadDictionary[identifier] = Toolbar;
    Toolbar.makeKeyAndOrderFront(nil);
    var ga = new Analytics(context);
    if (ga) ga.sendEvent('toolbar', 'open');
  } else if (Toolbar && !auto) {
    threadDictionary.removeObjectForKey(identifier);
    Toolbar.close();
  }
}

var onRunToolBar = function onRunToolBar(context) {
  toolbar(context);
};

/***/ })

/******/ });
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['onOpenDocument'] = __skpm_run.bind(this, 'onOpenDocument');
that['onRun'] = __skpm_run.bind(this, 'default')

//# sourceMappingURL=onAction.js.map