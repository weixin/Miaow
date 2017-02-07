@import "common.js"

var kPluginDomain = "com.sketchplugins.wechat.link";
var lineColorKey = "com.sketchplugins.wechat.linecolor";
var drawLineLocationX = {};
var drawLineLocationY = {};
var colorLine = NSUserDefaults.standardUserDefaults().objectForKey(lineColorKey) || "#1AAD19";
var colorLineR = rgb(colorLine)[0];
var colorLineG = rgb(colorLine)[1];
var colorLineB = rgb(colorLine)[2];
var leaveZero = function(a){
	return parseInt(a);
	// return parseInt(parseInt(a).toString().substr(0,parseInt(a).toString().length-1) + '0');
}
var drawLineLocation = function(location,direction,plus){
	location = leaveZero(location)
	if(direction == 'horizontal'){
		if(drawLineLocationY[location]){
			if(plus){
				location =  location + 40;
			}else{
				location =  location - 40;
			}
			if(drawLineLocationY[location]){
				return drawLineLocation(location,direction,plus);
			}
		}
	}else{
		if(drawLineLocationX[location]){
			if(plus){
				location = location + 40;
			}else{
				location = location - 40;
			}
			if(drawLineLocationY[location]){
				return drawLineLocation(location,direction,plus);
			}
		}
	}
	setDrawLineLocation(location,direction);
	return location;
	
}
var setDrawLineLocation = function(location,direction){
	if(direction == 'horizontal'){
		drawLineLocationY[location] = true;
	}else{
		drawLineLocationX[location] = true;
	}
}

var sanitizeArtboard = function(artboard, context) {
	if (context.command.valueForKey_onLayer_forPluginIdentifier("artboardID", artboard, kPluginDomain) == nil) {
		context.command.setValue_forKey_onLayer_forPluginIdentifier(artboard.objectID(), "artboardID", artboard, kPluginDomain);
	}
}

var getConnectionsGroupInPage = function(page) {
	var connectionsLayerPredicate = NSPredicate.predicateWithFormat("userInfo != nil && function(userInfo, 'valueForKeyPath:', %@).isConnectionsContainer == true", kPluginDomain);
	return page.children().filteredArrayUsingPredicate(connectionsLayerPredicate).firstObject();
}

function segmentsIntr(a, b, c, d){
    // 三角形abc 面积的2倍  
    var area_abc = (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);  
    // 三角形abd 面积的2倍  
    var area_abd = (a.x - d.x) * (b.y - d.y) - (a.y - d.y) * (b.x - d.x);   
    // 面积符号相同则两点在线段同侧,不相交 (对点在线段上的情况,本例当作不相交处理);  
    if ( area_abc*area_abd>=0 ) {  
        return false;  
    }  
    // 三角形cda 面积的2倍  
    var area_cda = (c.x - a.x) * (d.y - a.y) - (c.y - a.y) * (d.x - a.x);  
    // 三角形cdb 面积的2倍  
    // 注意: 这里有一个小优化.不需要再用公式计算面积,而是通过已知的三个面积加减得出.  
    var area_cdb = area_cda + area_abc - area_abd ;  
    if (  area_cda * area_cdb >= 0 ) {  
        return false;  
    }  
    return true;
    //计算交点坐标  
    // var t = area_cda / ( area_abd- area_abc );  
    // var dx= t*(b.x - a.x),  
    //     dy= t*(b.y - a.y);  
    // return { x: a.x + dx , y: a.y + dy };  
}

