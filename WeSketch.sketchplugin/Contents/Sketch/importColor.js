@import "common.js"

var importUrlKey = "com.sketchplugins.wechat.importcolorurl";


var onRun = function(context){
  var doc = context.document;
  var app = NSApp.delegate();
  var getLocal = NSUserDefaults.standardUserDefaults().objectForKey(importUrlKey);
 
  var panel = [NSOpenPanel openPanel];
  if(getLocal){
    [panel setDirectoryURL:[NSURL URLWithString:getLocal]];
  }
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
    var urlSave = file_path.replace('file:///','');
    urlSave = urlSave.substr(0,urlSave.lastIndexOf('/'));
    NSUserDefaults.standardUserDefaults().setObject_forKey(urlSave, importUrlKey);

    var theResponseData = request(file_path)
    var theText = [[NSString alloc] initWithData:theResponseData encoding:NSUTF8StringEncoding];
    var dataPre = [theText substringToIndex:1];
    if (dataPre == "<"){
      NSApp.displayDialog("导入失败，请检查色板文件");
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
    NSApp.displayDialog("色板已导入 Document Colors，请重新打开色板查看");
  }

}

