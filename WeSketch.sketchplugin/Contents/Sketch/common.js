@import "MochaJSDelegate.js";

var kPluginDomain;
var iconQueryUrl = 'http://123.207.94.56:3000';
var loginKey = "com.sketchplugins.wechat.iconLogin";

function initDefaults(pluginDomain, initialValues) {
	kPluginDomain = pluginDomain

	var defaults = [[NSUserDefaults standardUserDefaults] objectForKey:kPluginDomain]
	var defaultValues = {}
    var dVal;

    for (var key in defaults) {
    	defaultValues[key] = defaults[key]
	}

	for (var key in initialValues) {
		dVal = defaultValues[key]
		if (dVal == nil) defaultValues[key] = initialValues[key]
	}

	return defaultValues
}

function rgb(a){
	var sColor = a.toLowerCase();
	if(sColor.length === 4){
		var sColorNew = "#";
		for(var i=1; i<4; i+=1){
			sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));	
		}
		sColor = sColorNew;
	}
	//处理六位的颜色值
	var sColorChange = [];
	for(var i=1; i<7; i+=2){
		sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));	
	}
	return sColorChange;
}

function saveDefaults(newValues) {
	if (kPluginDomain) {
		var defaults = [NSUserDefaults standardUserDefaults]
		[defaults setObject: newValues forKey: kPluginDomain];
	}
}

function request(args) {
  var aara = [args];
  var task = NSTask.alloc().init();
  task.setLaunchPath("/usr/bin/curl");
  task.setArguments(aara);
  var outputPipe = [NSPipe pipe];
  [task setStandardOutput:outputPipe];
  task.launch();
  var responseData = [[outputPipe fileHandleForReading] readDataToEndOfFile];
  return responseData;
}

function networkRequest(args) {
  var task = NSTask.alloc().init();
  task.setLaunchPath("/usr/bin/curl");
  task.setArguments(args);
  var outputPipe = [NSPipe pipe];
  [task setStandardOutput:outputPipe];
  task.launch();
  var responseData = [[outputPipe fileHandleForReading] readDataToEndOfFile];
  return responseData;
}

function encodeData(jsonData){
    var result = {};
    for(var o in jsonData){
        result[o] = typeof jsonData != 'object'? encodeURIComponent(jsonData[o]) : encodeData(jsonData[o]);
    }
    return result;
}

function post(args){
    var sig = NSUserDefaults.standardUserDefaults().objectForKey(loginKey);
    var returnData = networkRequest(['-d','sig='+ sig + '&' + args[1],iconQueryUrl + args[0]]);
    var jsonData = [[NSString alloc] initWithData:returnData encoding:NSUTF8StringEncoding];
    jsonData = JSON.parse(jsonData);
    if(jsonData.status == 200){
        return jsonData;
    }else{
        NSApp.displayDialog(jsonData.msg);
        return jsonData;
    }
}

function getConfig(json,context) {
		var manifestPath = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent(json+".json").path();
		return NSJSONSerialization.JSONObjectWithData_options_error(NSData.dataWithContentsOfFile(manifestPath), NSJSONReadingMutableContainers, nil);
}

function openUrlInBrowser(url) {
    NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString(url));
}

function createRadioButtons(options, selectedItem) {
    var rows = Math.ceil(options.length / 2);
    var columns = ((options.length < 2) ? 1 : 2);
    
    var selectedRow = Math.floor(selectedItem / 2);
    var selectedColumn = selectedItem - (selectedRow * 2);
    
    var buttonCell = [[NSButtonCell alloc] init];
        [buttonCell setButtonType:NSRadioButton]
    
    var buttonMatrix = [[NSMatrix alloc] initWithFrame: NSMakeRect(20.0, 20.0, 300.0, rows * 25) mode:NSRadioModeMatrix prototype:buttonCell numberOfRows:rows numberOfColumns:columns];
        [buttonMatrix setCellSize: NSMakeSize(140, 20)];

    for (i = 0; i < options.length; i++) {
        [[[buttonMatrix cells] objectAtIndex: i] setTitle: options[i]];
        [[[buttonMatrix cells] objectAtIndex: i] setTag: i];
    }
    
	if (rows*columns > options.length) {
		[[[buttonMatrix cells] objectAtIndex:(options.length)] setTransparent: true];
		[[[buttonMatrix cells] objectAtIndex:(options.length)] setEnabled: false];

	}
    [buttonMatrix selectCellAtRow: selectedRow column: selectedColumn]
    return buttonMatrix;
}

