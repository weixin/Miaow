var kPluginDomain = "com.abynim.sketchplugins.wechat";
var kShowConnectionsKey = "com.abynim.wechat.showConnections";

var getConnectionsGroupInPage = function(page) {
	var connectionsLayerPredicate = NSPredicate.predicateWithFormat("userInfo != nil && function(userInfo, 'valueForKeyPath:', %@).isflagContainer == true", kPluginDomain);
	return page.children().filteredArrayUsingPredicate(connectionsLayerPredicate).firstObject();
}

var onRun = function(context) {
	var selection = context.selection[0];
	var doc = context.document;
	var selectedLayers = doc.findSelectedLayers();
	
	if (context.selection.count() != 1) {
		NSApp.displayDialog('请选中一个需要添加标志的元素');
        return;
	}else{
		var linexl = selection.absoluteRect().x();
		var linexr = selection.absoluteRect().x() + selection.rect().size.width;
		var liney = selection.absoluteRect().y() + selection.rect().size.height/2;
		log(linexl);
		log(linexr);
		log(liney);

		var flags = [];
		var path = NSBezierPath.bezierPath();
		path.moveToPoint(NSMakePoint(0,24));
		path.lineToPoint(NSMakePoint(44,0));
		path.lineToPoint(NSMakePoint(68,24));
		path.lineToPoint(NSMakePoint(44,48));
		path.closePath();
		var flag = MSShapeGroup.shapeWithBezierPath(path);
		flag.style().addStylePartOfType(0).setColor(MSImmutableColor.colorWithSVGString('#1AAD19').newMutableCounterpart());
		flag.absoluteRect().setX(linexl);
		flag.absoluteRect().setY(liney);
		flags.push(flag);

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
}