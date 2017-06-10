var BorderPositions = ["center", "inside", "outside"],
    FillTypes = ["color", "gradient"],
    GradientTypes = ["linear", "radial", "angular"],
    ShadowTypes = ["outer", "inner"],
    TextAligns = ["left", "right", "center", "justify", "left"],
    ResizingType = ["stretch", "corner", "resize", "float"]; 
function pointToJSON(point){
    return {
        x: parseFloat(point.x),
        y: parseFloat(point.y)
    };
}
function colorStopToJSON(colorStop) {
    return {
        color: colorToJSON(colorStop.color()),
        position: colorStop.position()
    };
}
function gradientToJSON(gradient) {
    var stopsData = [],
        stop, stopIter = gradient.stops().objectEnumerator();
    while (stop = stopIter.nextObject()) {
        stopsData.push(colorStopToJSON(stop));
    }

    return {
        type: GradientTypes[gradient.gradientType()],
        from: pointToJSON(gradient.from()),
        to: pointToJSON(gradient.to()),
        colorStops: stopsData
    };
}
function getFills(style) {
    var fillsData = [],
        fill, fillIter = style.fills().objectEnumerator();
    while (fill = fillIter.nextObject()) {
        if (fill.isEnabled()) {
            var fillType = FillTypes[fill.fillType()],
                fillData = {
                    fillType: fillType
                };

            switch (fillType) {
                case "color":
                    fillData.color = colorToJSON(fill.color());
                    break;

                case "gradient":
                    fillData.gradient = gradientToJSON(fill.gradient());
                    break;

                default:
                    continue;
            }

            fillsData.push(fillData);
        }
    }

    return fillsData;
}
function colorToJSON(color) {
    var obj =  {
        r: Math.round(color.red() * 255),
        g: Math.round(color.green() * 255),
        b: Math.round(color.blue() * 255),
        a: color.alpha()
    }
    function bzone(d){
        if(d.length == 1){
            d = '0' + d;
        }
        return d;
    }
    if(obj.a == 1){
        return '#' + bzone(obj.r.toString(16)) + bzone(obj.g.toString(16)) + bzone(obj.b.toString(16));
    }else{
        return 'rgba(' + obj.r + ',' + obj.g + ',' + obj.b + ',' + obj.a + ')';
    }
}


function getColor(selection){
    var text = '';
    if([selection class] == 'MSTextLayer'){
        text = exportText(selection);
    }else{
        text = exportSize(selection);
    }
    paste(text);
}

function exportText(selection){
    var layerStyle = selection.style();
    var returnText = [];
    returnText.push(colorToJSON(selection.textColor()));
    return returnText.join('');
}
function exportSize(selection){
    var layerStyle = selection.style();
    var returnText = [];
    var backgroundColor = getFills(layerStyle);
   
    if(backgroundColor.length>0){
        if(backgroundColor[0].fillType == 'color'){
            returnText.push(backgroundColor[0].color);
        }else if(backgroundColor[0].fillType == 'gradient'){
            function bzone6(z){
                if(z.length != 6){
                    z = '0' + z;
                }
                if(z.length != 6){
                    bzone6(z);
                }else{
                    return z;
                }
            }
            var midColor = bzone6(parseInt((parseInt('0x'+backgroundColor[0].gradient.colorStops[0].color.replace('#','')) + parseInt('0x'+backgroundColor[0].gradient.colorStops[1].color.replace('#','')))/2).toString(16));
            returnText.push('#'+midColor);
        }
    }
    return returnText.join('');
}
function paste(text){
    var pasteBoard = [NSPasteboard generalPasteboard];
    [pasteBoard declareTypes:[NSArray arrayWithObject:NSPasteboardTypeString] owner:nil];
    [pasteBoard setString:text forType:NSPasteboardTypeString];
}
var onRun = function (context) {
    var selection = context.selection[0];
    getColor(selection);
    context.document.showMessage("颜色已复制到剪贴板");
}