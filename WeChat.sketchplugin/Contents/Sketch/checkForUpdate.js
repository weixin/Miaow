var checkForUpdates = function(context) {

	context.document.showMessage("检查更新中...");

	var json = NSJSONSerialization.JSONObjectWithData_options_error(NSData.dataWithContentsOfURL(NSURL.URLWithString("https://github.com/weixin/weDesgin/configuration.json")), 0, nil),
		currentVersion = json.valueForKey("currentVersion"),
		currentVersionAsInt = getVersionNumberFromString(currentVersion),
		installedVersion = context.plugin.version(),
		installedVersionAsInt = getVersionNumberFromString(installedVersion),
		updateAvailable = currentVersionAsInt > installedVersionAsInt,
		updateAlert = getAlertWindow();

		updateAlert.setMessageText(updateAvailable ? "有新的升级包" : "没有更新");
		if (updateAvailable) {
			updateAlert.setInformativeText("最新版本是 " + currentVersion + " 你现在的版本是 " + installedVersion + "，你需要跳转到网页下载新的更新吗？");
			updateAlert.addButtonWithTitle("升级");
			updateAlert.addButtonWithTitle("暂不");
		} else {
			updateAlert.setInformativeText("你已经在用最新的啦 👍");
			updateAlert.addButtonWithTitle("确定");
		}

		var response = updateAlert.runModal();
		if (updateAvailable && response == "1000") {
			var websiteURL = NSURL.URLWithString(json.valueForKey("websiteURL"));
			NSWorkspace.sharedWorkspace().openURL(websiteURL);
		}
	
}