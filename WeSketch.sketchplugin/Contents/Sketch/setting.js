var lineColorKey = "com.sketchplugins.wechat.linecolor";
var flagColorKey = "com.sketchplugins.wechat.flagcolor";


var onRun = function(context) {
	var settingsWindow = COSAlertWindow.new();
	settingsWindow.addButtonWithTitle("保存");
	settingsWindow.addButtonWithTitle("取消");
	settingsWindow.setMessageText("设置");


	settingsWindow.addTextLabelWithValue("箭头线色值             标记色值");
	var flowIndicatorColorWell = NSColorWell.alloc().initWithFrame(NSMakeRect(0,0,44,23));
	var flowIndicatorColorHex = NSUserDefaults.standardUserDefaults().objectForKey(lineColorKey) || "#1AAD19";
	var flowIndicatorColorAlpha = 1;
	var flowIndicatorMSColor = MSImmutableColor.colorWithSVGString(flowIndicatorColorHex);
	flowIndicatorMSColor.setAlpha(flowIndicatorColorAlpha);
	var flowIndicatorColor = flowIndicatorMSColor.NSColorWithColorSpace(NSColorSpace.deviceRGBColorSpace())
	flowIndicatorColorWell.setColor(flowIndicatorColor);
	var flowIndicatorOptionsView = NSView.alloc().initWithFrame(NSMakeRect(0,0,300,23));
	flowIndicatorOptionsView.addSubview(flowIndicatorColorWell);

	var flowIndicatorColorWell2 = NSColorWell.alloc().initWithFrame(NSMakeRect(105,0,44,23));
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
	var manifestPath1 = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("config.json").path();
	var	manifest1 = NSJSONSerialization.JSONObjectWithData_options_error(NSData.dataWithContentsOfFile(manifestPath1), NSJSONReadingMutableContainers, nil);
	var	uikit = manifest1.UIKIT;
	var	color = manifest1.COLOR;
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
		var Field = NSTextField.alloc().initWithFrame(NSMakeRect(105,0,160,40));
		uikitField.push(Field);
		accessoryView.addSubview(Field);
		settingsWindow.addAccessoryView(accessoryView);
		if(i <= uikit.length-1){
        	Label.setStringValue(uikit[i].title);
			Field.setStringValue(uikit[i].url);
		}
    }

	var separator = NSBox.alloc().initWithFrame(NSMakeRect(0,0,300,10));
    separator.setBoxType(2);
    settingsWindow.addAccessoryView(separator);
    settingsWindow.addTextLabelWithValue("色板同步源");
    for (var i = 0; i < 2; i++) {
		var accessoryView = NSView.alloc().initWithFrame(NSMakeRect(0.0, i*24 + 40, 300.0, 40))
		var Label = NSTextField.alloc().initWithFrame(NSMakeRect(0,9,100,22));
		colorLabel.push(Label);
        accessoryView.addSubview(Label);
		Field = NSTextField.alloc().initWithFrame(NSMakeRect(105,0,160,40));
		accessoryView.addSubview(Field);
		colorField.push(Field);
		settingsWindow.addAccessoryView(accessoryView);
		if(i <= color.length-1){
	        Label.setStringValue(color[i].title);
			Field.setStringValue(color[i].url);	
		}
    }

	var separator = NSBox.alloc().initWithFrame(NSMakeRect(0,0,300,10));
    separator.setBoxType(2);
    settingsWindow.addAccessoryView(separator);
    settingsWindow.addTextLabelWithValue("快捷键设置");
	// // settingsWindow.setInformativeText("请使用(cmd, control, shift, option)加上字母键组合使用，例如填写cmd shift k。若输入之后不能使用，是与系统已有快捷键冲突，请更换。");

	var manifestPath = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("manifest.json").path(),
		manifest = NSJSONSerialization.JSONObjectWithData_options_error(NSData.dataWithContentsOfFile(manifestPath), NSJSONReadingMutableContainers, nil),
		commands = manifest.commands,
		validCommands = manifest.menu.items,
		commandsCount = 2,
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
		manifest1.UIKIT = uikitsave;
		manifest1.COLOR = colorsave;
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


		NSString.alloc().initWithData_encoding(NSJSONSerialization.dataWithJSONObject_options_error(manifest1, NSJSONWritingPrettyPrinted, nil), NSUTF8StringEncoding).writeToFile_atomically_encoding_error(manifestPath1, true, NSUTF8StringEncoding, nil);
		NSString.alloc().initWithData_encoding(NSJSONSerialization.dataWithJSONObject_options_error(manifest, NSJSONWritingPrettyPrinted, nil), NSUTF8StringEncoding).writeToFile_atomically_encoding_error(manifestPath, true, NSUTF8StringEncoding, nil);
		AppController.sharedInstance().pluginManager().reloadPlugins();
		NSApp.displayDialog("修改已保存");

	}
}