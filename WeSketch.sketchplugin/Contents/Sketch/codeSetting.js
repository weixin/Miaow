@import "common.js"
var codeKey = "com.sketchplugins.wechat.codetype";


var onRun = function(context) {
	var settingsWindow = COSAlertWindow.new();
	settingsWindow.addButtonWithTitle("保存");
	settingsWindow.addButtonWithTitle("取消");
	settingsWindow.setMessageText("获取代码设置");

    settingsWindow.addTextLabelWithValue("代码类型");
	var key = NSUserDefaults.standardUserDefaults().objectForKey(codeKey) || '';

    var ButtonList = [];
    ButtonList.push('标准 px');
    ButtonList.push('小程序 rpx');

    var choice = 0;
    if(key == 'rpx'){
    	choice = 1;
    }


	var scaleOptionsMatrix = createRadioButtons(ButtonList,choice);
	settingsWindow.addAccessoryView(scaleOptionsMatrix);

	var response = settingsWindow.runModal();
	if (response == "1000") {
		var uikit = scaleOptionsMatrix.selectedCell();
		var index = [uikit tag];
		if(index == 1){
  			NSUserDefaults.standardUserDefaults().setObject_forKey('rpx', codeKey);
		}else{
  			NSUserDefaults.standardUserDefaults().setObject_forKey('px', codeKey);
		}
       	NSApp.displayDialog('设置成功');
	}
}