function SMPanel(options){
    coscript.setShouldKeepAround(true);
    var self = this,
        result = false;
    options.url = encodeURI("file://" + options.url);
    var frame = NSMakeRect(0, 0, options.width, (options.height + 32)),
        titleBgColor = NSColor.colorWithRed_green_blue_alpha(0.945,0.945,0.945, 1),
        contentBgColor = NSColor.colorWithRed_green_blue_alpha(0.945, 0.945, 0.945, 1);

    if(options.identifier){
        var threadDictionary = NSThread.mainThread().threadDictionary();
        if(threadDictionary[options.identifier]){
            return false;
        }
    }

    var Panel = NSPanel.alloc().init();
    Panel.setTitleVisibility(NSWindowTitleHidden);
    Panel.setTitlebarAppearsTransparent(true);
    Panel.standardWindowButton(NSWindowCloseButton).setHidden(options.hiddenClose);
    Panel.standardWindowButton(NSWindowMiniaturizeButton).setHidden(true);
    Panel.standardWindowButton(NSWindowZoomButton).setHidden(true);
    Panel.setFrame_display(frame, false);
    Panel.setBackgroundColor(contentBgColor);

    var contentView = Panel.contentView(),
        webView = WebView.alloc().initWithFrame(NSMakeRect(0, 0, options.width, options.height)),
        windowObject = webView.windowScriptObject(),
        delegate = new MochaJSDelegate({
            "webView:didFinishLoadForFrame:": (function(webView, webFrame){
                    var SMAction = [
                                "function SMAction(hash, data){",
                                    "if(data){",
                                        "window.SMData = encodeURI(JSON.stringify(data));",
                                    "}",
                                    "window.location.hash = hash;",
                                "}"
                            ].join(""),
                        DOMReady = [
                                "$(",
                                    "function(){",
                                        "init(" + JSON.stringify(options.data) + ")",
                                    "}",
                                ");"
                            ].join("");

                    windowObject.evaluateWebScript(SMAction);
                    windowObject.evaluateWebScript(DOMReady);
                }),
            "webView:didChangeLocationWithinPageForFrame:": (function(webView, webFrame){
                    var request = NSURL.URLWithString(webView.mainFrameURL()).fragment();

                    if(request == "submit"){
                        var data = JSON.parse(decodeURI(windowObject.valueForKey("SMData")));
                        options.callback(data);
                        result = true;
                    }
                    else if(request == "close"){
                        if(!options.floatWindow){
                            Panel.orderOut(nil);
                            NSApp.stopModal();
                        }
                        else{
                            Panel.close();
                        }
                        threadDictionary.removeObjectForKey(options.identifier);
                    }else if(request == 'file'){
                        var panel = [NSOpenPanel openPanel];
                        [panel setCanChooseDirectories:false];
                        [panel setCanCreateDirectories:false];
                        panel.setAllowedFileTypes([@"sketch"]);
                        panel.setAllowsOtherFileTypes(false);
                        panel.setExtensionHidden(false);
                        var clicked = [panel runModal];
                        if (clicked != NSFileHandlingPanelOKButton) {
                            return;
                        }
                        var firstURL = [[panel URLs] objectAtIndex:0];
                        var unformattedURL = [NSString stringWithFormat:@"%@", firstURL];
                        var file_path = [unformattedURL stringByRemovingPercentEncoding];
                        windowObject.evaluateWebScript("inputFile('"+file_path+"')");
                    }else if(request == 'login'){
                        options.loginCallback(windowObject);
                    }
                    windowObject.evaluateWebScript("window.location.hash = '';");
                })
        });

    contentView.setWantsLayer(true);
    contentView.layer().setFrame( contentView.frame() );
    contentView.layer().setCornerRadius(6);
    contentView.layer().setMasksToBounds(true);

    webView.setBackgroundColor(contentBgColor);
    webView.setFrameLoadDelegate_(delegate.getClassInstance());
    webView.setMainFrameURL_(options.url);

    contentView.addSubview(webView);

    var closeButton = Panel.standardWindowButton(NSWindowCloseButton);
    closeButton.setCOSJSTargetFunction(function(sender) {
        var request = NSURL.URLWithString(webView.mainFrameURL()).fragment();

        // if(options.floatWindow && request == "submit"){
        //     data = JSON.parse(decodeURI(windowObject.valueForKey("SMData")));
        //     options.callback(data);
        // }

        if(options.identifier){
            threadDictionary.removeObjectForKey(options.identifier);
        }

        self.wantsStop = true;
        if(options.floatWindow){
            Panel.close();
        }
        else{
            Panel.orderOut(nil);
            NSApp.stopModal();
        }

    });
    closeButton.setAction("callAction:");

    var titlebarView = contentView.superview().titlebarViewController().view(),
        titlebarContainerView = titlebarView.superview();
    closeButton.setFrameOrigin(NSMakePoint(8, 8));
    titlebarContainerView.setFrame(NSMakeRect(0, options.height, options.width, 32));
    titlebarView.setFrameSize(NSMakeSize(options.width, 32));
    titlebarView.setTransparent(true);
    titlebarView.setBackgroundColor(titleBgColor);
    titlebarContainerView.superview().setBackgroundColor(titleBgColor);

    if(options.floatWindow){
        Panel.becomeKeyWindow();
        Panel.setLevel(NSFloatingWindowLevel);
        Panel.center();
        Panel.makeKeyAndOrderFront(nil);
        if(options.identifier){
            threadDictionary[options.identifier] = Panel;
        }
        return webView;
    }
    else{
        if(options.identifier){
            threadDictionary[options.identifier] = Panel;
        }
        NSApp.runModalForWindow(Panel);
    }

    return windowObject;
}