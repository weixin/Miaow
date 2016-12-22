@import "config.js"
@import "common.js"

var onRun = function (context) {
	context.document.showMessage("检查更新中...");
	var theResponseData = request(UIKIT);
	var data = [[NSData alloc] initWithData:theResponseData];
	var basepath = [[NSFileManager defaultManager] currentDirectoryPath];
	var databasePath = [[NSString alloc] initWithString: [basepath stringByAppendingPathComponent:@"Users/Shared/uikit.sketch"]]
	[data writeToFile:databasePath atomically:true];

	var sourceDoc = MSDocument.new();
	if(sourceDoc.readFromURL_ofType_error(NSURL.fileURLWithPath(databasePath), "com.bohemiancoding.sketch.drawing", nil)) {
		var doc = context.document;
		var savePage;
		var pages = doc.pages();

		var sourcePages = sourceDoc.documentData().pages();

		var addSymbolCount = 0;
		var CTCount = 0;
		var addPageCount = 0;


		for(var i=0;i<sourcePages.count();i++){
			var sourcePageName = sourcePages[i].name();
			var flagForOldPage = false;
			for(var k=0;k<pages.count();k++){
				//如果有同一个page名
				if(encodeURI(pages[k].name()) == encodeURI(sourcePageName)){
					flagForOldPage = true;

					//比对一下
					var sourceSymbol = sourcePages[i].artboards();
		   			var localSymobl = pages[k].artboards();
		   			var deleteObject = {};

		            for(var f=0;f<sourceSymbol.count();f++){
		            	var s = sourceSymbol[f];
		            	var flagForNewSymbol = false;
		            	for(var g=0;g<localSymobl.count();g++){
		            		if(encodeURI(s.name()) == encodeURI(localSymobl[g].name())){
		            			flagForNewSymbol = true;

		            			// 找出相同名字的，内容相同不处理，内容不同，使用source的，并把local的放到save
		            			if(!isSame(s,localSymobl[g])){
		            				if(CTCount == 0){
		            					savePage = doc.addBlankPage();
										savePage.setName('更新冲突');
		            				}
		            				CTCount ++;
		            				//添加原始的到冲突
		            				savePage.addLayers([localSymobl[g].copy()]);
		            				//删除原始的
		            				localSymobl[g].removeFromParent();
		            				localSymobl[g].adjustFrameToFit();
		            				//添加线上的到画布
		            				pages[k].addLayers([s.copy()]);
		            			}
		            			deleteObject[g] = true;
		            			break;
		            		}
		            	}
		            	if(!flagForNewSymbol){
		            		//没找着，直接添加source的到现有的画布
		            		pages[k].addLayers([s.copy()]);
		            		addSymbolCount++;
		            	}
		            }
		            //没找着，直接添加source的到冲突画布
		            for(var g=0;g<localSymobl.count();g++){
		            	if(!deleteObject[g]){
		            		if(CTCount == 0){
            					savePage = doc.addBlankPage();
								savePage.setName('更新冲突');
            				}
		            		CTCount ++;
		            		var saveSymbol = localSymobl[g];
		            		savePage.addLayers([saveSymbol]);
		            	}
		            }
					break;
				}
			}
			//如果没有

			if(!flagForOldPage){
				addPageCount++;
				doc.documentData().addPage(sourcePages[i]);
			}

		}
		doc.setCurrentPage(doc.documentData().symbolsPageOrCreateIfNecessary());
		NSApp.displayDialog('新增'+ addPageCount + '个页面，' + addSymbolCount + '个单元，有'+ CTCount + '个冲突，' +" UIKIT已经导入成功！");
	}
	sourceDoc.close();
	sourceDoc = nil;

}

function isSame(a,b){
	var layers = a.layers();

	//视图不一样大
	if(encodeURI(a.rect().toString()) != encodeURI(b.rect().toString())){
		return false;
	}
	if(encodeURI(a.name()) != encodeURI(b.name())){
		return false;
	}

	for(var i = 0;i < layers.length; i++){
		var layer = layers[i];
		if(encodeURI(layer.name()) != encodeURI(b.layers()[i].name())){
			return false;
		}
		switch(layer.class()){
			case 'MSTextLayer':
			if(!(encodeURI(layer.font()) == encodeURI(b.layers()[i].font()) && encodeURI(layer.stringValue()) == encodeURI(b.layers()[i].stringValue()))){
				return false;
			}
			case 'MSLayerGroup':
			case 'MSShapeGroup':
			case 'MSBitmapLayer':
				if(encodeURI(layer.rect().toString()) != encodeURI(b.layers()[i].rect().toString())){
					return false;
				}
		}
		
	}
	return true;
	
}
