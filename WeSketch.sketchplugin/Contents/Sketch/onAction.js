@import "toolbar.js";
@import "checkForUpdate.js";

var selectionDom = "com.sketchplugins.wechat.selectionDom";
var selectionDom1 = "com.sketchplugins.wechat.selectionDom1";
var selectionDom2 = "com.sketchplugins.wechat.selectionDom2";
var toolbarAutoShow = "com.sketchplugins.wechat.toolbarautoshow";
var updateAutoShow = "com.sketchplugins.wechat.updateAutoShow";

var onSelectionChanged = function(context) {
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
        } else if(count == 2){
        	for(var i = 0;i<count;i++){
                if(oldSelection == selection[i].objectID()){
                    saveMessage.unshift(selection[i]);
                }else{
                    saveMessage.push(selection[i]);
                }
	    	}
            message = saveMessage[0].objectID() + ',' + saveMessage[1].objectID();
        }
        NSUserDefaults.standardUserDefaults().setObject_forKey(message, selectionDom);
    }
    if(saveMessage.length == 2){
        context.command.setValue_forKey_onLayer_forPluginIdentifier(saveMessage[0].objectID(), "selection1", saveMessage[0], selectionDom1);
        context.command.setValue_forKey_onLayer_forPluginIdentifier(saveMessage[1].objectID(), "selection2", saveMessage[1], selectionDom2);
    }
};




var onOpenDocument = function(context) {
    var i18nKey = "com.sketchplugins.wechat.i18n";
    var lang = NSUserDefaults.standardUserDefaults().objectForKey(i18nKey);
    if(lang == undefined){
        var macOSVersion = NSDictionary.dictionaryWithContentsOfFile("/System/Library/CoreServices/SystemVersion.plist").objectForKey("ProductVersion") + "";
        lang = NSUserDefaults.standardUserDefaults().objectForKey("AppleLanguages").objectAtIndex(0);
        lang = (macOSVersion >= "10.12")? lang.split("-").slice(0, -1).join("-"): lang;
        if(lang.indexOf('zh') > -1){
            lang = 'zhCN';
        }else{
            lang = 'enUS';
        }
        NSUserDefaults.standardUserDefaults().setObject_forKey(lang,i18nKey);
    }
    if(encodeURIComponent(lang.toString()).length != 4){
        lang = 'enUS';
        NSUserDefaults.standardUserDefaults().setObject_forKey(lang,i18nKey);
    }
    var toolbarAuto = NSUserDefaults.standardUserDefaults().objectForKey(toolbarAutoShow) || '';
    var updateAuto = NSUserDefaults.standardUserDefaults().objectForKey(updateAutoShow) || '';
    if(toolbarAuto != 'false'){
        toolbar(context,true);
    }
    if(updateAuto == 'true'){
        checkForUpdate(context,true);
    }
};