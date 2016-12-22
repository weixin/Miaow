@import "config.js"
@import "common.js"

var onRun = function (context) {	
	var app = NSApp.delegate();
	var doc = context.document;

	
	var theResponseData = request(COLOR);
	
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
			palette[i].red,
			palette[i].green,
			palette[i].blue,
			palette[i].alpha
		));	
	}
	
	doc.documentData().assets().setColors(colors);
	
	app.refreshCurrentDocument();

	NSApp.displayDialog("色板已经同步到你的Document Color");
}