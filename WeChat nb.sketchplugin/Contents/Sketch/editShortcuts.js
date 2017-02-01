var onRun = function(context) {
	var settingsWindow = COSAlertWindow.new();
	settingsWindow.addButtonWithTitle("保存");
	settingsWindow.addButtonWithTitle("取消");
	settingsWindow.setMessageText("设置");


    settingsWindow.addTextLabelWithValue("UI kit 地址设置");

	var separator = NSBox.alloc().initWithFrame(NSMakeRect(0,0,300,10));
    separator.setBoxType(2);
    settingsWindow.addAccessoryView(separator);
    settingsWindow.addTextLabelWithValue("色板地址设置");

	var separator = NSBox.alloc().initWithFrame(NSMakeRect(0,0,300,10));
    separator.setBoxType(2);
    settingsWindow.addAccessoryView(separator);
    settingsWindow.addTextLabelWithValue("快捷键设置");
	// settingsWindow.setInformativeText("请使用(cmd, control, shift, option)加上字母键组合使用，例如填写cmd shift k。若输入之后不能使用，是与系统已有快捷键冲突，请更换。");

	var manifestPath = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("manifest.json").path(),
		manifest = NSJSONSerialization.JSONObjectWithData_options_error(NSData.dataWithContentsOfFile(manifestPath), NSJSONReadingMutableContainers, nil),
		commands = manifest.commands,
		validCommands = manifest.menu.items,
		commandsCount = commands.count() - 2,
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
		for (var i = 0; i < commandsCount; i++) {
			command = commands[i];
			shortcutField = shortcutFields[command.identifier];
			if(typeof shortcutField === 'undefined')
				continue;

			command.shortcut = shortcutField.stringValue();
		}
		NSString.alloc().initWithData_encoding(NSJSONSerialization.dataWithJSONObject_options_error(manifest, NSJSONWritingPrettyPrinted, nil), NSUTF8StringEncoding).writeToFile_atomically_encoding_error(manifestPath, true, NSUTF8StringEncoding, nil);
		AppController.sharedInstance().pluginManager().reloadPlugins();
	}
}