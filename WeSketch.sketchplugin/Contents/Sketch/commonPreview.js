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

		var rx = selection.rect().size.width/1242;
		var width = 1060 * rx;
		var height = 1034 * rx;
		
		var x = selection.absoluteRect().x() - width;
		var y = selection.absoluteRect().y() - height;
		// 删除页面中所有
		var svg = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg width="1052" height="1050" viewBox="0 0 1052 1050"><g fill="none" fill-rule="evenodd" stroke-linecap="square"><path stroke="#E20000" stroke-width="40" d="M28.5 28.5L998.5 996.5M998.5 996.5L992.9745 986.747623 988.73624 990.99464 998.5 996.5z"/></g></svg>';
		svg = NSString.stringWithString(svg);
		svg = [svg dataUsingEncoding: NSUTF8StringEncoding];
		var svgImporter = MSSVGImporter.svgImporter();
		svgImporter.prepareToImportFromData(svg);
		var importedSVGLayer = svgImporter.importAsLayer();
		var svgFrame = importedSVGLayer.frame();
		importedSVGLayer.name = commonPreviewIndexKey + selection.objectID();
		[svgFrame setX:x];
		[svgFrame setY:y];
		[svgFrame setWidth:width];
		[svgFrame setHeight:height];
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
		var rx = selection.rect().size.width/1242;
		var width = 300 * rx;
		var height = 300 * rx;
		var x = selection.absoluteRect().x() + selection.rect().size.width - width;
		var y = selection.absoluteRect().y() - height;
		// 删除页面中所有
		var svg = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg width="300" height="300" viewBox="0 0 300 300"><path fill="#E20000" d="M140.359091,159.640909 C142.910934,162.207399 146.380778,163.650475 150,163.650475 C153.619222,163.650475 157.089066,162.207399 159.640909,159.640909 L289.186364,30.0954545 C292.630729,26.6510895 293.975907,21.630818 292.715181,16.9257277 C291.454456,12.2206375 287.779363,8.54554367 283.074272,7.28481856 C278.369182,6.02409345 273.348911,7.3692712 269.904545,10.8136364 L140.359091,140.359091 C137.799322,142.914511 136.360893,146.383014 136.360893,150 C136.360893,153.616986 137.799322,157.085489 140.359091,159.640909 M286.363636,136.363636 C278.832481,136.363636 272.727273,142.468844 272.727273,150 L272.836364,272.727273 L27.2727273,272.836364 L27.1636364,27.2727273 L150,27.2727273 C157.531156,27.2727273 163.636364,21.1675193 163.636364,13.6363636 C163.636364,6.10520796 157.531156,0 150,0 L27.1636364,0 C12.1709158,0.0225285439 0.0225285439,12.1709158 0,27.1636364 L0,272.836364 C0,287.809091 12.1909091,300 27.1636364,300 L272.836364,300 C287.829084,299.977471 299.977471,287.829084 300,272.836364 L300,150 C300,142.468844 293.894792,136.363636 286.363636,136.363636"/></svg>';
		svg = NSString.stringWithString(svg);
		svg = [svg dataUsingEncoding: NSUTF8StringEncoding];
		var svgImporter = MSSVGImporter.svgImporter();
		svgImporter.prepareToImportFromData(svg);
		var importedSVGLayer = svgImporter.importAsLayer();
		var svgFrame = importedSVGLayer.frame();
		importedSVGLayer.name = dialogKey + selection.objectID();
		[svgFrame setX:x];
		[svgFrame setY:y];
		[svgFrame setWidth:width];
		[svgFrame setHeight:height];
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