@import "common.js"

var setIndex = function(context){
	var firstKey = '（_firstPage）';
	if(context.selection.length==0){
		return NSApp.displayDialog('请选中 artboard 进行设置');
	}else{

		var selection = context.selection[0];
		if(selection.className() != 'MSArtboardGroup'){
			return NSApp.displayDialog('请选中 artboard 进行设置');
		}
		if(selection.name().indexOf(firstKey) > -1){
			selection.setName(selection.name().replace(firstKey));
		}else{
			var page = context.document.currentPage();
			var artboards = page.artboards();
			for(var i = 0;i<artboards.length;i++){
				if(artboards[i].name().indexOf(firstKey)>-1){
					artboards[i].setName(artboards[i].name().replace(firstKey,''));
					break;
				}
			}
			selection.setName(selection.name() + firstKey);
		}
	}
}

var setDialog = function(context){
	var fx = 0;
	var dialogKey = '（_dialog_';
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
		if(selection.name().indexOf(dialogKey)>-1){
			var name = selection.name().replace(/（_dialog_.*?）/,'');
			selection.setName(name);
		}else{
			if(!chooseDialog()){
				return;
			}
			fx = fx.selectedCell();
			var index = [fx tag];
			if(index == 0){
				dialogKey += 'b';
			}else if(index == 1){
				dialogKey += 't';
			}else if(index == 2){
				dialogKey += 'l';
			}else if(index == 3){
				dialogKey += 'r';
			}
			dialogKey = dialogKey + '）';

			selection.setName(selection.name() + dialogKey);
		}
	}
}

var setFixed = function(context){
	var fx = 0;
	var fixedKey = '（_fixed_';
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
		return NSApp.displayDialog('请选中一个元素进行设置');
	}else{
		var selection = context.selection[0];
		if(selection.className() == 'MSArtboardGroup'){
			return NSApp.displayDialog('请选择元素进行设置');
		}
		if(selection.name().indexOf(fixedKey)>-1){
			var name = selection.name().replace(/（_fixed_.*?）/,'');
			selection.setName(name);
		}else{
			var key = fixedKey;
			if(!chooseDialog()){
				return;
			}
			fx = fx.selectedCell();
			var index = [fx tag];
			if(index == 0){
				key += 't';
			}else if(index == 1){
				key += 'b';
			}
			key = key + '）';

			selection.setName(selection.name() + key);
		}
	}
}

var setBack = function(context){
	var fx = 0;
	var backKey = '（_back）';
	if(context.selection.length==0){
		return NSApp.displayDialog('请选中一个元素进行设置');
	}else{
		var selection = context.selection[0];
		if(selection.className() == 'MSArtboardGroup'){
			return NSApp.displayDialog('请选择元素进行设置');
		}
		if(selection.name().indexOf(backKey)>-1){
			var name = selection.name().replace(backKey,'');
			selection.setName(name);
		}else{
			var key = backKey;
			selection.setName(selection.name() + key);
		}
	}
}

