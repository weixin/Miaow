@import "common.js"
@import "organizer.js"
@import "syncColor.js"

function syncUIkit(context) {
	var i18 = _(context).syncUIkit;
	var scaleOptionsMatrix;
	var scaleOptionsMatrix2;
	var uiKitUrlKey = "com.sketchplugins.wechat.uikiturl";
	var colorUrlKey = "com.sketchplugins.wechat.colorurl";

	function chooseKit(context) {
		var settingsWindow = COSAlertWindow.new();
		settingsWindow.addButtonWithTitle(i18.m1);
		settingsWindow.addButtonWithTitle(i18.m2);

		settingsWindow.setMessageText(i18.m3);
		settingsWindow.setInformativeText(i18.m4);
		settingsWindow.addTextLabelWithValue(i18.m5);

		var ButtonList = [];
		var List = NSUserDefaults.standardUserDefaults().objectForKey(uiKitUrlKey) || getConfig('config', context).UIKIT;

		for (var i = 0; i < List.length; i++) {
			if (List[i].title != '' && List[i].url != '') {
				var key = List[i].title;
				ButtonList.push(key);
			}

		}
		scaleOptionsMatrix = createRadioButtons(ButtonList, ButtonList[0]);

		settingsWindow.addAccessoryView(scaleOptionsMatrix);

		var items = [i18.m16];

		var w = 400,
			h = items.length * 30;
		var view = [[NSView alloc] initWithFrame: NSMakeRect(20.0, 20.0, 400, h)];

		var frame = NSMakeRect(0, 0, w, 30);
		var buttons = [];
		var title = items[0];
		var button = [[NSButton alloc] initWithFrame: frame];
		[button setButtonType: NSSwitchButton];
		button.bezelStyle = 0;

		button.title = title;
		button.state = false;
		scaleOptionsMatrix2 = button;
		[view addSubview: button];
		frame.origin.y += frame.size.height;
		settingsWindow.addAccessoryView(view);

		return settingsWindow.runModal();
	}

	function isSame(a, b) {
		var layers = a.layers();
		if (layers.count() != b.layers().count()) {
			return false;
		}
		for (var i = 0; i < layers.count(); i++) {
			var layer = layers[i];

			//名字顺序也会变
			if (encodeURIComponent(layer.name()) != encodeURIComponent(b.layers()[i].name())) {
				return false;
			}
			if (encodeURIComponent(layer.rect().toString()) != encodeURIComponent(b.layers()[i].rect().toString())) {
				return false;
			}

			if (layer.class() == 'MSTextLayer') {
				if (encodeURIComponent(layer.textColor().toString()) != encodeURIComponent(b.layers()[i].textColor().toString()) || encodeURIComponent(layer.font()) != encodeURIComponent(b.layers()[i].font()) || encodeURIComponent(layer.stringValue().trim()) != encodeURIComponent(b.layers()[i].stringValue().trim())) {
					return false;
				}
			}
			if ((layer.class() == 'MSLayerGroup' || layer.class() == 'MSShapeGroup') && layer.style().fills().count() != 0) {
				if (encodeURIComponent(layer.style().fills()[0].color().toString()) != encodeURIComponent(b.layers()[i].style().fills()[0].color().toString())) {
					return false;
				}
			}
			if (layer.class() == 'MSLayerGroup' || layer.class() == 'MSShapeGroup') {
				var boolChild = isSame(layer, b.layers()[i]);
				if (!boolChild) {
					return false;
				}
			}

		}
		return true;

	}

	var dialog = chooseKit(context);
	if (dialog != '1000') {
		return;
	}
	var uikit = scaleOptionsMatrix.selectedCell();
	var index = [uikit tag];
	var List = NSUserDefaults.standardUserDefaults().objectForKey(uiKitUrlKey) || getConfig('config', context).UIKIT;
	var UIKITURL = List[index].url;

	var colorList = NSUserDefaults.standardUserDefaults().objectForKey(colorUrlKey) || getConfig('config', context).COLOR;
	var tbColor = '';
	for (var co = 0; co < colorList.length; co++) {
		if (colorList[co].title == List[index].title) {
			SyncColor2(context, colorList[co].url);
			tbColor = i18.m6;
			break;
		}
	}

	context.document.showMessage(i18.m7 + "...");
	var theResponseData = networkRequest([UIKITURL]);

	var save = NSSavePanel.savePanel();
	var databasePath = save.URL().path();
	var data = [[NSData alloc] initWithData: theResponseData];
	[data writeToFile: databasePath atomically: true];


	var saveArtBoard = [];
	var sourceDoc = MSDocument.new();
	if (sourceDoc.readFromURL_ofType_error(NSURL.fileURLWithPath(databasePath), "com.bohemiancoding.sketch.drawing", nil)) {
		var doc = context.document;
		for (var i = 0; i < doc.pages().length; i++) {
			if (encodeURIComponent(doc.pages()[i].name()) == encodeURIComponent(i18.m15)) {
				doc.removePage(doc.pages()[i]);
			}
		}
		var savePage;
		var pages = doc.pages();
		var sourcePages = sourceDoc.documentData().pages();
		var addSymbolCount = 0;
		var addPageCount = 0;
		var firstSymbols = false;
		for (var i = 0; i < sourcePages.count(); i++) {
			if (sourcePages[i].name() != 'Symbols' && firstSymbols == false) {
				continue;
			}
			if (sourcePages[i].name() == 'Symbols' && firstSymbols == true) {
				continue;
			}
			var saveArtBoard2 = [];
			var sourcePageName = sourcePages[i].name();
			var sourceSymbol = sourcePages[i].artboards();

			var flagForOldPage = false;
			for (var k = 0; k < pages.count(); k++) {
				//如果有同一个page名
				if (encodeURIComponent(pages[k].name().trim()) == encodeURIComponent(sourcePageName.trim())) {
					flagForOldPage = true;

					//比对一下
					var localSymobl = pages[k].artboards();

					for (var f = 0; f < sourceSymbol.count(); f++) {
						var s = sourceSymbol[f];
						var flagForNewSymbol = false;
						for (var g = 0; g < localSymobl.count(); g++) {
							if (encodeURIComponent(s.name().trim()) == encodeURIComponent(localSymobl[g].name().trim())) {
								if (sourcePages[i].name() != 'Symbols') {
									continue;
								}
								flagForNewSymbol = true;
								if (!isSame(s, localSymobl[g])) {
									var scopy = s.copy();
									saveArtBoard.push({
										oldA: localSymobl[g],
										newA: scopy
									});
									pages[k].addLayers([scopy]);
								}
								break;
							}
						}
						if (!flagForNewSymbol) {
							// saveArtBoard2.push(sourceSymbol[f]);
							addSymbolCount++;
						}
					}

					break;
				}
			}
			var newPage;
			if (!flagForOldPage) {
				addPageCount++;
				newPage = doc.addBlankPage();
				newPage.setName(sourcePageName);
				newPage.addLayers(sourceSymbol);
			}
			// newPage.addLayers(saveArtBoard2);
			doc.setCurrentPage(doc.documentData().symbolsPageOrCreateIfNecessary());
			if (sourcePages[i].name() == 'Symbols') {
				firstSymbols = true;
				i = -1;
			}
		}
		var isChangeChild = scaleOptionsMatrix2.state();
		if (isChangeChild) {
			for (var i = 0; i < doc.pages().length; i++) {
				var p = doc.pages()[i];
				var chi = p.children();
				for (var k = 0; k < chi.length; k++) {
					if (chi[k].className() == 'MSSymbolInstance') {
						var oldDad = chi[k].symbolMaster();
						for (var l = 0; l < saveArtBoard.length; l++) {
							// 删掉稿中旧的添上新的
							if (saveArtBoard[l].oldA == oldDad && saveArtBoard[l].newA) {
								var x = chi[k].absoluteRect().x();
								var y = chi[k].absoluteRect().y();
								var parartboard = chi[k].parentGroup();
								var newlayer = saveArtBoard[l].newA.newSymbolInstance();
								newlayer.absoluteRect().setX(x);
								newlayer.absoluteRect().setY(y);
								p.addLayers([newlayer]);
								if (parartboard) {
									p.setCurrentArtboard(parartboard);
								}
								var baba = chi[k].parentGroup();
								baba.removeLayer(chi[k]);
							}
						}
					}
				}
			}
		}

	}
	var fm = [NSFileManager defaultManager];
	fm.removeItemAtPath_error(databasePath, nil);
	sourceDoc.close();
	sourceDoc = nil;
	var alertData = i18.m8 + addPageCount + i18.m9 + '，' + addSymbolCount + i18.m10 + '，';
	if (saveArtBoard.length != 0) {
		alertData += (i18.m11 + saveArtBoard.length + i18.m12);
	}
	alertData += (i18.m13 + '！');
	if (addPageCount == 0 && addSymbolCount == 0 && saveArtBoard.length == 0) {
		alertData = (i18.m14 + '！');
	}
	if (saveArtBoard.length > 0) {
		var savePage = doc.addBlankPage();
		savePage.setName(i18.m15);
		for (var i = 0; i < saveArtBoard.length; i++) {
			if (saveArtBoard[i].newA) {
				saveArtBoard[i].oldA.setName(saveArtBoard[i].oldA.name() + '(Old)');
				saveArtBoard[i].oldA.moveToLayer_beforeLayer(savePage, savePage);
			}
		}
		doc.setCurrentPage(savePage);
		Organizer(context);
	}
	if (context.document.pages()[0].children().count() == 1) {
		context.document.removePage(context.document.pages()[0]);
		var savePage = doc.addBlankPage();
		savePage.setName('page 1');
		doc.setCurrentPage(savePage);
	}

	if (isChangeChild) {
		NSApp.displayDialog(i18.m17);
	}

	context.document.showMessage(alertData + tbColor);
	var ga = new Analytics(context);
	if (ga) ga.sendEvent('syncUIkit', 'confirm');
}

var onRun = function (context) {
	syncUIkit(context);
}