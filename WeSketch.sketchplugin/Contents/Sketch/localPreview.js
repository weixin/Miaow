@import "common.js"
@import "link.js"
@import "commonPreviewJson.js"

var localPreview =function(context){
	var check = checkPreviewJson(context);
	if(!check){
		return;
	}
	function chooseFilePath(){
		var save = NSSavePanel.savePanel();
		save.setAllowsOtherFileTypes(true);
		save.setNameFieldStringValue("preview");
		save.setExtensionHidden(false);
		if(save.runModal()){
			return save.URL().path();
		}else{
			return false;
		}
	}
	var filePath = chooseFilePath();
	if(!filePath){
    	return;
	}
	commonPreviewJson(context,filePath);
    NSWorkspace.sharedWorkspace().activateFileViewerSelectingURLs(NSArray.arrayWithObjects(NSURL.fileURLWithPath(filePath)));
}

var onRun = function(context){
	localPreview(context);
}