var lineColorKey = "com.sketchplugins.wechat.linecolor";
var flagColorKey = "com.sketchplugins.wechat.flagcolor";
var lineThicknessKey = "com.sketchplugins.wechat.linethickness";

var uiKitUrlKey = "com.sketchplugins.wechat.uikiturl";
var colorUrlKey = "com.sketchplugins.wechat.colorurl";

function drawIcon(sender){
    var size = sender.frame().size;
	var image = [NSImage imageWithSize:size];
    [image lockFocus];
    [[NSColor colorWithCalibratedRed:0.157 green:0.78 blue:0.4 alpha:1] set];

    var path = [NSBezierPath bezierPath];
    [path moveToPoint:NSMakePoint(10.1, 1)];
    path.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(11.81,1.73),NSMakePoint(10.65,1),NSMakePoint(11.42,1.32));
    path.lineToPoint(NSMakePoint(14, 4));
    path.lineToPoint(NSMakePoint(22, 4));
    path.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(25,7),NSMakePoint(23.65,4),NSMakePoint(25,5.34));
    path.lineToPoint(NSMakePoint(25, 16));
    path.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(22,19),NSMakePoint(25,17.66),NSMakePoint(23.66,19));
    path.lineToPoint(NSMakePoint(4, 19));
    path.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(1,16),NSMakePoint(2.34,19),NSMakePoint(1,17.65));
    path.lineToPoint(NSMakePoint(1, 4));
    path.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(4,1),NSMakePoint(1,2.34),NSMakePoint(2.34,1));
    path.lineToPoint(NSMakePoint(10, 1));

    [path stroke];
	[image unlockFocus];
	return image;
}

function addButton(index,func){
    var button = [[NSButton alloc] initWithFrame:NSMakeRect(250, 10, 26, 24)];
    [button setButtonType:1];
    button.bezelStyle = 1;
    button.bordered = 0;
    button.tag = index;
    button.allowsMixedState = true;  // 仅初始化状态为混合态时允许
    button.state = true;
    var imageState = drawIcon(button);
    button.image = imageState;
    button.cell().imageScaling = 1;
    [button setCOSJSTargetFunction:function(sender) {func(sender);}];
    return button;
}

