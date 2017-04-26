
function getCode(selection){
    var text = '';
    switch ([selection class]) {
        case MSTextLayer:
            text = exportText(selection);
        break;

        case MSLayerGroup:
        case MSSymbolMaster:
        case MSArtboardGroup:
            // log(layer.class());
            // log(layer);
        break;
    }
    paste(text);
}
function colorToJSON(color) {
    var obj =  {
        r: Math.round(color.red() * 255),
        g: Math.round(color.green() * 255),
        b: Math.round(color.blue() * 255),
        a: color.alpha()
    }
    if(obj.a == 1){
        return '#' + obj.r.toString(16) + obj.g.toString(16) + obj.b.toString(16);
    }else{
        return 'rgba(' + obj.r + ',' + obj.g + ',' + obj.b + ',' + obj.a + ')';
    }
}

function exportText(selection){
    var layerStyle = selection.style();
    var returnText = [];
    if(layerStyle.contextSettings().opacity() != 1){
        returnText.push('opacity:' + layerStyle.contextSettings().opacity().toFixed(2) + ';');
    }
    returnText.push('font-size:' +　selection.fontSize() + 'px;');
    returnText.push('color:' +　colorToJSON(selection.textColor()) + ';');
    return returnText.join('\n');
}

function paste(text){
    var pasteBoard = [NSPasteboard generalPasteboard];
      [pasteBoard declareTypes:[NSArray arrayWithObject:NSPasteboardTypeString] owner:nil];
      [pasteBoard setString:text forType:NSPasteboardTypeString];
}


var onRun = function (context) {
    var selection = context.selection[0];
    getCode(selection);
}