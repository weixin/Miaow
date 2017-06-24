@import "common.js";

function codeS(context){
    var codeKey = "com.sketchplugins.wechat.codetype";
    var Rate = 2;
    var keyCode = 'px';
    var BorderPositions = ["center", "inside", "outside"],
        FillTypes = ["color", "gradient"],
        GradientTypes = ["linear", "radial", "angular"],
        ShadowTypes = ["outer", "inner"],
        TextAligns = ["left", "right", "center", "justify", "left"],
        ResizingType = ["stretch", "corner", "resize", "float"]; 
    function shadowToJSON(shadow) {
        return {
            type: shadow instanceof MSStyleShadow ? "outer" : "inner",
            offsetX: shadow.offsetX(),
            offsetY: shadow.offsetY(),
            blurRadius: shadow.blurRadius(),
            spread: shadow.spread(),
            color: colorToJSON(shadow.color())
        };
    }
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
    function getRadius(layer){
        var returnFlag = 0;
        try{
            return layer.layers().firstObject().fixedRadius();
        }catch(e){
            return 0;
        }
    }
    function getBorders(style) {
        var bordersData = [],
            border, borderIter = style.borders().objectEnumerator();
        while (border = borderIter.nextObject()) {
            if (border.isEnabled()) {
                var fillType = FillTypes[border.fillType()],
                    borderData = {
                        fillType: fillType,
                        position: BorderPositions[border.position()],
                        thickness: border.thickness()
                    };

                switch (fillType) {
                    case "color":
                        borderData.color = colorToJSON(border.color());
                        break;

                    case "gradient":
                        borderData.gradient = gradientToJSON(border.gradient());
                        break;

                    default:
                        continue;
                }

                bordersData.push(borderData);
            }
        }

        return bordersData;
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
    function getShadows(style) {
        var shadowsData = [],
            shadow, shadowIter = style.shadows().objectEnumerator();
        while (shadow = shadowIter.nextObject()) {
            if (shadow.isEnabled()) {
                shadowsData.push(shadowToJSON(shadow));
            }
        }

        shadowIter = style.innerShadows().objectEnumerator();
        while (shadow = shadowIter.nextObject()) {
            if (shadow.isEnabled()) {
                shadowsData.push(shadowToJSON(shadow));
            }
        }
        return shadowsData;
    }

    function getCode(selection){
        var text = '';
        if([selection class] == 'MSTextLayer'){
            text = exportText(selection);
        }else{
            text = exportSize(selection);
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
        function bzone(d){
            if(d.length == 1){
                d = '0' + d;
            }
            return d;
        }
        if(obj.a == 1){
            return '#' + bzone(obj.r.toString(16)) + bzone(obj.g.toString(16)) + bzone(obj.b.toString(16));
        }else{
            return 'rgba(' + obj.r + ',' + obj.g + ',' + obj.b + ',' + obj.a.toFixed(2) + ')';
        }
    }

    function exportText(selection){
        var layerStyle = selection.style();
        var returnText = [];
        if(layerStyle.contextSettings().opacity() != 1){
            returnText.push('opacity: ' + layerStyle.contextSettings().opacity().toFixed(2) + ';');
        }
        returnText.push('font-size: ' +　parseInt((selection.fontSize()/Rate)) + keyCode + ';');
        var lineHeight = (selection.lineHeight() || selection.font().defaultLineHeightForFont())/Rate;
        returnText.push('line-height: ' + parseInt(lineHeight) + keyCode + ';');
        returnText.push('color: ' +　colorToJSON(selection.textColor()) + ';');
        var fontName = selection.font().fontName().toLocaleUpperCase();
        if(fontName.indexOf('MEDIUM')>0 || fontName.indexOf('SEMIBOLD')>0 || fontName.indexOf('BOLD')>0){
            returnText.push('font-weight: bold;');
        }
        if(fontName.indexOf('ITALIC')>0){
            returnText.push('font-style: italic;');
        }
        return returnText.join('\n');
    }
    function exportSize(selection){
        var layerStyle = selection.style();
        var returnText = [];
        
        if(getRadius(selection) != 0){
            returnText.push('border-radius: ' + parseInt(getRadius(selection)/Rate) + keyCode +';');
        }
        var backgroundColor = getFills(layerStyle);
        var getBorder = getBorders(layerStyle);
        var borderless = 0;
        var rateX = 1;
        if(Rate > 1){
            rateX = 2;
        }
        
        if(getBorder.length>0){
            if(getBorder[0].position == 'inside'){
                borderless = getBorder[0].thickness * 2 / rateX;
            }
            if(getBorder[0].fillType == 'color'){
                returnText.push('border: ' + parseInt(getBorder[0].thickness /rateX) + keyCode + ' solid ' + (getBorder[0].color) + ';');
            }
        }
        var width = selection.rect().size.width/Rate;
        var height = selection.rect().size.height/Rate;
        returnText.push('width: '+parseInt(width - borderless) + keyCode + ';');
        returnText.push('height: ' + parseInt(height - borderless) + keyCode + ';');

        if(backgroundColor.length>0){
            if(backgroundColor[0].fillType == 'color'){
                returnText.push('background-color: ' + backgroundColor[0].color + ';');
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
                var param = [];
                var to = backgroundColor[0].gradient.to;
                var from = backgroundColor[0].gradient.from;
                param.push(parseInt(90-180*Math.atan(Math.abs((to.y-from.y))/Math.abs((to.x-from.x)))/Math.PI)+'deg');
                var colorStops = backgroundColor[0].gradient.colorStops;
                for(var i = 0;i<colorStops.length;i++){
                    param.push(colorStops[i].color + ' ' + parseInt(colorStops[i].position*100) + '%');
                }
                returnText.push('background: linear-gradient(' + param.join(',') + ');');
            }
        }
        return returnText.join('\n');
    }

    keyCode = NSUserDefaults.standardUserDefaults().objectForKey(codeKey) || 'px';
    if(context.selection.count()<1){
        return context.document.showMessage("请先选择要获取样式的元素");
    }
    var showMessage = '代码已复制到剪贴板';
    var selection = context.selection[0];
    var artboard = selection.parentArtboard().absoluteRect();
    var size = artboard.size().width;
    if(size  == 750 || size == 1334 || size == 720){
        Rate = 2;
    }else if(size == 320 || size == 414 || size == 375){
        Rate = 1;
    }
    else if(size == 1242 || size == 2208 || size == 1080){
        Rate = 3;
    }else{
        showMessage += '，此元素所在artboard为非标准尺寸，按默认2倍图处理'
    }
    if(keyCode == 'rpx'){
        if(size == 750 || size == 1334 || size == 720 || size == 320 || size == 414 || size == 375 || size == 1242 || size == 2208 || size == 1080){
            Rate = parseFloat((size/750).toFixed(2));
        }else{
            Rate = 1;
        }
    }
    getCode(selection);
    context.document.showMessage(showMessage);
}

var onRun = function (context) {
    codeS(context);
}