@import "common.js"

var onRun = function(context){

    var pluginSketch = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("library").path();

	SMPanel({
        url: pluginSketch + "/panel/icon.html",
        width: 362,
        height: 548,
        data: {
            a:"1"
        },
        hiddenClose: false,
        floatWindow: true,
        identifier: "icon",
        callback: function( data ){
            logo = NSString.stringWithString(data);
            logo = [logo dataUsingEncoding: NSUTF8StringEncoding];
            var svgImporter = MSSVGImporter.svgImporter();
            svgImporter.prepareToImportFromData(logo);
            var importedSVGLayer = svgImporter.importAsLayer();
            var svgFrame = importedSVGLayer.frame();
            importedSVGLayer.name = 'test123';
            [svgFrame setX:0];
            [svgFrame setY:0];
            var page = context.document.currentPage();

            var canvas = page.currentArtboard() || page;
            canvas.addLayers([importedSVGLayer]);
        }
    });
}