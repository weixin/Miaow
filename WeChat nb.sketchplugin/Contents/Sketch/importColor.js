@import "common.js"
var scaleOptionsMatrix;

function chooseKit(context){
	var settingsWindow = COSAlertWindow.new();
	settingsWindow.addButtonWithTitle("同步");
	settingsWindow.addButtonWithTitle("取消");

	settingsWindow.setMessageText("请选择您需要同步的画板");
	settingsWindow.setInformativeText("同步画板会同时清空现有画板");
    
	var List = getConfig('config',context).COLOR;
	var ButtonList = [];

	for(var i = 0;i < List.length;i++){
		if(List[i].title != '' && List[i].url != ''){
			var key = List[i].title;
			ButtonList.push(key);
		}
		
	}
	scaleOptionsMatrix = createRadioButtons(ButtonList,ButtonList[0]);
	settingsWindow.addAccessoryView(scaleOptionsMatrix);
	return settingsWindow.runModal();
}


var onRun = function (context) {	
	var app = NSApp.delegate();
	var doc = context.document;
	var dialog = chooseKit(context);
	if(dialog != '1000'){
		return;
	}
	
	var List = getConfig('config',context).COLOR;
	var uikit = scaleOptionsMatrix.selectedCell();
	var index = [uikit tag];
	var UIKITURL = List[index].url;

	var theResponseData = request(UIKITURL);
	
	var colorContents = "";

	theText = [[NSString alloc] initWithData:theResponseData encoding:NSUTF8StringEncoding];
	
	var dataPre = [theText substringToIndex:1];
	if (dataPre == "<"){
		NSApp.displayDialog("数据出错，请检查json文件");
		return;
	}else{
		colorContents = theText		
	}

	var paletteContents = JSON.parse(colorContents.toString());
	var palette = paletteContents.colors;
		
	var colors = [];
	
	for (var i = 0; i < palette.length; i++) {
		colors.push(MSColor.colorWithRed_green_blue_alpha(
			palette[i].red/255,
			palette[i].green/255,
			palette[i].blue/255,
			palette[i].alpha
		));	
	}
	
	doc.documentData().assets().setColors(colors);
	
	app.refreshCurrentDocument();

	NSApp.displayDialog("色板已经同步到你的Document Colors");
}