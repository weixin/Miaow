import {_,dialog,errorDialog,initDefaults,saveDefaults,uploadContext,paste,rgb,request,networkRequest,zip,encodeData,get,post,getConfig,openUrlInBrowser,createRadioButtons,createRadioButtons2,createArtboard,hexToRgb,unique,SMPanel} from "./common";

function textReplace(context) {
    var i18 = _(context).textReplace;

    var textToFind = '',
        textToReplace = '';
    var textToFind2;
    var selection = context.selection;
    var document = context.document;
    var currentPage = document.currentPage();
    var searchScope = 0;
    var userInterface;
    var typeChoose = 0;
    var replaceCount = 0;

    function JTester(r) {
        var myReg = null;
        var begin = r.indexOf('/');
        var end = r.lastIndexOf('/');
        if (begin < 0 || end < 0 || begin == end) {
            return false;
        }
        var flags = r.match(/\/([igm]{0,3})$/i)[1];
        try {
            myReg = new RegExp(r.substring(begin + 1, end), flags);
            return myReg;
        } catch (e) {
            return false;
        }
    };

    function createUserInterface() {
        if (selection.length>0 && selection.count() == 1 && selection[0].class() == MSTextLayer) {
            if (selection[0].editingDelegate()) {
                var range = selection[0].editingDelegate().textView().selectedRange();
                var value = selection[0].stringValue();
                textToFind = value.substr(range.location, range.length + range.location);
            } else {
                textToFind = selection[0].stringValue().trim();
            }
        }
        userInterface = dialog(context);

        userInterface.setMessageText(i18.m1);
        userInterface.setInformativeText(i18.m2);

        userInterface.addTextLabelWithValue(i18.m3);
        userInterface.addTextFieldWithValue(textToFind);

        userInterface.addTextLabelWithValue(i18.m4);
        userInterface.addTextFieldWithValue('');

        userInterface.addTextLabelWithValue(i18.m5);
        var options = [i18.m6, i18.m7];
        userInterface.addAccessoryView(createRadioButtons(options, options[0]));

        userInterface.addTextLabelWithValue(i18.m8);
        var options2 = [i18.m9, i18.m10];
        userInterface.addAccessoryView(createRadioButtons(options2, options2[0]));

        userInterface.addButtonWithTitle(i18.m11);
        userInterface.addButtonWithTitle(i18.m12);

        userInterface.alert().window().setInitialFirstResponder(userInterface.viewAtIndex(1))
        userInterface.viewAtIndex(1).setNextKeyView(userInterface.viewAtIndex(3))
        userInterface.viewAtIndex(3).setNextKeyView(userInterface.viewAtIndex(5))
        userInterface.viewAtIndex(5).setNextKeyView(userInterface.viewAtIndex(7))
        userInterface.viewAtIndex(7).setNextKeyView(userInterface.viewAtIndex(1))

        return userInterface.runModal();
    }


    function processButtonClick() {
        textToFind2 = textToFind = userInterface.viewAtIndex(1).stringValue();
        textToReplace = userInterface.viewAtIndex(3).stringValue();
        searchScope = userInterface.viewAtIndex(5).selectedCell().tag();
        typeChoose = userInterface.viewAtIndex(7).selectedCell().tag();
        if (JTester(textToFind)) {
            textToFind = JTester(textToFind);
        } else {
            textToFind = new RegExp(textToFind, 'gm');
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

        switch (layer.class()) {
            case MSTextLayer:
                if (layer.stringValue().trim().match(textToFind)) {
                    if (selection.length>0 && selection[0].editingDelegate() && layer.objectID() == selection[0].objectID()) {
                        var value = layer.stringValue();
                        var result = value.replace(textToFind, textToReplace);
                        var valueLength = value.length();
                        layer.editingDelegate().textView().replaceCharactersInRange_withString({
                            location: 0,
                            length: valueLength
                        }, result);

                    } else {
                        layer.setStringValue(layer.stringValue().replace(textToFind, textToReplace));
                        layer.setName(layer.stringValue().trim().replace(/(\r\n|\n|\r)/gm, " "));
                    }

                    replaceCount++;
                }
                break;
            case MSDocument:
                var documentPages = layer.pages();
                for (var i = 0; i < documentPages.count(); i++) {
                    var documentPage = documentPages.objectAtIndex(i);
                    searchInLayer(documentPage);
                }
                break;
            case MSPage:
            case MSLayerGroup:
            case MSArtboardGroup:
            case MSSymbolMaster:
                var sublayers = layer.layers();
                for (var i = 0; i < sublayers.count(); i++) {
                    var sublayer = sublayers.objectAtIndex(i);
                    searchInLayer(sublayer);
                }
                break;
            case MSSymbolInstance:
                for (var key in layer.overrides()) {
                    var value = layer.overrides()[key];
                    if (value.isKindOfClass(NSString)) {
                        if (value.trim().match(textToFind)) {
                            layer.overrides()[key] = layer.overrides()[key].replace(textToFind, textToReplace);
                            replaceCount++;
                        }
                    }
                }
                break;
        }
        if (typeChoose == 0 && layer.class() != 'MSDocument') {
            var name = layer.name();
            if (name.match(textToFind)) {
                layer.setName(name.replace(textToFind, textToReplace));
                replaceCount++;
            }
        }
    }


    if (createUserInterface() != '1000') {
        return;
    }

    processButtonClick();
    doFindAndReplace();
    if (replaceCount) {
        context.document.showMessage(i18.m13 + replaceCount + i18.m14 + '\r\n"' + textToFind2 + i18.m15 + textToReplace + '"');
    } else {
        errorDialog(context,i18.m16 + '"' + textToFind + '"');
    }
    var ga = new Analytics(context);
    if (ga) ga.sendEvent('textReplace', 'confirm');
}

var onRun = function (context) {
    textReplace(context);
}