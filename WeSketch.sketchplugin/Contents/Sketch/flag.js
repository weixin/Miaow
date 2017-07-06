@import "common.js"

function getFlag(context,refrush){
    var i18 = _(context).flag;

	var kPluginDomainFlag = "com.sketchplugins.wechat.flag";
	var lineColorKey = "com.sketchplugins.wechat.flagcolor";
	var textCount = 1;
	var scale = 2;
	var isDeleteNum = 0;
	var scaleOptionsMatrix = 0;
	var getConnectionsGroupInPage = function(page) {
		var connectionsLayerPredicate = NSPredicate.predicateWithFormat("userInfo != nil && function(userInfo, 'valueForKeyPath:', %@).isflagContainer == true", kPluginDomainFlag);
		return page.children().filteredArrayUsingPredicate(connectionsLayerPredicate).firstObject();
	}
	var colorLine = NSUserDefaults.standardUserDefaults().objectForKey(lineColorKey) || "#1AAD19";
	var colorLineR = rgb(colorLine)[0];
	var colorLineG = rgb(colorLine)[1];
	var colorLineB = rgb(colorLine)[2];
	function deleteDialog(context){
		var settingsWindow = COSAlertWindow.new();
		settingsWindow.addButtonWithTitle(i18.m1);
		settingsWindow.addButtonWithTitle(i18.m2);

		settingsWindow.setMessageText(i18.m3);
	    
		var ButtonList = [i18.m4,i18.m5];

		scaleOptionsMatrix = createRadioButtons(ButtonList,ButtonList[0]);
		settingsWindow.addAccessoryView(scaleOptionsMatrix);
		return settingsWindow.runModal();
	}

	var getLeftFlagNum = function(){
		var children = getConnectionsGroupInPage(doc.currentPage());
		if(children){
			children = children.children();
		}else{
			return 1;
		}
		var num = [];
		for(var i = 0;i < children.length;i++){
			var Reg = new RegExp("^\\d{1,2}$");
			var countL = children[i].name().replace('___p','').replace('___t','').replace('___','');
			if(Reg.test(countL)){
				countL = parseInt(countL)-1;
				num[countL] = true;
			}
		}
		for(var k = 0;k<num.length+1;k++){
			if(!num[k]){
				return (k+1);
			}
		}
	}

	var getRightFlagNum = function(dom){
		var children = getConnectionsGroupInPage(doc.currentPage());
		if(children){
			children = children.children();
		}else{
			return 1;
		}
		for(var i = 0;i < children.length;i++){
			if(children[i].name() == dom.objectID()){
				var children2 = children[i].children();
				for(var k = 0;k < children2.length;k++){
					var Reg = new RegExp("^\\d{1,2}$");
					var countL = children2[k].name().replace('___p','').replace('___t','').replace('___','');
					if(Reg.test(countL)){
						countL = parseInt(countL);
						return countL;
					}
				}
			}
		}
		return 1;
	}

	var drawLeftArrow = function(doc,dom,isNew){
		var count;
		if(isNew){
			count = getLeftFlagNum();
		}else{
			count = getRightFlagNum(dom);
			if(isDeleteNum !=0 && count > isDeleteNum){
				count = count - 1;
			}
		}
		 

		var linexl = dom.absoluteRect().x() + dom.rect().size.width;
		var liney = dom.absoluteRect().y() + dom.rect().size.height/2 - (24 * scale/2);

		var path = NSBezierPath.bezierPath();
		path.moveToPoint(NSMakePoint(22 * scale,60 * scale))
		path.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(34 * scale,48 * scale),NSMakePoint(28.625 * scale,60 * scale),NSMakePoint(34 * scale,54.625 * scale));
		path.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(22 * scale,36 * scale),NSMakePoint(34 * scale,41.375 * scale),NSMakePoint(28.625 * scale,36 * scale));
		path.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(0,48 * scale),NSMakePoint(15.375 * scale,36 * scale),NSMakePoint(0,48 * scale));
		path.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(22 * scale,60 * scale),NSMakePoint(0,48 * scale),NSMakePoint(15.375 * scale,60 * scale));
		path.closePath();
		var flag = MSShapeGroup.shapeWithBezierPath(path);
		flag.style().addStylePartOfType(0).setColor(MSImmutableColor.colorWithIntegerRed_green_blue_alpha(colorLineR,colorLineG,colorLineB,76.5).newMutableCounterpart());
		flag.style().addStylePartOfType(1).setColor(MSImmutableColor.colorWithIntegerRed_green_blue_alpha(colorLineR,colorLineG,colorLineB,255).newMutableCounterpart());
		flag.absoluteRect().setX(linexl);
		flag.absoluteRect().setY(liney);
		flag.setName('___'+count+'___p');

		var textLayer = MSTextLayer.alloc().init();

		if(count.toString().length == 1){
			textLayer.absoluteRect().setX(linexl + (12+ 26) * scale/2);
		}else{
			textLayer.absoluteRect().setX(linexl + (12+ 18) * scale/2);
		}
		
		textLayer.absoluteRect().setY(liney + 8 * scale / 2 );
		textLayer.setName('___'+count+'___t');
		var fixedBehaviour = 1;
		textLayer.setTextBehaviour(fixedBehaviour);
		textLayer.setStringValue(count.toString());
		textLayer.setTextColor(MSImmutableColor.colorWithIntegerRed_green_blue_alpha(colorLineR,colorLineG,colorLineB,255).newMutableCounterpart());
		textLayer.setFontSize(13 * scale);
		
		doc.currentPage().addLayers([flag,textLayer]);
		var connectionLayers = MSLayerArray.arrayWithLayers([flag,textLayer]);
		connectionsGroup = MSLayerGroup.groupFromLayers(connectionLayers);
		connectionsGroup.setName(dom.objectID());
		return connectionsGroup;
	}
	var drawRightArrow = function(doc,dom){
		var count = getRightFlagNum(dom);
		if(isDeleteNum !=0 && count > isDeleteNum){
			count = count - 1;
		}
		var linexr = dom.absoluteRect().x() - 34 * scale;
		var liney = dom.absoluteRect().y() + dom.rect().size.height/2 - (24 * scale/2);

		var path = NSBezierPath.bezierPath();
		path.moveToPoint(NSMakePoint(12 * scale,24 * scale))
		path.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(0 * scale,12 * scale),NSMakePoint(5.375 * scale,24 * scale),NSMakePoint(0 * scale,18.625 * scale));
		path.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(12 * scale,0 * scale),NSMakePoint(0 * scale,5.375 * scale),NSMakePoint(5.375 * scale,0 * scale));
		path.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(34 * scale,12 * scale),NSMakePoint(18.625 * scale,0 * scale),NSMakePoint(34 * scale,12 * scale));
		path.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(12 * scale,24 * scale),NSMakePoint(34 * scale,12 * scale),NSMakePoint(18.625 * scale,24 * scale));
		path.closePath();
		var flag = MSShapeGroup.shapeWithBezierPath(path);
		flag.style().addStylePartOfType(0).setColor(MSImmutableColor.colorWithIntegerRed_green_blue_alpha(colorLineR,colorLineG,colorLineB,76.5).newMutableCounterpart());
		flag.style().addStylePartOfType(1).setColor(MSImmutableColor.colorWithIntegerRed_green_blue_alpha(colorLineR,colorLineG,colorLineB,255).newMutableCounterpart());
		flag.absoluteRect().setX(linexr);
		flag.absoluteRect().setY(liney);
		flag.setName('___'+count+'___p');

		var textLayer = MSTextLayer.alloc().init();

		if(count.toString().length == 1){
			textLayer.absoluteRect().setX(linexr + (14) * scale/2);
		}else{
			textLayer.absoluteRect().setX(linexr + (10) * scale/2);
		}
		
		textLayer.absoluteRect().setY(liney + 8 * scale / 2 );
		textLayer.setName('___'+count+'___t');
		var fixedBehaviour = 1;
		textLayer.setTextBehaviour(fixedBehaviour);
		textLayer.setStringValue(count.toString());
		textLayer.setTextColor(MSImmutableColor.colorWithIntegerRed_green_blue_alpha(colorLineR,colorLineG,colorLineB,255).newMutableCounterpart());
		textLayer.setFontSize(13 * scale);

		doc.currentPage().addLayers([flag,textLayer]);
		var connectionLayers = MSLayerArray.arrayWithLayers([flag,textLayer]);
		connectionsGroup = MSLayerGroup.groupFromLayers(connectionLayers);
		connectionsGroup.setName(dom.objectID());
		return connectionsGroup;
	}

	function isMaxNum(dom){
		var num = getRightFlagNum(dom);
		var children = getConnectionsGroupInPage(doc.currentPage());
		if(children){
			children = children.children();
			for(var i = 0;i < children.length;i++){
				var Reg = new RegExp("^\\d{1,2}$");
				var countL = children[i].name().replace('___p','').replace('___t','').replace('___','');
				if(Reg.test(countL)){
					if(countL > num){
						return false;
					}
				}
			}
			return true;
		}
		return true;
	}

	var drawFunction = function(doc,nowDom){
		var linkLayersPredicate = NSPredicate.predicateWithFormat("userInfo != nil && function(userInfo, 'valueForKeyPath:', %@).FlagID != nil", kPluginDomainFlag);
		var linkLayers = doc.currentPage().children().filteredArrayUsingPredicate(linkLayersPredicate);
		var loop = linkLayers.objectEnumerator();
		var returnLine = [];
		var isDrawNow = false;
		while (linkLayer = loop.nextObject()) {
			var lastState = 'e';
			var lastDom = NSPredicate.predicateWithFormat("userInfo != nil && function(userInfo, 'valueForKeyPath:', %@).FlagID == '"+linkLayer.objectID() + "_l'", kPluginDomainFlag);
			lastDom = doc.currentPage().children().filteredArrayUsingPredicate(lastDom).firstObject();
			if(lastDom){
				lastState = 'l';
				if(nowDom && lastDom.objectID() == nowDom.objectID()){
					context.command.setValue_forKey_onLayer_forPluginIdentifier(nowDom.objectID() + '_r', "FlagID", nowDom, kPluginDomainFlag);
					lastState = 'r';
					isDrawNow = true;
					break;
				}
			}else{
				lastDom = NSPredicate.predicateWithFormat("userInfo != nil && function(userInfo, 'valueForKeyPath:', %@).FlagID == '"+linkLayer.objectID() + "_r'", kPluginDomainFlag);
				lastDom = doc.currentPage().children().filteredArrayUsingPredicate(lastDom).firstObject();

				if(lastDom){
					lastState = 'r';
					if(nowDom && lastDom.objectID() == nowDom.objectID()){
						if(isMaxNum(nowDom)){
							context.command.setValue_forKey_onLayer_forPluginIdentifier(nil, "FlagID", nowDom, kPluginDomainFlag);
							lastState = 'e';
							isDrawNow = true;
						}else{
							if(deleteDialog(context) == 1000){
								context.command.setValue_forKey_onLayer_forPluginIdentifier(nil, "FlagID", nowDom, kPluginDomainFlag);
								lastState = 'e';
								isDrawNow = true;
								if(scaleOptionsMatrix.selectedCell().tag() == 1){
									isDeleteNum = getRightFlagNum(nowDom);
								}
							}else{
								return false;
							}
						}
						
						break;
						

					}
				}
			}
		}
		linkLayers = doc.currentPage().children().filteredArrayUsingPredicate(linkLayersPredicate);
		loop = linkLayers.objectEnumerator();

		while (linkLayer = loop.nextObject()) {
			var lastState = 'e';
			var lastDom = NSPredicate.predicateWithFormat("userInfo != nil && function(userInfo, 'valueForKeyPath:', %@).FlagID == '"+linkLayer.objectID() + "_l'", kPluginDomainFlag);
			lastDom = doc.currentPage().children().filteredArrayUsingPredicate(lastDom).firstObject();
			if(lastDom){
				lastState = 'l';
			}else{
				lastDom = NSPredicate.predicateWithFormat("userInfo != nil && function(userInfo, 'valueForKeyPath:', %@).FlagID == '"+linkLayer.objectID() + "_r'", kPluginDomainFlag);
				lastDom = doc.currentPage().children().filteredArrayUsingPredicate(lastDom).firstObject();
				if(lastDom){
					lastState = 'r';
				}
			}
			if(lastState == 'l'){
				context.command.setValue_forKey_onLayer_forPluginIdentifier(linkLayer.objectID() + '_l', "FlagID", linkLayer, kPluginDomainFlag);
				returnLine = returnLine.concat(drawLeftArrow(doc,linkLayer,false));
			}else if(lastState == 'r'){
				context.command.setValue_forKey_onLayer_forPluginIdentifier(linkLayer.objectID() + '_r', "FlagID", linkLayer, kPluginDomainFlag);	
				returnLine = returnLine.concat(drawRightArrow(doc,linkLayer));
			}
		}

		if(!isDrawNow && nowDom){
			context.command.setValue_forKey_onLayer_forPluginIdentifier(nowDom.objectID() + '_l', "FlagID", nowDom, kPluginDomainFlag);
			returnLine = returnLine.concat(drawLeftArrow(doc,nowDom,true));
		}

		return returnLine;
	}

	var doc = context.document;
	var flags = [];
	var selectedLayers = context.selection;

	if (context.selection.count()!=1 || refrush) {
		flags = drawFunction(doc,null);
		if(!refrush){
			NSApp.displayDialog(i18.m6);
		}
	}else{
		flags = drawFunction(doc,context.selection[0]);
	}
	

	var connectionsGroup = getConnectionsGroupInPage(doc.currentPage());

	if (connectionsGroup) {
		connectionsGroup.removeFromParent();
	}

	var connectionLayers = MSLayerArray.arrayWithLayers(flags);
	connectionsGroup = MSLayerGroup.groupFromLayers(connectionLayers);
	connectionsGroup.setName("___flags");
	connectionsGroup.setIsLocked(1);
	context.command.setValue_forKey_onLayer_forPluginIdentifier(true, "isflagContainer", connectionsGroup, kPluginDomainFlag);

	for(var i = 0;i<context.selection.length;i++){
		context.selection[i].select_byExpandingSelection(false,false);
	}

	selectedLayers[0].select_byExpandingSelection(true, true);
}

var onRun = function(context){
	getFlag(context);
}
