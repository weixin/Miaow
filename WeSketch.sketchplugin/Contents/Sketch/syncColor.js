@import "common.js"


var SyncColor2 = function(context,UIKITURL) {
	var i18c = _(context).syncColor;

	var app = NSApp.delegate();
	var doc = context.document;
	var theResponseData = request(UIKITURL);
	
	var colorContents = "";

	theText = [[NSString alloc] initWithData:theResponseData encoding:NSUTF8StringEncoding];
	
	var dataPre = [theText substringToIndex:1];
	if (dataPre == "<"){
		NSApp.displayDialog(i18c.m1);
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

}

function syncColor(context){
	var i18c = _(context).syncColor;

	var colorUrlKey = "com.sketchplugins.wechat.colorurl";
	var scaleOptionsMatrix;

	function chooseKit(context){
		var settingsWindow = COSAlertWindow.new();
		settingsWindow.addButtonWithTitle(i18c.m2);
		settingsWindow.addButtonWithTitle(i18c.m3);

		settingsWindow.setMessageText(i18c.m4);
		settingsWindow.setInformativeText(i18c.m5);
		settingsWindow.setInformativeText(i18c.m6);
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
	SyncColor2(context,UIKITURL);
	context.document.showMessage(i18c.m7);
}



var onRun = function (context) {	
	syncColor(context);
}