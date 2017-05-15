@import "common.js";


var onRun = function(context){
    var pluginSketch = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("library").path();

    var manifestPath = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("config.json").path(),
        manifest = NSJSONSerialization.JSONObjectWithData_options_error(NSData.dataWithContentsOfFile(manifestPath), NSJSONReadingMutableContainers, nil);
    var obj = [];
    for(var i = 0;i<manifest.UIKITCOLOR.length;i++){
        obj.push({
            title:encodeURIComponent(manifest.UIKITCOLOR[i].title),
            uikit:encodeURIComponent(manifest.UIKITCOLOR[i].uikit),
            color:encodeURIComponent(manifest.UIKITCOLOR[i].color)
        })
        
    }
    NSApp.displayDialog(obj);


	SMPanel({
        url: pluginSketch + "/panel/syncSetting.html",
        width: 362,
        height: 548,
        data:{
            list:obj
        },
        hiddenClose: false,
        floatWindow: true,
        identifier: "syncSetting",
        callback: function( data ){
            
        }
    });
}