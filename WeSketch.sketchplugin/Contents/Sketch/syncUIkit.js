@import "common.js"
@import "organizer.js"
@import "syncColor.js"

function syncUIkit(context){

	var scaleOptionsMatrix;
	var uiKitUrlKey = "com.sketchplugins.wechat.uikiturl";
	var colorUrlKey = "com.sketchplugins.wechat.colorurl";

	function chooseKit(context){
		var settingsWindow = COSAlertWindow.new();
		settingsWindow.addButtonWithTitle("同步");
		settingsWindow.addButtonWithTitle("取消");

		settingsWindow.setMessageText("请选择需要同步的 UI Kit 来源");
		settingsWindow.setInformativeText("请勿在同一画板同步多个 UI Kit，以免发生错误");
		settingsWindow.setInformativeText("在管理 UI Kit -》 设置中修改同步源");
	    
		var ButtonList = [];
		var List = NSUserDefaults.standardUserDefaults().objectForKey(uiKitUrlKey) || getConfig('config',context).UIKIT;

		for(var i = 0;i < List.length;i++){
			if(List[i].title != '' && List[i].url != ''){
				var key = List[i].title;
				ButtonList.push(key);
			}
			
		}
		scaleOptionsMatrix = createRadioButtons(ButtonList,ButtonList[0]);
		settingsWindow.addAccessoryView(scaleOptionsMatrix);
		return settingsWindow.runModal();
	}

	function isSame(a,b){
		var layers = a.layers();
		if(layers.count() != b.layers().count()){
			return false;
		}
		// if(a.rect() && b.rect() && a.rect().toString() != b.rect().toString()){
		// 	return false;
		// }
		for(var i = 0;i < layers.count(); i++){
			var layer = layers[i];

			//名字顺序也会变
			if(encodeURIComponent(layer.name()) != encodeURIComponent(b.layers()[i].name())){
				return false;
			}
			if(encodeURIComponent(layer.rect().toString()) != encodeURIComponent(b.layers()[i].rect().toString())){
				return false;
			}
			
			if(layer.class() == 'MSTextLayer'){
				if(encodeURIComponent(layer.textColor().toString()) != encodeURIComponent(b.layers()[i].textColor().toString()) || encodeURIComponent(layer.font()) != encodeURIComponent(b.layers()[i].font()) || encodeURIComponent(layer.stringValue().trim()) != encodeURIComponent(b.layers()[i].stringValue().trim())){
					return false;
				}
			}
			// if(layer.class() == 'MSRectangleShape' || layer.class() == 'MSOvalShape' || layer.class() == 'MSShapePathLayer'){
				
			// }
			if(layer.class() == 'MSLayerGroup' && layer.style().fills().count() != 0){
				if(encodeURIComponent(layer.style().fills()[0].color().toString()) != encodeURIComponent(b.layers()[i].style().fills()[0].color().toString())){
					return false;
				}
			}
			if(layer.class() == 'MSLayerGroup' || layer.class() ==  'MSShapeGroup'){
				var boolChild = isSame(layer,b.layers()[i]);
				if(!boolChild){
					return false;
				}
			}
			
		}
		return true;
		
	}

	var dialog = chooseKit(context);
	if(dialog != '1000'){
		return;
	}
	var uikit = scaleOptionsMatrix.selectedCell();
	var index = [uikit tag];
	var List = NSUserDefaults.standardUserDefaults().objectForKey(uiKitUrlKey) || getConfig('config',context).UIKIT;
	var UIKITURL = List[index].url;

	var colorList = NSUserDefaults.standardUserDefaults().objectForKey(colorUrlKey) || getConfig('config',context).COLOR;
	var tbColor = '';
	for(var co = 0;co<colorList.length;co ++){
		if(colorList[co].title == List[index].title){
			SyncColor(context,colorList[co].url);
			tbColor = '\r\n色板已同步到 Document Colors，请重新打开色板查看';
			break;
		}
	}

	context.document.showMessage("下载更新中...");
	var theResponseData = networkRequest([UIKITURL]);

	var save = NSSavePanel.savePanel();
	var databasePath = save.URL().path();
	var data = [[NSData alloc] initWithData:theResponseData];
	[data writeToFile:databasePath atomically:true];
	
	
	var saveArtBoard = [];
	var sourceDoc = MSDocument.new();
	if(sourceDoc.readFromURL_ofType_error(NSURL.fileURLWithPath(databasePath), "com.bohemiancoding.sketch.drawing", nil)) {
	    var doc = context.document;
	    var savePage;
	    var pages = doc.pages();

	    var sourcePages = sourceDoc.documentData().pages();

	    var addSymbolCount = 0;
	    var addPageCount = 0;

	    var firstSymbols = false;

	    for(var i=0;i<sourcePages.count();i++){
	    	if(sourcePages[i].name() != 'Symbols' && firstSymbols == false){
	    		continue;
	    	}
	    	if(sourcePages[i].name() == 'Symbols' && firstSymbols == true){
	    		continue;
	    	}
	    	// context.document.removePage(pages[i]);
	      var saveArtBoard2 = [];
	      var sourcePageName = sourcePages[i].name();
	      var sourceSymbol = sourcePages[i].artboards();

	      var flagForOldPage = false;
	      var nowK = k;
	      for(var k=0;k<pages.count();k++){
	        //如果有同一个page名
	        if(encodeURIComponent(pages[k].name().trim()) == encodeURIComponent(sourcePageName.trim())){
	          flagForOldPage = true;

	          //比对一下
	          var localSymobl = pages[k].artboards();
	          var deleteObject = {};
	          var pushAllArtboards = [];

	          for(var f=0;f<sourceSymbol.count();f++){
	            var s = sourceSymbol[f];
	            var flagForNewSymbol = false;
	            for(var g=0;g<localSymobl.count();g++){
	              if(encodeURIComponent(s.name().trim()) == encodeURIComponent(localSymobl[g].name().trim())){
	      			context.document.removePage(pages[k]);
	                
	                flagForNewSymbol = true;

	                // 找出相同名字的，内容相同不处理，内容不同，使用source的，并把local的放到save
	                if(!isSame(s,localSymobl[g])){
	                  //添加现在画布上的到冲突
	                  saveArtBoard.push(localSymobl[g]);
	                  //删除画布上的
	                  // localSymobl[g].moveToLayer(saveArtBoard);
	                  // localSymobl[g].removeFromParent();
	                  //添加线上的到画布
	                  // pushAllArtboards.push(s);
	                }
	                deleteObject['g_'+g] = true;
	                break;
	              }
	            }
	            if(!flagForNewSymbol){
	              //没找着，直接添加source的到现有的画布
	              // saveArtBoard2.push(s);
	              // pushAllArtboards.push(s);
	              
	              addSymbolCount++;
	            }
	          }
	          //线上源中没找着，直接添加source的到冲突画布
	          for(var g=0;g<localSymobl.count();g++){
	            if(!deleteObject['g_'+g]){
	              saveArtBoard.push(localSymobl[g]);
	              // localSymobl[g].removeFromParent();
	            }
	          }

	          // 这里全部换一种实现，先将冲突提出来换到冲突画板，然后把整张画布删除再copy一份
	          // pages[k].addLayers(pushAllArtboards);

	          break;
	        }
	      }
	      
	      //如果没有直接添加一个新的page
	      // 不行，直接新增page有bug

	      if(!flagForOldPage){
	        addPageCount++; 
	      }
	      var newPage = doc.addBlankPage();
	      newPage.setName(sourcePageName);
	      newPage.addLayers(sourceSymbol);
	      // newPage.addLayers(saveArtBoard2);
	      doc.setCurrentPage(doc.documentData().symbolsPageOrCreateIfNecessary());
	      if(sourcePages[i].name() == 'Symbols'){
	      	firstSymbols = true;
	      	i = -1;
	      }
	    }
	}
	var fm  =[NSFileManager defaultManager];
    fm.removeItemAtPath_error(databasePath,nil);
	sourceDoc.close();
	sourceDoc = nil;
	var alertData = '新增'+ addPageCount + '个页面，' + addSymbolCount + '个组，';
	if(saveArtBoard.length != 0){
		alertData += '有'+ saveArtBoard.length + '个冲突，请在冲突文件page查看';
	}
	alertData += 'UIKIT已经导入成功！';
	if(addPageCount == 0 && addSymbolCount == 0 && saveArtBoard.length == 0){
		alertData = '没有新的更新！';
	}
	if(saveArtBoard.length>0){
		var savePage = doc.addBlankPage();
		savePage.setName('更新冲突');
		for(var i=0;i<saveArtBoard.length;i++){
			saveArtBoard[i].setName(saveArtBoard[i].name()+ '(Old)');
			saveArtBoard[i].moveToLayer_beforeLayer(savePage,savePage);
		}
		doc.setCurrentPage(savePage);
		Organizer(context);
	}
	if(context.document.pages()[0].children().count() == 1){
		context.document.removePage(context.document.pages()[0]);
	}

	context.document.showMessage(alertData + tbColor);
}

var onRun = function(context){
	syncUIkit(context);
}
