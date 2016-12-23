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
		var saveArtBoard = [];
		var pages = doc.pages();

		var sourcePages = sourceDoc.documentData().pages();

		var addSymbolCount = 0;
		var addPageCount = 0;


		for(var i=0;i<sourcePages.count();i++){
			var sourcePageName = sourcePages[i].name();

			var flagForOldPage = false;
			for(var k=0;k<pages.count();k++){
				//如果有同一个page名

				if(encodeURIComponent(pages[k].name().trim()) == encodeURIComponent(sourcePageName.trim())){
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
		            		if(encodeURIComponent(s.name().trim()) == encodeURIComponent(localSymobl[g].name().trim())){
		            			flagForNewSymbol = true;

		            			// 找出相同名字的，内容相同不处理，内容不同，使用source的，并把local的放到save
		            			if(!isSame(s,localSymobl[g])){
		            				//添加现在画布上的到冲突
		            				saveArtBoard.push(localSymobl[g]);
		            				//删除画布上的
		            				localSymobl[g].removeFromParent();
		            				//添加线上的到画布
		            				pushAllArtboards.push(s);
		            			}
		            			deleteObject['g_'+g] = true;
		            			break;
		            		}
		            	}
		            	if(!flagForNewSymbol){
		            		//没找着，直接添加source的到现有的画布
            				pushAllArtboards.push(s);
		            		
		            		addSymbolCount++;
		            	}
		            }
		            //没找着，直接添加source的到冲突画布
		            for(var g=0;g<localSymobl.count();g++){
		            	if(!deleteObject['g_'+g]){
		            		saveArtBoard.push(localSymobl[g].copy());
		            		localSymobl[g].removeFromParent();
		            	}
		            }
		            pages[k].addLayers(pushAllArtboards);
					break;
				}
			}
			//如果没有直接添加一个新的page
			// 不行，直接新增page有bug

			if(!flagForOldPage){
				addPageCount++;	
				var newPage = doc.addBlankPage();
				var sourceSymbol = sourcePages[i].artboards();
				newPage.setName(sourcePageName);
				newPage.addLayers(sourceSymbol);
			}
			doc.setCurrentPage(doc.documentData().symbolsPageOrCreateIfNecessary());
		}
	}
	sourceDoc.close();
	sourceDoc = nil;
	var alertData = '新增'+ addPageCount + '个页面，' + addSymbolCount + '个组，有'+ saveArtBoard.length + '个冲突，';
	alertData += 'UIKIT已经导入成功！';
	if(saveArtBoard.length>0){
		var savePage = doc.addBlankPage();
		savePage.setName('更新冲突');
		savePage.addLayers(saveArtBoard);
		doc.setCurrentPage(savePage);
		Organizer(context);
	}
	NSApp.displayDialog(alertData);
}

function isSame(a,b){
	var layers = a.layers();

	for(var i = 0;i < layers.length; i++){
		var layer = layers[i];
		//名字顺序也会变
		if(encodeURIComponent(layer.name()) != encodeURIComponent(b.layers()[i].name())){
			return false;
		}
		if(layer.class() == 'MSTextLayer'){
			if(encodeURIComponent(layer.font()) != encodeURIComponent(b.layers()[i].font()) || encodeURIComponent(layer.stringValue().trim()) != encodeURIComponent(b.layers()[i].stringValue().trim())){
				log(encodeURIComponent(layer.font()))
				log(encodeURIComponent(b.layers()[i].font()))
				log(encodeURIComponent(layer.stringValue().trim()))
				log(encodeURIComponent(b.layers()[i].stringValue().trim()))
				return false;
			}
		}
		if(layer.class() == 'MSLayerGroup' || layer.class() == 'MSShapeGroup' || layer.class() == 'MSBitmapLayer'){
			if(encodeURIComponent(layer.rect().size.toString()) != encodeURIComponent(b.layers()[i].rect().size.toString())){
				return false;
			}
		}
		
	}
	return true;
	
}
