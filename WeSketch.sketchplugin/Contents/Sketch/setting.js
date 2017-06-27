@import "common.js";

var onRun = function(context){
    var i18 = _(context).setting;

    var toolbarAutoShow = "com.sketchplugins.wechat.toolbarautoshow";
    var updateAutoShow = "com.sketchplugins.wechat.updateAutoShow";

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

    var toolbarAuto = NSUserDefaults.standardUserDefaults().objectForKey(toolbarAutoShow) || '';
    var updateAuto = NSUserDefaults.standardUserDefaults().objectForKey(updateAutoShow) || '';


	SMPanel({
        url: pluginSketch + "/panel/setting.html",
        width: 362,
        height: 548,
        data:{
            commands:obj,
            toolbarAuto:encodeURIComponent(toolbarAuto),
            updateAuto:encodeURIComponent(updateAuto),
            i18:i18
        },
        hiddenClose: false,
        floatWindow: true,
        identifier: "setting",
        callback: function( data ){
            var keydata = data.keydata;
            for(var i = 0;i < commands.length;i++){
                for(var k = 0; k < keydata.length;k++){
                    if(decodeURIComponent(keydata[k].name) == (commands[i].name)){
                        commands[i].shortcut = decodeURIComponent(keydata[k].shortcut);
                        commands[i].istool = (keydata[k].istool);
                    }
                }
            }
            manifest.commands = commands;
            NSString.alloc().initWithData_encoding(NSJSONSerialization.dataWithJSONObject_options_error(manifest, NSJSONWritingPrettyPrinted, nil), NSUTF8StringEncoding).writeToFile_atomically_encoding_error(manifestPath, true, NSUTF8StringEncoding, nil);
            AppController.sharedInstance().pluginManager().reloadPlugins();
            
            NSUserDefaults.standardUserDefaults().setObject_forKey(data.updateAuto, updateAutoShow);
            NSUserDefaults.standardUserDefaults().setObject_forKey(data.toolbarAuto, toolbarAutoShow);

            context.document.showMessage(i18.m1);

        }
    });
}