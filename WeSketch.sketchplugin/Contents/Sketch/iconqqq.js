@import "common.js";

var usualKey = "com.sketchplugins.wechat.iconusual";
var usualObj = NSUserDefaults.standardUserDefaults().objectForKey(usualKey);

var onRun = function(context){

    var pluginSketch = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("library").path();

    var theResponseData = networkRequest(['http://123.207.94.56:3000/users/getFiles']);
    var jsonData = NSJSONSerialization.JSONObjectWithData_options_error(theResponseData,0,nil);
    var object = [];
    for (var i = 0; i < jsonData.data.length; i++) {
        var name = encodeURIComponent(jsonData.data[i].name);
        var content = encodeURIComponent(jsonData.data[i].content);
        object.push({name:name,content:content});
    };

    function paste(text){
        var pasteBoard = [NSPasteboard generalPasteboard];
          [pasteBoard declareTypes:[NSArray arrayWithObject:NSPasteboardTypeString] owner:nil];
          [pasteBoard setString:text forType:NSPasteboardTypeString];
    }

    var svgtitle = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>';

	SMPanel({
        url: pluginSketch + "/panel/icon.html?12",
        width: 362,
        height: 548,
        data: {data:object,usual:usualObj},
        hiddenClose: false,
        floatWindow: true,
        identifier: "icon",
        callback: function( data ){
            var usualArr = [];
            usualObj = NSUserDefaults.standardUserDefaults().objectForKey(usualKey);
            if(usualObj){
               usualArr  = usualObj.split(',');
            }else{
                usualArr.push(data.name);
            }
            NSUserDefaults.standardUserDefaults().setObject_forKey(usualArr.join(','), usualKey);
            var x = 0;
            var y = 0;
            var selection = context.selection;
            if (selection.count() > 0) {
                selection = selection[0];
                if(selection.className() == 'MSSymbolMaster' || selection.className() == 'MSArtboardGroup'){
                    x = selection.absoluteRect().size().width/2;
                    y = selection.absoluteRect().size().height/2;
                }else{
                    x = selection.frame().x;
                    y = selection.frame().y;
                }
            }

            logo = decodeURIComponent(data.content);
            logo = svgtitle + logo.replace('xmlns="http://www.w3.org/2000/svg"','version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"');
            logo = NSString.stringWithString(logo);
            logo = [logo dataUsingEncoding: NSUTF8StringEncoding];
            var svgImporter = MSSVGImporter.svgImporter();
            svgImporter.prepareToImportFromData(logo);
            var importedSVGLayer = svgImporter.importAsLayer();
            var svgFrame = importedSVGLayer.frame();
            importedSVGLayer.name = data.name;
            [svgFrame setX:x];
            [svgFrame setY:y];
            var page = context.document.currentPage();
            var canvas = page.currentArtboard() || page;
            canvas.addLayers([importedSVGLayer]);
        }
    });
}