var commonCodeJson = function(context,filePath){
	var BorderPositions = ["center", "inside", "outside"],
	    FillTypes = ["color", "gradient"],
	    GradientTypes = ["linear", "radial", "angular"],
	    ShadowTypes = ["outer", "inner"],
	    TextAligns = ["left", "right", "center", "justify", "left"],
	    ResizingType = ["stretch", "corner", "resize", "float"]; 
    
    function pointToJSON(point){
        return {
            x: parseFloat(point.x),
            y: parseFloat(point.y)
        };
    }
    function colorStopToJSON(colorStop) {
        return {
            color: colorToJSON(colorStop.color()),
            position: colorStop.position()
        };
    }
    function gradientToJSON(gradient) {
        var stopsData = [],
            stop, stopIter = gradient.stops().objectEnumerator();
        while (stop = stopIter.nextObject()) {
            stopsData.push(colorStopToJSON(stop));
        }

        return {
            type: GradientTypes[gradient.gradientType()],
            from: pointToJSON(gradient.from()),
            to: pointToJSON(gradient.to()),
            colorStops: stopsData
        };
    }

	function colorToJSON(color) {
	    var obj =  {
	        r: Math.round(color.red() * 255),
	        g: Math.round(color.green() * 255),
	        b: Math.round(color.blue() * 255),
	        a: color.alpha()
	    }
	    function bzone(d){
	        if(d.length == 1){
	            d = '0' + d;
	        }
	        return d;
	    }
	    if(obj.a == 1){
	        return '#' + bzone(obj.r.toString(16)) + bzone(obj.g.toString(16)) + bzone(obj.b.toString(16));
	    }else{
	        return 'rgba(' + obj.r + ',' + obj.g + ',' + obj.b + ',' + obj.a.toFixed(2) + ')';
	    }
	}

	function getFills(style) {
	    var fillsData = [],
	        fill, fillIter = style.fills().objectEnumerator();
	    while (fill = fillIter.nextObject()) {
	        if (fill.isEnabled()) {
	            var fillType = FillTypes[fill.fillType()],
	                fillData = {
	                    fillType: fillType
	                };

	            switch (fillType) {
	                case "color":
	                    fillData.color = colorToJSON(fill.color());
	                    break;

	                case "gradient":
	                    fillData.gradient = gradientToJSON(fill.gradient());
	                    break;

	                default:
	                    continue;
	            }

	            fillsData.push(fillData);
	        }
	    }

	    return fillsData;
	}

	function exportColor(selection){
	    var layerStyle = selection.style();
	    var returnText = [];
	    var backgroundColor = getFills(layerStyle);
	   
	    if(backgroundColor.length>0){
	        if(backgroundColor[0].fillType == 'color'){
	            returnText.push(backgroundColor[0].color);
	        }else if(backgroundColor[0].fillType == 'gradient'){
	            function bzone6(z){
	                if(z.length != 6){
	                    z = '0' + z;
	                }
	                if(z.length != 6){
	                    bzone6(z);
	                }else{
	                    return z;
	                }
	            }
	            var param = [];
	            var to = backgroundColor[0].gradient.to;
	            var from = backgroundColor[0].gradient.from;
	            param.push(parseInt(90-180*Math.atan(Math.abs((to.y-from.y))/Math.abs((to.x-from.x)))/Math.PI)+'deg');
	            var colorStops = backgroundColor[0].gradient.colorStops;
	            for(var i = 0;i<colorStops.length;i++){
	                param.push(colorStops[i].color + ' ' + parseInt(colorStops[i].position*100) + '%');
	            }
	            returnText.push('linear-gradient(' + param.join(',') + ')');
	        }
	    }else if(borderColor.length>0){
	        returnText.push(borderColor[0].color);
	    }
	    return returnText.join('');
	}


	var exportSVGJson = {};
	var pageCount = 1;
	var fixedCount = 1;
	var dialogCount = 1;
	var kPluginDomain = "com.sketchplugins.wechat.link";

	var getConnectionsGroupInPage = function(page) {
		var connectionsLayerPredicate = NSPredicate.predicateWithFormat("userInfo != nil && function(userInfo, 'valueForKeyPath:', %@).isConnectionsContainer == true", kPluginDomain);
		return page.children().filteredArrayUsingPredicate(connectionsLayerPredicate).firstObject();
	}

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
			if(exportSVGJson[linkLayer.parentArtboard().objectID()].children[i]){
				exportSVGJson[linkLayer.parentArtboard().objectID()].children[linkLayer.objectID()].to = children.to;
			}else{
				exportSVGJson[linkLayer.parentArtboard().objectID()].children[linkLayer.objectID()] = children;
			}
			
		}
	}

	function exportHTML(filePath){
    	var htmlPath = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("preview.html").path();
        var previewData = NSData.dataWithContentsOfFile(htmlPath);
        previewData = [[NSString alloc] initWithData:previewData encoding:NSUTF8StringEncoding];
		previewData = previewData.replace('{{json}}',JSON.stringify(exportSVGJson));
        writeFile({content:previewData,path:filePath,fileName:'index.html'})
	}

	function exportPNG(layer,context,file,scale){
	    exportSVGJson[layer.objectID()] = {};
	    exportSVGJson[layer.objectID()].width = encodeURIComponent(layer.absoluteRect().size().width);
	    exportSVGJson[layer.objectID()].height = encodeURIComponent(layer.absoluteRect().size().height);
	    if(layer.name().indexOf('firstPage') > -1){
	    	exportSVGJson[layer.objectID()].firstPage = true;
	    }
	    exportSVGJson[layer.objectID()].children = {};
	    var saveChild = [];
	    for(var i = 0;i < layer.children().length;i++){
	    	var child = layer.children()[i];
	    	if((child.name().indexOf('back')>-1 || child.name().indexOf('fixed')>-1) && child.isVisible()){
	    		var backObj = {};
	    		backObj.x = encodeURIComponent(layer.children()[i].rect().origin.x);
	    		backObj.y = encodeURIComponent(layer.children()[i].rect().origin.y);
	    		backObj.width = encodeURIComponent(layer.children()[i].absoluteRect().size().width);
	    		backObj.height = encodeURIComponent(layer.children()[i].absoluteRect().size().height);
	    		exportSVGJson[layer.objectID()].children[child.objectID()] = backObj;
	    	}
	    	if(child.name().indexOf('fixed')>-1 && child.isVisible()){
	    		var name = 'fixed'+(fixedCount++);
	    		exportSVGJson[layer.objectID()].children[child.objectID()].image = name;
	    		var fixedDirection = child.name().match(/（_fixed_(.*?)）/)[1];
	    		exportSVGJson[layer.objectID()].children[child.objectID()].fixedDirection = fixedDirection;
	    		if(fixedDirection == 'b'){
	    			exportSVGJson[layer.objectID()].children[child.objectID()].y = exportSVGJson[layer.objectID()].height - exportSVGJson[layer.objectID()].children[child.objectID()].height - exportSVGJson[layer.objectID()].children[child.objectID()].y;
	    		}

				var fixedpng = MSExportRequest.exportRequestsFromExportableLayer(child).firstObject();
			    fixedpng.scale = scale;
			    fixedpng.format = 'png';
			    var savePath = file + '/' + name + '.png';
	    		context.document.saveArtboardOrSlice_toFile(fixedpng, savePath);
	    		child.setIsVisible(false);
	    		saveChild.push(child);
	    	}
	    	if(child.name().indexOf('back')>-1 && child.isVisible()){
	    		exportSVGJson[layer.objectID()].children[child.objectID()].back = true;
	    	}
	    }
	    
	    var fileName;
	    if(layer.name().indexOf('dialog')>-1){
	    	//dialog 的逻辑，把除了背景之外的元素拿出来导出图片，然后再放回去
	    	var group = MSLayerGroup.new();
	    		    	layer.addLayers([group]);

	    	var count = 0;
	    	var flagcount = 0;
	    	var layersLength = layer.layers().length;
	    	for(var i = 0;i<layersLength;i++){
	    		if(layer.layers()[flagcount].objectID() != group.objectID()){
		    	    if(layer.layers()[flagcount].rect().size.width == layer.rect().size.width && layer.layers()[flagcount].rect().size.height == layer.rect().size.height){
		    	    	exportSVGJson[layer.objectID()].background = exportColor(layer.layers()[flagcount]);
		    	    	flagcount++;
			    	}else{
			    	    layer.layers()[flagcount].moveToLayer_beforeLayer(group,group);
			    	}
	    		}else{
		    	    flagcount++;
	    		}
	    	    
	    	    count++;
	    	    if(count+flagcount == layersLength){
	    	        break;
	    	    }
	    	}
	    	group.resizeToFitChildrenWithOption(1);

	    	var name = 'dialog' + (dialogCount++);
	    	var dialogObj = {};
	    	dialogObj.x = encodeURIComponent(group.rect().origin.x);
	    	dialogObj.y = encodeURIComponent(group.rect().origin.y);
	    	dialogObj.width = encodeURIComponent(group.absoluteRect().size().width);
	    	dialogObj.height = encodeURIComponent(group.absoluteRect().size().height);
	    	dialogObj.name = name;
	    	dialogObj.direction = 'b';
	    	exportSVGJson[layer.objectID()].dialog = dialogObj;
	    	

	    	var slice = MSExportRequest.exportRequestsFromExportableLayer(group).firstObject();
	    	slice.scale = scale;
	    	slice.format = 'png';
	    	var savePath = file + '/' + name + '.png';
	    	context.document.saveArtboardOrSlice_toFile(slice, savePath);

	    	count = 0;
	    	layersLength = group.layers().length;
	    	for(var i = 0;i<layersLength;i++){
	    	    group.layers()[0].moveToLayer_beforeLayer(layer,layer);
	    	    count++;
	    	    if(count == layersLength){
	    	        break;
	    	    }
	    	}
	    	group.removeFromParent();
	    	if(!exportSVGJson[layer.objectID()].background){
	    		exportSVGJson[layer.objectID()].background = colorToJSON(layer.backgroundColor());
	    	}
	    }else{
	    	var fileName = 'page' + (pageCount++);
	    	exportSVGJson[layer.objectID()].name = fileName;
	    	var slice = MSExportRequest.exportRequestsFromExportableLayer(layer).firstObject();
	    	slice.scale = scale;
	    	slice.format = 'png';
	    	var savePath = file + '/' + fileName + '.png';
	    	context.document.saveArtboardOrSlice_toFile(slice, savePath);
	    } 
	    for(var i = 0;i < saveChild.length;i++){
	    	saveChild[i].setIsVisible(true);
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


	if(filePath == false){
		return;
	}
	writeDirectory(filePath);
	var connectionsGroup = getConnectionsGroupInPage(context.document.currentPage());
	if (connectionsGroup) {
		connectionsGroup.removeFromParent();
	}
	var scale = 1;
	var linkJson = {};

	var nowPage = context.document.currentPage();
	var artBoards = nowPage.artboards();
	for(var i = 0;i<artBoards.length;i++){
		var size = artBoards[i].absoluteRect().size().width;
		if(size == 320 || size == 414 || size == 375){
			scale = 2;
		}
		exportPNG(artBoards[i],context,filePath,scale);
	}
	relationship(context.document);
	exportHTML(filePath);
	getLink(context,true);
}