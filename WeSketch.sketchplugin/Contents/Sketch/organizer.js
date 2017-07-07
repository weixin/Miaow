//by Symobl Organizer
//author sonburn
//https://github.com/sonburn/symbol-organizer

var Organizer = function(context) {
	function actionWithType(context,type) {
		var controller = context.document.actionsController();

		if (controller.actionWithName) {
			return controller.actionWithName(type);
		} else if (controller.actionWithID) {
			return controller.actionWithID(type);
		} else {
			return controller.actionForID(type);
		}
	}

	function addTextStyle(context,styleName,fontName,fontSize,fontLineHeight,textAlignment) {
		getTextStyleByName(context,styleName,1);

		var textStyles = context.document.documentData().layerTextStyles();

		var textStyle = [[MSTextLayer alloc] initWithFrame:nil];
		textStyle.setFontSize(fontSize);
		textStyle.setLineHeight(fontLineHeight);
		textStyle.setTextAlignment(textAlignment);
		textStyle.setFontPostscriptName(fontName);

		textStyles.addSharedStyleWithName_firstInstance(styleName,textStyle.style());
	}

	function createSelect(items,selectedItemIndex,frame) {
		selectedItemIndex = (selectedItemIndex > -1) ? selectedItemIndex : 0;
		var comboBox = [[NSComboBox alloc] initWithFrame:frame];
		[comboBox addItemsWithObjectValues:items];
		[comboBox selectItemAtIndex:selectedItemIndex];

		return comboBox;
	}

	function createRadioButtons(options,selected,format,x,y) {
		// Set number of rows and columns
		if (!format || format == 0) {
			var rows = options.length;
			var columns = 1;
			var buttonMatrixWidth = 300;
			var buttonCellWidth = buttonMatrixWidth;
		} else {
			var rows = options.length / 2;
			var columns = 2;
			var buttonMatrixWidth = 300;
			var buttonCellWidth = buttonMatrixWidth / columns;
		}

		var x = (x) ? x : 0;
		var y = (y) ? y : 0;

		// Make a prototype cell
		var buttonCell = [[NSButtonCell alloc] init];
		[buttonCell setButtonType:NSRadioButton]

		// Make a matrix to contain the radio cells
		var buttonMatrix = [[NSMatrix alloc] initWithFrame: NSMakeRect(x,y,buttonMatrixWidth,rows*25) mode:NSRadioModeMatrix prototype:buttonCell numberOfRows:rows numberOfColumns:columns];
		[buttonMatrix setCellSize: NSMakeSize(buttonCellWidth,20)];

		// Create a cell for each option
		for (i = 0; i < options.length; i++) {
			[[[buttonMatrix cells] objectAtIndex: i] setTitle: options[i]];
			[[[buttonMatrix cells] objectAtIndex: i] setTag: i];
		}

		// Select the default cell
		[buttonMatrix selectCellAtRow:selected column:0]

		// Return the matrix
		return buttonMatrix;
	}

	function createField(value,frame) {
		var field = [[NSTextField alloc] initWithFrame:frame];
		[field setStringValue:value];

		return field;
	}

	function createLabel(text,size,frame) {
		var label = [[NSTextField alloc] initWithFrame:frame];
		[label setStringValue:text];
		[label setFont:[NSFont boldSystemFontOfSize:size]];
		[label setBezeled:false];
		[label setDrawsBackground:false];
		[label setEditable:false];
		[label setSelectable:false];

		return label;
	}

	function createDescription(text,size,frame) {
		var label = [[NSTextField alloc] initWithFrame:frame];
		[label setStringValue:text];
		[label setFont:[NSFont systemFontOfSize:size]];
		[label setTextColor:[NSColor colorWithCalibratedRed:(0/255) green:(0/255) blue:(0/255) alpha:0.6]];
		[label setBezeled:false];
		[label setDrawsBackground:false];
		[label setEditable:false];
		[label setSelectable:false];

		return label;
	}

	function createCheckbox(item,flag,frame) {
		flag = ( flag == false ) ? NSOffState : NSOnState;
		var checkbox = [[NSButton alloc] initWithFrame:frame];
		[checkbox setButtonType: NSSwitchButton];
		[checkbox setBezelStyle: 0];
		[checkbox setTitle: item.name];
		[checkbox setTag: item.value];
		[checkbox setState: flag];

		return checkbox;
	}

	function displayDialog(body,title) {
		var app = NSApplication.sharedApplication();
		app.displayDialog_withTitle(body,title);
	}

	function findLayerByName(scope,name,type) {
		var scope = scope.layers();

		if (scope) {
			for (var i = 0; i < scope.count(); i++) {
				var layerName = scope.objectAtIndex(i).name().trim();

				if ((!type && layerName == name) || (type && layerName == name && scope.objectAtIndex(i) instanceof type)) {
					return scope.objectAtIndex(i);
				}
			}
		}

		return false;
	}

	function getCharPosition(string,match,count) {
		var actualCount = string.split(match).length - 1;

		if (actualCount < count) {
			return string.split(match,actualCount).join(match).length;
		} else {
			return string.split(match,count).join(match).length;
		}
	}

	function getTextStyleByName(context,styleName,removeStyle) {
		var textStyles = context.document.documentData().layerTextStyles().objects();

		if (textStyles) {
			for (var i = 0; i < textStyles.count(); i++) {
				if (textStyles.objectAtIndex(i).name() == styleName) {
					if (removeStyle && removeStyle == 1) {
						context.document.documentData().layerTextStyles().removeSharedStyle(textStyles.objectAtIndex(i));
						return false;
					} else {
						return textStyles.objectAtIndex(i);
					}
				}
			}
		}

		return false;
	}

	function renameDuplicateSymbols(symbols) {
		var symbolLoop = symbols.objectEnumerator();
		var symbol;
		var lastSymbolName;
		var duplicateSymbolCount = 0;

		while (symbol = symbolLoop.nextObject()) {
			var thisSymbolName = String(symbol.name());

			if (thisSymbolName == lastSymbolName) {
				duplicateSymbolCount++;

				symbol.setName(thisSymbolName + " Copy " + duplicateSymbolCount);
			} else {
				duplicateSymbolCount = 0;
			}

			lastSymbolName = thisSymbolName;
		}

		return symbols;
	}

	function setKeyOrder(alert,order) {
		for (var i = 0; i < order.length; i++) {
			var thisItem = order[i];
			var nextItem = order[i+1];

			if (nextItem) thisItem.setNextKeyView(nextItem);
		}

		alert.alert().window().setInitialFirstResponder(order[0]);
	}
	var pluginName = "Symbol Organizer";

	// Document variables
	var doc = context.document;
	var command = context.command;
	var pages = doc.pages();
	var page = doc.currentPage();

	// If the current page has symbols...
	if (page.symbols().count() != 0) {
		// If the current page only contains symbols...
		if (page.artboards().count() == page.symbols().count()) {
			// Get layout settings
			var layoutSettings = getLayoutSettings();

			// If layout settings were provided...
			if (layoutSettings) {
				// Layout variables
				var x = 0;
				var y = 0;
				var xPad = parseInt(layoutSettings.xPad);
				var yPad = parseInt(layoutSettings.yPad);
				var maxPer = (layoutSettings.maxPer > 0) ? layoutSettings.maxPer : 0;

				// Title variables
				var titleGroupName = 'Titles';
				var titleStyleName = 'Symbol Group Title';
				var titleStyleFont = 'Helvetica Neue Medium Italic';
				var titleTextSize = 20;
				var titleTextHeight = 24;
				var titleTextAlign = (layoutSettings.sortDirection == 0) ? 0 : 1;
				var titleGroupX = (layoutSettings.sortDirection == 0) ? 0 : -xPad;
				var titleGroupY = (layoutSettings.sortDirection == 0) ? -(titleTextHeight+yPad) : 0;

				// If user wants to remove unused symbols...
				if (layoutSettings.removeSymbols == 1) {
					// Document variables
					var pagesLoop = pages.objectEnumerator();
					var thisPage;

					// Symbol variables
					var exemptSymbols = [];
					var removedSymbolCount = 0;

					// Iterate through each page and find children
					while (thisPage = pagesLoop.nextObject()) {
						// Children variables
						var children = thisPage.children();
						var loopChildren = children.objectEnumerator();
						var child;

						// Iterate through each child...
						while (child = loopChildren.nextObject()) {
							// If child is a symbol instance and has overrides...
							if (child.class() == "MSSymbolInstance" && child.overrides()) {
								// Create object of overrides
								var overrides = child.overrides().allValues();

								// Iterate through overrides
								for (var i = 0; i < overrides.count(); i++) {
									// Function to add each override symbol ID to exempt symbols object
									pushOverrideSymbolIDtoArray(overrides.objectAtIndex(i),exemptSymbols);
								}
							}

							// If child is a symbol master...
							if (child.class() == "MSSymbolMaster") {
								// If this symbol does not reside on the symbols page...
								if (thisPage.name() != 'Symbols') {
									// Add this symbol ID to exempt symbols object
									exemptSymbols.push(String(child.symbolID()));
								} else {
									// Layer variables
									var layers = child.children();
									var loopLayers = layers.objectEnumerator();
									var layer;
									var exemptions = 0;

									// Iterate through layers
									while (layer = loopLayers.nextObject()) {
										// If layer is a symbol instance...
										if (layer.class() == "MSSymbolInstance" && layer.symbolMaster()) {
											// Add symbol master ID to exempt symbols object
											exemptSymbols.push(String(layer.symbolMaster().symbolID()));

											// Increment exemption counter
											exemptions++;
										}
									}

									// If this symbol had nested symbols...
									if (exemptions > 0) {
										// Add this symbol ID to exempt symbols object
										exemptSymbols.push(String(child.symbolID()));
									}
								}
							}
						}
					}

					// Call function to remove unused symbols
					removeUnusedSymbols();
				}

				// Find titles group
				var titleGroup = findLayerByName(page,titleGroupName);

				// If titles group exists, remove it
				if (titleGroup) page.removeLayer(titleGroup);

				// If the document still has symbols...
				if (page.symbols().count() != 0) {
					// Create a symbols object, of either all symbols or just Symbols page symbols
					var symbols = (layoutSettings.gatherSymbols == 1) ? doc.documentData().allSymbols() : page.symbols();

					// Sort the symbols object by name
					var sortByName = [NSSortDescriptor sortDescriptorWithKey:"name" ascending:1];
					symbols = [symbols sortedArrayUsingDescriptors:[sortByName]];

					// if user wants to rename duplicate symbols...
					if (layoutSettings.renameSymbols == 1) {
						symbols = renameDuplicateSymbols(symbols);
					}

					// Sort the layer list
					sortLayerList(symbols,layoutSettings.reverseOrder);

					// Create the group object
					var groupLayout = createGroupObject(symbols,layoutSettings.groupDepth);

					// Reset page origin
					page.setRulerBase(CGPointMake(0,0));

					// If user wants to display group titles...
					if (layoutSettings.displayTitles == 1) {
						// Add title style
						addTextStyle(context,titleStyleName,titleStyleFont,titleTextSize,titleTextHeight,titleTextAlign);

						// Create new screen title group
						titleGroup = MSLayerGroup.new();
						titleGroup.setName(titleGroupName);
						titleGroup.frame().setX(titleGroupX);
						titleGroup.frame().setY(titleGroupY);
						titleGroup.setIsLocked(true);
						titleGroup.setHasClickThrough(true);
					}

					// Set tracker/counters
					var groupSpace = 0;
					var groupCount = 1;
					var objectCount = 1;

					// Iterate through the group object
					for (var i = 0; i < groupLayout.length; i++) {
						// Symbol variables
						var symbol = symbols.objectAtIndex(i);
						var symbolFrame = symbol.frame();

						// If user wants to display titles, and this is the first item in the first group, or a brand new group...
						if (layoutSettings.displayTitles == 1 && (objectCount == 1 || groupCount != groupLayout[i]['group'])) {
							// Title position variables
							var titleTextX = 0;
							var titleTextY = 0;
							var titleTextAlign = 0;

							// Update title position variables per the layout direction
							if (layoutSettings.sortDirection == 0) {
								titleTextX = (objectCount == 1) ? 0 : x+groupSpace+xPad;
							} else {
								titleTextY = (objectCount == 1) ? 0 : y+groupSpace+yPad;
								titleTextAlign = 1;
							}

							// Create screen title
							var screenTitle = MSTextLayer.new();
							screenTitle.setStringValue(groupLayout[i]['prefix']);
							screenTitle.setName(groupLayout[i]['prefix']);

							if (titleTextAlign == 0) {
								screenTitle.frame().setY(titleTextY);
								screenTitle.frame().setX(titleTextX);
							} else {
								screenTitle.frame().setY(titleTextY);
								screenTitle.frame().setX(titleTextX-screenTitle.frame().width());
							}

							// Set screen title style
							var screenTitleStyle = getTextStyleByName(context,titleStyleName);
							screenTitle.setStyle(screenTitleStyle.newInstance());

							// Add screen title to title group
							titleGroup.addLayers([screenTitle]);
						}

						// If the current group number doesn't match the group counter
						if (groupLayout[i]['group'] != groupCount) {
							// Update group position variables per the layout direction
							if (layoutSettings.sortDirection == 0) {
								// Reset y position, set the x position of the next row
								y = 0;
								x += groupSpace + xPad;
							} else {
								// Reset x position, set the y position of the next row
								x = 0;
								y += groupSpace + yPad;
							}

							// Reset the group space tracker
							groupSpace = 0;

							// Increment the group counter
							groupCount++;

							// Reset the object counter
							objectCount = 1;
						}

						// If the max per row is greater than 0, and object count is greater than max per row
						if (maxPer > 0 && objectCount > maxPer) {
							// Update group position variables per the layout direction
							if (layoutSettings.sortDirection == 0) {
								// Reset y position, set the x position of the next row
								y = 0;
								x += groupSpace + xPad;
							} else {
								// Reset x position, set the y position of the next row
								x = 0;
								y += groupSpace + yPad;
							}

							// Reset the group space tracker
							groupSpace = 0;

							// Reset the object counter
							objectCount = 1;
						}

						// Position the symbol
						symbolFrame.x = x;
						symbolFrame.y = y;

						// Update group position variables per the layout direction
						if (layoutSettings.sortDirection == 0) {
							// If this symbol is wider than previous symbols in row
							if (symbolFrame.width() > groupSpace) {
								// Increase the width of the row
								groupSpace = symbolFrame.width();
							}

							// Set the y position for the next symbol
							y += symbolFrame.height() + yPad;
						} else {
							// If this symbol is taller than previous symbols in row
							if (symbolFrame.height() > groupSpace) {
								// Increase the height of the row
								groupSpace = symbolFrame.height();
							}

							// Set the x position for the next symbol
							x += symbolFrame.width() + xPad;
						}

						// Increment the object counter
						objectCount++;
					}

					// If user wants to display group titles...
					if (layoutSettings.displayTitles == 1) {
						// Add title group to page
						page.addLayers([titleGroup]);
					}

					// Collapse symbols
					actionWithType(context,"MSCollapseAllGroupsAction").doPerformAction(nil);

					// Feedback to user
					if (layoutSettings.removeSymbols == 1 && removedSymbolCount > 0) {
						doc.showMessage("Symbol layout complete! " + removedSymbolCount + " unused symbols were removed.");
					} else {
						doc.showMessage("Symbol layout complete!");
					}
				} else {
					displayDialog("There are no symbols to organize on this page.",pluginName);
				}
			}
		} else {
			displayDialog("This page contains artboards and symbols. Symbol Organizer can only be used on pages with just symbols.",pluginName);
		}
	} else {
		displayDialog("There are no symbols to organize on this page.",pluginName);
	}

	function getLayoutSettings() {
		// Setting variables
		var defaultSettings = {};
		defaultSettings.groupDepth = 1;
		defaultSettings.displayTitles = 0;
		defaultSettings.sortDirection = 0;
		defaultSettings.xPad = '100';
		defaultSettings.yPad = '100';
		defaultSettings.maxPer = '';
		defaultSettings.reverseOrder = 0;
		defaultSettings.renameSymbols = 0;
		defaultSettings.gatherSymbols = 0;
		defaultSettings.removeSymbols = 0;

		// Update default settings with cached settings
		defaultSettings = getCachedSettings(page,defaultSettings);

		return {
			groupDepth : defaultSettings.groupDepth,
			displayTitles : defaultSettings.displayTitles,
			sortDirection : defaultSettings.sortDirection,
			xPad : defaultSettings.xPad,
			yPad : defaultSettings.yPad,
			maxPer : defaultSettings.maxPer,
			reverseOrder : defaultSettings.reverseOrder,
			renameSymbols : defaultSettings.renameSymbols,
			gatherSymbols : defaultSettings.gatherSymbols,
			removeSymbols : defaultSettings.removeSymbols
		}
	}

	function pushOverrideSymbolIDtoArray(overrideObject,array) {
		if (
			overrideObject.class() == "__NSDictionaryI" ||
			overrideObject.class() == "__NSDictionaryM" ||
			overrideObject.class() == "__NSSingleEntryDictionaryI" ||
			overrideObject.class() == "__NSSingleEntryDictionaryM"
		) {
			if (overrideObject.objectForKey("symbolID")) {
				array.push(String(overrideObject.objectForKey("symbolID")));
			}

			for (var i = 0; i < overrideObject.allValues().count(); i++) {
				pushOverrideSymbolIDtoArray(overrideObject.allValues().objectAtIndex(i),array);
			}
		}
	}

	function removeUnusedSymbols() {
		var count = 0;
		var symbols = context.document.documentData().allSymbols();
		var symbolsLoop = symbols.objectEnumerator();
		var symbol;

		while (symbol = symbolsLoop.nextObject()) {
			if (!symbol.hasInstances() && exemptSymbols.indexOf(String(symbol.symbolID())) == -1) {
				symbol.removeFromParent();
				count++;
				removedSymbolCount++;
			}
		}

		if (count != 0) {
			removeUnusedSymbols();
		}
	}

	function sortLayerList(symbols,order) {
		var symbols = (order == 1) ? [[symbols reverseObjectEnumerator] allObjects] : symbols;
		var symbolIndices = [];
		var symbolLoop = symbols.objectEnumerator();
		var symbol;

		while (symbol = symbolLoop.nextObject()) {
			symbolIndices.push(symbols.indexOfObject(symbol));
		}

		var removeLoop = symbols.objectEnumerator();
		var symbolToRemove;

		while (symbolToRemove = removeLoop.nextObject()) {
			symbolToRemove.removeFromParent();
		}

		for (var i = 0; i < symbolIndices.length; i++) {
			[[doc currentPage] insertLayer:symbols[i] atIndex:symbolIndices[i]];
		}
	}

	function createGroupObject(symbols,depth) {
		// Group variables
		var groupCount = 0;
		var groupLayout = [];
		var lastGroupPrefix;

		// Iterate through the symbols
		for (var i = 0; i < symbols.count(); i++) {
			// Symbol variables
			var symbol = symbols.objectAtIndex(i);
			var symbolName = symbol.name();

			// Determine a break point in the symbol name
			var breakPoint = (symbolName.indexOf("/") != -1) ? getCharPosition(symbolName,"/",depth+1) : 0;

			// Set a prefix for current group
			var thisGroupPrefix = (breakPoint > 0) ? symbolName.slice(0,breakPoint) : symbolName;

			// If this group prefix is not the same as last group
			if (lastGroupPrefix != thisGroupPrefix) {
				// Increment the group counter
				groupCount++;
			}

			// Add an entry to the group object
			groupLayout.push({
				prefix: thisGroupPrefix,
				group: groupCount
			});

			// Set the last group prefix to current prefix
			lastGroupPrefix = thisGroupPrefix;
		}

		return groupLayout;
	}

	function getCachedSettings(location,settings) {
		try {
			for (i in settings) {
				if ([command valueForKey:i onLayer:location]) {
					settings[i] = [command valueForKey:i onLayer:location];
				}
			}

			return settings;
		} catch(err) {
			log("Unable to fetch settings.");
		}
	}
};
