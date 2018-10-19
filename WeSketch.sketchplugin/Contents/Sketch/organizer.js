//by Symobl Organizer
//author sonburn
//https://github.com/sonburn/symbol-organizer

var Organizer = function (context) {
	// Document variables
	var doc = context.document;
	var command = context.command;
	var page = doc.currentPage();
	var symbols = page.artboards();
	var symbolCount = symbols.count();


	// If there are no symbols...
	if (!symbolCount) {
		// Feedback to user
	}
	// If there are symbols...
	else {
		// Reset page origin
		var pageOrigin = CGPointMake(0, 0);
		page.setRulerBase(pageOrigin);

		// Get layout settings
		var layoutSettings = getLayoutSettings();

		// If layout settings were provided...
		if (layoutSettings) {
			// Remove unused symbols
			if (layoutSettings.removeSymbols == 1) {
				var removedCount = 0;

				for (var i = 0; i < symbols.count(); i++) {
					var symbol = symbols.objectAtIndex(i);

					if (!symbol.hasInstances()) {
						symbol.removeFromParent();
						removedCount++;
					}
				}

				symbols = page.artboards();
				symbolCount = symbols.count();
			}

			// Duplicate symbols object
			var layoutSymbols = page.artboards();

			// Sort new symbols object by name
			var sortByName = [NSSortDescriptor sortDescriptorWithKey: "name"
				ascending: 1
			];
			layoutSymbols = [layoutSymbols sortedArrayUsingDescriptors: [sortByName]];

			// Duplicate the sorted symbol object, reverse the order if the user has selected to do so
			var layoutLayers = (layoutSettings.sortOrder == 0) ? [[layoutSymbols reverseObjectEnumerator] allObjects] : layoutSymbols;

			// Sort the layer list
			sortLayerList(layoutLayers);

			// Grouping variables
			var groupCount = 0;
			var groupLayout = [];
			var lastGroupPrefix;

			// Iterate through the symbols
			for (var i = 0; i < symbolCount; i++) {
				// Symbol variables
				var symbol = layoutSymbols.objectAtIndex(i);
				var symbolName = symbol.name();

				// Determine a break point in the symbol name
				var breakPoint = getCharPosition(symbolName, "/", layoutSettings.groupDepth + 1);

				// Set a prefix for current group
				var thisGroupPrefix = (breakPoint > 0) ? symbolName.slice(0, breakPoint) : symbolName.slice(0, symbolName.indexOf("/"));

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

			// Layout variables
			var x = 0;
			var y = 0;
			var xPad = parseInt(layoutSettings.xPad);
			var yPad = parseInt(layoutSettings.yPad);
			var groupSpace = 0;
			var maxPer = (layoutSettings.maxPer > 0) ? layoutSettings.maxPer : 0;

			// Reset the group counter
			var groupCount = 1;
			var objectCount = 1;

			// Iterate through the group object
			for (var i = 0; i < groupLayout.length; i++) {
				// Symbol variables
				var symbol = layoutSymbols.objectAtIndex(i);
				var symbolFrame = symbol.frame();

				// Layout symbols horizontally or vertically
				if (layoutSettings.sortDirection == 0) {
					// If the current group number doesn't match the group counter
					if (groupLayout[i]['group'] != groupCount) {
						// Reset x position, set the y position of the next row, reset the row height
						y = 0;
						x += groupSpace + xPad;
						groupSpace = 0;

						// Increment the group counter
						groupCount++;

						// Reset the object counter
						objectCount = 1;
					}

					// If the max per row is greater than 0, and object count is greater than max per row
					if (maxPer > 0 && objectCount > maxPer) {
						// Reset x position, set the y position of the next row, reset the row height
						y = 0;
						x += groupSpace + xPad;
						groupSpace = 0;

						// Reset the object counter
						objectCount = 1;
					}

					// Position the symbol
					symbolFrame.x = x;
					symbolFrame.y = y;

					// If this symbol is taller than previous symbols in row
					if (symbolFrame.width() > groupSpace) {
						// Increase the height of the row
						groupSpace = symbolFrame.width();
					}

					// Set the y position for the next symbol
					y += symbolFrame.height() + yPad;
				} else {
					// If the current group number doesn't match the group counter
					if (groupLayout[i]['group'] != groupCount) {
						// Reset x position, set the y position of the next row, reset the row height
						x = 0;
						y += groupSpace + yPad;
						groupSpace = 0;

						// Increment the group counter
						groupCount++;

						// Reset the object counter
						objectCount = 1;
					}

					// If the max per row is greater than 0, and object count is greater than max per row
					if (maxPer > 0 && objectCount > maxPer) {
						// Reset x position, set the y position of the next row, reset the row height
						x = 0;
						y += groupSpace + yPad;
						groupSpace = 0;

						// Reset the object counter
						objectCount = 1;
					}

					// Position the symbol
					symbolFrame.x = x;
					symbolFrame.y = y;

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
		}
	}


	function getLayoutSettings() {
		// Setting variables
		var groupOptions = ['Label/', 'Label/Label/', 'Label/Label/Label/', 'Label/Label/Label/Label/'];
		var groupDepth = 1;
		var sortOrderOptions = ['A-Z', 'Z-A'];
		var sortOrder = 1;
		var sortDirectionOptions = ['Horizontal', 'Vertical'];
		var sortDirection = 0;
		var xPad = '300';
		var yPad = '300';
		var removeSymbols = 0;
		var maxPer = '';


		return {
			groupDepth: groupDepth,
			sortOrder: sortOrder,
			sortDirection: sortDirection,
			maxPer: maxPer,
			xPad: xPad,
			yPad: yPad,
			removeSymbols: removeSymbols
		}
	}

	function displayDialog(title, body) {
		var app = NSApplication.sharedApplication();
		app.displayDialog_withTitle(body, title);
	}

	function getCharPosition(string, match, count) {
		var position = string.split(match, count).join(match).length;

		if (string.length() != position) {
			return position;
		} else return -1;
	}

	function sortLayerList(layoutSymbols) {
		var parent = page;
		var indices = [];
		var loop = [symbols objectEnumerator],
			symbol;

		while (symbol = [loop nextObject]) {
			indices.push(parent.indexOfLayer(symbol));
		}

		var removeLoop = [symbols objectEnumerator],
			symbolToRemove;

		while (symbolToRemove = [removeLoop nextObject]) {
			[symbolToRemove removeFromParent];
		}

		for (var i = 0; i < indices.length; i++) {
			var index = indices[i];
			var sortedSymbol = layoutSymbols[i];
			var layerArray = [NSArray arrayWithObject: sortedSymbol];
			[parent insertLayers: layerArray atIndex: index];
		}

		symbols = page.artboards();
	}
};