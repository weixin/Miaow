@import "common.js"

function fontReplace(context) {
    var i18 = _(context).fontReplace;

    var doc = context.document;
    var doctype = 0;
    var page = doc.currentPage();
    var switchOfSearch = 0;
    var includedFontName = [];
    var selectingFontName = [];
    var userInterface;
    var SELECT, READY_TO_SEARCH, CANCELLED, NOT_READY;
    var fontCheck = {};
    var accessoryList = null;
    var scaleOptionsMatrix = null;
    var options = [[[NSFontManager sharedFontManager] availableFontFamilies]][0];
    var searchList = [];
    var searchButtonType = 1;
    var fontRpleaceCount = 0;
    var replaceCount = 0;

    featureSearchFontName();
    userInterfaceLoop();


    function userInterfaceLoop() {
        var modal = createUserInterface();
        if (modal) {
            uiResponse = processButtonClick(modal, modal.runModal());
        }

    }


    function createUserInterface() {
        if (includedFontName.length == 0) {
            doc.showMessage(i18.m1);
            return false;
        } else {
            userInterface = dialog(context);
            userInterface.setMessageText(i18.m2);
            userInterface.addTextLabelWithValue(i18.m3 + "：");

            var k = 0;
            for (var i = 0; i < includedFontName.length; i++) {
                var checkbox = NSButton.alloc().initWithFrame(NSMakeRect(0, i * 24, 300, 18));
                checkbox.setButtonType(NSSwitchButton);
                checkbox.setTitle(includedFontName[i]);
                checkbox.setState(false);
                userInterface.addAccessoryView(checkbox);
                k = i;
            }
            var separator = NSBox.alloc().initWithFrame(NSMakeRect(0, 0, 300, 10));
            separator.setBoxType(2);
            userInterface.addAccessoryView(separator);

            userInterface.addTextLabelWithValue(i18.m4 + "：");

            var accessoryView = NSView.alloc().initWithFrame(NSMakeRect(0.0, k * 24 + 40, 300.0, 30))

            accessoryList = NSComboBox.alloc().initWithFrame(NSMakeRect(0, 0, 200, 25));
            accessoryList.addItemsWithObjectValues(options);
            accessoryView.addSubview(accessoryList);

            var button = [[NSButton alloc] initWithFrame: NSMakeRect(220, -3, 80, 30)];
            [button setButtonType: 2];
            button.bezelStyle = 1;
            button.title = i18.m5;
            [button setCOSJSTargetFunction: function (sender) {
                if (searchButtonType == 1) {
                    button.title = i18.m6;
                    var value = accessoryList.objectValue().toLocaleLowerCase();
                    searchButtonType = 2;
                    searchList = [];
                    for (var i = 0; i < options.length; i++) {
                        if (options[i].toLocaleLowerCase().indexOf(value) > -1) {
                            searchList.push(options[i]);
                        }
                    }
                    accessoryList.removeAllItems();
                    accessoryList.addItemsWithObjectValues(searchList);
                    accessoryList.selectItemAtIndex(0);

                } else {
                    searchButtonType = 1;
                    button.title = i18.m7;
                    accessoryList.removeAllItems();
                    accessoryList.addItemsWithObjectValues(options);

                }
            }];
            accessoryView.addSubview(button);
            userInterface.addAccessoryView(accessoryView);


            var separator = NSBox.alloc().initWithFrame(NSMakeRect(0, 0, 300, 10));
            separator.setBoxType(2);
            userInterface.addAccessoryView(separator);

            userInterface.addTextLabelWithValue(i18.m8 + "：");
            var scaleOptions = [1, 2];
            var numOptions = scaleOptions.length;
            var exportScale = 1;
            var buttonCell = NSButtonCell.new();
            buttonCell.setButtonType(NSRadioButton);

            scaleOptionsMatrix = NSMatrix.alloc().initWithFrame_mode_prototype_numberOfRows_numberOfColumns(NSMakeRect(0, 0, 300, 22), NSRadioModeMatrix, buttonCell, 1, numOptions);
            scaleOptionsMatrix.setAutorecalculatesCellSize(true);
            scaleOptionsMatrix.setIntercellSpacing(NSMakeSize(10, 0));
            var cells = scaleOptionsMatrix.cells();
            cells.objectAtIndex(0).setTitle(i18.m9);
            cells.objectAtIndex(1).setTitle(i18.m10);
            var scaleOption;

            var exportOptionsView = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 300, 30));
            exportOptionsView.addSubview(scaleOptionsMatrix);
            userInterface.addAccessoryView(exportOptionsView);

            var separator = NSBox.alloc().initWithFrame(NSMakeRect(0, 0, 300, 10));
            separator.setBoxType(2);
            userInterface.addAccessoryView(separator);


            userInterface.addButtonWithTitle(i18.m11);
            userInterface.addButtonWithTitle(i18.m12);
            return userInterface;
        }
    }


    function processButtonClick(modal, buttonClick) {

        var result;

        if (buttonClick == '1000') {

            for (var i = 0; i < includedFontName.length; i++) {
                if ([[[modal viewAtIndex: i + 1] selectedCell] state] == true) {
                    replaceCount++;
                    selectingFontName.push([[[modal viewAtIndex: i + 1] selectedCell] title]);
                }
            }

            featureSelectSpecificFontTextLayer();

            context.document.showMessage(i18.m13 + "，" + fontRpleaceCount + i18.m14);

        }
    }


    function featureSearchFontName() {
        switchOfSearch = 1;
        searchInLayer(doc);
        includedFontName.sort();
    }


    function featureSelectSpecificFontTextLayer() {
        if (scaleOptionsMatrix.selectedCell().title() == i18.m9) {
            doctype = 0;
        } else {
            doctype = 1;
        }
        switchOfSearch = 2;
        if (doctype == 0) {
            searchInLayer(doc);
        } else {
            searchInLayer(page);
        }
    }


    function searchInLayer(layer) {
        switch ([layer class]) {

            case MSTextLayer:
                if (switchOfSearch == 1) {
                    showFontName(layer);
                } else if (switchOfSearch == 2) {
                    selectTextLayer(layer);
                }
                break;

            case MSDocument:
                var documentPages = [layer pages];
                for (var i = 0; i < [documentPages count]; i++) {
                    var documentPage = [documentPages objectAtIndex: i];
                    searchInLayer(documentPage);
                }
                break;

            case MSPage:
            case MSLayerGroup:
            case MSSymbolMaster:
            case MSArtboardGroup:
                var sublayers = [layer layers];
                for (var i = 0; i < [sublayers count]; i++) {
                    var sublayer = [sublayers objectAtIndex: i];
                    searchInLayer(sublayer);
                }
                break;
        }
    }


    function showFontName(layer) {
        var tempFontName = layer.attributedString().fontNames().toString().replace('{(', '').replace(')}', '').replace(/\n/g, '').replace(/\u0022/g, '').split(',');
        for (var z = 0; z < tempFontName.length; z++) {
            var fontName = tempFontName[z];
            if (!fontCheck[fontName]) {
                fontCheck[fontName] = true;
                includedFontName.push(fontName);
            }
        }
    }


    function selectTextLayer(layer) {
        for (var i = 0; i < selectingFontName.length; i++) {
            if (layer.attributedString().fontNames().toString().indexOf(selectingFontName[i].replace(/\s+/g, "")) != -1) {
                replaceFont(layer, accessoryList.objectValue());
            }
        }
    }

    function replaceFont(textLayer, text) {
        fontRpleaceCount++;
        var fontfamily = [NSFont fontWithName: text size: 0];
        var fontSize = textLayer.fontSize();
        textLayer.setFont(fontfamily);
        textLayer.setFontSize(fontSize);
        textLayer.adjustFrameToFit();
    }
    var ga = new Analytics(context);
    if (ga) ga.sendEvent('fontReplace', 'open');
}

var onRun = function (context) {
    fontReplace(context);
}