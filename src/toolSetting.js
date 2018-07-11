import {_,dialog,errorDialog,initDefaults,saveDefaults,uploadContext,paste,rgb,request,networkRequest,zip,encodeData,get,post,getConfig,openUrlInBrowser,createRadioButtons,createRadioButtons2,createArtboard,hexToRgb,unique,SMPanel} from "./common";
import {getLink} from "./link";
import {getFlag} from "./flag";

var lineColorKey = "com.sketchplugins.wechat.linecolor";
var flagColorKey = "com.sketchplugins.wechat.flagcolor";
var lineThicknessKey = "com.sketchplugins.wechat.lineThicknessLink";

function drawIcon(sender) {
	var size = sender.frame().size;
	var image = NSImage.imageWithSize(size);
	image.lockFocus();
	NSColor.colorWithCalibratedRed_green_blue_alpha(0.157,0.78,0.4,1).set();

	var path = NSBezierPath.bezierPath();
	path.moveToPoint(NSMakePoint(10.1, 1));
	path.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(11.81, 1.73), NSMakePoint(10.65, 1), NSMakePoint(11.42, 1.32));
	path.lineToPoint(NSMakePoint(14, 4));
	path.lineToPoint(NSMakePoint(22, 4));
	path.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(25, 7), NSMakePoint(23.65, 4), NSMakePoint(25, 5.34));
	path.lineToPoint(NSMakePoint(25, 16));
	path.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(22, 19), NSMakePoint(25, 17.66), NSMakePoint(23.66, 19));
	path.lineToPoint(NSMakePoint(4, 19));
	path.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(1, 16), NSMakePoint(2.34, 19), NSMakePoint(1, 17.65));
	path.lineToPoint(NSMakePoint(1, 4));
	path.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(4, 1), NSMakePoint(1, 2.34), NSMakePoint(2.34, 1));
	path.lineToPoint(NSMakePoint(10, 1));

	path.stroke();
	image.unlockFocus();
	return image;
}

function addButton(index, func) {
	var button = NSButton.alloc().initWithFrame(NSMakeRect(250, 10, 26, 24));
	button.setButtonType(1);
	button.bezelStyle = 1;
	button.bordered = 0;
	button.tag = index;
	button.allowsMixedState = true; // 仅初始化状态为混合态时允许
	button.state = true;
	var imageState = drawIcon(button);
	button.image = imageState;
	button.cell().imageScaling = 1;
	button.setCOSJSTargetFunction(function (sender) {
		func(sender);
	});
	return button;
}

