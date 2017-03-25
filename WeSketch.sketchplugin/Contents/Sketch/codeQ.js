function request(args) {
  var aara = [args];
  var task = NSTask.alloc().init();
  task.setLaunchPath("/usr/bin/curl");
  task.setArguments(aara);
  var outputPipe = [NSPipe pipe];
  [task setStandardOutput:outputPipe];
  task.launch();
  var responseData = [[outputPipe fileHandleForReading] readDataToEndOfFile];
  return responseData;
}
function networkRequest(args) {
  var task = NSTask.alloc().init();
  task.setLaunchPath("/usr/bin/curl");
  task.setArguments(args);
  var outputPipe = [NSPipe pipe];
  [task setStandardOutput:outputPipe];
  task.launch();
  var responseData = [[outputPipe fileHandleForReading] readDataToEndOfFile];
  return responseData;
}

var BorderPositions = ["center", "inside", "outside"],
    FillTypes = ["color", "gradient"],
    GradientTypes = ["linear", "radial", "angular"],
    ShadowTypes = ["outer", "inner"],
    TextAligns = ["left", "right", "center", "justify", "left"],
    ResizingType = ["stretch", "corner", "resize", "float"];;

function toHex(c) {
    var hex = Math.round(c).toString(16).toUpperCase();
    return hex.length == 1 ? "0" + hex :hex;
}

function colorToJSON(color) {
    return {
        r: Math.round(color.red() * 255),
        g: Math.round(color.green() * 255),
        b: Math.round(color.blue() * 255),
        a: color.alpha()
        // "color-hex": color.immutableModelObject().stringValueWithAlpha(false) + " " + Math.round(color.alpha() * 100) + "%",
        // "argb-hex": "#" + toHex(color.alpha() * 255) + color.immutableModelObject().stringValueWithAlpha(false).replace("#", ""),
        // "css-rgba": "rgba(" + [
        //                 Math.round(color.red() * 255),
        //                 Math.round(color.green() * 255),
        //                 Math.round(color.blue() * 255),
        //                 (Math.round(color.alpha() * 100) / 100)
        //             ].join(",") + ")",
        // "ui-color": "(" + [
        //                 "r:" + (Math.round(color.red() * 100) / 100).toFixed(2),
        //                 "g:" + (Math.round(color.green() * 100) / 100).toFixed(2),
        //                 "b:" + (Math.round(color.blue() * 100) / 100).toFixed(2),
        //                 "a:" + (Math.round(color.alpha() * 100) / 100).toFixed(2)
        //             ].join(" ") + ")"
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
                    borderData.color = this.colorToJSON(border.color());
                    break;

                case "gradient":
                    borderData.gradient = this.gradientToJSON(border.gradient());
                    break;

                default:
                    continue;
            }

            bordersData.push(borderData);
        }
    }

    return bordersData;
}
function colorStopToJSON(colorStop) {
    return {
        color: this.colorToJSON(colorStop.color()),
        position: colorStop.position()
    }
}

function gradientToJSON(gradient) {
    var stopsData = [],
        stop, stopIter = gradient.stops().objectEnumerator();
    while (stop = stopIter.nextObject()) {
        stopsData.push(this.colorStopToJSON(stop));
    }

    return {
        type: GradientTypes[gradient.gradientType()],
        from: this.pointToJSON(gradient.from()),
        to: this.pointToJSON(gradient.to()),
        colorStops: stopsData
    };
}

function getRect(layer){
	var rect = layer.absoluteRect();
	var rect1 = layer.rect();
	log(rect1);
    return {
        x: Math.round(rect.x()),
        y: Math.round(rect.y()),
        width: Math.round(rect.width()),
        height: Math.round(rect.height()),
        maxX: Math.round(rect.x() + rect.width()),
        maxY: Math.round(rect.y() + rect.height()),
        setX: function(x){ rect.setX(x); this.x = x; this.maxX = this.x + this.width; },
        setY: function(y){ rect.setY(y); this.y = y; this.maxY = this.y + this.height; },
        setWidth: function(width){ rect.setWidth(width); this.width = width; this.maxX = this.x + this.width; },
        setHeight: function(height){ rect.setHeight(height); this.height = height; this.maxY = this.y + this.height; }
    };
}

function sort(artboard){
    var layers = artboard.layers();
    var sortArtboard = [];
    for(var i = 0;i < layers.length;i++){
        var rect = layers[i].rect();
        log(rect);
    }
} 

