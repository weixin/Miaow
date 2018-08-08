import {_,dialog,errorDialog,initDefaults,saveDefaults,uploadContext,paste,rgb,request,networkRequest,zip,encodeData,get,post,getConfig,openUrlInBrowser,createRadioButtons,createRadioButtons2,createArtboard,hexToRgb,unique,SMPanel} from "./common";
var uiKitUrlKey = "com.sketchplugins.wechat.uikiturl";
var colorUrlKey = "com.sketchplugins.wechat.colorurl";

export function syncSettingAction(context) {

    var i18 = _(context).syncSetting;

    var pluginSketch = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("library").path();

    var manifestPath = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("config.json").path(),
        manifest = NSJSONSerialization.JSONObjectWithData_options_error(NSData.dataWithContentsOfFile(manifestPath), NSJSONReadingMutableContainers, nil);

    // 如果 系统key 中有，就从系统key 中读取，没有再去读取 config.json 
    var uiKitUrlInKey = NSUserDefaults.standardUserDefaults().objectForKey(uiKitUrlKey);
    var colorUrlInKey = NSUserDefaults.standardUserDefaults().objectForKey(colorUrlKey);

    var saveUIKIT = uiKitUrlInKey || manifest.UIKIT;
    var saveCOLOR = colorUrlInKey || manifest.COLOR;

    var obj = [];
    for (var i = 0; i < saveUIKIT.length; i++) {
        obj.push({
            title: encodeURIComponent(saveUIKIT[i].title),
            uikit: encodeURIComponent(saveUIKIT[i].url)
        })
    }
    for (var k = 0; k < saveCOLOR.length; k++) {
        var flagT = false;
        for (var j = 0; j < obj.length; j++) {
            if (obj[j].title == saveCOLOR[k].title) {
                flagT = true;
                obj[j].color = encodeURIComponent(saveCOLOR[k].url);
            }
        }
        if (!flagT) {
            obj.push({
                title: encodeURIComponent(saveCOLOR[k].title),
                color: encodeURIComponent(saveCOLOR[k].url)
            })
        }
    }


    var windowObject = SMPanel({
        url: pluginSketch + "/panel/syncSetting.html",
        width: 462,
        height: 548,
        data: {
            list: obj,
            i18: i18
        },
        hiddenClose: false,
        floatWindow: true,
        identifier: "syncSetting",
        callback: function (data) {
            if (data.type == 'save') {
                var UIKIT = [];
                var COLOR = [];
                for (var i = 0; i < data.data.length; i++) {
                    if (data.data[i].color != '') {
                        COLOR.push({
                            title: data.data[i].title,
                            url: data.data[i].color
                        })
                    }
                    if (data.data[i].uikit != '') {
                        UIKIT.push({
                            title: data.data[i].title,
                            url: data.data[i].uikit
                        })
                    }
                }
                manifest.UIKIT = UIKIT;
                manifest.COLOR = COLOR;
                NSUserDefaults.standardUserDefaults().setObject_forKey(UIKIT, uiKitUrlKey);
                NSUserDefaults.standardUserDefaults().setObject_forKey(COLOR, colorUrlKey);
                context.document.showMessage(i18.m1);

            }
        }
    });
    var ga = new Analytics(context);
    if (ga) ga.sendEvent('syncSetting', 'confirm');
}