var onRun = function(context) {
	var settingsWindow = COSAlertWindow.new();
	settingsWindow.addButtonWithTitle("保存");
	settingsWindow.addButtonWithTitle("取消");
	settingsWindow.setMessageText("设置");
    settingsWindow.setInformativeText("填写线上地址或者点击按钮选取本地文件作为同步源");

	var manifestPath1 = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("config.json").path();
	var	manifest1 = NSJSONSerialization.JSONObjectWithData_options_error(NSData.dataWithContentsOfFile(manifestPath1), NSJSONReadingMutableContainers, nil);

	// 如果 系统key 中有，就从系统key 中读取，没有再去读取 config.json 
	var uiKitUrlInKey = NSUserDefaults.standardUserDefaults().objectForKey(uiKitUrlKey);
	var colorUrlInKey = NSUserDefaults.standardUserDefaults().objectForKey(colorUrlKey);

	var	uikit = uiKitUrlInKey || manifest1.UIKIT;
	var	color = colorUrlInKey || manifest1.COLOR;

	var uikitLabel = [];	
	var colorLabel = [];	
	var uikitField = [];	
	var colorField = [];	

    settingsWindow.addTextLabelWithValue("UI Kit 同步源");
	for (var i = 0; i < 4; i++) {
		var accessoryView = NSView.alloc().initWithFrame(NSMakeRect(0.0, i*24 + 40, 300.0, 40))
		var Label = NSTextField.alloc().initWithFrame(NSMakeRect(0,9,100,22));
		uikitLabel.push(Label);
        accessoryView.addSubview(Label);
		var Field = NSTextField.alloc().initWithFrame(NSMakeRect(105,0,130,40));
		uikitField.push(Field);
		accessoryView.addSubview(Field);
		var linkbutton = addButton(i,function(d){
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
			uikitField[d.tag()].setStringValue(file_path);
		});
		accessoryView.addSubview(linkbutton);
		settingsWindow.addAccessoryView(accessoryView);
		if(i <= uikit.length-1){
        	Label.setStringValue(uikit[i].title);
			Field.setStringValue(uikit[i].url);
		}
    }

    settingsWindow.addTextLabelWithValue("色板同步源");
    for (var i = 0; i < 2; i++) {
		var accessoryView = NSView.alloc().initWithFrame(NSMakeRect(0.0, i*24 + 40, 300.0, 40))
		var Label = NSTextField.alloc().initWithFrame(NSMakeRect(0,9,100,22));
		colorLabel.push(Label);
        accessoryView.addSubview(Label);
		Field = NSTextField.alloc().initWithFrame(NSMakeRect(105,0,130,40));
		accessoryView.addSubview(Field);
		colorField.push(Field);
		var linkbutton = addButton(i,function(d){
			var panel = [NSOpenPanel openPanel];
			[panel setCanChooseDirectories:false];
			[panel setCanCreateDirectories:false];
			panel.setAllowedFileTypes([@"json"]);
			panel.setAllowsOtherFileTypes(false);
			panel.setExtensionHidden(false);
			var clicked = [panel runModal];
			if (clicked != NSFileHandlingPanelOKButton) {
				return;
			}
			var firstURL = [[panel URLs] objectAtIndex:0];
			var unformattedURL = [NSString stringWithFormat:@"%@", firstURL];
			var file_path = [unformattedURL stringByRemovingPercentEncoding];
			colorField[d.tag()].setStringValue(file_path);
		});
		accessoryView.addSubview(linkbutton);
		settingsWindow.addAccessoryView(accessoryView);
		if(i <= color.length-1){
	        Label.setStringValue(color[i].title);
			Field.setStringValue(color[i].url);	
		}
    }

    var separator = NSBox.alloc().initWithFrame(NSMakeRect(0,0,300,10));
    separator.setBoxType(2);
    settingsWindow.addAccessoryView(separator);

    settingsWindow.addTextLabelWithValue("箭头线色值             箭头线粗细             标记色值");

	var flowIndicatorColorWell = NSColorWell.alloc().initWithFrame(NSMakeRect(0,0,44,23));
	var flowIndicatorColorHex = NSUserDefaults.standardUserDefaults().objectForKey(lineColorKey) || "#1AAD19";
	var flowIndicatorColorAlpha = 1;
	var flowIndicatorMSColor = MSImmutableColor.colorWithSVGString(flowIndicatorColorHex);
	flowIndicatorMSColor.setAlpha(flowIndicatorColorAlpha);
	var flowIndicatorColor = flowIndicatorMSColor.NSColorWithColorSpace(NSColorSpace.deviceRGBColorSpace())
	flowIndicatorColorWell.setColor(flowIndicatorColor);
	var flowIndicatorOptionsView = NSView.alloc().initWithFrame(NSMakeRect(0,0,300,23));
	flowIndicatorOptionsView.addSubview(flowIndicatorColorWell);

	// 添加箭头线粗细  
	var flowIndicatorThicknessWell = NSTextField.alloc().initWithFrame(NSMakeRect(105, 0, 44, 23));
	// 读取系统默认的粗细
	var flowIndicatorThicknessNum = NSUserDefaults.standardUserDefaults().objectForKey(lineThicknessKey) || "6";
	// // 默认值填入输入框
	flowIndicatorThicknessWell.setStringValue(flowIndicatorThicknessNum);
	// 将文本输入框放在 NSView 中
	flowIndicatorOptionsView.addSubview(flowIndicatorThicknessWell);

	var flowIndicatorColorWell2 = NSColorWell.alloc().initWithFrame(NSMakeRect(210,0,44,23));
	flowIndicatorColorHex = NSUserDefaults.standardUserDefaults().objectForKey(flagColorKey) || "#1AAD19";
	var flowIndicatorColorAlpha = 1;
	var flowIndicatorMSColor = MSImmutableColor.colorWithSVGString(flowIndicatorColorHex);
	flowIndicatorMSColor.setAlpha(flowIndicatorColorAlpha);
	var flowIndicatorColor = flowIndicatorMSColor.NSColorWithColorSpace(NSColorSpace.deviceRGBColorSpace())
	flowIndicatorColorWell2.setColor(flowIndicatorColor);
	flowIndicatorOptionsView.addSubview(flowIndicatorColorWell2);

	settingsWindow.addAccessoryView(flowIndicatorOptionsView);

	var separator = NSBox.alloc().initWithFrame(NSMakeRect(0,0,300,10));
    separator.setBoxType(2);
    settingsWindow.addAccessoryView(separator);
    settingsWindow.addTextLabelWithValue("快捷键设置");
	// // settingsWindow.setInformativeText("请使用(cmd, control, shift, option)加上字母键组合使用，例如填写cmd shift k。若输入之后不能使用，是与系统已有快捷键冲突，请更换。");

	var manifestPath = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("manifest.json").path(),
		manifest = NSJSONSerialization.JSONObjectWithData_options_error(NSData.dataWithContentsOfFile(manifestPath), NSJSONReadingMutableContainers, nil),
		commands = manifest.commands,
		validCommands = manifest.menu.items,
		commandsCount = 4,
		shortcutFields = {},
		command, shortcutField, shortcut;

	for (var i = 0; i < commandsCount; i++) {
		command = commands[i];
		if (!validCommands.containsObject(command.identifier))
			continue;
        var accessoryView = NSView.alloc().initWithFrame(NSMakeRect(0.0, i*24 + 40, 300.0, 30))
		var Label = NSTextField.alloc().initWithFrame(NSMakeRect(0,6,100,14));
		Label.setEditable(false);
		Label.setBordered(false);
		Label.setDrawsBackground(false);
        Label.setStringValue(command.name + "：");
        accessoryView.addSubview(Label);
		shortcutField = NSTextField.alloc().initWithFrame(NSMakeRect(105,0,160,23));
		shortcut = command.shortcut == nil ? "" : command.shortcut;
		shortcutField.setStringValue(shortcut);
		accessoryView.addSubview(shortcutField);
		settingsWindow.addAccessoryView(accessoryView);
		shortcutFields[command.identifier] = shortcutField;
	}

	var response = settingsWindow.runModal();
	if (response == "1000") {
		var uikitsave = [];
		var colorsave = [];
		for (var i = 0; i < 4; i++) {
			uikitsave.push({
				title:uikitLabel[i].stringValue(),
				url:uikitField[i].stringValue(),
			})
		}
		for (var i = 0; i < 2; i++) {
			colorsave.push({
				title:colorLabel[i].stringValue(),
				url:colorField[i].stringValue(),
			})
		}
		// 存到 config.json 中
		manifest1.UIKIT = uikitsave;
		manifest1.COLOR = colorsave;
		// 存到 系统key 中
		NSUserDefaults.standardUserDefaults().setObject_forKey(uikitsave, uiKitUrlKey);
		NSUserDefaults.standardUserDefaults().setObject_forKey(colorsave, colorUrlKey);

		for (var i = 0; i < commandsCount; i++) {
			command = commands[i];
			shortcutField = shortcutFields[command.identifier];
			if(typeof shortcutField === 'undefined')
				continue;

			command.shortcut = shortcutField.stringValue();
		}

		var flowIndicatorMSColor = MSColor.colorWithNSColor(flowIndicatorColorWell.color()).immutableModelObject();
		var flowIndicatorColor = flowIndicatorMSColor.svgRepresentation()
		var flowIndicatorMSColor2 = MSColor.colorWithNSColor(flowIndicatorColorWell2.color()).immutableModelObject();
		var flowIndicatorColor2 = flowIndicatorMSColor2.svgRepresentation()
		NSUserDefaults.standardUserDefaults().setObject_forKey(flowIndicatorColor, lineColorKey);
		NSUserDefaults.standardUserDefaults().setObject_forKey(flowIndicatorColor2, flagColorKey);

		// 获取 “箭头线粗细” 输入框的值，存入 系统key 中
		var flowIndicatorThickness = flowIndicatorThicknessWell.stringValue();
		NSUserDefaults.standardUserDefaults().setObject_forKey(flowIndicatorThickness, lineThicknessKey);

		NSString.alloc().initWithData_encoding(NSJSONSerialization.dataWithJSONObject_options_error(manifest1, NSJSONWritingPrettyPrinted, nil), NSUTF8StringEncoding).writeToFile_atomically_encoding_error(manifestPath1, true, NSUTF8StringEncoding, nil);
		NSString.alloc().initWithData_encoding(NSJSONSerialization.dataWithJSONObject_options_error(manifest, NSJSONWritingPrettyPrinted, nil), NSUTF8StringEncoding).writeToFile_atomically_encoding_error(manifestPath, true, NSUTF8StringEncoding, nil);
		AppController.sharedInstance().pluginManager().reloadPlugins();
		NSApp.displayDialog("修改已保存");

	}
}