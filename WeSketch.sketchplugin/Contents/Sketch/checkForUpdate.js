@import "common.js"

var onRun = function(context) {
	context.document.showMessage("正在检查更新...");
	var json = NSJSONSerialization.JSONObjectWithData_options_error(NSData.dataWithContentsOfURL(NSURL.URLWithString(getConfig('config',context).VERSION)), 0, nil),
	currentVersion = json.valueForKey("currentVersion"),
	installedVersion = context.plugin.version();
	var updateAvailable = true;
	if(currentVersion == installedVersion){
		updateAvailable = false;
	}
	var updateAlert = COSAlertWindow.new();

	updateAlert.setMessageText(updateAvailable ? "发现新版本" : "已经是最新版啦 👍");
	if (updateAvailable) {
		updateAlert.setInformativeText("最新版本为 " + currentVersion + " 当前版本为 " + installedVersion + "，前往下载更新？");
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