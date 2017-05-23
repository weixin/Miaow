@import "common.js"

var onRun = function (context) {
	var newDoc = MSDocument.alloc().init();
	var save = NSSavePanel.savePanel();
	save.setNameFieldStringValue("uikit.sketch");
	save.setAllowedFileTypes([@"sketch"]);
	save.setAllowsOtherFileTypes(false);
	save.setExtensionHidden(false);
	if (save.runModal()) {
		var filePath = NSURL.fileURLWithPath(save.URL().path());
		newDoc.writeToURL_ofType_forSaveOperation_originalContentsURL_error_(filePath, "com.bohemiancoding.sketch.drawing", 
		NSSaveOperation, nil, nil);
	}
}