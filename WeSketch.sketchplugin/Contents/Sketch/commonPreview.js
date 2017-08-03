@import "common.js"

var previewKey = "com.sketchplugins.wechat.preview.";
var previewWrapKey = "com.sketchplugins.wechat.previewwrap";

var getCurrentPagesObject = function(context){
	return JSON.parse(NSUserDefaults.standardUserDefaults().objectForKey(previewKey+context.document.currentPage().objectID()) || "{}");
}

var getConnectionsInPage = function(page) {
	var connectionsLayerPredicate = NSPredicate.predicateWithFormat("userInfo != nil && function(userInfo, 'valueForKeyPath:', %@).isConnectionsContainer == true", previewWrapKey);
	return page.children().filteredArrayUsingPredicate(connectionsLayerPredicate).firstObject();
}

var setIndex = function(context){
	var newPreviewObject = getCurrentPagesObject(context);
	var commonPreviewIndexKey = '#_*index__#';
	if(context.selection.length==0){
		return NSApp.displayDialog('请选中 artboard 进行设置');
	}else{
		var selection = context.selection[0];
		if(selection.className() != 'MSArtboardGroup'){
			return NSApp.displayDialog('请选中 artboard 进行设置');
		}

		
		var x = selection.absoluteRect().x() + selection.rect().size.width - 20;
		var y = selection.absoluteRect().y() - 20;
		// 删除页面中所有
		var svg = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g fill="#D43737"><path d="M10,8.66666667 C11.2866667,8.66666667 12.3333333,7.61966667 12.3333333,6.33333333 C12.3333333,5.047 11.2866667,4 10,4 C8.71333333,4 7.66666667,5.047 7.66666667,6.33333333 C7.66666667,7.61966667 8.71333333,8.66666667 10,8.66666667 Z M10,4.66666667 C10.919,4.66666667 11.6666667,5.41433333 11.6666667,6.33333333 C11.6666667,7.25233333 10.919,8 10,8 C9.081,8 8.33333333,7.25233333 8.33333333,6.33333333 C8.33333333,5.41433333 9.081,4.66666667 10,4.66666667 Z"/><path d="M9.941,18.2523333 L15.0546667,10.8666667 C16.9726667,8.30966667 16.6953333,4.10666667 14.461,1.87266667 C13.2536667,0.665 11.6483333,0 9.941,0 C8.23366667,0 6.62833333,0.665 5.421,1.87233333 C3.18666667,4.10633333 2.90933333,8.30933333 4.81966667,10.8563333 L9.941,18.2523333 Z M5.89233333,2.34366667 C6.974,1.26233333 8.41166667,0.666666667 9.941,0.666666667 C11.4703333,0.666666667 12.908,1.26233333 13.9896667,2.34366667 C16.0063333,4.36 16.2546667,8.156 14.514,10.4766667 L9.941,17.081 L5.36066667,10.4666667 C3.62733333,8.156 3.876,4.36 5.89233333,2.34366667 Z"/><path d="M14.039,14.3356667 C13.8556667,14.3133333 13.6903333,14.4446667 13.669,14.6276667 C13.6476667,14.8106667 13.7783333,14.9763333 13.961,14.9976667 C17.4663333,15.4103333 19.3333333,16.5223333 19.3333333,17.1666667 C19.3333333,18.0713333 15.7826667,19.3333333 10,19.3333333 C4.21733333,19.3333333 0.666666667,18.0713333 0.666666667,17.1666667 C0.666666667,16.5223333 2.53366667,15.4103333 6.039,14.9976667 C6.22166667,14.9763333 6.35233333,14.8103333 6.331,14.6276667 C6.30933333,14.4446667 6.144,14.3126667 5.961,14.3356667 C2.45133333,14.749 0,15.913 0,17.1666667 C0,18.5746667 3.435,20 10,20 C16.565,20 20,18.5746667 20,17.1666667 C20,15.913 17.5486667,14.749 14.039,14.3356667 Z"/></g></svg>';
		svg = NSString.stringWithString(svg);
		svg = [svg dataUsingEncoding: NSUTF8StringEncoding];
		var svgImporter = MSSVGImporter.svgImporter();
		svgImporter.prepareToImportFromData(svg);
		var importedSVGLayer = svgImporter.importAsLayer();
		var svgFrame = importedSVGLayer.frame();
		importedSVGLayer.name = commonPreviewIndexKey + selection.objectID();
		[svgFrame setX:x];
		[svgFrame setY:y];
		importedSVGLayer.setIsLocked(1);
		
        context.document.currentPage().addLayers([importedSVGLayer]);
		var connectionsGroup = getConnectionsInPage(context.document.currentPage());
        if (connectionsGroup) {
        	importedSVGLayer.moveToLayer_beforeLayer(connectionsGroup,connectionsGroup);
        }else{
        	var connectionLayers = MSLayerArray.arrayWithLayers([importedSVGLayer]);
        	connectionsGroup = MSLayerGroup.groupFromLayers(connectionLayers);
        	connectionsGroup.setName("Preview");
        	connectionsGroup.setIsLocked(1);
			context.command.setValue_forKey_onLayer_forPluginIdentifier(true, "isConnectionsContainer", connectionsGroup, previewWrapKey);
        }

        if(newPreviewObject.index){
        	for(var i in newPreviewObject.index){
        		var linkLayersPredicate = NSPredicate.predicateWithFormat("userInfo != nil && function(userInfo, 'valueForKeyPath:', %@).index == '"+ newPreviewObject['index'][i].vs +"'", previewKey+context.document.currentPage().objectID());
        		var oldIndex = context.document.currentPage().children().filteredArrayUsingPredicate(linkLayersPredicate).firstObject();
        		if(oldIndex){
        			oldIndex.removeFromParent();
        		}
        	}
        }else{
			newPreviewObject['index'] = {};
        }
		newPreviewObject['index'][selection.objectID()] = {main:decodeURIComponent(encodeURIComponent(selection.objectID())),vs:decodeURIComponent(encodeURIComponent(importedSVGLayer.objectID()))};
		context.command.setValue_forKey_onLayer_forPluginIdentifier(importedSVGLayer.objectID(), "index", importedSVGLayer, previewKey+context.document.currentPage().objectID());
		NSUserDefaults.standardUserDefaults().setObject_forKey(JSON.stringify(newPreviewObject),previewKey+context.document.currentPage().objectID());
	}
}

