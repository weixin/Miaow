@import "common.js";

function exportSVG(layer,doc,file){
    var slice = MSExportRequest.exportRequestsFromExportableLayer(layer).firstObject();
    slice.scale = '1';
    slice.format = 'svg';
    // var savePath = file + '/svg/' + layer.name() + '.svg';
    doc.saveArtboardOrSlice_toFile(slice, savePath);
    var content = networkRequest([savePath]);
    log(content);
}

var onRun = function(context){

    var pluginSketch = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("library").path();

	SMPanel({
        url: pluginSketch + "/panel/uploadIcon.html",
        width: 362,
        height: 548,
        hiddenClose: false,
        floatWindow: true,
        identifier: "uploadIcon",
        callback: function( data ){

        }
    });
}