var onRun = function (context) {
	var manifestPath = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("manifest.json").path(),
		manifest = NSJSONSerialization.JSONObjectWithData_options_error(NSData.dataWithContentsOfFile(manifestPath), NSJSONReadingMutableContainers, nil);

	var manifestPathZh = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("i18n").URLByAppendingPathComponent("manifest.json").path(),
		manifestZh = NSJSONSerialization.JSONObjectWithData_options_error(NSData.dataWithContentsOfFile(manifestPath), NSJSONReadingMutableContainers, nil);

	var manifestPathEn = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("i18n").URLByAppendingPathComponent("manifest.json").path(),
		manifestEn = NSJSONSerialization.JSONObjectWithData_options_error(NSData.dataWithContentsOfFile(manifestPath), NSJSONReadingMutableContainers, nil);

	var i18t = _(context).toolSetting;
	var settingsWindow = dialog(context);
	settingsWindow.addButtonWithTitle(i18t.m1);
	settingsWindow.addButtonWithTitle(i18t.m2);

	var items = [i18t.m7];

	var isChecked = false;
	if (JSON.stringify(manifest.commands[0]).indexOf('SelectionChanged.finish') > -1) {
		isChecked = true;
	}
	var w = 400,
		h = items.length * 30;
	var view = NSView.alloc().initWithFrame(NSMakeRect(20.0, 20.0, 400, h));
	var frame = NSMakeRect(0, 0, w, 30);
	var buttons = [];
	for (var i = 0; i < items.length; i++) {
		var title = items[i];
		var button = NSButton.alloc().initWithFrame(frame);;
		button.setButtonType(NSSwitchButton);
		button.bezelStyle = 0;

		button.title = title;
		if (isChecked) {
			button.state = true;
		} else {
			button.state = false;
		}
		buttons[i] = button;
		view.addSubview(button);
		frame.origin.y += frame.size.height;
	}
	settingsWindow.addAccessoryView(view);


	settingsWindow.setMessageText(i18t.m3);
	settingsWindow.addTextLabelWithValue(i18t.m4);

	var flowIndicatorColorWell = NSColorWell.alloc().initWithFrame(NSMakeRect(0, 0, 44, 23));
	var flowIndicatorColorHex = NSUserDefaults.standardUserDefaults().objectForKey(lineColorKey) || "#1AAD19";
	var flowIndicatorColorAlpha = 1;
	var flowIndicatorMSColor = MSImmutableColor.colorWithSVGString(flowIndicatorColorHex);
	flowIndicatorMSColor.setAlpha(flowIndicatorColorAlpha);
	var flowIndicatorColor = flowIndicatorMSColor.NSColorWithColorSpace(NSColorSpace.deviceRGBColorSpace())
	flowIndicatorColorWell.setColor(flowIndicatorColor);
	var flowIndicatorOptionsView = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 300, 23));
	flowIndicatorOptionsView.addSubview(flowIndicatorColorWell);

	// 添加箭头线粗细  
	var flowIndicatorThicknessWell = NSTextField.alloc().initWithFrame(NSMakeRect(105, 0, 44, 23));
	// 读取系统默认的粗细
	var flowIndicatorThicknessNum = NSUserDefaults.standardUserDefaults().objectForKey(lineThicknessKey) || "6";
	// // 默认值填入输入框
	flowIndicatorThicknessWell.setStringValue(flowIndicatorThicknessNum);
	// 将文本输入框放在 NSView 中
	flowIndicatorOptionsView.addSubview(flowIndicatorThicknessWell);
	settingsWindow.addAccessoryView(flowIndicatorOptionsView);

	settingsWindow.addTextLabelWithValue(i18t.m5);
	var flowIndicatorColorWell2 = NSColorWell.alloc().initWithFrame(NSMakeRect(0, 0, 44, 23));
	flowIndicatorColorHex = NSUserDefaults.standardUserDefaults().objectForKey(flagColorKey) || "#1AAD19";
	var flowIndicatorColorAlpha = 1;
	var flowIndicatorMSColor = MSImmutableColor.colorWithSVGString(flowIndicatorColorHex);
	flowIndicatorMSColor.setAlpha(flowIndicatorColorAlpha);
	var flowIndicatorColor = flowIndicatorMSColor.NSColorWithColorSpace(NSColorSpace.deviceRGBColorSpace())
	flowIndicatorColorWell2.setColor(flowIndicatorColor);
	var flowIndicatorOptionsView2 = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 300, 23));
	flowIndicatorOptionsView2.addSubview(flowIndicatorColorWell2);
	settingsWindow.addAccessoryView(flowIndicatorOptionsView2);


	var response = settingsWindow.runModal();
	if (response == "1000") {
		var flowIndicatorMSColor = MSColor.colorWithNSColor(flowIndicatorColorWell.color()).immutableModelObject();
		var flowIndicatorColor = flowIndicatorMSColor.svgRepresentation()
		var flowIndicatorMSColor2 = MSColor.colorWithNSColor(flowIndicatorColorWell2.color()).immutableModelObject();
		var flowIndicatorColor2 = flowIndicatorMSColor2.svgRepresentation()
		NSUserDefaults.standardUserDefaults().setObject_forKey(flowIndicatorColor, lineColorKey);
		NSUserDefaults.standardUserDefaults().setObject_forKey(flowIndicatorColor2, flagColorKey);

		// 获取 “箭头线粗细” 输入框的值，存入 系统key 中
		var flowIndicatorThickness = flowIndicatorThicknessWell.stringValue();
		NSUserDefaults.standardUserDefaults().setObject_forKey(flowIndicatorThickness, lineThicknessKey);

		var CommonAction = {};
		if (buttons[0].state() == true) {
			CommonAction = {
				"handlers": {
					"actions": {
						"SelectionChanged.finish": "onSelectionChanged",
						"OpenDocument": "onOpenDocument"
					}
				},
				"script": "onAction.js"
			};
		} else {
			CommonAction = {
				"handlers": {
					"actions": {
						"OpenDocument": "onOpenDocument"
					}
				},
				"script": "onAction.js"
			};
		}

		var i18nList = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("config.json").path();

		i18nList = NSData.dataWithContentsOfFile(i18nList);
		i18nList = NSString.alloc().initWithData_encoding(i18nList,NSUTF8StringEncoding);
		i18nList = JSON.parse(i18nList).i18n;

		for (var i = 0; i < i18nList.length; i++) {
			var allManifestPath = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("i18n").URLByAppendingPathComponent("manifest-" + i18nList[i].key + ".json").path();
			manifestLangData = NSJSONSerialization.JSONObjectWithData_options_error(NSData.dataWithContentsOfFile(allManifestPath), NSJSONReadingMutableContainers, nil);
			manifestLangData.commands[0] = CommonAction;
			NSString.alloc().initWithData_encoding(NSJSONSerialization.dataWithJSONObject_options_error(manifestLangData, NSJSONWritingPrettyPrinted, nil), NSUTF8StringEncoding).writeToFile_atomically_encoding_error(allManifestPath, true, NSUTF8StringEncoding, nil);
		}


		manifest.commands[0] = CommonAction;

		NSString.alloc().initWithData_encoding(NSJSONSerialization.dataWithJSONObject_options_error(manifest, NSJSONWritingPrettyPrinted, nil), NSUTF8StringEncoding).writeToFile_atomically_encoding_error(manifestPath, true, NSUTF8StringEncoding, nil);


		context.document.showMessage(i18t.m6);

		var nowContext = uploadContext(context);
		getLink(nowContext, true);
		getFlag(context, true);
		AppController.sharedInstance().pluginManager().reloadPlugins();
		var ga = new Analytics(context);
		if (ga) ga.sendEvent('toolbarSetting', 'confirm');
	}
}