var setDialog = function(context){
	var fx = 0;
	var dialogKey = '#_*dialog__';
	function chooseDialog(){
		var settingsWindow = COSAlertWindow.new();
		settingsWindow.addButtonWithTitle('确定');
		settingsWindow.addButtonWithTitle('取消');

		settingsWindow.setMessageText('请选择从何处划入');
	    
		var ButtonList = ['下边入','上边入','左边入','右边入','无动画'];

		fx = createRadioButtons(ButtonList,0);
		settingsWindow.addAccessoryView(fx);
		return settingsWindow.runModal();
	}
	if(context.selection.length==0){
		return NSApp.displayDialog('请选中 artboard 进行设置');
	}else{
		var selection = context.selection[0];
		if(selection.className() != 'MSArtboardGroup'){
			return NSApp.displayDialog('请选中 artboard 进行设置');
		}
		if(chooseDialog() != '1000'){
			return;
		}

		var newPreviewObject = getCurrentPagesObject(context);

		if(newPreviewObject.dialog){
			for(var i in newPreviewObject.dialog){
				if(i == selection.objectID()){
					var dialogObj = newPreviewObject['dialog'][i];
					var linkLayersPredicate = NSPredicate.predicateWithFormat("userInfo != nil && function(userInfo, 'valueForKeyPath:', %@).dialog == '"+ dialogObj.vs +"'", previewKey+context.document.currentPage().objectID());
					var oldDialog = context.document.currentPage().children().filteredArrayUsingPredicate(linkLayersPredicate).firstObject();
					if(oldDialog){
						oldDialog.removeFromParent();
					}
					delete newPreviewObject['dialog'][i];
				}
			}
		}else{
			newPreviewObject.dialog = {};
		}
		fx = fx.selectedCell();
		var index = [fx tag];
		var direction = '';
		if(index == 0){
			direction = 'b';
		}else if(index == 1){
			direction = 't';
		}else if(index == 2){
			direction = 'l';
		}else if(index == 3){
			direction = 'r';
		}
		dialogKey = dialogKey + direction + '#';
		var x = selection.absoluteRect().x() + selection.rect().size.width - 20;
		var y = selection.absoluteRect().y() - 20;
		// 删除页面中所有
		var svg = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g fill="#D43737"><path d="M10,8.66666667 C11.2866667,8.66666667 12.3333333,7.61966667 12.3333333,6.33333333 C12.3333333,5.047 11.2866667,4 10,4 C8.71333333,4 7.66666667,5.047 7.66666667,6.33333333 C7.66666667,7.61966667 8.71333333,8.66666667 10,8.66666667 Z M10,4.66666667 C10.919,4.66666667 11.6666667,5.41433333 11.6666667,6.33333333 C11.6666667,7.25233333 10.919,8 10,8 C9.081,8 8.33333333,7.25233333 8.33333333,6.33333333 C8.33333333,5.41433333 9.081,4.66666667 10,4.66666667 Z"/><path d="M9.941,18.2523333 L15.0546667,10.8666667 C16.9726667,8.30966667 16.6953333,4.10666667 14.461,1.87266667 C13.2536667,0.665 11.6483333,0 9.941,0 C8.23366667,0 6.62833333,0.665 5.421,1.87233333 C3.18666667,4.10633333 2.90933333,8.30933333 4.81966667,10.8563333 L9.941,18.2523333 Z M5.89233333,2.34366667 C6.974,1.26233333 8.41166667,0.666666667 9.941,0.666666667 C11.4703333,0.666666667 12.908,1.26233333 13.9896667,2.34366667 C16.0063333,4.36 16.2546667,8.156 14.514,10.4766667 L9.941,17.081 L5.36066667,10.4666667 C3.62733333,8.156 3.876,4.36 5.89233333,2.34366667 Z"/><path d="M14.039,14.3356667 C13.8556667,14.3133333 13.6903333,14.4446667 13.669,14.6276667 C13.6476667,14.8106667 13.7783333,14.9763333 13.961,14.9976667 C17.4663333,15.4103333 19.3333333,16.5223333 19.3333333,17.1666667 C19.3333333,18.0713333 15.7826667,19.3333333 10,19.3333333 C4.21733333,19.3333333 0.666666667,18.0713333 0.666666667,17.1666667 C0.666666667,16.5223333 2.53366667,15.4103333 6.039,14.9976667 C6.22166667,14.9763333 6.35233333,14.8103333 6.331,14.6276667 C6.30933333,14.4446667 6.144,14.3126667 5.961,14.3356667 C2.45133333,14.749 0,15.913 0,17.1666667 C0,18.5746667 3.435,20 10,20 C16.565,20 20,18.5746667 20,17.1666667 C20,15.913 17.5486667,14.749 14.039,14.3356667 Z"/></g></svg>';
		svg = NSString.stringWithString(svg);
		svg = [svg dataUsingEncoding: NSUTF8StringEncoding];
		var svgImporter = MSSVGImporter.svgImporter();
		svgImporter.prepareToImportFromData(svg);
		var importedSVGLayer = svgImporter.importAsLayer();
		var svgFrame = importedSVGLayer.frame();
		importedSVGLayer.name = dialogKey + selection.objectID();
		[svgFrame setX:x];
		[svgFrame setY:y];
        context.document.currentPage().addLayers([importedSVGLayer]);
		var connectionsGroup = getConnectionsInPage(context.document.currentPage());
        if (connectionsGroup) {
        	importedSVGLayer.moveToLayer_beforeLayer(connectionsGroup,connectionsGroup);
        }else{
        	var connectionLayers = MSLayerArray.arrayWithLayers([importedSVGLayer]);
        	connectionsGroup = MSLayerGroup.groupFromLayers(connectionLayers);
        	connectionsGroup.setName("Preview");
        	connectionsGroup.setIsLocked(1);
			context.command.setValue_forKey_onLayer_forPluginIdentifier(true, "isConnectionsContainer", connectionsGroup, previewWrapKey);
        }
		importedSVGLayer.setIsLocked(1);
		newPreviewObject.dialog[selection.objectID()] = {direction:direction,main:decodeURIComponent(encodeURIComponent(selection.objectID())),vs:decodeURIComponent(encodeURIComponent(importedSVGLayer.objectID()))};;
		context.command.setValue_forKey_onLayer_forPluginIdentifier(importedSVGLayer.objectID(), "dialog", importedSVGLayer, previewKey+context.document.currentPage().objectID());
		NSUserDefaults.standardUserDefaults().setObject_forKey(JSON.stringify(newPreviewObject),previewKey+context.document.currentPage().objectID());
	}
}

