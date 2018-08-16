import {_,dialog,errorDialog,initDefaults,saveDefaults,uploadContext,paste,rgb,request,networkRequest,zip,encodeData,get,post,getConfig,openUrlInBrowser,createRadioButtons,createRadioButtons2,createArtboard,hexToRgb,unique,SMPanel} from "./common";

export function settingAction(context) {
    var i18 = _(context).setting;

    var i18nKey = "com.sketchplugins.wechat.i18n";
    var toolbarAutoShow = "com.sketchplugins.wechat.toolbarautoshow";
    var updateAutoShow = "com.sketchplugins.wechat.updateAutoShow";

    var lang = NSUserDefaults.standardUserDefaults().objectForKey(i18nKey);

    var manifestPath = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("manifest.json").path(),
        manifest = NSJSONSerialization.JSONObjectWithData_options_error(NSData.dataWithContentsOfFile(manifestPath), NSJSONReadingMutableContainers, nil),
        commands = manifest.commands;

    var pluginSketch = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("library").path();
    var obj = [];
    for (var i = 0; i < commands.length; i++) {
        if (!commands[i].noshortcut) {
            obj.push({
                identifier: encodeURIComponent(commands[i].identifier),
                name: encodeURIComponent(commands[i].name),
                shortcut: encodeURIComponent(commands[i].shortcut),
                istool: encodeURIComponent(commands[i].istool)
            })
        }
    }

    var i18nList = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("config.json").path();

    i18nList = NSData.dataWithContentsOfFile(i18nList);
    i18nList = NSString.alloc().initWithData_encoding(initWithData,NSUTF8StringEncoding);
    i18nList = JSON.parse(i18nList).i18n;

    var toolbarAuto = NSUserDefaults.standardUserDefaults().objectForKey(toolbarAutoShow) || '';
    var updateAuto = NSUserDefaults.standardUserDefaults().objectForKey(updateAutoShow) || 'false';

    SMPanel({
        url: pluginSketch + "/panel/setting.html",
        width: 362,
        height: 548,
        data: {
            commands: obj,
            toolbarAuto: encodeURIComponent(toolbarAuto),
            updateAuto: encodeURIComponent(updateAuto),
            i18: i18,
            language: encodeURIComponent(lang),
            i18nList: i18nList
        },
        hiddenClose: false,
        floatWindow: true,
        identifier: "setting",
        callback: function (data) {
            function setKey(manifestPath, data) {
                var manifestLang = NSJSONSerialization.JSONObjectWithData_options_error(NSData.dataWithContentsOfFile(manifestPath), NSJSONReadingMutableContainers, nil);
                var commandsLang = manifestLang.commands;
                var keydata = data.keydata;
                for (var i = 0; i < commandsLang.length; i++) {
                    for (var k = 0; k < keydata.length; k++) {
                        if (decodeURIComponent(keydata[k].identifier) == (commandsLang[i].identifier)) {
                            commandsLang[i].shortcut = decodeURIComponent(keydata[k].shortcut);
                            commandsLang[i].istool = (keydata[k].istool);
                        }
                    }
                }
                manifestLang.commands = commandsLang;
                NSString.alloc().initWithData_encoding(NSJSONSerialization.dataWithJSONObject_options_error(manifestLang, NSJSONWritingPrettyPrinted, nil), NSUTF8StringEncoding).writeToFile_atomically_encoding_error(manifestPath, true, NSUTF8StringEncoding, nil);
            }

            var manifestLangData;

            for (var i = 0; i < i18nList.length; i++) {
                var allManifestPath = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("i18n").URLByAppendingPathComponent("manifest-" + i18nList[i].key + ".json").path();
                setKey(allManifestPath, data);
                if (i18nList[i].key == data.language) {
                    manifestLangData = NSJSONSerialization.JSONObjectWithData_options_error(NSData.dataWithContentsOfFile(allManifestPath), NSJSONReadingMutableContainers, nil)
                }
            }


            var localManiFest = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("manifest.json").path();
            NSString.alloc().initWithData_encoding(NSJSONSerialization.dataWithJSONObject_options_error(manifestLangData, NSJSONWritingPrettyPrinted, nil), NSUTF8StringEncoding).writeToFile_atomically_encoding_error(localManiFest, true, NSUTF8StringEncoding, nil);

            AppController.sharedInstance().pluginManager().reloadPlugins();

            NSUserDefaults.standardUserDefaults().setObject_forKey(data.updateAuto, updateAutoShow);
            NSUserDefaults.standardUserDefaults().setObject_forKey(data.toolbarAuto, toolbarAutoShow);
            NSUserDefaults.standardUserDefaults().setObject_forKey(data.language, i18nKey);

            context.document.showMessage(i18.m1);

        }
    });
    var ga = new Analytics(context);
    if (ga) ga.sendEvent('setting', 'confirm');
}