var findAway = function(line,a,b,doc,endPoisiton){
	var art = doc.artboards();
	var pca = a;
	var pcb = b;
	var lastEndPosition = endPoisiton;
	a = a.absoluteRect();
	b = b.absoluteRect();
	var returnLine = [];
	var ax=0,bx=0,ay=0,by=0;
	var isReturnFlag = false;
	if(a.className() != "MSArtboardGroup" && a.className() != "MSSymbolMaster"){
		if(pca.parentArtboard()){
			pca = pca.parentArtboard();
		}
	}
	if(lastEndPosition == 'l'){
		ax = a.x() + a.size().width / 2;
		ay = a.y() + a.size().height;
		by = ay + 30;
	}else if(lastEndPosition == 'r'){
		ax = a.x() + a.size().width / 2;
		ay = a.y();
		by = ay - 80;
	}else if(lastEndPosition == 't'){
		ax = a.x() + a.size().width;
		bx = ax + 30;
		ay = a.y() + a.size().height/2;
	}else if(lastEndPosition == 'b'){
		ax = a.x();
		bx = ax - 30;
		ay = a.y() + a.size().height/2;
	}

	for(var i = 0;i<art.length;i++){
		if(pca.objectID() != art[i].objectID() && pcb.objectID() != art[i].objectID() && segmentsIntr(
				{x:line.ax,y:line.ay},
				{x:line.bx,y:line.by},
				{x:art[i].absoluteRect().x(),y:art[i].absoluteRect().y()},
				{x:art[i].absoluteRect().x()+art[i].absoluteRect().size().width,y:art[i].absoluteRect().y()+art[i].absoluteRect().size().height}
			)){
			isReturnFlag = true;
			if(endPoisiton == 't'){
				if(ax <= art[i].absoluteRect().x() + art[i].absoluteRect().size().width){
					if(bx < art[i].absoluteRect().x() + art[i].absoluteRect().size().width){
						bx = art[i].absoluteRect().x() + art[i].absoluteRect().size().width + 30;
						by = art[i].absoluteRect().y() + art[i].absoluteRect().size()/2;
					}
				}
			}
			else if(endPoisiton == 'b'){
				if(ax >= art[i].absoluteRect().x()){
					if(bx > art[i].absoluteRect().x()){
						bx = art[i].absoluteRect().x() - 30;
						by = art[i].absoluteRect().y() + art[i].absoluteRect().size().height/2;
					}
				}
			}
			else if(endPoisiton == 'l'){
				if(ay <= art[i].absoluteRect().y() + art[i].absoluteRect().size().height){
					if(by < art[i].absoluteRect().y() + art[i].absoluteRect().size().height){
						by = art[i].absoluteRect().y() + art[i].absoluteRect().size().height + 30;
						bx = art[i].absoluteRect().x() + art[i].absoluteRect().size()/2;
					}
				}
			}
			else if(endPoisiton == 'r'){
				if(ay >= art[i].absoluteRect().y()){
					if(by > art[i].absoluteRect().y()){
						by = art[i].absoluteRect().y() - 80;
						bx = art[i].absoluteRect().x() + art[i].absoluteRect().size()/2;
					}
				}
			}
		}
	}
	returnLine.push({x:ax,y:ay});
	if(lastEndPosition == 'l'){
		if(by < b.y() + b.size().height){
			returnLine.push({x:ax,y:by});
			returnLine.push({x:b.size().width+b.x(),y:by});
			endPoisiton = 'l';
		}else{
			returnLine.push({x:ax,y:by});
			returnLine.push({x:b.x() + b.size().width/2,y:by});
			returnLine.push({x:b.x() + b.size().width/2,y:b.y()+b.size().height});
			endPoisiton = 'b';
		}
	}else if(lastEndPosition == 'r'){
		if(by > b.y()){
			returnLine.push({x:ax,y:by});
			returnLine.push({x:b.x(),y:by});
			
			endPoisiton = 'r';
		}else{
			returnLine.push({x:ax,y:by});
			returnLine.push({x:b.x() + b.size().width/2,y:by});
			returnLine.push({x:b.x() + b.size().width/2,y:b.y()});
			endPoisiton = 't';
		}
	}else if(lastEndPosition == 't'){
		if(bx < b.x()+b.size().width){
			returnLine.push({x:bx,y:ay});
			returnLine.push({x:bx,y:b.y()});
			endPoisiton = 't';
		}else{
			returnLine.push({x:bx,y:ay});
			returnLine.push({x:bx,y:b.y()+b.size().height/2});
			returnLine.push({x:b.x()+b.size().width,y:b.y()+b.size().height/2});
			endPoisiton = 'l';
		}
	}else if(lastEndPosition == 'b'){
		if(bx > b.x()){
			returnLine.push({x:bx,y:ay});
			returnLine.push({x:bx,y:b.y() + b.size().height});
			endPoisiton = 'b';
		}else{
			returnLine.push({x:bx,y:ay});
			returnLine.push({x:bx,y:b.y()+b.size().height/2});
			returnLine.push({x:b.x(),y:b.y()+b.size().height/2});
			endPoisiton = 'r';
		}
	}
	return {
		line: returnLine,
		flag: isReturnFlag,
		endPoisiton: endPoisiton
	}
	
}

