@import "common.js"

var onRun = function (context) {

    var presets, userDefaults, document, selection, textToFind, textToReplace, searchScope, matchRegex, matchRegexStart, matchRegexEnd, matchRegexCase, REPLACE_ALL, READY_TO_SEARCH, CANCELLED, NOT_READY, itemsMatched;
    
    // Initialise
    initialise(context);
    
    // Display the user interface
    userInterfaceLoop();

    
    
    function initialise(context) {

        presets = {
            caseSensitivity : 0,    // Off by default
            caseReplace : 0,        // Intelligent by default
            matchWhere : 1,         // Anywhere by default
            matchWhole : 1          // Not whole words by default
            }
        
        userDefaults = initDefaults("com.martinsteven.sketch-find-and-replace", presets);
        
        document = context.document;
        currentPage = [document currentPage]
        selection = context.selection;
        textToFind = "";
        textToReplace = "";
        readyToReplace = null;
        showScopeOptions = (selection && selection.count() > 0);
        searchScope = (selection && selection.count() > 0) ? 2 : 0;
        matchRegex = null;
        matchRegexStart = [
            ['^(','(', '^(','('],
            ['^(','(?:^|\\b)(', '^(','(']
        ];
        matchRegexEnd = [
            [')$',')',')',')$'],
            [')$',')(?=\\b|\\$)',')(?=\\b)',')$']
        ];
        matchRegexCase = ['gi','g'];
        REPLACE_ALL = 1000;
        READY_TO_SEARCH = true;
        CANCELLED = false;
        NOT_READY = null;
        
        
        // If the selected layer is a text layer, bring the text in automatically
        if (selection && selection.count() == 1 && selection[0].class() == MSTextLayer) {
            textToFind = selection[0].stringValue().trim();
        }
    }    


    // Keep displaying the user interface until we've either cancelled or clicked search
    function userInterfaceLoop() {
        
        var uiResponse = NOT_READY;
        
        while (uiResponse === NOT_READY) {
        
            // Creatte the interface
            var modal = createUserInterface();
            
            // Show it and process the form
            uiResponse = processButtonClick(modal, modal.runModal());
            
            // Process the response
            switch (uiResponse) {

                // Reload the interface
                case NOT_READY:
                    alert("Find or replace cannot be blank");
                    break;

                // Let's go
                case READY_TO_SEARCH:
                    doFindAndReplace();
                    break;                
                    
                // Cancelled
                case CANCELLED:
                    [document showMessage: "Cancelled"];
                    break;
            }
        }
    }
    
    
    function createUserInterface() {

        // Create modal window
        var userInterface = COSAlertWindow.new();

        // Text for modal
        userInterface.setMessageText("Find And Replace");
        userInterface.setInformativeText("Finds and replaces text items in the selected layer(s) or the complete document.");

        // Find text input
        userInterface.addTextLabelWithValue("Find");
        userInterface.addTextFieldWithValue(textToFind);

        // Replace with text input
        userInterface.addTextLabelWithValue("Replace with");
        userInterface.addTextFieldWithValue(textToReplace);

        // Scope
        userInterface.addTextLabelWithValue("Search scope");
        var options = showScopeOptions ? ['Whole document', 'Current page','Selected layer' + ([selection count] > 1 ? "s" : "")] : ["Whole document","Current page"];
        userInterface.addAccessoryView(createRadioButtons(options, (showScopeOptions ? searchScope : 1)));

        // Case-sensitivity
        userInterface.addTextLabelWithValue("Case matching")
        userInterface.addAccessoryView(createRadioButtons(["Case insensitive", "Case sensitive"], userDefaults.caseSensitivity))

        // Case-sensitivity
        userInterface.addTextLabelWithValue("Case replacement")
        userInterface.addAccessoryView(createRadioButtons(["Intelligent", "Standard"], userDefaults.caseReplace))

        // Where to match
        userInterface.addTextLabelWithValue("Where to match")
        userInterface.addAccessoryView(createRadioButtons(["Exact match only", "Anywhere in layer", "At start of layer","At end of layer"], userDefaults.matchWhere))
        
        // How to match
        userInterface.addTextLabelWithValue("Match whole words or phrases only")
        userInterface.addAccessoryView(createRadioButtons(["Yes", "No"], userDefaults.matchWhole))
        
        // Replace and cancel buttons
        userInterface.addButtonWithTitle('Replace All');
        userInterface.addButtonWithTitle('Cancel');

        // Return the Modal structure
        return userInterface;
    }

    
    
    // Creates a matrix of radio buttons for options
    
    function createRadioButtons(options, selectedItem) {

        // Work out how many rows and columns we need for the options
        var rows = Math.ceil(options.length / 2);
        var columns = ((options.length < 2) ? 1 : 2);
        
        // And which row and column contains the selected item
        var selectedRow = Math.floor(selectedItem / 2);
        var selectedColumn = selectedItem - (selectedRow * 2);
        
        // Make a prototype cell
        var buttonCell = [[NSButtonCell alloc] init];
            [buttonCell setButtonType:NSRadioButton]
        
        // And the matrix to contain the cells in Radio mode
        var buttonMatrix = [[NSMatrix alloc] initWithFrame: NSMakeRect(20.0, 20.0, 300.0, rows * 25) mode:NSRadioModeMatrix prototype:buttonCell numberOfRows:rows numberOfColumns:columns];
            [buttonMatrix setCellSize: NSMakeSize(140, 20)];

        // Add the options as cells
        for (i = 0; i < options.length; i++) {
            [[[buttonMatrix cells] objectAtIndex: i] setTitle: options[i]];
            [[[buttonMatrix cells] objectAtIndex: i] setTag: i];
        }
        
        // If there's an odd number of cells, hide the last one or it displays "Button".  There must be something i've missed that it displays "Button" in the first place!
		if (rows*columns > options.length) {
			[[[buttonMatrix cells] objectAtIndex:(options.length)] setTransparent: true];
			[[[buttonMatrix cells] objectAtIndex:(options.length)] setEnabled: false];

		}

        
        // Select the default one
        [buttonMatrix selectCellAtRow: selectedRow column: selectedColumn]
        
        // Return the matrix so we can display it
        return buttonMatrix;
    }


    
    // Processes the result of the UI
    
    function processButtonClick(modal, buttonClick) {
        
        var result;
        
        // We're only concerned if the replace all button has been clicked
        if (buttonClick === REPLACE_ALL) {

            // Grab the data from the form
            textToFind = [[modal viewAtIndex: 1] stringValue];
            textToReplace = modal.viewAtIndex(3).stringValue();
            searchScope = [[[modal viewAtIndex: 5] selectedCell] tag];

            userDefaults.caseSensitivity = [[[modal viewAtIndex: 7] selectedCell] tag];
            userDefaults.caseReplace = [[[modal viewAtIndex: 9] selectedCell] tag];
            userDefaults.matchWhere = [[[modal viewAtIndex: 11] selectedCell] tag];
            userDefaults.matchWhole = [[[modal viewAtIndex: 13] selectedCell] tag];

            saveDefaults(userDefaults);
            
            log ("Scope " + searchScope + " - Case " + userDefaults.caseSensitivity + " - Replace " + userDefaults.caseReplace + " - Where " + userDefaults.matchWhere + " - Whole " + userDefaults.matchWhole);
            
            
            // Make sure we have both text to find and replace
            if (textToFind != "" && textToReplace != "") {
                
                // Yeah, ready to go
                result = READY_TO_SEARCH;
                
            } else {
                
                // Need something in find and replace
                result = NOT_READY;
                
            }
            
        } else {
            
            // Cancel button pressed
            result = CANCELLED;

        }

        return result;        
    }
    
    

    // Kick off the find and replace loop at the correct start point(s)
    
    function doFindAndReplace() {

        // Reset the counter
        itemsMatched = 0;
        
        // Build the regex to match on, based on the user options
        matchRegex = new RegExp(matchRegexStart[userDefaults.matchWhole][userDefaults.matchWhere] + cleanSearch(textToFind) + matchRegexEnd[userDefaults.matchWhole][userDefaults.matchWhere],matchRegexCase[userDefaults.caseSensitivity]);

        // Determine the scope and launch the search accordingly
        switch (searchScope) {
            
        case 0:
            // Start at the document root
            searchInLayer(document);
            break;

        case 1:
            // Search in the current page only
            searchInLayer(currentPage);
            break;
        
        case 2:    
            // Loop through all the selected layers
            for (var i = 0; i < [selection count]; i++) {
                     searchInLayer(selection[i]);
                }
            break;
            
    }

        // Display a small result message
        [document showMessage: itemsMatched + " instance" + (itemsMatched != 1 ? "s" : "") + " replaced"];
        
    }
    
    
    
    // Show a small alert dialog
    
    function alert(message) {
        
        // Create the dialog
        var alertDialog = COSAlertWindow.new();
        
        // Add a title, message and button
        [alertDialog setMessageText: "Find And Replace"];
        [alertDialog setInformativeText: message];
        [alertDialog addButtonWithTitle: "OK"];
        
        // And show it
        [alertDialog runModal];
        
    }


    
    // Clean find input so it's suitable for use in the regex 
    
    function cleanSearch(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').trim();
    };
    
    
    // Intelligent replace which attempts to match case if possible
    function doIntelligentReplace(replaceThis, replaceWith) {
        var replacement = replaceWith;
        if (userDefaults.caseReplace == 1) {
            if (replaceThis.charAt(0) == replaceThis.charAt(0).toLowerCase()) {
                replacement = replaceWith.charAt(0).toLowerCase() + replaceWith.slice(1);
            }
            if (replaceThis.charAt(0) == replaceThis.charAt(0).toUpperCase()) {
                replacement = replaceWith.charAt(0).toUpperCase() + replaceWith.slice(1);
            }
            if (replaceThis == replaceThis.toLowerCase()) {
                replacement = replaceWith.toLowerCase()
            }
            if (replaceThis == replaceThis.toUpperCase()) {
                replacement = replaceWith.toUpperCase()
            }
        }
        return replacement;
    }
    

    // Do the actual search within the specified layer.  Recursive to drill down into sublayers.
    
    function searchInLayer(layer) {
    
        // Determine the type of layer we're looking at
        switch ([layer class]) {

            // Text layer - this is the important one
            case MSTextLayer:
                if ([layer stringValue].trim().match(matchRegex)) {
                    itemsMatched++;
                    layer.setStringValue(layer.stringValue().replace(matchRegex,function(eachMatch){return doIntelligentReplace(eachMatch, textToReplace);})); 
                    layer.setName(layer.stringValue().trim().replace(/(\r\n|\n|\r)/gm," "));
                }
                break;

            // If we've started our search at the document root, loop through the pages
            case MSDocument:
                var documentPages = [layer pages];
                for (var i = 0; i < [documentPages count]; i++) {
                    var documentPage = [documentPages objectAtIndex:i];
                    searchInLayer(documentPage);
                }
                break;

            // Otherwise everything below that is an alias for layers anyway so we can treat them the same and loop through any sublayers
            case MSPage:
            case MSLayerGroup:
            case MSArtboardGroup:
                var sublayers = [layer layers];
                for (var i = 0; i < [sublayers count]; i++) {
                    var sublayer = [sublayers objectAtIndex: i];
                    searchInLayer(sublayer);
                }
                break;
        }
    }


}
