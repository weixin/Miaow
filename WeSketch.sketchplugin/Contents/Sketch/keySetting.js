@import "common.js";


var onRun = function(context){

    var manifestPath = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("manifest.json").path(),
        manifest = NSJSONSerialization.JSONObjectWithData_options_error(NSData.dataWithContentsOfFile(manifestPath), NSJSONReadingMutableContainers, nil),
        commands = manifest.commands;
       NSApp.displayDialog(JSON.stringity(commands));

    var pluginSketch = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("library").path();
    var obj = [];
    for(var i = 0;i < commands.length -1;i++){
        obj.push({name:encodeURIComponent(commands[i].name),shortcut:encodeURIComponent(commands[i].shortcut)})
    }
       NSApp.displayDialog(JSON.stringity(obj));

	SMPanel({
        url: pluginSketch + "/panel/keySetting.html",
        width: 362,
        height: 548,
        data:{
            commands:obj
        },
        hiddenClose: false,
        floatWindow: true,
        identifier: "keySetting",
        callback: function( data ){

        }
    });
}