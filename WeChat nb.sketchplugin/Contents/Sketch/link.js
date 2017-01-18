var kPluginDomain = "com.abynim.sketchplugins.wechat";
var kShowConnectionsKey = "com.abynim.wechat.showConnections";

var sanitizeArtboard = function(artboard, context) {
	if (context.command.valueForKey_onLayer_forPluginIdentifier("artboardID", artboard, kPluginDomain) == nil) {
		context.command.setValue_forKey_onLayer_forPluginIdentifier(artboard.objectID(), "artboardID", artboard, kPluginDomain);
	}
}

var getConnectionsGroupInPage = function(page) {
	var connectionsLayerPredicate = NSPredicate.predicateWithFormat("userInfo != nil && function(userInfo, 'valueForKeyPath:', %@).isConnectionsContainer == true", kPluginDomain);
	return page.children().filteredArrayUsingPredicate(connectionsLayerPredicate).firstObject();
}

var drawConnections = function(connections, parent, exportScale) {
	var connectionsCount = connections.length,
		flowIndicatorColor =  "#F5A623",
		flowIndicatorAlpha = 1,
		minimumTapArea =  44,
		showLinkRects =  1,
		strokeWidth = 3,
		connectionType =  "curved",
		connectionLayers = [],
		hitAreaColor = MSImmutableColor.colorWithSVGString("#000000").newMutableCounterpart(),
		hitAreaBorderColor = MSImmutableColor.colorWithSVGString(flowIndicatorColor).newMutableCounterpart(),
		arrowRotation = 0,
		arrowOffsetX = 0,
		path, hitAreaLayer, linkRect, dropPoint, hitAreaBorder, startPoint, controlPoint1, controlPoint1Offset, controlPoint2OffsetX, controlPoint2OffsetY, linePath, lineLayer, destinationArtboardIsConditional, originPoint, degrees;
	hitAreaColor.setAlpha(0);
	hitAreaBorderColor.setAlpha(flowIndicatorAlpha);

	for (var i=0; i < connectionsCount; i++) {
		connection = connections[i];
		linkRect = connection.linkRect;
		destinationArtboardIsConditional = connection.destinationIsConditional == 1;
		if (linkRect.size.width < minimumTapArea) {
			linkRect = NSInsetRect(linkRect, (linkRect.size.width-minimumTapArea)/2, 0);
		}
		if (linkRect.size.height < minimumTapArea) {
			linkRect = NSInsetRect(linkRect, 0, (linkRect.size.height-minimumTapArea)/2);
		}

		if (showLinkRects == 1 && connection.linkIsCondition != 1) {
			path = NSBezierPath.bezierPathWithRect(linkRect);
			hitAreaLayer = MSShapeGroup.shapeWithBezierPath(path);
			hitAreaLayer.style().addStylePartOfType(0).setColor(hitAreaColor);
			hitAreaBorder = hitAreaLayer.style().addStylePartOfType(1);
			hitAreaBorder.setColor(hitAreaBorderColor);
			hitAreaBorder.setPosition(2);
			hitAreaBorder.setThickness(2*exportScale);
			parent.addLayers([hitAreaLayer]);
			connectionLayers.push(hitAreaLayer);
		}

		dropPoint = destinationArtboardIsConditional ? NSMakePoint(connection.dropPoint.x+(5*exportScale), connection.dropPoint.y + (10*exportScale)) : NSMakePoint(connection.dropPoint.x, connection.dropPoint.y);
		if (dropPoint.x < CGRectGetMinX(linkRect)) {
			dropPoint = NSMakePoint(dropPoint.x + 18, dropPoint.y - (30/exportScale) );
			arrowRotation = 90;
			arrowOffsetX = 2;
			if (dropPoint.y < CGRectGetMinY(linkRect)) {
				startPoint = NSMakePoint(CGRectGetMidX(linkRect), CGRectGetMinY(linkRect) + 5);
				controlPoint1Offset = Math.max(Math.abs(dropPoint.y - startPoint.y)/2, 200);
				controlPoint1 = NSMakePoint(startPoint.x, startPoint.y - controlPoint1Offset);
			} else {
				startPoint = NSMakePoint(CGRectGetMidX(linkRect), CGRectGetMaxY(linkRect) - 5);
				controlPoint1Offset = Math.max(Math.abs(dropPoint.y - startPoint.y)/2, 200);
				controlPoint1 = NSMakePoint(startPoint.x, startPoint.y + controlPoint1Offset);
			}
			controlPoint2OffsetX = 0;
			controlPoint2OffsetY = -160;

		} else {
			startPoint = NSMakePoint(CGRectGetMaxX(linkRect) - 5, CGRectGetMidY(linkRect));
			controlPoint1Offset = Math.max(Math.abs(dropPoint.x - startPoint.x)/2, 100);
			controlPoint1 = NSMakePoint(startPoint.x + controlPoint1Offset, startPoint.y);
			controlPoint2OffsetY = 0;
			controlPoint2OffsetX = Math.max(Math.abs(dropPoint.x - startPoint.x)/2, 100);
			arrowRotation = 0;
			arrowOffsetX = 0;
		}

		linkRect = NSInsetRect(NSMakeRect(startPoint.x, startPoint.y, 0, 0), -5, -5);
		path = NSBezierPath.bezierPathWithOvalInRect(linkRect);
		hitAreaLayer = MSShapeGroup.shapeWithBezierPath(path);
		hitAreaLayer.style().addStylePartOfType(0).setColor(hitAreaBorderColor);
		parent.addLayers([hitAreaLayer]);
		connectionLayers.push(hitAreaLayer);

		linePath = NSBezierPath.bezierPath();
		linePath.moveToPoint(startPoint);
		if (connectionType == "curved") {
			linePath.curveToPoint_controlPoint1_controlPoint2(dropPoint, controlPoint1, NSMakePoint(dropPoint.x - controlPoint2OffsetX, dropPoint.y + controlPoint2OffsetY));
		} else if (connectionType == "straight") {
			linePath.lineToPoint(dropPoint);
			originPoint = CGPointMake(dropPoint.x - startPoint.x, dropPoint.y - startPoint.y);
    		degrees = Math.atan2(originPoint.y, originPoint.x) * (180.0 / Math.PI);
    		arrowRotation = (degrees > 0.0 ? degrees : (360.0 + degrees));
    		if (arrowRotation < 110 || arrowRotation > 255) { arrowOffsetX = 2 };
		}

		lineLayer = MSShapeGroup.shapeWithBezierPath(linePath);
		lineLayer.setName("Flow arrow");
		hitAreaBorder = lineLayer.style().addStylePartOfType(1);
		hitAreaBorder.setColor(hitAreaBorderColor);
		hitAreaBorder.setThickness(strokeWidth*exportScale);
		hitAreaBorder.setPosition(0);
		parent.addLayers([lineLayer]);
		connectionLayers.push(lineLayer);

		var arrowSize = Math.max(12, strokeWidth*3);
		path = NSBezierPath.bezierPath();
		path.moveToPoint(NSMakePoint(dropPoint.x+(arrowSize*0.6), dropPoint.y));
		path.lineToPoint(NSMakePoint(dropPoint.x-arrowSize, dropPoint.y+(arrowSize*0.6)));
		path.lineToPoint(NSMakePoint(dropPoint.x-(arrowSize*0.6), dropPoint.y));
		path.lineToPoint(NSMakePoint(dropPoint.x-arrowSize, dropPoint.y-(arrowSize*0.6)));
		path.closePath();
		var arrow = MSShapeGroup.shapeWithBezierPath(path);
		arrow.style().addStylePartOfType(0).setColor(hitAreaBorderColor);
		arrow.setRotation(-arrowRotation);
		arrow.absoluteRect().setX(arrow.absoluteRect().x() + arrowOffsetX);
		parent.addLayers([arrow]);
		connectionLayers.push(arrow);

	}

	return connectionLayers;
}

