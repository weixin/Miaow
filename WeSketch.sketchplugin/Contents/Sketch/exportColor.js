@import "common.js"

var onRun = function (context) {	
	var doc = context.document;
	var colors = doc.documentData().assets().colors();
	
	if (colors.length > 0) {	
		
		var save = NSSavePanel.savePanel();
		save.setNameFieldStringValue("untitled.json");
		save.setAllowedFileTypes([@"json"]);
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
			
			[file writeToFile:filePath atomically:true encoding:NSUTF8StringEncoding error:null];
			context.document.showMessage("色板导出成功"); 

		}
		
	} else { 
		NSApp.displayDialog("请先在 Document Colors 创建你想建立的公共色"); 
	}
}