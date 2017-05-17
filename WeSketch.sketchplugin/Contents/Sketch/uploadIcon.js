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
    var fm  =[NSFileManager defaultManager];
    fm.removeItemAtPath_error(savePath,nil);
    return string;
}

var onRun = function(context){

    var selection = context.selection;
    if(selection.length == 1){
        selection = selection[0];
    }else{
        return NSApp.displayDialog('请选中一个您需要上传到项目管理的图标');
    }
    var svg = encodeURIComponent(choiceSVG(selection,context.document));
    var pluginSketch = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("library").path();

	SMPanel({
        url: pluginSketch + "/panel/uploadIcon.html",
        width: 300,
        height: 430,
        data:{svg:svg,name:selection.name()},
        hiddenClose: false,
        floatWindow: true,
        identifier: "uploadIcon",
        callback: function( data ){

        }
    });
}