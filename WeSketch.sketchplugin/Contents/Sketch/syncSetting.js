@import "common.js";


var onRun = function(context){
    var pluginSketch = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("library").path();

    var manifestPath = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("config.json").path(),
        manifest = NSJSONSerialization.JSONObjectWithData_options_error(NSData.dataWithContentsOfFile(manifestPath), NSJSONReadingMutableContainers, nil);
    
    var obj = [];
    for(var i = 0;i<manifest.UIKIT.length;i++){
        obj.push({
            title:encodeURIComponent(manifest.UIKIT[i].title),
            uikit:encodeURIComponent(manifest.UIKIT[i].url)
        })
    }
    for(var k = 0;k<manifest.COLOR.length;k++){
        var flagT = false;
        for(var j = 0;j<obj.length;j++){
            if(obj[j].title == manifest.COLOR[k].title){
                flagT = true;
                obj[j].color = encodeURIComponent(manifest.COLOR[k].url);
            }
        }
        if(!flagT){
            obj.push({
                title:encodeURIComponent(manifest.COLOR[k].title),
                color:encodeURIComponent(manifest.COLOR[k].url)
            })
        }
    }


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
            if(data.type == 'choicefile'){
                var panel = [NSOpenPanel openPanel];
                [panel setCanChooseDirectories:false];
                [panel setCanCreateDirectories:false];
                panel.setAllowedFileTypes([@"sketch"]);
                panel.setAllowsOtherFileTypes(false);
                panel.setExtensionHidden(false);
                var clicked = [panel runModal];
                if (clicked != NSFileHandlingPanelOKButton) {
                    return;
                }
                var firstURL = [[panel URLs] objectAtIndex:0];
                var unformattedURL = [NSString stringWithFormat:@"%@", firstURL];
                var file_path = [unformattedURL stringByRemovingPercentEncoding];
                NSApp.displayDialog(file_path);
                var inputAction = [
                    "$(",
                        "function(){",
                            "inputFile('" + file_path + "')",
                        "}",
                    ");"].join("");
                windowObject.evaluateWebScript(inputAction);

            }
        }
    });
}