var drawPPP = function(a,b,doc){
	var domA = a;
	var domB = b;
	a = a.absoluteRect();
	b = b.absoluteRect();
	var startPointX;
	var startPointY;
	var endPointX;
	var endPointY;
	var endPoisiton = 'l';
	var returnDom = [];
	var tempPointX;
	var tempPointY;

	//先确定是否可以走直线
	var axPoint = a.x() + a.size().width/2;
	var ayPoint = a.y() + a.size().height/2;

	//是否是上下关系
	if(b.x() < axPoint && axPoint < b.x() + b.size().width){
		startPointX = axPoint;
		endPointX = axPoint;
		var plus = true;
		//在上边
		if(a.y() > b.y()){
			startPointY = a.y();
			endPointY = b.y() + b.size().height;
			endPoisiton = 'b';
		}else{
		//在下边
			startPointY = a.y() + a.size().height;
			endPointY = b.y();
			endPoisiton = 't';
			plus = false;
		}
		var line;
		var returnLine = findAway({ax:startPointX,ay:startPointY,bx:endPointX,by:endPointY},domA,domB,doc,endPoisiton);
		//三根线算法
		if(returnLine.flag){
			startPointX = returnLine.line[0].x;
			startPointY = returnLine.line[0].y;
			endPointX = returnLine.line[returnLine.line.length-1].x;
			endPointY = returnLine.line[returnLine.line.length-1].y;
			line = drawLine(returnLine.line,endPoisiton,true);
			endPoisiton = returnLine.endPoisiton;
		}else{
			var xLocation = drawLineLocation(startPointX,'horizontal',plus);
			startPointX = xLocation;
			endPointX = xLocation;
			line = drawLine([{x:startPointX,y:startPointY},{x:endPointX,y:endPointY}],endPoisiton);
		}
		returnDom.push(line);
	}
	//是否是左右关系
	else if(b.y() < ayPoint && ayPoint < b.y() + b.size().height){
		startPointY = ayPoint;
		endPointY = ayPoint;
		var plus = true;
		if(a.x() > b.x()){
		//在右边
			startPointX = a.x();
			endPointX = b.x() + b.size().width;
			endPoisiton = 'l';
		}else{
		//在左边
			startPointX = a.x() + a.size().width;
			endPointX = b.x() ;
			endPoisiton = 'r';
			plus = false;
		}
		var line;
		var returnLine = findAway({ax:startPointX,ay:startPointY,bx:endPointX,by:endPointY},domA,domB,doc,endPoisiton);
		//三根线算法
		if(returnLine.flag){
			startPointX = returnLine.line[0].x;
			startPointY = returnLine.line[0].y;
			endPointX = returnLine.line[returnLine.line.length-1].x;
			endPointY = returnLine.line[returnLine.line.length-1].y;
			line = drawLine(returnLine.line,endPoisiton,true);
			endPoisiton = returnLine.endPoisiton;
		}else{
			var yLocation = drawLineLocation(startPointY,'n',plus);
			startPointY = yLocation;
			endPointY = yLocation;
			line = drawLine([{x:startPointX,y:startPointY},{x:endPointX,y:endPointY}],endPoisiton);
		}
		returnDom.push(line);
	}
	// 都不是，要用两根线了
	else if(b.y() + b.size().height/2  < ayPoint || b.y() + b.size().height/2 > ayPoint){
		if(b.x() > a.x() + a.size().width / 2){
			startPointX = a.x() + a.size().width;
			startPointY = ayPoint;
			endPointX = b.x() + b.size().width/2;
			endPointY = ayPoint;
			endPoisiton = 'r';
			returnDom.push(drawLine([{x:startPointX,y:startPointY},{x:endPointX,y:endPointY}],endPoisiton));
		}
		else if(b.x() + b.size().width / 2 < a.x()){
			startPointX = a.x();
			startPointY = ayPoint;
			endPointX = b.x() + b.size().width/2;
			endPointY = ayPoint;
			endPoisiton = 'l';
			returnDom.push(drawLine([{x:startPointX,y:startPointY},{x:endPointX,y:endPointY}],endPoisiton));
		}
		tempPointX = startPointX;
		tempPointY = startPointY;
		startPointX = endPointX;
		startPointY = endPointY;
		endPointX = startPointX;
		if(b.y() + b.size().height/2 > ayPoint){
			endPointY = b.y();
			endPoisiton = 't';
		}else{
			endPointY = b.y() + b.size().height;
			endPoisiton = 'b';
		}
		
		returnDom.push(drawLine([{x:startPointX,y:startPointY},{x:endPointX,y:endPointY}],endPoisiton,true));
		startPointX = tempPointX;
		startPointY = tempPointY;
	}
	returnDom.push(drawRound(startPointX,startPointY));
	returnDom.push(drawArrow(endPointX,endPointY,endPoisiton));
	return returnDom;
}
var drawRound = function(x,y){
	var linkRect = NSInsetRect(NSMakeRect(x, y, 0, 0), -5, -5);
	var path = NSBezierPath.bezierPathWithOvalInRect(linkRect);
	var hitAreaLayer = MSShapeGroup.shapeWithBezierPath(path);
	hitAreaLayer.style().addStylePartOfType(0).setColor(MSImmutableColor.colorWithIntegerRed_green_blue_alpha(colorLineR,colorLineG,colorLineB,76.5).newMutableCounterpart());
	hitAreaLayer.style().addStylePartOfType(1).setColor(MSImmutableColor.colorWithIntegerRed_green_blue_alpha(colorLineR,colorLineG,colorLineB,255).newMutableCounterpart());
	hitAreaLayer.setName('Point');
	return hitAreaLayer;
}

