var kPluginDomain = "com.sketchplugins.wechat.flag";

var getConnectionsGroupInPage = function(page) {
	var connectionsLayerPredicate = NSPredicate.predicateWithFormat("userInfo != nil && function(userInfo, 'valueForKeyPath:', %@).isflagContainer == true", kPluginDomain);
	return page.children().filteredArrayUsingPredicate(connectionsLayerPredicate).firstObject();
}

var getFlagCount = function(doc){
	var connectionsGroup = getConnectionsGroupInPage(doc.currentPage());
	var layers = connectionsGroup.layers();
	var name = {};
	for(var i = 0;i<layers.count();i++){
		name[layers[i].name().replace('___p','').replace('___t','')] = true;
	}
	var k = 1;
	while(1){
		if(!name['___'+k]){
			return (k);
		}
		k++;
	}
}

var onRun = function(context) {
	var drewLeftArrow = function(doc){
		var countLength = getFlagCount(doc);

		var path = NSBezierPath.bezierPath();
		path.moveToPoint(NSMakePoint(44,120))
		path.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(68,96),NSMakePoint(57.25,120),NSMakePoint(68,109.25));
		path.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(44,72),NSMakePoint(68,82.75),NSMakePoint(57.25,72));
		path.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(0,96),NSMakePoint(30.75,72),NSMakePoint(0,96));
		path.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(44,120),NSMakePoint(0,96),NSMakePoint(30.75,120));
		path.closePath();
		var flag = MSShapeGroup.shapeWithBezierPath(path);
		flag.style().addStylePartOfType(0).setColor(MSImmutableColor.colorWithIntegerRed_green_blue_alpha(26,173,25,76.5).newMutableCounterpart());
		flag.style().addStylePartOfType(1).setColor(MSImmutableColor.colorWithIntegerRed_green_blue_alpha(26,173,25,255).newMutableCounterpart());
		flag.absoluteRect().setX(linexl);
		flag.absoluteRect().setY(liney);
		flag.setName('___'+countLength+'___p');

		var textLayer = MSTextLayer.alloc().init();

		if(countLength.toString().length == 1){
			textLayer.absoluteRect().setX(linexl + 38);
		}else{
			textLayer.absoluteRect().setX(linexl + 26);
		}
		textLayer.absoluteRect().setY(liney + 6);
		textLayer.setName('___'+countLength+'___t');
		var fixedBehaviour = 1;
		textLayer.setTextBehaviour(fixedBehaviour);
		textLayer.setStringValue(countLength.toString());
		textLayer.setTextColor(MSImmutableColor.colorWithIntegerRed_green_blue_alpha(26,173,25,255).newMutableCounterpart());
		textLayer.setFontSize(26);
		doc.currentPage().addLayers([flag,textLayer]);
		return [flag,textLayer];
	}
	var drewRightArrow = function(){
		var path = NSBezierPath.bezierPath();
		path.moveToPoint(NSMakePoint(44,120))
		path.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(68,96),NSMakePoint(57.25,120),NSMakePoint(68,109.25));
		path.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(44,72),NSMakePoint(68,82.75),NSMakePoint(57.25,72));
		path.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(0,96),NSMakePoint(30.75,72),NSMakePoint(0,96));
		path.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(44,120),NSMakePoint(0,96),NSMakePoint(30.75,120));
		path.closePath();
		var flag = MSShapeGroup.shapeWithBezierPath(path);
		flag.style().addStylePartOfType(0).setColor(MSImmutableColor.colorWithIntegerRed('#1AAD19').newMutableCounterpart());
		flag.absoluteRect().setX(linexl);
		flag.absoluteRect().setY(liney);
		doc.currentPage().addLayers([flag]);
		return flag;
	}

	function setKey(obj){
		var flagID = context.command.valueForKey_onLayer_forPluginIdentifier("flagID", obj, kPluginDomain);
		if (!flagID) {
			flagID = obj.objectID();
			context.command.setValue_forKey_onLayer_forPluginIdentifier(flagID, "flagID", obj, kPluginDomain);
		}
	}




	if (context.selection.count()!=1) {
		NSApp.displayDialog('请选且只选中一个需要添加标志的元素');
        return;
	}

	var selection = context.selection[0];
	var doc = context.document;
	var selectedLayers = doc.findSelectedLayers();

	
	var linexl = selection.absoluteRect().x() + selection.rect().size.width;
	var linexr = selection.absoluteRect().x() - 68;
	var liney = selection.absoluteRect().y() + selection.rect().size.height/2 - 48/2;

	var flags = [];

	flags = flags.concat(drewLeftArrow(doc));

	var connectionsGroup = getConnectionsGroupInPage(doc.currentPage());
	if (connectionsGroup) {
		connectionsGroup.removeFromParent();
	}

	var connectionLayers = MSLayerArray.arrayWithLayers(flags);
	connectionsGroup = MSLayerGroup.groupFromLayers(connectionLayers);
	connectionsGroup.setName("___flags");
	connectionsGroup.setIsLocked(1);
	context.command.setValue_forKey_onLayer_forPluginIdentifier(true, "isflagContainer", connectionsGroup, kPluginDomain);
	doc.currentPage().deselectAllLayers();
	var loop = selectedLayers.objectEnumerator(), selectedLayer;
	while (selectedLayer = loop.nextObject()) {
		selectedLayer.select_byExpandingSelection(true, true);
	}
}
