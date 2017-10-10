@import "common.js"

var symbolCodeKey = "com.sketchplugins.wechat.symbolCode";

function getSymbolCode(context) {
    if(context.selection.length == 0){
        return;
    }
    var selection = context.selection[0];
    if(selection.className() == 'MSSymbolInstance'){
        var code = decodeURIComponent(encodeURIComponent(context.command.valueForKey_onLayer_forPluginIdentifier("symbolKey", context.selection[0].symbolMaster(), symbolCodeKey)));
        for (var key in selection.overrides()) {
            for(var i = 0;i<selection.symbolMaster().children().length;i++){
                if(key == selection.symbolMaster().children()[i].objectID()){
                    code = code.replace(selection.symbolMaster().children()[i].stringValue(),selection.overrides()[key]);
                    break;
                }
            }
        }
    }
    paste(code);
    context.document.showMessage('代码已经放入剪贴板');
    var ga = new Analytics(context);
    if (ga) ga.sendEvent('code', 'get');
}

function setSymbolCode(context) {
    if(context.selection[0].className() == 'MSSymbolMaster'){
        var pluginSketch = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("library").path();
        SMPanel({
            url: pluginSketch + "/panel/setCode.html",
            width: 400,
            height: 400,
            data: {
                
            },
            hiddenClose: false,
            floatWindow: false,
            identifier: "setCode",
            callback: function (data) {
                context.command.setValue_forKey_onLayer_forPluginIdentifier(data.data, "symbolKey", context.selection[0], symbolCodeKey);
                context.document.showMessage('设置成功');
            },
            closeCallback: function () {
                
            }
        });
        var ga = new Analytics(context);
        if (ga) ga.sendEvent('code', 'set');
    }

    
}


var onRun = function (context) {
    setSymbolCode(context);
}