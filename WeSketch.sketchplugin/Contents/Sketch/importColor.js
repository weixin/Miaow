@import "common.js"

var onRun = function(context){
  var doc = context.document;
  var app = NSApp.delegate();
  var panel = [NSOpenPanel openPanel];
  [panel setCanChooseDirectories:false];
  [panel setCanCreateDirectories:false];
  panel.setAllowedFileTypes([@"json"]);
  panel.setAllowsOtherFileTypes(false);
  panel.setExtensionHidden(false);

  var clicked = [panel runModal];
  if (clicked == NSFileHandlingPanelOKButton) {
    var isDirectory = true;
    var firstURL = [[panel URLs] objectAtIndex:0];
    var unformattedURL = [NSString stringWithFormat:@"%@", firstURL];
    var file_path = [unformattedURL stringByRemovingPercentEncoding];
    var theResponseData = request(file_path)
    var theText = [[NSString alloc] initWithData:theResponseData encoding:NSUTF8StringEncoding];
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

    NSApp.displayDialog("色板已经导入到你的Document Colors");
  }

}

