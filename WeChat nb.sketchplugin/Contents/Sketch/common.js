var kPluginDomain;

function initDefaults(pluginDomain, initialValues) {
	kPluginDomain = pluginDomain

	var defaults = [[NSUserDefaults standardUserDefaults] objectForKey:kPluginDomain]
	var defaultValues = {}
    var dVal;

    for (var key in defaults) {
    	defaultValues[key] = defaults[key]
	}

	for (var key in initialValues) {
		dVal = defaultValues[key]
		if (dVal == nil) defaultValues[key] = initialValues[key]
	}

	return defaultValues
}

function saveDefaults(newValues) {
	if (kPluginDomain) {
		var defaults = [NSUserDefaults standardUserDefaults]
		[defaults setObject: newValues forKey: kPluginDomain];
	}
}

function request(queryURL) {
	var request = NSMutableURLRequest.new();
	[request setHTTPMethod:@"GET"];
	[request setURL:[NSURL URLWithString:queryURL]];
	var error = NSError.new();
	var responseCode = null;
	var oResponseData = [NSURLConnection sendSynchronousRequest:request returningResponse:responseCode error:error];
	return oResponseData;
}

function getConfig(json,context) {
		var manifestPath = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent(json+".json").path();
		return NSJSONSerialization.JSONObjectWithData_options_error(NSData.dataWithContentsOfFile(manifestPath), NSJSONReadingMutableContainers, nil);
}

function createRadioButtons(options, selectedItem) {
    var rows = Math.ceil(options.length / 2);
    var columns = ((options.length < 2) ? 1 : 2);
    
    var selectedRow = Math.floor(selectedItem / 2);
    var selectedColumn = selectedItem - (selectedRow * 2);
    
    var buttonCell = [[NSButtonCell alloc] init];
        [buttonCell setButtonType:NSRadioButton]
    
    var buttonMatrix = [[NSMatrix alloc] initWithFrame: NSMakeRect(20.0, 20.0, 300.0, rows * 25) mode:NSRadioModeMatrix prototype:buttonCell numberOfRows:rows numberOfColumns:columns];
        [buttonMatrix setCellSize: NSMakeSize(140, 20)];

    for (i = 0; i < options.length; i++) {
        [[[buttonMatrix cells] objectAtIndex: i] setTitle: options[i]];
        [[[buttonMatrix cells] objectAtIndex: i] setTag: i];
    }
    
	if (rows*columns > options.length) {
		[[[buttonMatrix cells] objectAtIndex:(options.length)] setTransparent: true];
		[[[buttonMatrix cells] objectAtIndex:(options.length)] setEnabled: false];

	}
    [buttonMatrix selectCellAtRow: selectedRow column: selectedColumn]
    return buttonMatrix;
}