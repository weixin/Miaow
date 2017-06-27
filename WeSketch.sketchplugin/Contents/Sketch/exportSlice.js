@import "common.js"

function exportSlice(context){
	var i18 = _(context).exportSlice;

	var selection = context.selection;
	if(selection.count() == 0){
		return NSApp.displayDialog(i18.m1);
	}
	var scale = 0;
	var parent = selection[0].parentArtboard();
	var selecWidth = parent.rect().size.width;
	if(selecWidth == 320 ||  selecWidth == 375 || selecWidth == 414){
		scale = 1;
	}else if(selecWidth == 750 || selecWidth == 1242){
		scale = 0;
	}
	var selectionWidth = selection[0].rect().size.width;
	var selectionHeight = selection[0].rect().size.height;

	var imagetype = 'png';
	var addressname = [];
	var settingsWindow = COSAlertWindow.new();
	settingsWindow.addButtonWithTitle(i18.m2);
	settingsWindow.addButtonWithTitle(i18.m3);
	settingsWindow.setMessageText(i18.m4);

    settingsWindow.addTextLabelWithValue(i18.m5);
    settingsWindow.addTextLabelWithValue(i18.m6);
    settingsWindow.addTextLabelWithValue(i18.m7);

	var flowIndicatorThicknessWell = NSTextField.alloc().initWithFrame(NSMakeRect(0, 0, 44, 23));
	flowIndicatorThicknessWell.setStringValue(selectionWidth);
	var flowIndicatorOptionsView = NSView.alloc().initWithFrame(NSMakeRect(0,0,300,23));
	flowIndicatorOptionsView.addSubview(flowIndicatorThicknessWell);

	var flowIndicatorThicknessWell2 = NSTextField.alloc().initWithFrame(NSMakeRect(105, 0, 44, 23));
	flowIndicatorThicknessWell2.setStringValue(selectionHeight);
	flowIndicatorOptionsView.addSubview(flowIndicatorThicknessWell2);

	settingsWindow.addAccessoryView(flowIndicatorOptionsView);

    settingsWindow.addTextLabelWithValue(i18.m8);

    var items = ['@1x','@2x','@3x'];
    var state = [1,2,3];

    var w = 400, h = items.length * 30;
    var view = [[NSView alloc] initWithFrame:NSMakeRect(20.0, 20.0, 400, h)];

    var frame = NSMakeRect(0, 0, w, 30);
    var buttons = [];
    for (var i = 0;i<items.length;i++){
        var title = items[i];
        var button = [[NSButton alloc] initWithFrame:frame];
        [button setButtonType:NSSwitchButton];
        button.bezelStyle = 0;

        button.title = title;
        if(scale == i){
        	button.state = true;
	    }else{
        	button.state = false;
	    }
        buttons[i] = button;
        [view addSubview:button];
        frame.origin.y += frame.size.height;
    }
    settingsWindow.addAccessoryView(view); 
    settingsWindow.addTextLabelWithValue(i18.m9);
	var ButtonList2 = [];
	ButtonList2.push('PNG');
    ButtonList2.push('JPG');
    ButtonList2.push('SVG');
    ButtonList2.push('PDF');

    var scaleOptionsMatrix2 = createRadioButtons(ButtonList2,0);
	settingsWindow.addAccessoryView(scaleOptionsMatrix2);

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
			if(cell2 == 0){
				imagetype = 'png';
			}else if(cell2 == 1){
				imagetype = 'jpg';
			}else if(cell2 == 2){
				imagetype = 'svg';
			}else if(cell2 == 3){
				imagetype = 'pdf';
			}

			var pages = context.document.pages();
			for(var i = 0;i<pages.length;i++){
				if(pages[i].name() == '__wesketch_export'){
					context.document.removePage(pages[i]);
				}
			}
		   	var newPage = context.document.addBlankPage();
		    newPage.setName('__wesketch_export');
			context.document.setCurrentPage(newPage);
			var width = flowIndicatorThicknessWell.stringValue();
			var height = flowIndicatorThicknessWell2.stringValue();
			var lastwidth = 0;
			for(var i = 0;i < selection.length;i++){
				width = flowIndicatorThicknessWell.stringValue();
				height = flowIndicatorThicknessWell2.stringValue();
				var name = selection[i].name();
				var icon = selection[i].copy();
				if(width < selection[i].rect().size.width){
					width = selection[i].rect().size.width;
				}
				if(height < selection[i].rect().size.height){
					height = selection[i].rect().size.height;
				}
				var frame = icon.frame();
				var y = 0;
				var iconx = (width - selection[i].rect().size.width)/2;
				if(iconx<0){
					iconx = 0;
				}
				var icony = (height - selection[i].rect().size.height)/2;
				if(icony<0){
					icony = 0;
				}
				frame.setX(iconx);
				frame.setY(icony);
		   		var artboard = createArtboard(context,{width:parseInt(width),height:parseInt(height),name:name,x:lastwidth,y:y});
				lastwidth = lastwidth + parseInt(width) + 50;
		   		artboard.addLayers([icon]);
		   		artboard.select_byExpandingSelection(true, true);
		   		saveartboard.push(artboard);
			}
			var path = panel.URL().path();
			for(var i = 0;i<buttons.length;i++){
				if(buttons[i].state() == true){
					addressname = [];
					for(var k = 0;k<saveartboard.length;k++){
						var sliceFormat = MSExportRequest.exportRequestsFromExportableLayer(saveartboard[k]).firstObject();
				        sliceFormat.scale = i+1;
				        sliceFormat.format = imagetype;
						context.document.saveArtboardOrSlice_toFile(sliceFormat,path + '/' + saveartboard[k].name() + buttons[i].title().replace('@1x','') + '.' + imagetype);
						addressname.push(saveartboard[k].name() + buttons[i].title().replace('@1x','') + '.' + imagetype);
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