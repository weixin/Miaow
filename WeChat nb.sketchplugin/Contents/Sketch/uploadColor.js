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
		
		// Open save dialog and run if Save was clicked
		
		if (save.runModal()) {
			
			// Convert MSColors to rgba
			
			var palette = [];
			
			for (var i = 0; i < colors.length; i++) {
				palette.push({
					red: colors[i].red(),
					green: colors[i].green(),
					blue: colors[i].blue(),
					alpha: colors[i].alpha()	
				});
			};
			
			// Palette data

			var fileData = {
				"colors": palette
			}
			
			// Get chosen file path
			
			var filePath = save.URL().path();
			
			// Write file to specified file path
			
			var file = NSString.stringWithString(JSON.stringify(fileData));
			
			[file writeToFile:filePath atomically:true encoding:NSUTF8StringEncoding error:null];
		}
		
	} else { 
		NSApp.displayDialog("色板是空的"); 
	}
}
// let fill  = shape.style().fills().firstObject();
//   var red   = fill.color().red().toFixed(3).toString();
//   var green = fill.color().green().toFixed(3).toString();
//   var blue  = fill.color().blue().toFixed(3).toString();
//   var alpha = fill.color().alpha().toFixed(3).toString();

//   var color = [NSColor colorWithRed:red green:green blue:blue alpha:alpha];