var redrawConnections = function(context) {
	var doc = context.document || context.actionContext.document;
	var selectedLayers = doc.findSelectedLayers();

	var connectionsGroup = getConnectionsGroupInPage(doc.currentPage());
	if (connectionsGroup) {
		connectionsGroup.removeFromParent();
	}

	var linkLayersPredicate = NSPredicate.predicateWithFormat("userInfo != nil && function(userInfo, 'valueForKeyPath:', %@).destinationArtboardID != nil", kPluginDomain),
		linkLayers = doc.currentPage().children().filteredArrayUsingPredicate(linkLayersPredicate),
		loop = linkLayers.objectEnumerator(),
		connections = [],
		linkLayer, destinationArtboardID, destinationArtboard, isCondition, linkRect;

	while (linkLayer = loop.nextObject()) {

		destinationArtboardID = context.command.valueForKey_onLayer_forPluginIdentifier("destinationArtboardID", linkLayer, kPluginDomain);

		destinationArtboard = doc.currentPage().artboards().filteredArrayUsingPredicate(NSPredicate.predicateWithFormat("(objectID == %@) || (userInfo != nil && function(userInfo, 'valueForKeyPath:', %@).artboardID == %@)", destinationArtboardID, kPluginDomain, destinationArtboardID)).firstObject();

		if (destinationArtboard) {

			isCondition = context.command.valueForKey_onLayer_forPluginIdentifier("isConditionGroup", linkLayer, kPluginDomain) || 0;
			linkRect = linkLayer.parentArtboard() == nil ? linkLayer.absoluteRect().rect() : CGRectIntersection(linkLayer.absoluteRect().rect(), linkLayer.parentArtboard().absoluteRect().rect());

			sanitizeArtboard(destinationArtboard, context);

			connection = {
		  		linkRect : linkRect,
		  		linkID : linkLayer.objectID(),
		  		linkIsCondition : isCondition,
		  		dropPoint : {
		  			x : destinationArtboard.absoluteRect().x() - 10,
		  			y : destinationArtboard.absoluteRect().y()
		  		}
		  	}
		  	connections.push(connection);
		}
	}

	var connectionLayers = MSLayerArray.arrayWithLayers(drawConnections(connections, doc.currentPage(), 1));
	connectionsGroup = MSLayerGroup.groupFromLayers(connectionLayers);
	connectionsGroup.setName("Connections");
	connectionsGroup.setIsLocked(1);
	context.command.setValue_forKey_onLayer_forPluginIdentifier(true, "isConnectionsContainer", connectionsGroup, kPluginDomain);
	doc.currentPage().deselectAllLayers();

	var loop = selectedLayers.objectEnumerator(), selectedLayer;
	while (selectedLayer = loop.nextObject()) {
		selectedLayer.select_byExpandingSelection(true, true);
	}

	return connectionsGroup;
}


