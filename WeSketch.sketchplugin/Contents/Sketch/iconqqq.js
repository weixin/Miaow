@import "common.js"

var onRun = function(context){

    var pluginSketch = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("library").path();

    var theResponseData = networkRequest(['http://123.207.94.56:3000/users/getFiles']);
    var jsonData = NSJSONSerialization.JSONObjectWithData_options_error(theResponseData,0,nil);
    
    NSApp.displayDialog(jsonData);

	SMPanel({
        url: pluginSketch + "/panel/icon.html?123",
        width: 362,
        height: 548,
        data: jsonData,
        hiddenClose: false,
        floatWindow: true,
        identifier: "icon",
        callback: function( data ){
            logo = NSString.stringWithString(data.content);
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