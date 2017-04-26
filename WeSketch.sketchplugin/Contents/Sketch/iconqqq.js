@import "common.js"

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

	SMPanel({
        url: pluginSketch + "/panel/icon.html?123",
        width: 362,
        height: 548,
        data: object,
        hiddenClose: false,
        floatWindow: true,
        identifier: "icon",
        callback: function( data ){
            // '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
            logo = NSString.stringWithString(data.content);
            context.document.showMessage(logo);
            logo = [logo dataUsingEncoding: NSUTF8StringEncoding];
            var svgImporter = MSSVGImporter.svgImporter();
            svgImporter.prepareToImportFromData(logo);
            var importedSVGLayer = svgImporter.importAsLayer();
            var svgFrame = importedSVGLayer.frame();
            importedSVGLayer.name = data.name;
            [svgFrame setX:0];
            [svgFrame setY:0];
            var page = context.document.currentPage();

            var canvas = page.currentArtboard() || page;
            canvas.addLayers([importedSVGLayer]);
        }
    });
}