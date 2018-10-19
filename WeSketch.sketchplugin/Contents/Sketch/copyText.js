@import "common.js"

function copyText(context) {
    var i18 = _(context).codeStyle;
    function getText() {
            paste(selection.stringValue().trim());
            context.document.showMessage(i18.m2)
    }
    function paste(text) {
    var pasteBoard = [NSPasteboard generalPasteboard];
        [pasteBoard declareTypes: [NSArray arrayWithObject: NSPasteboardTypeString] owner: nil];
        [pasteBoard setString: text forType: NSPasteboardTypeString];

    }    
    if (context.selection.count() < 1) {
        return context.document.showMessage(i18.m1);
    }
    var selection = context.selection[0];
    getText(selection);
    var ga = new Analytics(context);
    if (ga) ga.sendEvent('codeText', 'use');
}
var onRun = function (context) {
    copyText(context);
}