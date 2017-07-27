@import "common.js"
@import "link.js"
@import "commonPreview.js"

var localPreview =function(context){
	function chooseFilePath(){
		var save = NSSavePanel.savePanel();
		save.setAllowsOtherFileTypes(true);
		save.setExtensionHidden(false);
		if(save.runModal()){
			return save.URL().path();
		}else{
			return false;
		}
	}
	var filePath = chooseFilePath();
	commonCodeJson(context,filePath);
    NSApp.displayDialog('导出成功');
}

var onRun = function(context){
	localPreview(context);
}