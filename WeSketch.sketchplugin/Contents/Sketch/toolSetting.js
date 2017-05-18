@import "link.js";
@import "flag.js";

var lineColorKey = "com.sketchplugins.wechat.linecolor";
var flagColorKey = "com.sketchplugins.wechat.flagcolor";
var lineThicknessKey = "com.sketchplugins.wechat.lineThicknessLink";

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
	settingsWindow.setMessageText("交互功能设置");

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

		NSApp.displayDialog("设置成功");
		getLink(context,true);
		getFlag(context,true);
	}
}