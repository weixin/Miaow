import {_,dialog,errorDialog,initDefaults,saveDefaults,uploadContext,paste,rgb,request,networkRequest,zip,encodeData,get,post,getConfig,openUrlInBrowser,createRadioButtons,createRadioButtons2,createArtboard,hexToRgb,unique,SMPanel} from "./common";

var onRun = function (context) {
	var i18 = _(context).exportColor;
	var doc = context.document;
	var colors = doc.documentData().assets().colors();

	if (colors.length > 0) {

		var save = NSSavePanel.savePanel();
		save.setNameFieldStringValue("untitled.json");
		save.setAllowedFileTypes(["json"]);
		save.setAllowsOtherFileTypes(false);
		save.setExtensionHidden(false);

		if (save.runModal()) {


			var palette = [];

			for (var i = 0; i < colors.length; i++) {
				palette.push({
					red: colors[i].red() * 255,
					green: colors[i].green() * 255,
					blue: colors[i].blue() * 255,
					alpha: colors[i].alpha()
				});
			};


			var fileData = {
				"colors": palette
			}

			var filePath = save.URL().path();


			var file = NSString.stringWithString(JSON.stringify(fileData));
			file.writeToFile_atomically_encoding_error(filePath,true,NSUTF8StringEncoding,null);
			context.document.showMessage(i18.m1);

		}

	} else {
		errorDialog(context,i18.m2);
	}
}