function convertUnit(length, isText, percentageType,artboard){
    if(percentageType && artboard){
        var artboardRect = getRect( artboard );
        if (percentageType == "width") {
             return Math.round((length / artboardRect.width) * 1000) / 10 + "%";

        }
        else if(percentageType == "height"){
            return Math.round((length / artboardRect.height) * 1000) / 10 + "%";
        }
    }

    var length = Math.round( length / 1 * 10 ) / 10,
        units = this.configs.unit.split("/"),
        unit = units[0];

    if( units.length > 1 && isText){
        unit = units[1];
    }

    return length + unit;
}

@import "svgoco.js"


var BQ = {
	LinearLayout:'LinearLayout',   //group 
	ImageView:'com.tencent.mm.ui.MMImageView',  //group with icon
	TextView:'TextView',   //text
	ProgressBar:'ProgressBar',  //progress
	Button:'Button'  //spical button
}

var Layout = {
	layout_width:'layout_width',
	layout_height:'layout_height',
	paddingLeft:'paddingLeft',
	paddingRight:'paddingRight',
	paddingTop:'paddingTop',
	paddingBottom:'paddingBottom',
	layout_marginTop:'layout_marginTop',
	layout_marginLeft:'layout_marginLeft',
	layout_marginRight:'layout_marginRight',
	layout_marginBottom:'layout_marginBottom',
	background:'',
	text:'',
	minWidth:'',
	maxWidth:'',
	minHeight:'',
	maxWidth:'',	
	orientation:'orientation',
	maxLines:'',
	ellipsize:''
}

var spcialName = ['Actionbar','navigationbar'];

function layoutFunction(artboard){
	// return 'horizontal';
	return 'vertical';
}

function getCode(artboard,layers,doc,file){
    var layout = layoutFunction(artboard);
    var artboard = sort(artboard);
    for(var k = 0;k < layers.length;k++){
        var layer = layers[k];
        if(layer.name().indexOf('icon') > -1){
            exportSVG(layer,doc,file);
            return;
        }

        for(var i = 0;i<spcialName.length;i++){
            if(layer.name().indexOf(spcialName[i]) > -1){
                return;
            }
        }

        switch ([layer class]) {

            case MSTextLayer:
                exportText(artboard,layer,layout);
            break;

            case MSLayerGroup:



            case MSSymbolMaster:
            case MSArtboardGroup:
                // log(layer.class());
                // log(layer);
            break;
        }
    }
	
}

function exportText(artboard,layer,layout){
    // log(layer);
    // log(layout);
    var layerStyle = layer.style();

    var properties = ["string-value","position","layer-name","text-alignment", "color", "border", "opacity", "radius", "shadow", "font-size", "line-height", "font-face", "character", "paragraph"];
    var content = [];
    properties.forEach(function(property){
        switch(property){
        	case "string-value":
        		log(layer.stringValue());
            case "color":
            	log(colorToJSON(layer.textColor()));
                break;
            case "text-alignment":
            	log(TextAligns[layer.textAlignment()]);
            case "border":
                break;
            case "opacity":
            	log(layerStyle.contextSettings().opacity());
                break;
            case "radius":
                break;
            case "shadow":
                break;
            case "font-size":
            	log(layer.fontSize());
                break;
            case "line-height":
                break;
            case "font-face":
                break;
            case "character":
                break;
            case "paragraph":
                break;
            case "style-name":
                break;
    		case "layer-name":
                break;
            case "position":
            	// getRect(artboard,layer);
            	break;
            default:
                break;
        }
    });
}

function exportSVG(layer,doc,file){
	var slice = MSExportRequest.exportRequestsFromExportableLayer(layer).firstObject();
    slice.scale = '1';
    slice.format = 'svg';
    var savePath = file + '/svg/' + layer.name() + '.svg';
    doc.saveArtboardOrSlice_toFile(slice, savePath);
    // var content = networkRequest([savePath]);
    // log(content);
}

function chooseFilePath(){
	var save = NSSavePanel.savePanel();
	save.setAllowsOtherFileTypes(true);
	save.setExtensionHidden(false);
	if(save.runModal()){
		return save.URL().path();
	}else{
		return false;
	}

}
function writeDirectory(filePath){
	NSFileManager
            .defaultManager()
            .createDirectoryAtPath_withIntermediateDirectories_attributes_error(filePath, true, nil, nil);
}
function writeFile(options){
	var fileName = options.fileName;
	var file = NSString.stringWithString(options.content);
	[file writeToFile:fileName atomically:true encoding:NSUTF8StringEncoding error:null];
}


	var artboards = context.document.currentPage().artboards();
	var file = chooseFilePath();
	writeDirectory(file);
	for(var i = 0;i < artboards.length;i++){
		var artboard = artboards[i];
		var layers = artboard.layers();
		
		getCode(artboard,layers,context.document,file);
		
	}