var onRun = function(context) {
	var selection = context.selection;
	var validSelection = true;
	var destArtboard, linkLayer;

	if (selection.count() == 1) {
		var loop = context.selection.objectEnumerator(),
		linkLayer, destinationArtboardID;
		while (linkLayer = loop.nextObject()) {
			destinationArtboardID = context.command.valueForKey_onLayer_forPluginIdentifier("destinationArtboardID", linkLayer, kPluginDomain);
			if (!destinationArtboardID) { continue; }
			context.command.setValue_forKey_onLayer_forPluginIdentifier(nil, "destinationArtboardID", linkLayer, kPluginDomain);
		}

		var showingConnections = NSUserDefaults.standardUserDefaults().objectForKey(kShowConnectionsKey) || 1;
	}else if(selection.count() == 2) {
		if (selection.firstObject().className() == "MSArtboardGroup" || selection.firstObject().className() == "MSSymbolMaster") {
			destArtboard = selection.firstObject();
			linkLayer = selection.lastObject();
		}
		else if(selection.lastObject().className() == "MSArtboardGroup" || selection.lastObject().className() == "MSSymbolMaster") {
			destArtboard = selection.lastObject();
			linkLayer = selection.firstObject();
		}
		var artboardID = context.command.valueForKey_onLayer_forPluginIdentifier("artboardID", destArtboard, kPluginDomain);
		if (!artboardID) {
			artboardID = destArtboard.objectID();
			context.command.setValue_forKey_onLayer_forPluginIdentifier(artboardID, "artboardID", destArtboard, kPluginDomain);
		}
		context.command.setValue_forKey_onLayer_forPluginIdentifier(artboardID, "destinationArtboardID", linkLayer, kPluginDomain);

		var showingConnections = NSUserDefaults.standardUserDefaults().objectForKey(kShowConnectionsKey) || 1;

		if (!destArtboard || linkLayer.className() == "MSArtboardGroup" || linkLayer.className() == "MSSymbolMaster" || linkLayer.parentArtboard() == destArtboard) {
			validSelection = false;
		}
	}else{
		validSelection = false;
	}



	redrawConnections(context);
}