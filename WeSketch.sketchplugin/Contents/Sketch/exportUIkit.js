@import "common.js"

var onRun = function (context) {

	var save = NSSavePanel.savePanel();
	save.setNameFieldStringValue("uikit.sketch");
	save.setAllowedFileTypes([@"sketch"]);
	save.setAllowsOtherFileTypes(false);
	save.setExtensionHidden(false);
	if (save.runModal()) {
		var pages = context.document.pages();
		var newDoc = MSDocument.alloc().init();
		var objec = {};
		var firstSymbols = false;
		for(var i = 0;i<pages.count();i++){
			if(pages[i].name() != 'Symbols' && firstSymbols == false){
			  continue;
			}
			if(pages[i].name() == 'Symbols' && firstSymbols == true){
			  continue;
			}
			var newPage = newDoc.addBlankPage();
			newPage.setName(pages[i].name());
			var artboards = pages[i].artboards();
		    newPage.addLayers(artboards);
		    if(pages[i].name() == 'Symbols'){
		      firstSymbols = true;
		      i = -1;
		    }
		}
		var pages2 = newDoc.pages();
		for(var i = 0;i<pages2.count();i++){
			var artboards = pages2[i].artboards();
			if(artboards.length == 0){
				newDoc.removePage(pages2[i]);
			}
			for(var k = 0;k<artboards.count();k++){
				var artname = artboards[k].name();
				if(!objec[artname]){
					objec[artname] = 1;
				}else{
					objec[artname] = objec[artname] + 1;
					artboards[k].setName(artname +' '+ objec[artname]);
				}
			}
		}
		var filePath = NSURL.fileURLWithPath(save.URL().path());
		newDoc.writeToURL_ofType_forSaveOperation_originalContentsURL_error_(filePath, "com.bohemiancoding.sketch.drawing", 
		NSSaveOperation, nil, nil);
  		context.document.showMessage('导出 UIKit 成功');

	}
}