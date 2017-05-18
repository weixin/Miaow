@import "common.js"

var onRun = function (context) {
	var save = NSSavePanel.savePanel();
	save.setNameFieldStringValue("uikit.sketch");
	save.setAllowedFileTypes([@"sketch"]);
	save.setAllowsOtherFileTypes(false);
	save.setExtensionHidden(false);
	if (save.runModal()) {
		var filePath = save.URL().path();
		var data = [[NSData alloc] initWithData:theResponseData];
		[data writeToFile:save atomically:true];
	}
}