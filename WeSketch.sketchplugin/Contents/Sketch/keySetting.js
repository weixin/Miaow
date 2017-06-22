@import "common.js";


var onRun = function(context){

    var manifestPath = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("manifest.json").path(),
        manifest = NSJSONSerialization.JSONObjectWithData_options_error(NSData.dataWithContentsOfFile(manifestPath), NSJSONReadingMutableContainers, nil),
        commands = manifest.commands;

    var pluginSketch = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("library").path();
    var obj = [];
    for(var i = 0;i < commands.length;i++){
        if(!commands[i].noshortcut){
            obj.push({name:encodeURIComponent(commands[i].name),shortcut:encodeURIComponent(commands[i].shortcut),istool:encodeURIComponent(commands[i].istool)})
        }
    }

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
            for(var i = 0;i < commands.length;i++){
                for(var k = 0; k < data.length;k++){
                    if(decodeURIComponent(data[k].name) == (commands[i].name)){
                        commands[i].shortcut = decodeURIComponent(data[k].shortcut);
                        // commands[i].istool = (data[k].istool);
                    }
                }
            }
            manifest.commands = commands;

            NSString.alloc().initWithData_encoding(NSJSONSerialization.dataWithJSONObject_options_error(manifest, NSJSONWritingPrettyPrinted, nil), NSUTF8StringEncoding).writeToFile_atomically_encoding_error(manifestPath, true, NSUTF8StringEncoding, nil);
            AppController.sharedInstance().pluginManager().reloadPlugins();
            context.document.showMessage("快捷键设置成功");

        }
    });
}