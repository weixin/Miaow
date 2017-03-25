@import "common.js"

var onRun = function(context){

    var pluginSketch = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("library").path();

	SMPanel({
        url: pluginSketch + "/panel/icon.html",
        width: 320,
        height: 451,
        data: {
            a:"1"
        },
        hiddenClose: false,
        floatWindow: true,
        identifier: "icon",
        callback: function( data ){
            var logoURL = [NSURL URLWithString:'https://logos-api.funkreich.de/logo/gilbarbara-github'];
            var request = [NSURLRequest requestWithURL:logoURL];
            var response = NSURLConnection.sendSynchronousRequest_returningResponse_error(request, null, null);
            var svgImporter = MSSVGImporter.svgImporter();
            svgImporter.prepareToImportFromURL(logoURL);
            var importedSVGLayer = svgImporter.importAsLayer();
            var svgFrame = importedSVGLayer.frame();
            importedSVGLayer.name = 'test';

            // var selectedFrame = selectedShape.frame();
            // var ratio = svgFrame.width() / svgFrame.height();
            // var newWidth = selectedFrame.width();
            // var newHeight = newWidth / ratio;
            // if (newHeight > selectedFrame.height()) {
            //     newHeight = selectedFrame.height();
            //     newWidth = newHeight * ratio;
            // }

            // Center in selection frame
            [svgFrame setX:0];
            [svgFrame setY:0];
            [svgFrame setWidth:50];
            [svgFrame setHeight:50];

            // Add label layer
            var page = context.document.currentPage();
            var canvas = page.currentArtboard() || page;
            canvas.addLayers([importedSVGLayer]);
        }
    });
}