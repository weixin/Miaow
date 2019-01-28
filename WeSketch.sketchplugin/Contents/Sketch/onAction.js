@import "toolbar.js";
@import "checkForUpdate.js";
@import "common.js"

var selectionDom = "com.sketchplugins.wechat.selectionDom";
var selectionDom1 = "com.sketchplugins.wechat.selectionDom1";
var selectionDom2 = "com.sketchplugins.wechat.selectionDom2";
var toolbarAutoShow = "com.sketchplugins.wechat.toolbarautoshow";
var updateAutoShow = "com.sketchplugins.wechat.updateAutoShow";

var onSelectionChanged = function (context) {
    var action = context.actionContext;
    var document = action.document;
    var selection = action.newSelection;

    var count = selection.count();
    var message = '';
    var saveMessage = [];

    if (count == 1 || count == 2) {
        var oldSelection = NSUserDefaults.standardUserDefaults().objectForKey(selectionDom) || '';
        if (count == 1) {
            message = selection[0].objectID();
            context.command.setValue_forKey_onLayer_forPluginIdentifier(selection[0].objectID(), "selection1", selection[0], selectionDom1);
        } else if (count == 2) {
            for (var i = 0; i < count; i++) {
                if (oldSelection == selection[i].objectID()) {
                    saveMessage.unshift(selection[i]);
                } else {
                    saveMessage.push(selection[i]);
                }
            }
            message = saveMessage[0].objectID() + ',' + saveMessage[1].objectID();
        }
        NSUserDefaults.standardUserDefaults().setObject_forKey(message, selectionDom);
    }
    if (saveMessage.length == 2) {
        context.command.setValue_forKey_onLayer_forPluginIdentifier(saveMessage[0].objectID(), "selection1", saveMessage[0], selectionDom1);
        context.command.setValue_forKey_onLayer_forPluginIdentifier(saveMessage[1].objectID(), "selection2", saveMessage[1], selectionDom2);
    }
};




var onOpenDocument = function (context) {
    var toolbarAuto = NSUserDefaults.standardUserDefaults().objectForKey(toolbarAutoShow) || '';
    if (toolbarAuto != 'false') {
        toolbar(context, true);
    }
    var syncWeChatKey = 'com.sketchplugins.wechat.syncWeChatKey';
    var syncWeChatTime = 'com.sketchplugins.wechat.syncWeChatTime';
    var uiKitUrlKey = "com.sketchplugins.wechat.newuikiturl";
    var uiKitUrlSave = "com.sketchplugins.wechat.newuikitsaveurl";
    var uiKitLocalSave = 'com.sketchplugins.wechat.newuikitdatabasePath';

    var url = NSUserDefaults.standardUserDefaults().objectForKey(uiKitUrlSave);
    if(!url){
        return;
    }

    var time = NSUserDefaults.standardUserDefaults().objectForKey(syncWeChatTime);
    var myDate = new Date();
    var toDay = myDate.toLocaleDateString();
    if(toDay == time){
        return;
    }else{
        NSUserDefaults.standardUserDefaults().setObject_forKey(toDay, syncWeChatTime);
    }


    var returnData = networkRequest([url.replace('.sketch','.json')]);

    var jsonData = [[NSString alloc] initWithData: returnData encoding: NSUTF8StringEncoding];
    jsonData = JSON.parse(jsonData);
    var currentVersion = jsonData.VERSION;


    var version = NSUserDefaults.standardUserDefaults().objectForKey(syncWeChatKey);
    if(version != currentVersion){
        var updateAlert = dialog(context);
        updateAlert.setMessageText('检查到有新的 libary，是否更新？');
        updateAlert.setInformativeText('更新可能需要10-15秒下载文件');
        updateAlert.addButtonWithTitle('确认');
        updateAlert.addButtonWithTitle('取消');
        var response = updateAlert.runModal();
        if (response == "1000") {
          NSUserDefaults.standardUserDefaults().setObject_forKey(currentVersion, syncWeChatKey);
          function getUIKIT(content) {
            var List = NSUserDefaults.standardUserDefaults().objectForKey(uiKitUrlKey) || getConfig('config', context).UIKIT;
            return List;
          };
          var uikitList = getUIKIT(context);
          var data = networkRequest([url]);
          var save = NSSavePanel.savePanel();
          var databasePath = NSUserDefaults.standardUserDefaults().objectForKey(uiKitLocalSave);
          data = NSData.alloc().initWithData(data);
          data.writeToFile_atomically(databasePath, true);
          context.document.showMessage('导入成功，请在 Symbol 中使用您的 Library');
        }
    }

};