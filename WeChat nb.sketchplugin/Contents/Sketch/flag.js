var kPluginDomain = "com.sketchplugins.wechat.flag";
var textCount = 1;
var getConnectionsGroupInPage = function(page) {
	var connectionsLayerPredicate = NSPredicate.predicateWithFormat("userInfo != nil && function(userInfo, 'valueForKeyPath:', %@).isflagContainer == true", kPluginDomain);
	return page.children().filteredArrayUsingPredicate(connectionsLayerPredicate).firstObject();
}
var getFlagCount = function(){
	return textCount++;
}
// var getFlagCount = function(doc){
// 	var linkLayersPredicate = NSPredicate.predicateWithFormat("userInfo != nil && function(userInfo, 'valueForKeyPath:', %@).FlagID != nil", kPluginDomain);
// 	var connectionsGroup = doc.currentPage().children().filteredArrayUsingPredicate(linkLayersPredicate);
// 	log(connectionsGroup);
// 	if(connectionsGroup){
// 		var name = {};
// 		for(var i = 0;i<layers.count();i++){
// 			name[layers[i].name().replace('___p','').replace('___t','').replace('-left','').replace('-right','')] = true;
// 		}
// 		var k = 1;
// 		while(1){
// 			if(!name['___'+k]){
// 				return (k);
// 			}
// 			k++;
// 		}
// 	}else{
// 		return 1;
// 	}
// }

var getParent = function(section){
	return section.parentArtboard();
}

var onRun = function(context) {
	var scale = 1;

	var drawLeftArrow = function(doc,dom,count){
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
		flag.style().addStylePartOfType(0).setColor(MSImmutableColor.colorWithIntegerRed_green_blue_alpha(26,173,25,76.5).newMutableCounterpart());
		flag.style().addStylePartOfType(1).setColor(MSImmutableColor.colorWithIntegerRed_green_blue_alpha(26,173,25,255).newMutableCounterpart());
		flag.absoluteRect().setX(linexl);
		flag.absoluteRect().setY(liney);
		flag.setName('___'+count+'___p');

		var textLayer = MSTextLayer.alloc().init();

		textLayer.absoluteRect().setX(linexl + (24+13 * scale) * scale /2);
		
		textLayer.absoluteRect().setY(liney + 8 * scale / 2 );
		textLayer.setName('___'+count+'___t');
		var fixedBehaviour = 1;
		textLayer.setTextBehaviour(fixedBehaviour);
		textLayer.setStringValue(count.toString());
		textLayer.setTextColor(MSImmutableColor.colorWithIntegerRed_green_blue_alpha(26,173,25,255).newMutableCounterpart());
		textLayer.setFontSize(13 * scale);
		doc.currentPage().addLayers([flag,textLayer]);
		return [flag,textLayer];
	}
	var drawRightArrow = function(){
		context.command.setValue_forKey_onLayer_forPluginIdentifier(dom.objectID(), "FlagID", dom, kPluginDomain);

		var linexr = selection.absoluteRect().x() - 68;
		var liney = selection.absoluteRect().y() + selection.rect().size.height/2 - (24 * scale/2);

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

	var draw = function(doc,nowDom){

		context.command.setValue_forKey_onLayer_forPluginIdentifier(nowDom.objectID() + '_l', "FlagID", nowDom, kPluginDomain);

		var linkLayersPredicate = NSPredicate.predicateWithFormat("userInfo != nil && function(userInfo, 'valueForKeyPath:', %@).FlagID != nil", kPluginDomain);
		var linkLayers = doc.currentPage().children().filteredArrayUsingPredicate(linkLayersPredicate);
		log(linkLayers);

		var loop = linkLayers.objectEnumerator();
		var returnLine = [];
		var flagCount = 1;
		while (linkLayer = loop.nextObject()) {
			if(linkLayer.objectID() == nowDom.objectID()){
				//next
			}
			returnLine = returnLine.concat(drawLeftArrow(doc,linkLayer,flagCount++));
			
			// if(1){
			// 	returnLine = returnLine.concat(drawLeftArrow(doc,linkLayer,flagCount));
			// }
			// if(2){
			// 	deleteArrow(doc,linkLayer);
			// }
		}
		return returnLine;
	}


	if (context.selection.count()!=1) {
		NSApp.displayDialog('请选且只选中一个需要添加标志的元素');
        return;
	}

	var selection = context.selection[0];
	var doc = context.document;
	var selectedLayers = doc.findSelectedLayers();

	var p = getParent(selection);
	if(p){
		if(p.rect().size.width > 414){
			scale = 2;
		}
	}


	var flags = [];

	flags = draw(doc,selection);

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
