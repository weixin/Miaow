@import "common.js";

var onRun = function(context){
    var i18 = _(context).setting;

    var i18nKey = "com.sketchplugins.wechat.i18n";
    var toolbarAutoShow = "com.sketchplugins.wechat.toolbarautoshow";
    var updateAutoShow = "com.sketchplugins.wechat.updateAutoShow";

    var lang = NSUserDefaults.standardUserDefaults().objectForKey(i18nKey);
    if(lang == undefined){
        var macOSVersion = NSDictionary.dictionaryWithContentsOfFile("/System/Library/CoreServices/SystemVersion.plist").objectForKey("ProductVersion") + "";
        lang = NSUserDefaults.standardUserDefaults().objectForKey("AppleLanguages").objectAtIndex(0);
        lang = (macOSVersion >= "10.12")? lang.split("-").slice(0, -1).join("-"): lang;
        if(lang.indexOf('zh') > -1){
            lang = 'zh';
        }else{
            lang = 'en';
        }
    }

    var manifestPath = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("manifest.json").path(),
        manifest = NSJSONSerialization.JSONObjectWithData_options_error(NSData.dataWithContentsOfFile(manifestPath), NSJSONReadingMutableContainers, nil),
        commands = manifest.commands;

    var pluginSketch = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("library").path();
    var obj = [];
    for(var i = 0;i < commands.length;i++){
        if(!commands[i].noshortcut){
            obj.push({identifier:encodeURIComponent(commands[i].identifier),name:encodeURIComponent(commands[i].name),shortcut:encodeURIComponent(commands[i].shortcut),istool:encodeURIComponent(commands[i].istool)})
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
            i18:i18,
            language:encodeURIComponent(lang)
        },
        hiddenClose: false,
        floatWindow: true,
        identifier: "setting",
        callback: function( data ){
            var manifestPathLang = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("i18n").URLByAppendingPathComponent("manifest-"+data.language+".json").path(),
            manifestLang = NSJSONSerialization.JSONObjectWithData_options_error(NSData.dataWithContentsOfFile(manifestPathLang), NSJSONReadingMutableContainers, nil),
            commandsLang = manifestLang.commands;
            var keydata = data.keydata;
            for(var i = 0;i < commandsLang.length;i++){
                for(var k = 0; k < keydata.length;k++){
                    if(decodeURIComponent(keydata[k].identifier) == (commandsLang[i].identifier)){
                        commandsLang[i].shortcut = decodeURIComponent(keydata[k].shortcut);
                        commandsLang[i].istool = (keydata[k].istool);
                    }
                }
            }
            manifestLang.commands = commandsLang;
            NSString.alloc().initWithData_encoding(NSJSONSerialization.dataWithJSONObject_options_error(manifestLang, NSJSONWritingPrettyPrinted, nil), NSUTF8StringEncoding).writeToFile_atomically_encoding_error(manifestPath, true, NSUTF8StringEncoding, nil);
            AppController.sharedInstance().pluginManager().reloadPlugins();
            
            NSUserDefaults.standardUserDefaults().setObject_forKey(data.updateAuto, updateAutoShow);
            NSUserDefaults.standardUserDefaults().setObject_forKey(data.toolbarAuto, toolbarAutoShow);
            NSUserDefaults.standardUserDefaults().setObject_forKey(data.language, i18nKey);

            context.document.showMessage(i18.m1);

        }
    });
}