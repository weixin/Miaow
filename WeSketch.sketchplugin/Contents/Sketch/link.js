@import "common.js"
var kPluginDomain = "com.sketchplugins.wechat.link";
var lineColorKey = "com.sketchplugins.wechat.linecolor";
var lineThicknessKey = "com.sketchplugins.wechat.linethickness";
var selectionDom = "com.sketchplugins.wechat.selectionDom";
var selectionDom1 = "com.sketchplugins.wechat.selectionDom1";
var selectionDom2 = "com.sketchplugins.wechat.selectionDom2";
var Selection = NSUserDefaults.standardUserDefaults().objectForKey(selectionDom) || '';
var colorLine = NSUserDefaults.standardUserDefaults().objectForKey(lineColorKey) || "#1AAD19";
var lineThickness = NSUserDefaults.standardUserDefaults().objectForKey(lineThicknessKey) || "6";
var colorLineR = rgb(colorLine)[0];
var colorLineG = rgb(colorLine)[1];
var colorLineB = rgb(colorLine)[2];
var LineToArtJL = 120;
var lineCollections = []; // 所有线的集合 [{ x: 1; y: 2; direction: ‘l’; position: 3 },...]

var sanitizeArtboard = function(artboard, context) {
	if (context.command.valueForKey_onLayer_forPluginIdentifier("artboardID", artboard, kPluginDomain) == nil) {
		context.command.setValue_forKey_onLayer_forPluginIdentifier(artboard.objectID(), "artboardID", artboard, kPluginDomain);
	}
}

var getConnectionsGroupInPage = function(page) {
	var connectionsLayerPredicate = NSPredicate.predicateWithFormat("userInfo != nil && function(userInfo, 'valueForKeyPath:', %@).isConnectionsContainer == true", kPluginDomain);
	return page.children().filteredArrayUsingPredicate(connectionsLayerPredicate).firstObject();
}
function segmentsIntr0(a, b, c, d){
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
}

