var selectionDom = "com.sketchplugins.wechat.selectionDom";
var selectionDom1 = "com.sketchplugins.wechat.selectionDom1";
var selectionDom2 = "com.sketchplugins.wechat.selectionDom2";

var onSelectionChanged = function(context) {
	var action = context.actionContext;
    var document = action.document;
    var selection = action.newSelection;
    var oldSelection = NSUserDefaults.standardUserDefaults().objectForKey(selectionDom) || '';

    var count = selection.count();
    var message = '';
    var saveMessage = [];

    if (count != 0) {
    	if (count == 1) {
    		 message = selection[0].objectID();
        } else if(count == 2){
        	for(var i = 0;i<count;i++){
                if(oldSelection == selection[i].objectID()){
                    saveMessage.unshift(selection[i]);
                }else{
                    saveMessage.push(selection[i]);
                }
	    	}
            message = saveMessage[0].objectID() + ',' + saveMessage[1].objectID();
        }else{
            message = '';
        }
    }
    // document.showMessage(message);
    NSUserDefaults.standardUserDefaults().setObject_forKey(message, selectionDom);
    if(saveMessage.length > 1){
        context.command.setValue_forKey_onLayer_forPluginIdentifier(saveMessage[0].objectID(), "selection1", saveMessage[0], selectionDom1);
        context.command.setValue_forKey_onLayer_forPluginIdentifier(saveMessage[1].objectID(), "selection2", saveMessage[1], selectionDom2);
    }
   



};