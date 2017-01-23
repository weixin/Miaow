@import "common.js"

var onRun = function (context) {
    var textToFind = '',textToReplace = '';
    var textToFind2;
    var selection = context.selection;
    var document = context.document;
    var currentPage = [document currentPage]
    var searchScope = 0;
    var userInterface;
    var typeChoose = 0;
    var replaceCount = 0;

    function JTester(r) {
        var myReg = null;
        var begin = r.indexOf('/');
        var end = r.lastIndexOf('/');
        if (begin<0 || end<0 || begin==end) {
            return false;
        }
        var flags = r.match(/\/([igm]{0,3})$/i)[1];
        try{
            myReg = new RegExp(r.substring(begin + 1, end), flags);
            return myReg;
        }catch(e){
            return false;
        }
    };
    
    function createUserInterface() {
        if (selection && selection.count() == 1 && selection[0].class() == MSTextLayer) {
            textToFind = selection[0].stringValue().trim();
        }
        userInterface = COSAlertWindow.new();

        userInterface.setMessageText("全文替换文字");
        userInterface.setInformativeText("区分大小写，如需忽略大小写请使用正则表达式");

        userInterface.addTextLabelWithValue("请填写需要替换的文字（支持正则）：");
        userInterface.addTextFieldWithValue(textToFind);

        userInterface.addTextLabelWithValue("请填写想要替换的文字：");
        userInterface.addTextFieldWithValue('');

        userInterface.addTextLabelWithValue("应用于：");
        var options = ["全文件","选择中的Page"];
        userInterface.addAccessoryView(createRadioButtons(options, options[0]));

        userInterface.addTextLabelWithValue("应用于：");
        var options2 = ["全文件","仅画板中的文字"];
        userInterface.addAccessoryView(createRadioButtons(options2, options2[0]));
        
        userInterface.addButtonWithTitle('确定');
        userInterface.addButtonWithTitle('取消');

        return userInterface.runModal();
    }

    
    function processButtonClick() {
        textToFind2 = textToFind = [[userInterface viewAtIndex: 1] stringValue];
        textToReplace = userInterface.viewAtIndex(3).stringValue();
        searchScope = [[[userInterface viewAtIndex: 5] selectedCell] tag];
        typeChoose = [[[userInterface viewAtIndex: 7] selectedCell] tag];
        if(JTester(textToFind)){
            textToFind = JTester(textToFind);
        }else{
            textToFind = new RegExp(textToFind,'gm');
        }
    }
    
    function doFindAndReplace() {

        switch (searchScope) {
            case 0:
                searchInLayer(document);
                break;
            case 1:
                searchInLayer(currentPage);
                break;
        }

    }
    
    
    function searchInLayer(layer) {
    
        switch ([layer class]) {
            case MSTextLayer:
                if ([layer stringValue].trim().match(textToFind)) {
                    layer.setStringValue(layer.stringValue().replace(textToFind,textToReplace)); 
                    layer.setName(layer.stringValue().trim().replace(/(\r\n|\n|\r)/gm," "));
                    replaceCount ++;
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
            case MSArtboardGroup:
                var sublayers = [layer layers];
                for (var i = 0; i < [sublayers count]; i++) {
                    var sublayer = [sublayers objectAtIndex: i];
                    searchInLayer(sublayer);
                }
                break;
        }
        if(typeChoose == 0 && [layer class] != 'MSDocument'){
            var name = layer.name();
            if(name.match(textToFind)){
                layer.setName(name.replace(textToFind,textToReplace));
                replaceCount ++;
            }
        }
    }


    if(createUserInterface() != '1000'){
        return;
    }
    processButtonClick();
    doFindAndReplace();
    if(replaceCount){
        NSApp.displayDialog('已经将' + replaceCount + '个"' + textToFind2 + '"替换为"' + textToReplace + '"');
    }else{
        NSApp.displayDialog('没有找到"' + textToFind + '"');
    }
}
