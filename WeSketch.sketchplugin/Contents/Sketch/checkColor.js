@import "common.js"
@import "organizer.js"
var scaleOptionsMatrix;
function showColor(context){
	var settingsWindow = COSAlertWindow.new();
	settingsWindow.addButtonWithTitle("同步");
	settingsWindow.addButtonWithTitle("取消");

	settingsWindow.setMessageText("请选择您需要同步的UIkit");
	settingsWindow.setInformativeText("不能在同一个项目中同步不同的UIkit，否则会产生错误");
    
    var allLayers =  context.document.currentPage().children();
    var colorArray = [];
    var colorObject = {};
    log(allLayers);
    for(var i = 0;i < allLayers.length;i++){
    	if(allLayers[i].layer == 'MSDocument' || allLayers[i].layer == 'MSPage' || allLayers[i].layer == 'MSLayerGroup' ){

    	}else if(allLayers[i].layer == 'MSTextLayer'){
    		log(allLayers[i].textColor());
    	}else{
    		log(allLayers[i].style().fills().firstObject().color);
    		log(allLayers[i].style().border().color());
    	}
    }
	
	scaleOptionsMatrix = createRadioButtons(ButtonList,ButtonList[0]);
	settingsWindow.addAccessoryView(scaleOptionsMatrix);
	return settingsWindow.runModal();
}

var onRun = function (context) {
	
	showColor(context);
}
