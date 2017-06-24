@import "common.js"

function checkForUpdate(context,auto){
	if(!auto){
		context.document.showMessage("正在检查更新...");
	}
	var json = NSJSONSerialization.JSONObjectWithData_options_error(NSData.dataWithContentsOfURL(NSURL.URLWithString(getConfig('config',context).VERSION)), 0, nil),
	currentVersion = json.valueForKey("currentVersion"),
	message = json.valueForKey("message"),
	installedVersion = context.plugin.version();
	var updateAvailable = true;
	if(currentVersion == installedVersion){
		updateAvailable = false;
	}
	if(auto && updateAvailable == false){
		return false;
	}
	var updateAlert = COSAlertWindow.new();

	updateAlert.setMessageText(updateAvailable ? "发现新版本" : "已经是最新版啦 👍");
	if (updateAvailable) {
		updateAlert.setInformativeText("WeSketch 最新版本为 " + currentVersion + " 当前版本为 " + installedVersion + "，是否自动下载更新？");
		if(message){
			updateAlert.setInformativeText(message);
		}
		updateAlert.addButtonWithTitle("升级");
		updateAlert.addButtonWithTitle("暂不");
	} else {
		updateAlert.addButtonWithTitle("确定");
	}

	var response = updateAlert.runModal();
	if (updateAvailable && response == "1000") {
		var websiteURL = NSURL.URLWithString(json.valueForKey("websiteURL"));
		NSWorkspace.sharedWorkspace().openURL(websiteURL);
	}
}

var onRun = function(context) {
	checkForUpdate(context);
}