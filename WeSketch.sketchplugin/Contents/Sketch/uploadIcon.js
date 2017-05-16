@import "common.js";

function choiceSVG(layer,doc){
    var slice = MSExportRequest.exportRequestsFromExportableLayer(layer).firstObject();
    slice.scale = '1';
    slice.format = 'svg';
    var save = NSSavePanel.savePanel();
    var savePath = save.URL().path() + '.svg';
    doc.saveArtboardOrSlice_toFile(slice, savePath);
    var content = NSData.dataWithContentsOfURL(NSURL.URLWithString('file://'+savePath));
    var string = [[NSString alloc] initWithData:content encoding:NSUTF8StringEncoding];
    return string;
}

var onRun = function(context){

    var selection = context.selection;
    if(selection.length == 1){
        selection = selection[0];
    }
    var svg = encodeURIComponent(choiceSVG(selection,context.document));
    var pluginSketch = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("library").path();

	SMPanel({
        url: pluginSketch + "/panel/uploadIcon.html",
        width: 362,
        height: 548,
        data:{svg:svg}
        hiddenClose: false,
        floatWindow: true,
        identifier: "uploadIcon",
        callback: function( data ){

        }
    });
}