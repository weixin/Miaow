@import "config.js"
@import "common.js"
@import "organizer.js"

var onRun = function (context) {
	context.document.showMessage("下载更新中...");
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

		//先处理symbol
		(function(){
			var sourceSymbol = sourceDoc.documentData().allSymbols();
			var localSymobl = doc.documentData().allSymbols();
			var pushAllArtboards = [];
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
	        				var lolG = localSymobl[g];
	        				savePage.addLayers([lolG]);
	        				//删除原始的
	        				localSymobl[g].removeFromParent();
	        				//添加线上的到画布
	        				var newSymbol = s;
	        				var rect = s.rect();
	        				newSymbol.rect = rect;
	        				pushAllArtboards.push(newSymbol);
	        			}
	        			deleteObject[g] = true;
	        			break;
	        		}
	        	}
	        	if(!flagForNewSymbol){
	        		//没找着，直接添加source的到现有的画布
	        		var newSymbol = s;
					var rect = s.rect();
					newSymbol.rect = rect;
					pushAllArtboards.push(newSymbol);
	        		
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
	        doc.setCurrentPage(doc.documentData().symbolsPageOrCreateIfNecessary());
			var currentPage = context.document.currentPage();
			currentPage.addLayers(pushAllArtboards);
		})()
		


		//再处理页面

		for(var i=0;i<sourcePages.count();i++){
			var sourcePageName = sourcePages[i].name();
			if(sourcePageName == 'Symbols'){
				continue;
			}
			var flagForOldPage = false;
			for(var k=0;k<pages.count();k++){
				//如果有同一个page名
				if(pages[k].name() == 'Symbols'){
					continue;
				}
				if(encodeURI(pages[k].name()) == encodeURI(sourcePageName)){
					flagForOldPage = true;

					//比对一下
					var sourceSymbol = sourcePages[i].artboards();
		   			var localSymobl = pages[k].artboards();
		   			var deleteObject = {};
		   			var pushAllArtboards = [];

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
		            				var lolG = localSymobl[g];
		            				savePage.addLayers([lolG]);
		            				//删除原始的
		            				localSymobl[g].removeFromParent();
		            				//添加线上的到画布
		            				var newSymbol = s;
		            				var rect = s.rect();
		            				newSymbol.rect = rect;
		            				pushAllArtboards.push(newSymbol);
		            			}
		            			deleteObject[g] = true;
		            			break;
		            		}
		            	}
		            	if(!flagForNewSymbol){
		            		//没找着，直接添加source的到现有的画布
		            		var newSymbol = s;
            				var rect = s.rect();
            				newSymbol.rect = rect;
            				pushAllArtboards.push(newSymbol);
		            		
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
		            pages[k].addLayers(pushAllArtboards);
					break;
				}
			}
			//如果没有直接添加一个新的page
			// 不行，直接新增page有bug，没bug，要先添加symbol

			if(!flagForOldPage){
				addPageCount++;	
				// var newPage = doc.addBlankPage();
				// var sourceSymbol = sourcePages[i].artboards();
				// var newArtBoards = [];
				// for(var i = 0;i<sourceSymbol.count();i++){
				// 	newArtBoards.push(sourceSymbol[i].copy());
				// }
				// newPage.setName(sourcePageName);
				// newPage.addLayers(newArtBoards);
				doc.documentData().addPage(sourcePages[i]);
			}
			doc.setCurrentPage(doc.documentData().symbolsPageOrCreateIfNecessary());
		}
		
	}
	sourceDoc.close();
	sourceDoc = nil;
	var alertData = '新增'+ addPageCount + '个页面，' + addSymbolCount + '个组，有'+ CTCount + '个冲突，';
	alertData += 'UIKIT已经导入成功！';
	if(CTCount>0){
		doc.setCurrentPage(savePage);
		Organizer(context);
	}
	NSApp.displayDialog(alertData);
}

function isSame(a,b){
	var layers = a.layers();

	//视图不一样大
	if(encodeURI(a.rect().toString()) != encodeURI(b.rect().toString())){
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
