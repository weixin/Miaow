@import "config.js"

var onRun = function (context) {
  	function request(queryURL) {
		var request = NSMutableURLRequest.new();
		[request setHTTPMethod:@"GET"];
		[request setURL:[NSURL URLWithString:queryURL]];
		var error = NSError.new();
		var responseCode = null;
		var oResponseData = [NSURLConnection sendSynchronousRequest:request returningResponse:responseCode error:error];
		return oResponseData;
	}
	context.document.showMessage("检查更新中...");
	var theResponseData = request(UIKIT);
	var data = [[NSData alloc] initWithData:theResponseData];
	var sourceDoc = MSDocument.new();
	var basepath = [[NSFileManager defaultManager] currentDirectoryPath];
	var databasePath = [[NSString alloc] initWithString: [basepath stringByAppendingPathComponent:@"Users/Shared/uikit.sketch"]]
	[data writeToFile:databasePath atomically:true];

	if(sourceDoc.readFromURL_ofType_error(NSURL.fileURLWithPath(databasePath), "com.bohemiancoding.sketch.drawing", nil)) {
		var doc = context.document;
		var docData = doc.documentData();
		var sourceSymbols = sourceDoc.documentData().allSymbols();
		var addCount = 0;

		for(var i = 0;i<sourceSymbols.count();i++) {
			var symbol = sourceSymbols.objectAtIndex(i);
			var baserect = symbol.rect();
			var clonedSymbol = symbol.copy();
			var rect = clonedSymbol.rect();
			rect.origin.x = baserect.origin.x;
			rect.origin.y = baserect.origin.y;
			clonedSymbol.rect = rect;
			doc.setCurrentPage(docData.symbolsPageOrCreateIfNecessary());
			var currentPage = context.document.currentPage();
			currentPage.addLayers([clonedSymbol]);
			addCount++;
		}
		doc.showMessage(addCount+" Symbols已经导入成功！");
	}
	sourceDoc.close();
	sourceDoc = nil;

}