var setFixed = function(context){
	var fx = 0;
	var fixedKey = '#_*fixed__';
	function chooseDialog(){
		var settingsWindow = COSAlertWindow.new();
		settingsWindow.addButtonWithTitle('确定');
		settingsWindow.addButtonWithTitle('取消');

		settingsWindow.setMessageText('请选择固定方向');
	    
		var ButtonList = ['上固定','下固定'];

		fx = createRadioButtons(ButtonList,0);
		settingsWindow.addAccessoryView(fx);
		return settingsWindow.runModal();
	}
	if(context.selection.length==0){
		return NSApp.displayDialog('请选中元素进行设置');
	}else{
		var selection = context.selection[0];
		if(selection.className() == 'MSArtboardGroup'){
			return NSApp.displayDialog('请选中元素进行设置');
		}
		if(!chooseDialog()){
			return;
		}

		var newPreviewObject = getCurrentPagesObject(context);
		if(newPreviewObject.fixed){
			for(var i in newPreviewObject.fixed){
				if(i == selection.objectID()){
					var dialogObj = newPreviewObject['fixed'][i];
					var linkLayersPredicate = NSPredicate.predicateWithFormat("userInfo != nil && function(userInfo, 'valueForKeyPath:', %@).fixed == '"+ dialogObj.vs +"'", previewKey+context.document.currentPage().objectID());
					var oldDialog = context.document.currentPage().children().filteredArrayUsingPredicate(linkLayersPredicate).firstObject();
					if(oldDialog){
						oldDialog.removeFromParent();
					}
					delete newPreviewObject['fixed'][i];
				}
			}
		}else{
			newPreviewObject.fixed = {};
		}
		fx = fx.selectedCell();
		var index = [fx tag];
		var direction = 't';
		if(index == 0){
			direction = 't';
		}else if(index == 1){
			direction = 'b';
		}
		fixedKey = fixedKey + direction + '#';
		var x = selection.absoluteRect().x();
		var y = selection.absoluteRect().y();
		// 删除页面中所有
		var svg = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg width="418" height="219" viewBox="0 0 418 219" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><rect id="rectangle-2-a" width="417.282" height="218.764" x="160" y="252"/></defs><g fill="none" fill-rule="evenodd" transform="translate(-160 -252)"><use fill="#FFFAAC" fill-opacity=".354" xlink:href="#rectangle-2-a"/><rect width="416.282" height="217.764" x="160.5" y="252.5" stroke="#F3E31A"/></g></svg>';
		svg = NSString.stringWithString(svg);
		svg = [svg dataUsingEncoding: NSUTF8StringEncoding];
		var svgImporter = MSSVGImporter.svgImporter();
		svgImporter.prepareToImportFromData(svg);
		var importedSVGLayer = svgImporter.importAsLayer();
		var svgFrame = importedSVGLayer.frame();
		importedSVGLayer.name = fixedKey + selection.objectID();
		[svgFrame setX:x];
		[svgFrame setY:y];
        [svgFrame setWidth:selection.rect().size.width];
        [svgFrame setHeight:selection.rect().size.height];
        context.document.currentPage().addLayers([importedSVGLayer]);
		var connectionsGroup = getConnectionsInPage(context.document.currentPage());
        if (connectionsGroup) {
        	importedSVGLayer.moveToLayer_beforeLayer(connectionsGroup,connectionsGroup);
        }else{
        	var connectionLayers = MSLayerArray.arrayWithLayers([importedSVGLayer]);
        	connectionsGroup = MSLayerGroup.groupFromLayers(connectionLayers);
        	connectionsGroup.setName("Preview");
        	connectionsGroup.setIsLocked(1);
			context.command.setValue_forKey_onLayer_forPluginIdentifier(true, "isConnectionsContainer", connectionsGroup, previewWrapKey);
        }
		importedSVGLayer.setIsLocked(1);
		newPreviewObject.fixed[selection.objectID()] = {direction:direction,main:decodeURIComponent(encodeURIComponent(selection.objectID())),vs:decodeURIComponent(encodeURIComponent(importedSVGLayer.objectID()))};;
		NSUserDefaults.standardUserDefaults().setObject_forKey(JSON.stringify(newPreviewObject),previewKey+context.document.currentPage().objectID());
		context.command.setValue_forKey_onLayer_forPluginIdentifier(importedSVGLayer.objectID(), "fixed", importedSVGLayer, previewKey+context.document.currentPage().objectID());
	}
}

