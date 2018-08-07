import {_,dialog,errorDialog,initDefaults,saveDefaults,uploadContext,paste,rgb,request,networkRequest,zip,encodeData,get,post,getConfig,openUrlInBrowser,createRadioButtons,createRadioButtons2,createArtboard,hexToRgb,unique,SMPanel} from "./common";
import {getLink} from "./link";
// @import "commonPreviewJson.js"

var localPreview = function (context) {
	function chooseFilePath() {
		var save = NSSavePanel.savePanel();
		save.setAllowsOtherFileTypes(true);
		save.setNameFieldStringValue("preview");
		save.setExtensionHidden(false);
		if (save.runModal()) {
			return save.URL().path();
		} else {
			return false;
		}
	}
	var filePath = chooseFilePath();
	if (!filePath) {
		return;
	}
	var flag = commonPreviewJson(context, filePath);
	if (!flag) {
		return;
	}
	NSWorkspace.sharedWorkspace().activateFileViewerSelectingURLs(NSArray.arrayWithObjects(NSURL.fileURLWithPath(filePath)));
}

export function localPreviewAction(context) {
	localPreview(context);
}