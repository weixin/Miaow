@import "common.js"
var colorUrlKey = "com.sketchplugins.wechat.colorurl";
var scaleOptionsMatrix;

function chooseKit(context){
	var settingsWindow = COSAlertWindow.new();
	settingsWindow.addButtonWithTitle("同步");
	settingsWindow.addButtonWithTitle("取消");

	settingsWindow.setMessageText("请选择同步的色板来源");
	settingsWindow.setInformativeText("本次同步会覆盖当前画板");
	var ButtonList = [];
	var List = NSUserDefaults.standardUserDefaults().objectForKey(colorUrlKey) || getConfig('config',context).COLOR;

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
	
	var uikit = scaleOptionsMatrix.selectedCell();
	var List = NSUserDefaults.standardUserDefaults().objectForKey(colorUrlKey) || getConfig('config',context).COLOR;
	
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

	NSApp.displayDialog("色板已同步到 Document Colors，请重新打开色板查看");
}