var setBacks = function(context){
	var setBack_ = function(context,selection){
		var newPreviewObject = getCurrentPagesObject(context);
		if(newPreviewObject.back){
			for(var i in newPreviewObject.back){
				if(i == selection.objectID()){
					var dialogObj = newPreviewObject['back'][i];
					var linkLayersPredicate = NSPredicate.predicateWithFormat("userInfo != nil && function(userInfo, 'valueForKeyPath:', %@).back == '"+ dialogObj.vs +"'", previewKey+context.document.currentPage().objectID());
					var oldDialog = context.document.currentPage().children().filteredArrayUsingPredicate(linkLayersPredicate).firstObject();
					if(oldDialog){
						oldDialog.removeFromParent();
					}
					delete newPreviewObject['back'][i];
				}
			}
		}else{
			newPreviewObject.back = {};
		}
		var x = selection.absoluteRect().x();
		var y = selection.absoluteRect().y();
		var svg = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><rect id="rectangle-4-a" width="132.777" height="85.05" x="1" y="117" rx="10"/></defs><g fill="none" fill-rule="evenodd" transform="translate(-1 -117)"><use fill="#FF7979" fill-opacity=".3" xlink:href="#rectangle-4-a"/><rect width="131.777" height="84.05" x="1.5" y="117.5" stroke="#FF7C82" rx="10"/></g></svg>';
		svg = NSString.stringWithString(svg);
		svg = [svg dataUsingEncoding: NSUTF8StringEncoding];
		var svgImporter = MSSVGImporter.svgImporter();
		svgImporter.prepareToImportFromData(svg);
		var importedSVGLayer = svgImporter.importAsLayer();
		var svgFrame = importedSVGLayer.frame();
		importedSVGLayer.name = backKey + selection.objectID();
		[svgFrame setX:x];
		[svgFrame setY:y];
	    [svgFrame setWidth:selection.rect().size.width];
	    [svgFrame setHeight:selection.rect().size.height];
	    context.document.currentPage().addLayers([importedSVGLayer]);
		importedSVGLayer.setIsLocked(1);
		var connectionsGroup = getConnectionsInPage(context.document.currentPage());
	    if (connectionsGroup) {
	    	importedSVGLayer.moveToLayer_beforeLayer(connectionsGroup,connectionsGroup);
	    }else{
	    	var connectionLayers = MSLayerArray.arrayWithLayers([importedSVGLayer]);
	    	connectionsGroup = MSLayerGroup.groupFromLayers(connectionLayers);
	    	connectionsGroup.setName("Preview");
	    	connectionsGroup.setIsLocked(1);
			context.command.setValue_forKey_onLayer_forPluginIdentifier(true, "isConnectionsContainer", connectionsGroup, previewWrapKey);
	    }
		newPreviewObject.back[selection.objectID()] = {main:decodeURIComponent(encodeURIComponent(selection.objectID())),vs:decodeURIComponent(encodeURIComponent(importedSVGLayer.objectID()))};;
		NSUserDefaults.standardUserDefaults().setObject_forKey(JSON.stringify(newPreviewObject),previewKey+context.document.currentPage().objectID());
		context.command.setValue_forKey_onLayer_forPluginIdentifier(importedSVGLayer.objectID(), "back", importedSVGLayer, previewKey+context.document.currentPage().objectID());
	}
	var fx = 0;
	var backKey = '#_*back__#';
	function chooseDialog(n){
		var settingsWindow = COSAlertWindow.new();
		settingsWindow.addButtonWithTitle('确定');
		settingsWindow.addButtonWithTitle('取消');
		settingsWindow.setMessageText('页面中有 '+n+' 个和你设置相同的同名元素，是否都设置为 back？');
		return settingsWindow.runModal();
	}
	if(context.selection.length==0){
		return NSApp.displayDialog('请选中元素进行设置');
	}else{
		var selection = context.selection[0];
		if(selection.className() == 'MSArtboardGroup'){
			return NSApp.displayDialog('请选中元素进行设置');
		}
		var lengthD = 0;
		for(var i = 0;i < context.document.currentPage().children().length;i++){
			if(encodeURIComponent(context.document.currentPage().children()[i].name()) == encodeURIComponent(selection.name())){
				lengthD ++;
			}
		}
		if(chooseDialog(lengthD) != '1000'){
			setBack_(context,selection);
		}else{
			for(var i = 0;i < context.document.currentPage().children().length;i++){
				if(encodeURIComponent(context.document.currentPage().children()[i].name()) == encodeURIComponent(selection.name())){
					setBack_(context,context.document.currentPage().children()[i]);
				}
			}
		}
	}
}

