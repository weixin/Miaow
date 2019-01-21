const UI = require("sketch/ui");
const sketchDom = require("sketch/dom");
const Library = require('sketch/dom').Library;

let pageLayers = [];
let selectedArtboard;
let previewOnline;

// exportTo
const exportTo = (context, fileType, fileMarkup) => {
  
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

  const uiKitUrlKey = "com.sketchplugins.wechat.newuikiturl";
  const colorUrlKey = "com.sketchplugins.wechat.colorurl";

  const document = sketchDom.fromNative(context.document);
  const page = document.selectedPage;
  pageLayers = page.layers;

  const getConfig = (json, content) => {
      var manifestPath = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent(json + ".json").path();
      return NSJSONSerialization.JSONObjectWithData_options_error(NSData.dataWithContentsOfFile(manifestPath), NSJSONReadingMutableContainers, nil);
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
  }

  const getUIKIT = content => {
    var List = NSUserDefaults.standardUserDefaults().objectForKey(uiKitUrlKey) || getConfig('config', context).UIKIT;
    return List;
  }
  var uikitList = getUIKIT(context);


  
  // create save file dialog
  const runSaveFileDialog = () => {
    // create instance
    const savePanel = NSSavePanel.savePanel();
    savePanel.allowedFileTypes = [`${fileType}`];

    // launch dialog
    const resultSaveDialog = savePanel.runModal();

    // result
    if (resultSaveDialog == NSFileHandlingPanelOKButton) {
      const file = `${savePanel.nameFieldStringValue()}.${fileType}`;
      const directoryPath = savePanel
        .URL()
        .path()
        .replace(file, ""); // remove file to get only directory
      var library = Library.getLibraryForDocumentAtPath(
        '/Users/doubleluo/Desktop/WeChat.sketch'
      )
      try {
        log(directoryPath);
      } catch (err) {
        UI.alert("❌", `Something went wrong - ${err}.`);
      }
    }
  };

  function createRadioButtons(options,selected,format,x,y) {
    var rows = options.length,
      columns = 1,
      matrixWidth = 300,
      cellWidth = matrixWidth,
      x = (x) ? x : 0,
      y = (y) ? y : 0;

    if (format && format != 0) {
      rows = options.length / 2;
      columns = 2;
      matrixWidth = 300;
      cellWidth = matrixWidth / columns;
    }

    var buttonCell = NSButtonCell.alloc().init();

    buttonCell.setButtonType(NSRadioButton);

    var matrix = NSMatrix.alloc().initWithFrame_mode_prototype_numberOfRows_numberOfColumns(
      NSMakeRect(x,y,matrixWidth,rows*20),
      NSRadioModeMatrix,
      buttonCell,
      rows,
      columns
    );

    matrix.setCellSize(NSMakeSize(cellWidth,20));

    options.forEach(function(option,i){
      matrix.cells().objectAtIndex(i).setTitle(option);
      matrix.cells().objectAtIndex(i).setTag(i);
    })

    matrix.selectCellAtRow_column(selected,0);

    return matrix;
  }

  //create sketch export modal icon
  // const createPluginModalIcon = () => {
  //   const exportModalIconPath = context.plugin
  //     .urlForResourceNamed("icon.png")
  //     .path();
  //   return NSImage.alloc().initByReferencingFile(exportModalIconPath);
  // };

  // create export modal
  const runExportModal = () => {
    const exportModal = COSAlertWindow.new();
    exportModal.setMessageText(`Export to ${fileMarkup}`);
    // exportModal.setIcon(createPluginModalIcon());

    // adding the main cta's
    exportModal.addButtonWithTitle("Ok");
    exportModal.addButtonWithTitle("Cancel");

    // Creating the view
    const viewWidth = 300;
    const viewHeight = 130;
    const view = NSView.alloc().initWithFrame(
      NSMakeRect(0, 0, viewWidth, viewHeight)
    );
    exportModal.addAccessoryView(view);

    // const dropdownArtboards = NSPopUpButton.alloc().initWithFrame(
    //   NSMakeRect(0, 80, viewWidth / 2, 22)
    // );

    const dropdownArtboardLabel = NSTextField.alloc().initWithFrame(
      NSMakeRect(0, 110, viewWidth, 22)
    );
    dropdownArtboardLabel.setStringValue("Select an artboard");
    dropdownArtboardLabel.editable = false;
    dropdownArtboardLabel.selectable = false;
    dropdownArtboardLabel.bezeled = false;
    dropdownArtboardLabel.drawsBackground = false;


    var scaleOptionsMatrix;
    var ButtonList = [];
      context.document.showMessage('ok1');

    uikitList.forEach(function(uikiti){
      if (uikiti.title != '' && uikiti.url != '') {
        var key = uikiti.title;
        ButtonList.push(key);
      }
    })

    // }
    scaleOptionsMatrix = createRadioButtons(ButtonList, ButtonList[0]);


    // uikit.map(k => {
    //   uikitButton.addItemWithTitle(k.title);
    // });

    // Create Checkbox for Preview
    const checkboxPreview = NSButton.alloc().initWithFrame(
      NSMakeRect(0, 20, viewWidth, 22)
    );

    view.addSubview(dropdownArtboardLabel);
    view.addSubview(scaleOptionsMatrix);

    const resultExportModal = exportModal.runModal();
    if (resultExportModal != "1000") {
      return;
    } else {
      var uikit = scaleOptionsMatrix.selectedCell();
      context.document.showMessage(uikit);

      var index = uikit.tag();
      context.document.showMessage(index);
      
      var data = networkRequest([uikitList[index].url]);
      var save = NSSavePanel.savePanel();
      var databasePath = save.URL().path() + '.sketch';
      data = NSData.alloc().initWithData(data);
      data.writeToFile_atomically(databasePath, true);

      var library = Library.getLibraryForDocumentAtPath(databasePath);

      context.document.showMessage('导入成功，请在 Symbol 中使用您的 Library');
    }
  };

  // parse content either for md or json
  const parseContent = async (pageLayers, artboard, directoryPath, file) => {
    const content = await getParsedContent(
      pageLayers,
      artboard,
      directoryPath,
      fileType
    );
    await saveContentToFile(directoryPath, file, content);
    UI.alert(
      "Export complete.",
      `🎉🎉 ${artboard} was successfully exported to ${fileMarkup}.`
    );
    return content;
  };

  // save content to file
  const saveContentToFile = (path, file, content) => {
    fs.writeFileSync(`${path}${file}`, content, "utf8");
  };


  
  runExportModal();
};

export default exportTo;
