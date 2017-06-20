var onRun = function (context) {
    var doc = context.document;
    var doctype = 0;
    var page = doc.currentPage();
    var switchOfSearch = 0;
    var includedFontName = [];
    var selectingFontName = [];
    var userInterface;
    var SELECT, READY_TO_SEARCH, CANCELLED, NOT_READY;
    var fontCheck={};
    var accessoryList = null;
    var scaleOptionsMatrix = null;
    var options = [[[NSFontManager sharedFontManager] availableFontFamilies]][0];
    var searchList = [];
    var searchButtonType = 1;
    var fontRpleaceCount = 0;

    featureSearchFontName();
    userInterfaceLoop();


    function userInterfaceLoop() {
        var modal = createUserInterface();
        uiResponse = processButtonClick(modal, modal.runModal());

    }


    function createUserInterface() {
        if (includedFontName.length == 0) {
            doc.showMessage("本页面没有任何可以选择的字体");
        } else {
            userInterface = COSAlertWindow.new();
            userInterface.setMessageText('字体批量替换');
            userInterface.addTextLabelWithValue("请选择页面中需要替换的字体：");

            var k = 0;
            for (var i = 0; i < includedFontName.length; i++) {
                var checkbox = NSButton.alloc().initWithFrame(NSMakeRect( 0, i * 24, 300, 18 ));
                checkbox.setButtonType(NSSwitchButton);
                checkbox.setTitle(includedFontName[i]);
                checkbox.setState(false);
                userInterface.addAccessoryView( checkbox );
                k = i;
            }
            var separator = NSBox.alloc().initWithFrame(NSMakeRect(0,0,300,10));
            separator.setBoxType(2);
            userInterface.addAccessoryView(separator);

            userInterface.addTextLabelWithValue("替换为：");

            var accessoryView = NSView.alloc().initWithFrame(NSMakeRect(0.0, k*24 + 40, 300.0, 30))

            accessoryList = NSComboBox.alloc().initWithFrame(NSMakeRect(0,0,230,25));
            accessoryList.addItemsWithObjectValues(options);
            accessoryView.addSubview(accessoryList);

            var button = [[NSButton alloc] initWithFrame:NSMakeRect(240,-3,60,30)];
            [button setButtonType:2];
            button.bezelStyle = 1;
            button.title = '搜索';
            [button setCOSJSTargetFunction:function(sender) {
                 if(searchButtonType == 1){
                    button.title = '重置';
                    var value = accessoryList.objectValue().toLocaleLowerCase();
                    searchButtonType = 2;
                    searchList = [];
                    for(var i = 0;i<options.length;i++){
                        if(options[i].toLocaleLowerCase().indexOf(value) > -1){
                            searchList.push(options[i]);
                        }
                    }
                    accessoryList.removeAllItems();
                    accessoryList.addItemsWithObjectValues(searchList);
                    accessoryList.selectItemAtIndex(0);

                 }else{
                    searchButtonType = 1;
                    button.title = '搜索';
                    accessoryList.removeAllItems();
                    accessoryList.addItemsWithObjectValues(options);

                 }
            }];
            accessoryView.addSubview(button);
            userInterface.addAccessoryView(accessoryView);


            var separator = NSBox.alloc().initWithFrame(NSMakeRect(0,0,300,10));
            separator.setBoxType(2);
            userInterface.addAccessoryView(separator);

            userInterface.addTextLabelWithValue("生效范围：");
            var scaleOptions = [1, 2];
            var numOptions = scaleOptions.length;
            var exportScale = 1;
            var buttonCell = NSButtonCell.new();
            buttonCell.setButtonType(NSRadioButton);

            scaleOptionsMatrix = NSMatrix.alloc().initWithFrame_mode_prototype_numberOfRows_numberOfColumns(NSMakeRect(0, 0, 300, 22), NSRadioModeMatrix, buttonCell, 1, numOptions);
            scaleOptionsMatrix.setAutorecalculatesCellSize(true);
            scaleOptionsMatrix.setIntercellSpacing(NSMakeSize(10,0));
            var cells = scaleOptionsMatrix.cells();
            cells.objectAtIndex(0).setTitle('全文件');
            cells.objectAtIndex(1).setTitle('选中的 Page');
            var scaleOption;

            var exportOptionsView = NSView.alloc().initWithFrame(NSMakeRect(0,0,300,30));
            exportOptionsView.addSubview(scaleOptionsMatrix);
            userInterface.addAccessoryView(exportOptionsView);

            var separator = NSBox.alloc().initWithFrame(NSMakeRect(0,0,300,10));
            separator.setBoxType(2);
            userInterface.addAccessoryView(separator);


            userInterface.addButtonWithTitle('确定');
            userInterface.addButtonWithTitle('取消');
            return userInterface;
        }
    }


    function processButtonClick(modal, buttonClick) {

        var result;

        if (buttonClick == '1000') {
            page.deselectAllLayers()

            for (var i = 0; i < includedFontName.length; i++) {
                if ([[[modal viewAtIndex: i+1] selectedCell] state] == true) {
                    selectingFontName.push([[[modal viewAtIndex: i+1] selectedCell] title]);
                }
            }

            featureSelectSpecificFontTextLayer();

            NSApp.displayDialog("字体批量替换成功"); 

        }
    }


    function featureSearchFontName () {
        switchOfSearch = 1;
        searchInLayer(doc);
        includedFontName.sort();
    }


    function featureSelectSpecificFontTextLayer () {
        if(scaleOptionsMatrix.selectedCell().title() == '全文件'){
            doctype = 0;
        }else{
            doctype = 1;
        }
        switchOfSearch = 2;
        if(doctype == 0){
            searchInLayer(doc);
        }else{
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
                var documentPage = [documentPages objectAtIndex:i];
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
        var tempFontName = layer.attributedString().fontNames().toString().replace('{(','').replace(')}','').replace(/\n/g,'').replace(/\u0022/g,'').split(',');
        for(var z=0;z<tempFontName.length;z++){
            var fontName = tempFontName[z];                 
            if (!fontCheck[fontName]){
                 fontCheck[fontName] = true;
                 includedFontName.push(fontName);
            }
        }
    }


    function selectTextLayer(layer) {
        for (var i = 0; i < selectingFontName.length; i++) {
            if (layer.attributedString().fontNames().toString().indexOf(selectingFontName[i].replace(/\s+/g,"")) != -1) {
                replaceFont(layer,accessoryList.objectValue());
            }
        }
    }

    function replaceFont(textLayer,text){
        fontRpleaceCount ++;
        var fontfamily = [NSFont fontWithName:text size:0];
        var fontSize = textLayer.fontSize();
        textLayer.setFont(fontfamily);
        textLayer.setFontSize(fontSize);
        textLayer.adjustFrameToFit();
    }
    
}