function segmentsIntr(a, b, c, d){
	a = {x:parseInt(a.x),y:parseInt(a.y)};
	b = {x:parseInt(b.x),y:parseInt(b.y)};
	var cc = {x:parseInt(c.x),y:parseInt(c.y)};
	var dd = {x:parseInt(d.x),y:parseInt(d.y)};

	var flag = 0;
	for(var i = 0;i < 4;i++){
		if(i == 0){
			c = {x:cc.x,y:cc.y};
			d = {x:cc.x,y:dd.y};
		}else if(i == 1){
			c = {x:cc.x,y:cc.y};
			d = {x:dd.x,y:cc.y};
		}else if(i == 2){
			c = {x:dd.x,y:dd.y};
			d = {x:dd.x,y:cc.y};
		}else if(i == 3){
			c = {x:dd.x,y:dd.y};
			d = {x:cc.x,y:dd.y};
		}
		// 三角形abc 面积的2倍
	    var area_abc = (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);
	    // 三角形abd 面积的2倍
	    var area_abd = (a.x - d.x) * (b.y - d.y) - (a.y - d.y) * (b.x - d.x);
	    // 面积符号相同则两点在线段同侧,不相交 (对点在线段上的情况,本例当作不相交处理);
	    if ( area_abc*area_abd>=0 ) {
	        continue;
	    }
	    // 三角形cda 面积的2倍
	    var area_cda = (c.x - a.x) * (d.y - a.y) - (c.y - a.y) * (d.x - a.x);
	    // 三角形cdb 面积的2倍
	    // 注意: 这里有一个小优化.不需要再用公式计算面积,而是通过已知的三个面积加减得出.
	    var area_cdb = area_cda + area_abc - area_abd ;
	    if (  area_cda * area_cdb >= 0 ) {
	        continue;
	    }
	    var t = area_cda / ( area_abd- area_abc );
	    var dx= t*(b.x - a.x),
	        dy= t*(b.y - a.y);
	    return { x: a.x + dx , y: a.y + dy,flag:true };
	}
    return {flag:false};
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
	if(b.className() != "MSArtboardGroup" && b.className() != "MSSymbolMaster"){
		if(pcb.parentArtboard()){
			pcb = pcb.parentArtboard();
		}
	}
	if(lastEndPosition == 'l'){
		ax = a.x() + a.size().width / 2;
		ay = a.y() + a.size().height;
		by = ay + LineToArtJL;
	}else if(lastEndPosition == 'r'){
		ax = a.x() + a.size().width / 2;
		ay = a.y();
		by = ay - LineToArtJL;
	}else if(lastEndPosition == 't'){
		ax = a.x() + a.size().width;
		bx = ax + LineToArtJL;
		ay = a.y() + a.size().height/2;
	}else if(lastEndPosition == 'b'){
		ax = a.x();
		bx = ax - LineToArtJL;
		ay = a.y() + a.size().height/2;
	}


	for(var i = 0;i<art.length;i++){
		if(pca.objectID() != art[i].objectID() && pcb.objectID() != art[i].objectID() && segmentsIntr0(
				{x:line.ax,y:line.ay},
				{x:line.bx,y:line.by},
				{x:art[i].absoluteRect().x(),y:art[i].absoluteRect().y()},
				{x:art[i].absoluteRect().x()+art[i].absoluteRect().size().width,y:art[i].absoluteRect().y()+art[i].absoluteRect().size().height}
			)){
			isReturnFlag = true;
			if(endPoisiton == 't'){
				if(ax <= art[i].absoluteRect().x() + art[i].absoluteRect().size().width){
					if(bx < art[i].absoluteRect().x() + art[i].absoluteRect().size().width){
						bx = art[i].absoluteRect().x() + art[i].absoluteRect().size().width + LineToArtJL;
						by = art[i].absoluteRect().y() + art[i].absoluteRect().size().height/2;
					}
				}
			}
			else if(endPoisiton == 'b'){
				if(ax >= art[i].absoluteRect().x()){
					if(bx > art[i].absoluteRect().x()){
						bx = art[i].absoluteRect().x() - LineToArtJL;
						by = art[i].absoluteRect().y() + art[i].absoluteRect().size().height/2;
					}
				}
			}
			else if(endPoisiton == 'l'){
				if(ay <= art[i].absoluteRect().y() + art[i].absoluteRect().size().height){
					if(by < art[i].absoluteRect().y() + art[i].absoluteRect().size().height){
						by = art[i].absoluteRect().y() + art[i].absoluteRect().size().height + LineToArtJL;
						bx = art[i].absoluteRect().x() + art[i].absoluteRect().size().width/2;
					}
				}
			}
			else if(endPoisiton == 'r'){
				if(ay >= art[i].absoluteRect().y()){
					if(by > art[i].absoluteRect().y()){
						by = art[i].absoluteRect().y() - LineToArtJL;
						bx = art[i].absoluteRect().x() + art[i].absoluteRect().size().width/2;
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

var drawTwoLine = function(a,b,doc){
	var art = doc.artboards();
	var pca = a;
	var pcb = b;
	var endPoisiton;
	a = a.absoluteRect();
	b = b.absoluteRect();
	if(a.className() != "MSArtboardGroup" && a.className() != "MSSymbolMaster"){
		if(pca.parentArtboard()){
			pca = pca.parentArtboard();
		}
	}
	if(b.className() != "MSArtboardGroup" && b.className() != "MSSymbolMaster"){
		if(pcb.parentArtboard()){
			pcb = pcb.parentArtboard();
		}
	}
	//先左右后上下
	var axPoint = a.x() + a.size().width/2;
	var ayPoint = a.y() + a.size().height/2;
	var tmpLinePoint = [];
	var isReturnFlag = true;
	if(b.x() > a.x() + a.size().width / 2){
		startPointX = a.x() + a.size().width;
		startPointY = ayPoint;
		endPointX = b.x() + b.size().width/2;
		endPointY = ayPoint;
	}
	else if(b.x() + b.size().width / 2 < a.x()){
		startPointX = a.x();
		startPointY = ayPoint;
		endPointX = b.x() + b.size().width/2;
		endPointY = ayPoint;
	}
	tmpLinePoint = [{x:startPointX, y:startPointY}, {x:endPointX, y:endPointY}];

	if(b.y() + b.size().height/2 > ayPoint){
		endPointY = b.y();
		endPoisiton = 't';
	}else{
		endPointY = b.y() + b.size().height;
		endPoisiton = 'b';
	}
	tmpLinePoint.push({ x:endPointX, y:endPointY });
	for(var k = 0;k<tmpLinePoint.length - 1;k++){
		for(var i = 0;i<art.length;i++){
			var segments = segmentsIntr(
					{x:tmpLinePoint[k].x,y:tmpLinePoint[k].y},
					{x:tmpLinePoint[k+1].x+5,y:tmpLinePoint[k+1].y+5},
					{x:art[i].absoluteRect().x(),y:art[i].absoluteRect().y()},
					{x:art[i].absoluteRect().x()+art[i].absoluteRect().size().width,y:art[i].absoluteRect().y()+art[i].absoluteRect().size().height}
				);
			if(pca.objectID() != art[i].objectID() && pcb.objectID() != art[i].objectID() && segments.flag == true){
				isReturnFlag = false;
			}
		}
	}
	//先上下后左右
	if(!isReturnFlag){
		tmpLinePoint.splice(0,tmpLinePoint.length);
		isReturnFlag = true;
		if(b.y() + b.size().height/2 > ayPoint){
			startPointY = a.y() + a.size().height;
		}else{
			startPointY = a.y();
		}
		startPointX = a.x() + a.size().width/2;
		endPointX = startPointX;
		endPointY = b.y() + b.size().height/2;
		tmpLinePoint = [{x:startPointX, y:startPointY}, {x:endPointX, y:endPointY}];
		if(b.x() > a.x() + a.size().width / 2){
			endPointX = b.x();
			endPoisiton = 'r';
		}else{
			endPointX = b.x() + b.size().width;
			endPoisiton = 'l';
		}
		tmpLinePoint.push({ x:endPointX, y:endPointY });
		for(var k = 0;k<tmpLinePoint.length - 1;k++){
			for(var i = 0;i<art.length;i++){
				var segments = segmentsIntr(
					{x:tmpLinePoint[k].x,y:tmpLinePoint[k].y},
					{x:tmpLinePoint[k+1].x+5,y:tmpLinePoint[k+1].y+5},
					{x:art[i].absoluteRect().x(),y:art[i].absoluteRect().y()},
					{x:art[i].absoluteRect().x()+art[i].absoluteRect().size().width,y:art[i].absoluteRect().y()+art[i].absoluteRect().size().height}
				);
				if(pca.objectID() != art[i].objectID() && pcb.objectID() != art[i].objectID() && segments.flag == true){
					isReturnFlag = false;
				}
			}
		}
	}
	
	return {
		line: tmpLinePoint,
		flag: isReturnFlag,
		endPoisiton: endPoisiton
	}
}

var findAway2 = function(a,b,doc){
	var endPoisitonArrow = 'b';
	var art = doc.artboards();
	var returnLine = [];
	var isReturnFlag = false;
	var pca = a,pcb = b;
	var fx;
	var zaLength = 0;
	if(a.className() != "MSArtboardGroup" && a.className() != "MSSymbolMaster"){
		if(a.parentArtboard()){
			pca = pca.parentArtboard();
		}
	}
	if(b.className() != "MSArtboardGroup" && b.className() != "MSSymbolMaster"){
		if(pcb.parentArtboard()){
			pcb = pcb.parentArtboard();
		}
	}
	a = a.absoluteRect();
	b = b.absoluteRect();

	//确认位置关系 并确定起始点
	var qda = [];
	var ax,bx,ay,by,nx,ny;
	var linePath = [];
	var iFlag = 0;

	//左右
	if(b.x() > a.x()){
		ax = a.size().width + a.x();
		ay = a.size().height/2 + a.y();
		bx = b.x() + 5;
		by = b.size().height/2 + b.y();
		fx = 'r';
		returnLine.push({x:parseInt(ax),y:parseInt(ay)});
		if(b.y() > a.y()){
			// 目标在右下角 右下右
			getLinePath({x:ax,y:ay},{x:bx,y:by},fx,'b');
		}else{
			// 目标在右上角 右上右
			getLinePath({x:ax,y:ay},{x:bx,y:by},fx,'t');
		}
	}else{
		ax = a.x() - 5;
		ay = a.size().height/2 + a.y();
		bx = b.size().width + b.x();
		by = b.size().height/2 + b.y();
		fx = 'l';
		returnLine.push({x:parseInt(ax),y:parseInt(ay)});
		if(b.y() > a.y()){
			// 目标在左下角 左下左
			getLinePath({x:ax,y:ay},{x:bx,y:by},fx,'b');
		}else{
			// 目标在左上角 左上左
			getLinePath({x:ax,y:ay},{x:bx,y:by},fx,'t');
		}
	}

	function getLinePath(startPosition,endPoisiton,fx,nextFx){
		iFlag = iFlag +1;
		if(iFlag == 15){
			return iFlag ++;
		}
		//找到路径中最近的产生碰撞的元素
		var pzysx = 0;
		var pzysy = 0;
		var isPZ = false;
		var thisEndPosition = {x:parseInt(startPosition.x),y:parseInt(startPosition.y)};
		var PZLine = {x:parseInt(endPoisiton.x),y:parseInt(endPoisiton.y)};

		if(fx == 'l' || fx == 'r'){
			PZLine.y = startPosition.y;
			if(fx == 'l'){
				PZLine.x = PZLine.x - pcb.absoluteRect().size().width/2;
			}else{
				PZLine.x = PZLine.x + pcb.absoluteRect().size().width/2;
			}
		}else if(fx == 't' || fx == 'b'){
			PZLine.x = startPosition.x;
			if(fx == 't'){
				PZLine.y = PZLine.y - pcb.absoluteRect().size().height/2;
			}else{
				PZLine.y = PZLine.y + pcb.absoluteRect().size().height/2;
			}
		}

		var startArtPosition = pca.absoluteRect();
		for(var i = 0;i<art.length;i++){
			var segments = segmentsIntr(
					{x:startPosition.x,y:startPosition.y},
					PZLine,
					{x:art[i].absoluteRect().x(),y:art[i].absoluteRect().y()},
					{x:art[i].absoluteRect().x()+art[i].absoluteRect().size().width,y:art[i].absoluteRect().y()+art[i].absoluteRect().size().height}
				);
			if(pca.objectID() != art[i].objectID() && pcb.objectID() != art[i].objectID() && segments.flag == true){

				//需要一个绕过的情况

				isReturnFlag = true;
				if((pzysx < art[i].absoluteRect().x() + art[i].absoluteRect().size().width || !isPZ) && fx == 'l'){
					pzysx = parseInt(art[i].absoluteRect().x() + art[i].absoluteRect().size().width);
					thisEndPosition.x = parseInt(startArtPosition.x() - (startArtPosition.x() - (art[i].absoluteRect().x() + art[i].absoluteRect().size().width)) / 2);
					if(thisEndPosition.x == startPosition.x && thisEndPosition.y == startPosition.y){
						if(nextFx == 'b'){
							returnLine.splice(returnLine.length-1,1);
							thisEndPosition.y = art[i].absoluteRect().y() - LineToArtJL;
						}else if(nextFx == 't'){
							returnLine.splice(returnLine.length-1,1);
							thisEndPosition.y = art[i].absoluteRect().y() + art[i].absoluteRect().size().height + LineToArtJL;
						}
						returnLine.push({x:parseInt(thisEndPosition.x),y:parseInt(thisEndPosition.y)});
		 				getLinePath(thisEndPosition,endPoisiton,fx,nextFx);
		 				return;
					}
				}
				else if((pzysx > art[i].absoluteRect().x() || !isPZ) && fx == 'r'){
					pzysx = art[i].absoluteRect().x();
					thisEndPosition.x = parseInt(startArtPosition.x() + startArtPosition.size().width + (art[i].absoluteRect().x() - startArtPosition.x() - startArtPosition.size().width) / 2);
					if(thisEndPosition.x == startPosition.x && thisEndPosition.y == startPosition.y){
						if(nextFx == 'b'){
							returnLine.splice(returnLine.length-1,1);
							thisEndPosition.y = art[i].absoluteRect().y() - LineToArtJL;
						}else if(nextFx == 't'){
							returnLine.splice(returnLine.length-1,1);
							thisEndPosition.y = art[i].absoluteRect().y() + art[i].absoluteRect().size().height + LineToArtJL;
						}
						returnLine.push({x:parseInt(thisEndPosition.x),y:parseInt(thisEndPosition.y)});
		 				getLinePath(thisEndPosition,endPoisiton,fx,nextFx);
		 				return;
					}
				}
				else if((pzysy > art[i].absoluteRect().y() + art[i].absoluteRect().size().height || !isPZ) && fx == 't'){
					pzysy = art[i].absoluteRect().y() + art[i].absoluteRect().size().height;
					thisEndPosition.y = parseInt(startPosition.y - (startPosition.y - (art[i].absoluteRect().y() + art[i].absoluteRect().size().height)) / 2);

				}
				else if((pzysy > art[i].absoluteRect().y() || !isPZ) && fx == 'b'){
					pzysy = art[i].absoluteRect().y();
					thisEndPosition.y = parseInt(startPosition.y + (art[i].absoluteRect().y() - startPosition.y) / 2);
				}
				isPZ = true;
			}
		}
		var endObject = {};

		if(isPZ){
			if(fx == 'l' || fx == 'r'){
				zaLength ++;
			}else{
				zaLength --;
			}
			if(zaLength > 0){
				if(b.x() > a.x()){
					endPoisiton.x = b.x() + 10;
					endPoisiton.y = b.size().height/2 + b.y();
				}else{
					endPoisiton.x = b.size().width + b.x() - 10;
					endPoisiton.y = b.size().height/2 + b.y();
				}
			}else{
				if(b.y() < a.y()){
					endPoisiton.x = b.x() + b.size().width/2;
					endPoisiton.y = b.y() + b.size().height - 10;
				}else{
					endPoisiton.x = b.x() + b.size().width/2;
					endPoisiton.y = b.y() + 10;
				}
			}
			endObject = {x:parseInt(thisEndPosition.x),y:parseInt(thisEndPosition.y)};
			pzysx = 0;
			pzysy = 0;
		}else{
			if(fx == 'l' || fx == 'r'){
				endObject = {x:parseInt(endPoisiton.x),y:parseInt(startPosition.y)};
			}else if(fx == 't' || fx == 'b'){
				endObject = {x:parseInt(startPosition.x),y:parseInt(endPoisiton.y)};
			}
		}


		if(returnLine[returnLine.length-1].x != endObject.x || returnLine[returnLine.length-1].y != endObject.y){
			returnLine.push(endObject);
			//判断是不是撞到目标了
			for(var i = 0;i<art.length;i++){
				var segments = segmentsIntr(
					{x:startPosition.x,y:startPosition.y},
					endObject,
					{x:art[i].absoluteRect().x(),y:art[i].absoluteRect().y()},
					{x:art[i].absoluteRect().x()+art[i].absoluteRect().size().width,y:art[i].absoluteRect().y()+art[i].absoluteRect().size().height}
				);
				if(pcb.objectID() == art[i].objectID() && segments.flag == true){
					returnLine.splice(returnLine.length-1,1);
					returnLine.push({x:parseInt(segments.x),y:parseInt(segments.y)});
					if(fx == 'b'){
						endPoisitonArrow = 't';
					}else if(fx == 't'){
						endPoisitonArrow = 'b';
					}else{
						endPoisitonArrow = fx;
					}
					return;
				}
			}
		}else{
			returnLine.splice(returnLine.length-1,1);
		}

		if(parseInt(endObject.x) != parseInt(endPoisiton.x) || parseInt(endObject.y) != parseInt(endPoisiton.y)){
			 getLinePath(endObject,endPoisiton,nextFx,fx);
		}else{
			endPoisitonArrow = fx;
			if(fx == 'b'){
				endPoisitonArrow = 't';
			}else if(fx == 't'){
				endPoisitonArrow = 'b';
			}
		}
	}
	if(iFlag == 16){
		NSApp.displayDialog(pca.name() + '和' + pcb.name() + '之间生成连线太过复杂，请调整它们之间的摆放顺序再进行连接');
	}

	return {
		line: returnLine,
		flag: isReturnFlag,
		endPoisiton: endPoisitonArrow
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
			line = drawLine([{x:startPointX,y:startPointY},{x:endPointX,y:endPointY}],endPoisiton);
		}
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
			line = drawLine(returnLine.line,returnLine.endPoisiton,true);
		}else{
			line = drawLine([{x:startPointX,y:startPointY},{x:endPointX,y:endPointY}],endPoisiton);
		}
	}
	// 都不是，要用两根线了
	else if(b.y() + b.size().height/2  < ayPoint || b.y() + b.size().height/2 > ayPoint){
		var returnLine = drawTwoLine(domA,domB,doc);
		if(returnLine.flag == false){
			returnLine = findAway2(domA,domB,doc);
		}
		log(returnLine);
		line = drawLine(returnLine.line,returnLine.endPoisiton,true);
		

	}
	return line;
}

/*
* 获取两个点（有顺序的点）连成线的方向
*/
var getLineDirection = function (pointeOne, pointTwo) {
		if (pointeOne.x === pointTwo.x) { // 两个点的 x 相同
				if (pointeOne.y > pointTwo.y) { // 上
						return 't';
				}
				else { // 下
						return 'b';
				}
		}
		else { // 两个点的 y 相同
				if (pointeOne.x > pointTwo.x) { // 左
						return 'l';
				}
				else { // 右
						return 'r';
				}
		}
}

/*
* 获取两个点（有顺序的点）连成线的位置
*/
var getLinePosition = function (point) {
		if (point.direction == 't' || point.direction == 'b') {
				return point.x;
		}
		else {
				return point.y;
		}
}

var drawLine = function(linepoint,endPoisiton,isLess){
	var linePaths = [];
	var linePath = NSBezierPath.bezierPath();

	var lineCount = linepoint.length;
	var offset = 20;
	var coincideOffset = lineThickness * 5;

	for (var i = 0; i < lineCount - 1; i++) { // 给每个点添加接下来走向的方向和位置属性
			linepoint[i].direction = getLineDirection(linepoint[i], linepoint[i+1]);
			linepoint[i].position = getLinePosition(linepoint[i]]);
			lineCollections.push(linepoint[i]);
	}

	var comparedLineCollectionCount = lineCollections.length - (lineCount - 1);

	// 解决线重合问题
	for (var i = 0; i < lineCount; i++) {
			for (var j = 0; j < comparedLineCollectionCount; j++) {
					if ((linepoint[i].direction == 't' || linepoint[i].direction == 'b')
							&& (Math.abs(linepoint[i].position - lineCollections[j].position) < 3)) {
							// 不是起始线重合，位于起始点左侧 || 起始线重合: 位于重合线下侧，减去 coincideOffset
							if ((i != 0 && linepoint[0].x < linepoint[i].x)
									|| (i == 0 && (linepoint[0].y < lineCollections[j].y))) {
										linepoint[i].x -= coincideOffset;
										linepoint[i+1].x -= coincideOffset;
							}
							else {
										linepoint[i].x += coincideOffset;
										linepoint[i+1].x += coincideOffset;
							}
					}
					else if ((linepoint[i].direction == 'l' || linepoint[i].direction == 'r')
									 && (Math.abs(linepoint[i].position - lineCollections[j].position) < 3)) {
							// 不是起始线重合，位于起始点上侧 || 起始线重合: 位于重合线左侧，减去 coincideOffset
							if ((i != 0 && linepoint[0].y < linepoint[i].y)
									|| (i == 0 && linepoint[0].x < lineCollections[j].x)) {
										linepoint[i].y -= coincideOffset;
										linepoint[i+1].y -= coincideOffset;
							}
							else {
										linepoint[i].y += coincideOffset;
										linepoint[i+1].y += coincideOffset;
						 }
					}
					else {}
			}
	}

	for(var i = 0; i < lineCount - 1; i++){
		if (i === 0) { // 第一个点不做修改
				linePath.moveToPoint(NSMakePoint(linepoint[i].x, linepoint[i].y));
		}
		if (i === lineCount - 2) { // 倒数第二个点绘制直线
				linePath.lineToPoint(NSMakePoint(linepoint[i+1].x, linepoint[i+1].y));
		}
		else {
			// 先绘制到下一个点的直线，然后绘制到下下个点的曲线
			// 0.13 = 1 - cos(30)
			// 0.5 = 1- sin(30)
			if (linepoint[i].direction === 't') { // 上
					linePath.lineToPoint(NSMakePoint(linepoint[i+1].x, linepoint[i+1].y + offset));
					// 绘制过渡曲线
					if (linepoint[i+1].direction === 'l') { // 下一条线的方向 左
							linePath.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(linepoint[i+1].x - offset, linepoint[i+1].y), NSMakePoint(linepoint[i+1].x - offset*0.13, linepoint[i+1].y + offset*0.5), NSMakePoint(linepoint[i+1].x - offset*0.5, linepoint[i+1].y + offset*0.13));
					}
					else { // 右
							linePath.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(linepoint[i+1].x + offset, linepoint[i+1].y), NSMakePoint(linepoint[i+1].x + offset*0.13, linepoint[i+1].y + offset*0.5), NSMakePoint(linepoint[i+1].x + offset*0.5, linepoint[i+1].y + offset*0.13));
					}
			}
			else if (linepoint[i].direction === 'b') { // 下
					linePath.lineToPoint(NSMakePoint(linepoint[i+1].x, linepoint[i+1].y - offset));
					// 绘制过渡曲线
					if (linepoint[i+1].direction === 'l') { // 下一条线的方向 左
							linePath.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(linepoint[i+1].x - offset, linepoint[i+1].y), NSMakePoint(linepoint[i+1].x - offset*0.13, linepoint[i+1].y - offset*0.5), NSMakePoint(linepoint[i+1].x - offset*0.5, linepoint[i+1].y - offset*0.13));
					}
					else { // 右
							linePath.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(linepoint[i+1].x + offset, linepoint[i+1].y), NSMakePoint(linepoint[i+1].x + offset*0.13, linepoint[i+1].y - offset*0.5), NSMakePoint(linepoint[i+1].x + offset*0.5, linepoint[i+1].y - offset*0.13));
					}
			}
			else if (linepoint[i].direction === 'l') { // 左
					linePath.lineToPoint(NSMakePoint(linepoint[i+1].x + offset, linepoint[i+1].y));
					// 绘制过渡曲线
					if (linepoint[i+1].direction === 't') { // 下一条线的方向 上
							linePath.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(linepoint[i+1].x, linepoint[i+1].y - offset), NSMakePoint(linepoint[i+1].x + offset*0.5, linepoint[i+1].y - offset*0.13), NSMakePoint(linepoint[i+1].x + offset*0.13, linepoint[i+1].y - offset*0.5));
					}
					else { // 下
							linePath.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(linepoint[i+1].x, linepoint[i+1].y + offset), NSMakePoint(linepoint[i+1].x + offset*0.5, linepoint[i+1].y + offset*0.13), NSMakePoint(linepoint[i+1].x + offset*0.13, linepoint[i+1].y + offset*0.5));
					}
			}
			else { // 右
					linePath.lineToPoint(NSMakePoint(linepoint[i+1].x - offset, linepoint[i+1].y));
					// 绘制过渡曲线
					if (linepoint[i+1].direction === 't') { // 下一条线的方向 上
							linePath.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(linepoint[i+1].x, linepoint[i+1].y - offset), NSMakePoint(linepoint[i+1].x - offset*0.5, linepoint[i+1].y - offset*0.13), NSMakePoint(linepoint[i+1].x - offset*0.13, linepoint[i+1].y - offset*0.5));
					}
					else { // 下
							linePath.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(linepoint[i+1].x, linepoint[i+1].y + offset), NSMakePoint(linepoint[i+1].x - offset*0.5, linepoint[i+1].y + offset*0.13), NSMakePoint(linepoint[i+1].x - offset*0.13, linepoint[i+1].y + offset*0.5));
					}
			}
		}
	}

	var lineSh = MSShapeGroup.shapeWithBezierPath(linePath);
	var hitAreaBorder = lineSh.style().addStylePartOfType(1);
	hitAreaBorder.setColor(MSImmutableColor.colorWithIntegerRed_green_blue_alpha(colorLineR,colorLineG,colorLineB,255).newMutableCounterpart());
	hitAreaBorder.setThickness(lineThickness);
	hitAreaBorder.setPosition(0);
	lineSh.setName('Line');

	// 绘制起点圆圈
	var drawRound = function(x,y){
		var linkRect = NSInsetRect(NSMakeRect(x, y, 0, 0), -5, -5);
		var path = NSBezierPath.bezierPathWithOvalInRect(linkRect);
		var hitAreaLayer = MSShapeGroup.shapeWithBezierPath(path);
		hitAreaLayer.style().addStylePartOfType(0).setColor(MSImmutableColor.colorWithIntegerRed_green_blue_alpha(colorLineR,colorLineG,colorLineB,76.5).newMutableCounterpart());
		hitAreaLayer.style().addStylePartOfType(1).setColor(MSImmutableColor.colorWithIntegerRed_green_blue_alpha(colorLineR,colorLineG,colorLineB,255).newMutableCounterpart());
		hitAreaLayer.setName('Point');
		return hitAreaLayer;
	}

  // 绘制终点箭头
	var drawArrow = function(x,y,z) {
		// 绘制箭头
		var arrowDirection = z; // 1. 箭头方向
		var arrowOffset = 20 * (lineThickness / 6); // 2. 箭头长度
		var arrowPath = NSBezierPath.bezierPath();

		arrowPath.moveToPoint(NSMakePoint(x, y));
		if (arrowDirection == 't') {
				arrowPath.lineToPoint(NSMakePoint(x - arrowOffset, y + arrowOffset));
				arrowPath.lineToPoint(NSMakePoint(x, y));
				arrowPath.lineToPoint(NSMakePoint(x + arrowOffset, y + arrowOffset));
		}
		else if (arrowDirection == 'b') {
				arrowPath.lineToPoint(NSMakePoint(x - arrowOffset, y - arrowOffset));
				arrowPath.lineToPoint(NSMakePoint(x, y));
				arrowPath.lineToPoint(NSMakePoint(x + arrowOffset, y - arrowOffset));
		}
		else if (arrowDirection == 'l') {
				arrowPath.lineToPoint(NSMakePoint(x + arrowOffset, y - arrowOffset));
				arrowPath.lineToPoint(NSMakePoint(x, y));
				arrowPath.lineToPoint(NSMakePoint(x + arrowOffset, y + arrowOffset));
		}
		else {
				arrowPath.lineToPoint(NSMakePoint(x - arrowOffset, y - arrowOffset));
				arrowPath.lineToPoint(NSMakePoint(x, y));
				arrowPath.lineToPoint(NSMakePoint(x - arrowOffset, y + arrowOffset));
		}

		var arrow = MSShapeGroup.shapeWithBezierPath(arrowPath);
		var arrowStyle = arrow.style().addStylePartOfType(1);
		arrowStyle.setThickness(lineThickness);
		arrowStyle.setColor(MSImmutableColor.colorWithIntegerRed_green_blue_alpha(colorLineR,colorLineG,colorLineB,255).newMutableCounterpart());
		arrow.setName('Arrow');
		return arrow;
	}

	var startRound = drawRound(linepoint[0].x, linepoint[0].y);

	var endArrow = drawArrow(linepoint[lineCount-1].x, linepoint[lineCount-1].y, linepoint[lineCount-2].direction);

	return [lineSh, startRound, endArrow];
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
		var Message = destinationArtboardID.split('____');
		destinationArtboard = doc.currentPage().children().filteredArrayUsingPredicate(NSPredicate.predicateWithFormat("(objectID == %@) || (userInfo != nil && function(userInfo, 'valueForKeyPath:', %@).artboardID == %@)", Message[1], kPluginDomain, Message[1])).firstObject();

		if (destinationArtboard && Message[0] == linkLayer.objectID()) {
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
		redrawConnections(context);
		return NSApp.displayDialog('画板已刷新，请同时选中元素和 Artboard 添加连线，只选中元素可删除连线');
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
		}else{

			var Selection = NSUserDefaults.standardUserDefaults().objectForKey(selectionDom) || '';
			Selection = Selection.split(',');
			var linkLayersPredicate = NSPredicate.predicateWithFormat("userInfo != nil && function(userInfo, 'valueForKeyPath:', %@).selection1 == '"+ Selection[0] +"'", selectionDom1);
			linkLayer = context.document.currentPage().children().filteredArrayUsingPredicate(linkLayersPredicate).firstObject();
			var linkLayersPredicate2 = NSPredicate.predicateWithFormat("userInfo != nil && function(userInfo, 'valueForKeyPath:', %@).selection2 == '"+ Selection[1] +"'", selectionDom2);
			destArtboard = context.document.currentPage().children().filteredArrayUsingPredicate(linkLayersPredicate2).firstObject();
		}
		var artboardID = destArtboard.objectID();
		context.command.setValue_forKey_onLayer_forPluginIdentifier(artboardID, "artboardID", destArtboard, kPluginDomain);
		context.command.setValue_forKey_onLayer_forPluginIdentifier(linkLayer.objectID() + '____' + artboardID, "destinationArtboardID", linkLayer, kPluginDomain);
	}

	redrawConnections(context);
}
