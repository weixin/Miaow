@import "common.js"
var codeKey = "com.sketchplugins.wechat.codetype";


var onRun = function (context) {
	var i18 = _(context).codeSetting;

	var settingsWindow = COSAlertWindow.new();
	settingsWindow.addButtonWithTitle(i18.m1);
	settingsWindow.addButtonWithTitle(i18.m2);
	settingsWindow.setMessageText(i18.m3);

	settingsWindow.addTextLabelWithValue(i18.m4);
	var key = NSUserDefaults.standardUserDefaults().objectForKey(codeKey) || '';

	var ButtonList = [];
	ButtonList.push(i18.m5);
	ButtonList.push(i18.m6);

	var choice = 0;
	if (key == 'rpx') {
		choice = 1;
	}


	var scaleOptionsMatrix = createRadioButtons(ButtonList, choice);
	settingsWindow.addAccessoryView(scaleOptionsMatrix);

	var response = settingsWindow.runModal();
	if (response == "1000") {
		var uikit = scaleOptionsMatrix.selectedCell();
		var index = [uikit tag];
		if (index == 1) {
			NSUserDefaults.standardUserDefaults().setObject_forKey('rpx', codeKey);
		} else {
			NSUserDefaults.standardUserDefaults().setObject_forKey('px', codeKey);
		}
		context.document.showMessage(i18.m7);
	}
}