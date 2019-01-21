var that = this;
function __skpm_run (key, context) {
  that.context = context;

var exports =
/******/ (function(modules) { // webpackBootstrap
/******/  // The module cache
/******/  var installedModules = {};
/******/
/******/  // The require function
/******/  function __webpack_require__(moduleId) {
/******/
/******/    // Check if module is in cache
/******/    if(installedModules[moduleId]) {
/******/      return installedModules[moduleId].exports;
/******/    }
/******/    // Create a new module (and put it into the cache)
/******/    var module = installedModules[moduleId] = {
/******/      i: moduleId,
/******/      l: false,
/******/      exports: {}
/******/    };
/******/
/******/    // Execute the module function
/******/    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/    // Flag the module as loaded
/******/    module.l = true;
/******/
/******/    // Return the exports of the module
/******/    return module.exports;
/******/  }
/******/
/******/
/******/  // expose the modules object (__webpack_modules__)
/******/  __webpack_require__.m = modules;
/******/
/******/  // expose the module cache
/******/  __webpack_require__.c = installedModules;
/******/
/******/  // define getter function for harmony exports
/******/  __webpack_require__.d = function(exports, name, getter) {
/******/    if(!__webpack_require__.o(exports, name)) {
/******/      Object.defineProperty(exports, name, {
/******/        configurable: false,
/******/        enumerable: true,
/******/        get: getter
/******/      });
/******/    }
/******/  };
/******/
/******/  // getDefaultExport function for compatibility with non-harmony modules
/******/  __webpack_require__.n = function(module) {
/******/    var getter = module && module.__esModule ?
/******/      function getDefault() { return module['default']; } :
/******/      function getModuleExports() { return module; };
/******/    __webpack_require__.d(getter, 'a', getter);
/******/    return getter;
/******/  };
/******/
/******/  // Object.prototype.hasOwnProperty.call
/******/  __webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/  // __webpack_public_path__
/******/  __webpack_require__.p = "";
/******/
/******/  // Load entry module and return exports
/******/  return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("sketch/dom");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var UI = __webpack_require__(2);
var sketchDom = __webpack_require__(0);
var Library = __webpack_require__(0).Library;

var pageLayers = [];
var selectedArtboard = void 0;
var previewOnline = void 0;

// exportTo
var syncUIKit = function syncUIKit(context, fileType, fileMarkup) {

  // var _ = function (context) {
  //     var i18nKey = "com.sketchplugins.wechat.i18n";
  //     var lang = NSUserDefaults.standardUserDefaults().objectForKey(i18nKey);
  //     if (lang == undefined) {
  //         var macOSVersion = NSDictionary.dictionaryWithContentsOfFile("/System/Library/CoreServices/SystemVersion.plist").objectForKey("ProductVersion") + "";
  //         lang = NSUserDefaults.standardUserDefaults().objectForKey("AppleLanguages").objectAtIndex(0);
  //         lang = (macOSVersion >= "10.12") ? lang.split("-").slice(0, -1).join("-") : lang;
  //         if (lang.indexOf('zh') > -1) {
  //             lang = 'zhCN';
  //         } else {
  //             lang = 'enUS';
  //         }
  //         NSUserDefaults.standardUserDefaults().setObject_forKey(lang, i18nKey);
  //     }
  //     if (encodeURIComponent(lang.toString()).length != 4) {
  //         lang = 'enUS';
  //         NSUserDefaults.standardUserDefaults().setObject_forKey(lang, i18nKey);
  //     }

  //     function get_(json, context) {
  //         var manifestPath = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("i18n").URLByAppendingPathComponent(json + ".json").path();
  //         var jsonData = NSData.dataWithContentsOfFile(manifestPath);
  //         jsonData = NSString.alloc().initWithData_encoding(jsonData,NSUTF8StringEncoding);
  //         return JSON.parse(jsonData);
  //     }
  //     var i18Content = {};
  //     i18Content = get_(lang, context);

  //     return i18Content;
  // };

  // const i18 = _(context).syncUIkit;

  // context.document.showMessage(i18.m1);

  var uiKitUrlKey = "com.sketchplugins.wechat.newuikiturl";
  var colorUrlKey = "com.sketchplugins.wechat.colorurl";

  var document = sketchDom.fromNative(context.document);
  var page = document.selectedPage;
  pageLayers = page.layers;

  var getConfig = function getConfig(json, content) {
    var manifestPath = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent(json + ".json").path();
    return NSJSONSerialization.JSONObjectWithData_options_error(NSData.dataWithContentsOfFile(manifestPath), NSJSONReadingMutableContainers, nil);
  };

  function networkRequest(args) {
    var task = NSTask.alloc().init();
    task.setLaunchPath("/usr/bin/curl");
    task.setArguments(args);
    var outputPipe = NSPipe.pipe();
    task.setStandardOutput(outputPipe);
    task.launch();
    var responseData = outputPipe.fileHandleForReading().readDataToEndOfFile();
    return responseData;
  }

  var getUIKIT = function getUIKIT(content) {
    var List = NSUserDefaults.standardUserDefaults().objectForKey(uiKitUrlKey) || getConfig('config', context).UIKIT;
    return List;
  };
  var uikitList = getUIKIT(context);

  function createRadioButtons(options, selected, format, x, y) {
    var rows = options.length,
        columns = 1,
        matrixWidth = 300,
        cellWidth = matrixWidth,
        x = x ? x : 0,
        y = y ? y : 0;

    if (format && format != 0) {
      rows = options.length / 2;
      columns = 2;
      matrixWidth = 300;
      cellWidth = matrixWidth / columns;
    }

    var buttonCell = NSButtonCell.alloc().init();

    buttonCell.setButtonType(NSRadioButton);

    var matrix = NSMatrix.alloc().initWithFrame_mode_prototype_numberOfRows_numberOfColumns(NSMakeRect(x, y, matrixWidth, rows * 20), NSRadioModeMatrix, buttonCell, rows, columns);

    matrix.setCellSize(NSMakeSize(cellWidth, 20));

    options.forEach(function (option, i) {
      matrix.cells().objectAtIndex(i).setTitle(option);
      matrix.cells().objectAtIndex(i).setTag(i);
    });

    matrix.selectCellAtRow_column(selected, 0);

    return matrix;
  }

  var runExportModal = function runExportModal() {
    var exportModal = COSAlertWindow["new"]();
    var iconImage = NSImage.alloc().initByReferencingFile(context.plugin.urlForResourceNamed("icon.png").path());
    if (iconImage) {
        exportModal.setIcon(iconImage);
    }
    exportModal.setMessageText("\u8BF7\u9009\u62E9\u8981\u5BFC\u5165\u7684 Library");
    exportModal.addButtonWithTitle("确认");
    exportModal.addButtonWithTitle("取消");

    var viewWidth = 300;
    var viewHeight = 20 * uikitList.length;
    var view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, viewWidth, viewHeight));
    exportModal.addAccessoryView(view);

    var scaleOptionsMatrix;
    var ButtonList = [];

    uikitList.forEach(function (uikiti) {
      if (uikiti.title != '' && uikiti.url != '') {
        var key = uikiti.title;
        ButtonList.push(key);
      }
    });

    scaleOptionsMatrix = createRadioButtons(ButtonList, ButtonList[0]);

    var checkboxPreview = NSButton.alloc().initWithFrame(NSMakeRect(0, 20, viewWidth, 22));

    view.addSubview(scaleOptionsMatrix);

    var resultExportModal = exportModal.runModal();
    if (resultExportModal != "1000") {
      return;
    } else {
      var uikit = scaleOptionsMatrix.selectedCell();
      context.document.showMessage(uikit);

      var index = uikit.tag();
      context.document.showMessage(index);

      var data = networkRequest([uikitList[index].url]);
      var save = NSSavePanel.savePanel();
      var databasePath = (save.URL().path() + '.sketch').replace('Untitled', 'WeChat');
      data = NSData.alloc().initWithData(data);
      data.writeToFile_atomically(databasePath, true);

      var library = Library.getLibraryForDocumentAtPath(databasePath);

      context.document.showMessage('导入成功，请在 Symbol 中使用您的 Library');
    }
  };

  var parseContent = async function parseContent(pageLayers, artboard, directoryPath, file) {
    var content = await getParsedContent(pageLayers, artboard, directoryPath, fileType);
    await saveContentToFile(directoryPath, file, content);
    UI.alert("Export complete.", "\uD83C\uDF89\uD83C\uDF89 " + String(artboard) + " was successfully exported to " + String(fileMarkup) + ".");
    return content;
  };

  // save content to file
  var saveContentToFile = function saveContentToFile(path, file, content) {
    fs.writeFileSync("" + String(path) + String(file), content, "utf8");
  };

  runExportModal();
};

exports["default"] = syncUIKit;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("sketch/ui");

/***/ })
/******/ ]);
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['onRun'] = __skpm_run.bind(this, 'default')
var newSyncUikit = __skpm_run.bind(this, 'default')