@import "common.js"

function exportSlice(context) {
	function rgba(color) {
		var obj = {
			r: Math.round(color.red() * 255),
			g: Math.round(color.green() * 255),
			b: Math.round(color.blue() * 255),
			a: color.alpha()
		}
		return obj;
	}
	var i18 = _(context).exportSlice;

	var selection = context.selection;
	if (selection.count() == 0) {
		return errorDialog(context,i18.m1);
	}
	var scale = 0;
	var parent = selection[0].parentArtboard();
	if (parent == null) {
		scale = 1;
	} else {
		var selecWidth = parent.rect().size.width;
		if (selecWidth == 320 || selecWidth == 375 || selecWidth == 414) {
			scale = 1;
		} else if (selecWidth == 750 || selecWidth == 1242) {
			scale = 0;
		}
	}

	var selectionWidth = selection[0].rect().size.width;
	var selectionHeight = selection[0].rect().size.height;

	var imagetype = 'png';
	var addressname = [];
	var settingsWindow = dialog(context);
	settingsWindow.addButtonWithTitle(i18.m2);
	settingsWindow.addButtonWithTitle(i18.m3);
	settingsWindow.setMessageText(i18.m4);

	settingsWindow.addTextLabelWithValue(i18.m7);

	var flowIndicatorThicknessWell = NSTextField.alloc().initWithFrame(NSMakeRect(0, 0, 44, 23));
	flowIndicatorThicknessWell.setStringValue(selectionWidth);
	var flowIndicatorOptionsView = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 300, 23));
	flowIndicatorOptionsView.addSubview(flowIndicatorThicknessWell);

	var flowIndicatorThicknessWell2 = NSTextField.alloc().initWithFrame(NSMakeRect(105, 0, 44, 23));
	flowIndicatorThicknessWell2.setStringValue(selectionHeight);
	flowIndicatorOptionsView.addSubview(flowIndicatorThicknessWell2);

	settingsWindow.addAccessoryView(flowIndicatorOptionsView);

	settingsWindow.addTextLabelWithValue(i18.m8);

	var items = ['@1x', '@2x', '@3x'];
	var state = [1, 2, 3];

	var w = 400,
		h = items.length * 30;
	var view = [[NSView alloc] initWithFrame: NSMakeRect(20.0, 20.0, 400, h)];

	var frame = NSMakeRect(0, 0, w, 30);
	var buttons = [];
	for (var i = 0; i < items.length; i++) {
		var title = items[i];
		var button = [[NSButton alloc] initWithFrame: frame];
		[button setButtonType: NSSwitchButton];
		button.bezelStyle = 0;

		button.title = title;
		if (scale == i) {
			button.state = true;
		} else {
			button.state = false;
		}
		buttons[i] = button;
		[view addSubview: button];
		frame.origin.y += frame.size.height;
	}
	settingsWindow.addAccessoryView(view);
	settingsWindow.addTextLabelWithValue(i18.m9);
	var ButtonList2 = [];
	ButtonList2.push('PNG');
	ButtonList2.push('JPG');
	ButtonList2.push('SVG');
	ButtonList2.push('PDF');

	var scaleOptionsMatrix2 = createRadioButtons(ButtonList2, 0);
	settingsWindow.addAccessoryView(scaleOptionsMatrix2);

	settingsWindow.addTextLabelWithValue(i18.m5);
	var replaceColorWell = NSColorWell.alloc().initWithFrame(NSMakeRect(0, 0, 50, 25));
	var replaceColorHex = "#FFFFFF";
	var replaceColorAlpha = 0;
	var replaceMSColor = MSImmutableColor.colorWithSVGString(replaceColorHex);
	replaceMSColor.setAlpha(replaceColorAlpha);
	var replaceColor = replaceMSColor.NSColorWithColorSpace(NSColorSpace.deviceRGBColorSpace());
	replaceColorWell.setColor(replaceColor);
	var replaceColorView = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 50, 25));
	replaceColorView.addSubview(replaceColorWell);
	settingsWindow.addAccessoryView(replaceColorView);


	settingsWindow.addTextLabelWithValue(i18.m6);

	var ButtonList3 = [];
	ButtonList3.push(i18.m12);
	ButtonList3.push(i18.m13);
	ButtonList3.push(i18.m14);
	ButtonList3.push(i18.m15);
	ButtonList3.push(i18.m16);
	ButtonList3.push(i18.m17);
	ButtonList3.push(i18.m18);
	ButtonList3.push(i18.m19);
	ButtonList3.push(i18.m20);
	var locationX = 'm';
	var locationY = 'm';
	var scaleOptionsMatrix3 = createRadioButtons2(ButtonList3, 4);
	settingsWindow.addAccessoryView(scaleOptionsMatrix3);


	var response = settingsWindow.runModal();
	if (response == "1000") {

		var panel = NSOpenPanel.openPanel();
		panel.setCanChooseDirectories(true);
		panel.setAllowsMultipleSelection(true);
		panel.setCanCreateDirectories(true);
		panel.setMessage(i18.m10);
		if (panel.runModal() == NSOKButton) {
			var saveartboard = [];
			var cell2 = scaleOptionsMatrix2.selectedCell();
			cell2 = cell2.tag();
			if (cell2 == 0) {
				imagetype = 'png';
			} else if (cell2 == 1) {
				imagetype = 'jpg';
			} else if (cell2 == 2) {
				imagetype = 'svg';
			} else if (cell2 == 3) {
				imagetype = 'pdf';
			}

			var cell3 = scaleOptionsMatrix3.selectedCell();
			cell3 = cell3.tag();
			if (cell3 == 0 || cell3 == 3 || cell3 == 6) {
				locationX = 'l';
			} else if (cell3 == 1 || cell3 == 4 || cell3 == 7) {
				locationX = 'm';
			} else {
				locationX = 'r';
			}
			if (cell3 == 0 || cell3 == 1 || cell3 == 2) {
				locationY = 't';
			} else if (cell3 == 3 || cell3 == 4 || cell3 == 5) {
				locationY = 'm';
			} else {
				locationY = 'b';
			}


			var pages = context.document.pages();
			for (var i = 0; i < pages.length; i++) {
				if (pages[i].name() == '__wesketch_export') {
					context.document.removePage(pages[i]);
				}
			}
			var newPage = context.document.addBlankPage();
			newPage.setName('__wesketch_export');
			context.document.setCurrentPage(newPage);
			var width = flowIndicatorThicknessWell.stringValue();
			var height = flowIndicatorThicknessWell2.stringValue();
			var lastwidth = 0;
			for (var i = 0; i < selection.length; i++) {
				width = flowIndicatorThicknessWell.stringValue();
				height = flowIndicatorThicknessWell2.stringValue();
				var name = selection[i].name();
				var icon = selection[i].copy();
				if (width < selection[i].rect().size.width) {
					width = selection[i].rect().size.width;
				}
				if (height < selection[i].rect().size.height) {
					height = selection[i].rect().size.height;
				}
				var frame = icon.frame();
				var y = 0;
				var iconx;
				if (locationX == 'l') {
					iconx = 0;
				} else if (locationX == 'm') {
					iconx = (width - selection[i].rect().size.width) / 2;
				} else {
					iconx = (width - selection[i].rect().size.width);
				}
				if (iconx < 0) {
					iconx = 0;
				}
				var icony;
				if (locationY == 't') {
					icony = 0;
				} else if (locationY == 'm') {
					icony = (height - selection[i].rect().size.height) / 2;
				} else {
					icony = (height - selection[i].rect().size.height);
				}
				if (icony < 0) {
					icony = 0;
				}
				frame.setX(iconx);
				frame.setY(icony);
				var color = rgba(MSColor.colorWithNSColor(replaceColorWell.color()));
				if (color.a != 0) {
					var sketch = context.api();
					var myStyle = new sketch.Style()
					myStyle.fills = ['rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + color.a + ')'];
					var docm = sketch.selectedDocument;
					var pageq = docm.selectedPage;
					var rect = pageq.newShape({
						frame: new sketch.Rectangle(lastwidth, y, parseInt(width), parseInt(height)),
						style: myStyle
					});
				}
				var artboard = createArtboard(context, {
					width: parseInt(width),
					height: parseInt(height),
					name: name,
					x: lastwidth,
					y: y
				});
				artboard.addLayers([icon]);
				artboard.select_byExpandingSelection(true, true);

				saveartboard.push(artboard);
				lastwidth = lastwidth + parseInt(width) + 50;
			}
			var path = panel.URL().path();
			for (var i = 0; i < buttons.length; i++) {
				if (buttons[i].state() == true) {
					addressname = [];
					for (var k = 0; k < saveartboard.length; k++) {
						var sliceFormat = MSExportRequest.exportRequestsFromExportableLayer(saveartboard[k]).firstObject();
						sliceFormat.scale = i + 1;
						sliceFormat.format = imagetype;
						context.document.saveArtboardOrSlice_toFile(sliceFormat, path + '/' + saveartboard[k].name() + buttons[i].title().replace('@1x', '') + '.' + imagetype);
						addressname.push(saveartboard[k].name() + buttons[i].title().replace('@1x', '') + '.' + imagetype);
					}
				}

			}
			paste(addressname.join('\n'));
			context.document.removePage(newPage);
			context.document.showMessage(i18.m11);
		}

	}
}

var onRun = function (context) {
	exportSlice(context);
}