var drawLine = function(linepoint,endPoisiton,isLess){
	var linePaths = [];
	var linePath = NSBezierPath.bezierPath();
	for(var i = 0;i<linepoint.length - 1;i++){
		if(i != 0){
			isLess = true;
		}
		if(endPoisiton == 'l'){
			linePath.moveToPoint(NSMakePoint(isLess?linepoint[i].x:linepoint[i].x-5,linepoint[i].y));
		}else if(endPoisiton == 'r'){
			linePath.moveToPoint(NSMakePoint(isLess?linepoint[i].x:linepoint[i].x+5,linepoint[i].y));
		}else if(endPoisiton == 't'){
			linePath.moveToPoint(NSMakePoint(linepoint[i].x,isLess?linepoint[i].y:linepoint[i].y+5));
		}else if(endPoisiton == 'b'){
			linePath.moveToPoint(NSMakePoint(linepoint[i].x,isLess?linepoint[i].y:linepoint[i].y-5));
		}
		linePath.lineToPoint(NSMakePoint(linepoint[i+1].x,linepoint[i+1].y));
	}

	linePath.closePath();

	var lineSh = MSShapeGroup.shapeWithBezierPath(linePath);
	var hitAreaBorder = lineSh.style().addStylePartOfType(1);
	hitAreaBorder.setColor(MSImmutableColor.colorWithIntegerRed_green_blue_alpha(colorLineR,colorLineG,colorLineB,255).newMutableCounterpart());
	hitAreaBorder.setThickness(6);
	hitAreaBorder.setPosition(0);
	lineSh.setName('Line');
	return lineSh;
}