var clearPreview = function(context){
	var newPreviewObject = getCurrentPagesObject(context);
	for(var i in newPreviewObject){
		for(var k in newPreviewObject[i]){
			for(var l = 0;l < context.selection.length;l++){
				if(k == context.selection[l].objectID()){
					var linkLayersPredicate = NSPredicate.predicateWithFormat("userInfo != nil && function(userInfo, 'valueForKeyPath:', %@)."+ i +" == '"+ newPreviewObject[i][k].vs +"'", previewKey+context.document.currentPage().objectID());
					var oldDialog = context.document.currentPage().children().filteredArrayUsingPredicate(linkLayersPredicate).firstObject();
					if(oldDialog){
						oldDialog.removeFromParent();
						delete newPreviewObject[i][k];
						context.command.setValue_forKey_onLayer_forPluginIdentifier(nil, i, context.selection[l], previewKey+context.document.currentPage().objectID());
						NSUserDefaults.standardUserDefaults().setObject_forKey(JSON.stringify(newPreviewObject),previewKey+context.document.currentPage().objectID());

					}
				}
			}
		}
	}
}

var hidePreview = function(context){
	var connectionsGroup = getConnectionsInPage(context.document.currentPage());
    if (connectionsGroup) {
    	connectionsGroup.setIsVisible(false);
    }
}

var showPreview = function(context){
	var connectionsGroup = getConnectionsInPage(context.document.currentPage());
    if (connectionsGroup) {
    	connectionsGroup.setIsVisible(true);
    }
}