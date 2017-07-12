@import "common.js"

var onRun = function(context){
	var exportSVGJson = {};
	var pageCount = 1;

	function relationship(doc){
		var kPluginDomain = "com.sketchplugins.wechat.link";
		var linkLayersPredicate = NSPredicate.predicateWithFormat("userInfo != nil && function(userInfo, 'valueForKeyPath:', %@).destinationArtboardID != nil", kPluginDomain),
			linkLayers = doc.currentPage().children().filteredArrayUsingPredicate(linkLayersPredicate),
			loop = linkLayers.objectEnumerator(),
			connections = [],
			linkLayer, destinationArtboardID, destinationArtboard, isCondition, linkRect;

		while (linkLayer = loop.nextObject()) {
			var children = {};
			children.x = encodeURIComponent(linkLayer.rect().origin.x);
			children.y = encodeURIComponent(linkLayer.rect().origin.y);
			children.width = encodeURIComponent(linkLayer.absoluteRect().size().width);
			children.height = encodeURIComponent(linkLayer.absoluteRect().size().height);
			destinationArtboardID = context.command.valueForKey_onLayer_forPluginIdentifier("destinationArtboardID", linkLayer, kPluginDomain);
			var Message = destinationArtboardID.split('____');
			destinationArtboard = doc.currentPage().children().filteredArrayUsingPredicate(NSPredicate.predicateWithFormat("(objectID == %@) || (userInfo != nil && function(userInfo, 'valueForKeyPath:', %@).artboardID == %@)", Message[1], kPluginDomain, Message[1])).firstObject();

			if (destinationArtboard && Message[0] == linkLayer.objectID()) {
				children.to = encodeURIComponent(destinationArtboard.objectID());
			}
			exportSVGJson[linkLayer.parentArtboard().objectID()].children[linkLayer.objectID()] = children;
		}
	}

	function exportHTML(filePath){
    	var htmlPath = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("preview.html").path();
        var previewData = NSData.dataWithContentsOfFile(htmlPath);
        previewData = [[NSString alloc] initWithData:previewData encoding:NSUTF8StringEncoding];
		previewData = previewData.replace('{{json}}',JSON.stringify(exportSVGJson));
        writeFile({content:previewData,path:filePath,fileName:'index.html'})
		NSApp.displayDialog('导出成功');

	}

	function exportSVG(layer,context,file,fileName,scale){
		var slice = MSExportRequest.exportRequestsFromExportableLayer(layer).firstObject();
	    slice.scale = scale;
	    slice.format = 'png';
	    var savePath = file + '/images/' + fileName + '.png';
	    context.document.saveArtboardOrSlice_toFile(slice, savePath);
	    exportSVGJson[layer.objectID()] = {};
	    exportSVGJson[layer.objectID()].name = fileName;
	    exportSVGJson[layer.objectID()].width = encodeURIComponent(layer.absoluteRect().size().width);
	    exportSVGJson[layer.objectID()].children = {};
	}

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

	function writeFile(options) {
	        var content = NSString.stringWithString(options.content),
	        savePathName = [];
	    NSFileManager
	        .defaultManager()
	        .createDirectoryAtPath_withIntermediateDirectories_attributes_error(options.path, true, nil, nil);

	    savePathName.push(
	        options.path,
	        "/",
	        options.fileName
	    );
	    savePathName = savePathName.join("");
	    content.writeToFile_atomically_encoding_error(savePathName, false, 4, null);
	}

	function writeDirectory(filePath){
		NSFileManager
	            .defaultManager()
	            .createDirectoryAtPath_withIntermediateDirectories_attributes_error(filePath, true, nil, nil);
	}

	var filePath = chooseFilePath();
	writeDirectory(filePath);
	var scale = 1;
	var linkJson = {};

	var nowPage = context.document.currentPage();
	var artBoards = nowPage.artboards();
	for(var i = 0;i<artBoards.length;i++){
		var size = artBoards[i].absoluteRect().size().width;
		if(size == 320 || size == 414 || size == 375){
			scale = 2;
		}
		var fileName = 'page';
		exportSVG(artBoards[i],context,filePath,fileName+(pageCount++),scale);
	}
	relationship(context.document);
	exportHTML(filePath);
}