var drawArrow = function(x,y,z){
	function base(){
		var path = NSBezierPath.bezierPath();
		path.moveToPoint(NSMakePoint(7.37,20.87));
		path.lineToPoint(NSMakePoint(23.25, 36.4));
		path.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(23.25, 40.65),NSMakePoint(24.45, 37.58),NSMakePoint(24.45, 39.47));
		path.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(18.92, 40.65),NSMakePoint(22.06, 41.82),NSMakePoint(20.11, 41.82));
		path.lineToPoint(NSMakePoint(0.85, 22.97));
		path.lineToPoint(NSMakePoint(0.85, 18.73));
		path.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(1.54, 18.22),NSMakePoint(1.06, 18.52),NSMakePoint(1.29, 18.35));
		path.lineToPoint(NSMakePoint(19.03, 0.73));
		
		path.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(23.27, 0.73),NSMakePoint(20.2, -0.45),NSMakePoint(22.1, -0.45));
		path.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(23.27, 4.97),NSMakePoint(24.45, 1.9),NSMakePoint(24.45, 3.8));
		path.lineToPoint(NSMakePoint(7.37, 20.87));		
		path.closePath();
		var arrow = MSShapeGroup.shapeWithBezierPath(path);
		arrow.setName('Arrow');
		arrow.style().addStylePartOfType(0).setColor(MSImmutableColor.colorWithIntegerRed_green_blue_alpha(colorLineR,colorLineG,colorLineB,255).newMutableCounterpart());
		return arrow;
	}
	function left(){
		var arrow = base();
		arrow.absoluteRect().setX(x);
		arrow.absoluteRect().setY(y - 21);
		return arrow;
	}
	function right(){
		var arrow = base();
		arrow.setRotation(180);
		arrow.absoluteRect().setX(x - 24);
		arrow.absoluteRect().setY(y - 21);
		return arrow;
	}
	function top(){
		var arrow = base();
		arrow.setRotation(90);
		arrow.absoluteRect().setX(x - 21);
		arrow.absoluteRect().setY(y - 23);
		return arrow;
	}
	function bottom(){
		var arrow = base();
		arrow.setRotation(270);
		arrow.absoluteRect().setX(x - 21);
		arrow.absoluteRect().setY(y);
		return arrow;
	}
	if(z == 'l'){
		return left();
	}else if(z == 'r'){
		return right();
	}else if(z == 't'){
		return top();
	}else if(z == 'b'){
		return bottom();
	}
}


var drawConnections = function(connection, doc) {
	var draw = drawPPP(connection.linkRect,connection.artboard,doc);
	doc.addLayers(draw);

	var connectionLayersDom = MSLayerArray.arrayWithLayers(draw);
	connectionsGroup = MSLayerGroup.groupFromLayers(connectionLayersDom);
	connectionsGroup.setName(connection.linkRect.objectID());
	return connectionsGroup;
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
			sanitizeArtboard(destinationArtboard, context);
			connections.push(drawConnections({
		  		linkRect : linkLayer,
		  		artboard: destinationArtboard
		  	},doc.currentPage()));
		}
	}

	var connectionLayers = MSLayerArray.arrayWithLayers(connections);
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
	var destArtboard, linkLayer;

	if (selection.count() != 1 && selection.count() != 2) {
		return NSApp.displayDialog('选中一个元素删除连接线，选中一个元素和一个Artboard生成连接线。');
	}

	if (selection.count() == 1) {
		var loop = context.selection.objectEnumerator(),
		linkLayer, destinationArtboardID;
		while (linkLayer = loop.nextObject()) {
			destinationArtboardID = context.command.valueForKey_onLayer_forPluginIdentifier("destinationArtboardID", linkLayer, kPluginDomain);
			if (!destinationArtboardID) { continue; }
			context.command.setValue_forKey_onLayer_forPluginIdentifier(nil, "destinationArtboardID", linkLayer, kPluginDomain);
		}

	}else if(selection.count() == 2) {
		if (selection.firstObject().className() == "MSArtboardGroup" || selection.firstObject().className() == "MSSymbolMaster") {
			if((selection.firstObject().className() == "MSArtboardGroup" || selection.firstObject().className() == "MSSymbolMaster") && (selection.lastObject().className() == "MSArtboardGroup" || selection.lastObject().className() == "MSSymbolMaster")){
				linkLayer = selection[0];
				destArtboard = selection[1];
			}else{
				destArtboard = selection[0];
				linkLayer = selection[1];
			}
			
		}
		else if(selection.lastObject().className() == "MSArtboardGroup" || selection.lastObject().className() == "MSSymbolMaster") {
			destArtboard = selection.lastObject();
			linkLayer = selection.firstObject();
		}
		var artboardID = destArtboard.objectID();
		context.command.setValue_forKey_onLayer_forPluginIdentifier(artboardID, "artboardID", destArtboard, kPluginDomain);
		context.command.setValue_forKey_onLayer_forPluginIdentifier(artboardID, "destinationArtboardID", linkLayer, kPluginDomain);
	}

	redrawConnections(context);
}