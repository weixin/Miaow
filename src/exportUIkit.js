import {_,dialog,errorDialog,initDefaults,saveDefaults,uploadContext,paste,rgb,request,networkRequest,zip,encodeData,get,post,getConfig,openUrlInBrowser,createRadioButtons,createRadioButtons2,createArtboard,hexToRgb,unique,SMPanel} from "./common";

var onRun = function (context) {
	var i18 = _(context).exportUIkit;

	var save = NSSavePanel.savePanel();
	save.setNameFieldStringValue("uikit.sketch");
	save.setAllowedFileTypes(["sketch"]);
	save.setAllowsOtherFileTypes(false);
	save.setExtensionHidden(false);
	if (save.runModal()) {
		var pages = context.document.pages();
		var newDoc = MSDocument.alloc().init();
		var objec = {};
		for (var i = 0; i < pages.count(); i++) {
			if (pages[i].name() != 'Symbols') {
				continue;
			}
			var newPage = newDoc.addBlankPage();
			newPage.setName(pages[i].name());
			var artboards = pages[i].artboards();
			newPage.addLayers(artboards);
		}
		var pages2 = newDoc.pages();
		for (var i = 0; i < pages2.count(); i++) {
			var artboards = pages2[i].artboards();
			if (artboards.length == 0) {
				newDoc.removePage(pages2[i]);
			}
			for (var k = 0; k < artboards.count(); k++) {
				var artname = artboards[k].name();
				if (!objec[artname]) {
					objec[artname] = 1;
				} else {
					objec[artname] = objec[artname] + 1;
					artboards[k].setName(artname + ' ' + objec[artname]);
				}
			}
		}
		var filePath = NSURL.fileURLWithPath(save.URL().path());
		newDoc.writeToURL_ofType_forSaveOperation_originalContentsURL_error_(filePath, "com.bohemiancoding.sketch.drawing",
			NSSaveOperation, nil, nil);
		context.document.showMessage(i18.m1);

	}
}