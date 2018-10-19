@import "common.js"

function checkForUpdate(context, auto) {
	var i18 = _(context).checkForUpdate;
	if (!auto) {
		context.document.showMessage(i18.m1 + '...');
	}
	var returnData = networkRequest([getConfig('config', context).VERSION])
	var jsonData = [[NSString alloc] initWithData: returnData encoding: NSUTF8StringEncoding];
	jsonData = JSON.parse(jsonData);
	var currentVersion = jsonData.currentVersion,
		message = jsonData.message,
		installedVersion = context.plugin.version();
	var updateAvailable = true;
	if (currentVersion == installedVersion) {
		updateAvailable = false;
	}
	if (auto && updateAvailable == false) {
		return false;
	}
	var updateAlert = dialog(context);

	updateAlert.setMessageText(updateAvailable ? i18.m2 : i18.m3);
	if (updateAvailable) {
		updateAlert.setInformativeText(i18.m4 + currentVersion + i18.m5 + installedVersion + "，" + i18.m6 + "？");
		if (message) {
			updateAlert.setInformativeText(message);
		}
		updateAlert.addButtonWithTitle(i18.m7);
		updateAlert.addButtonWithTitle(i18.m8);
	} else {
		updateAlert.addButtonWithTitle(i18.m9);
	}

	var response = updateAlert.runModal();
	if (updateAvailable && response == "1000") {
		var websiteURL = NSURL.URLWithString(jsonData.websiteURL);
		NSWorkspace.sharedWorkspace().openURL(websiteURL);
	}
}

var onRun = function (context) {
	checkForUpdate(context);
}