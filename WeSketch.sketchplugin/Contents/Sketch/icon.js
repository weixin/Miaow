@import "common.js"

var onRun = function(context){
    var pluginSketch = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("library").path();

	SMPanel({
        url: pluginSketch + "/panel/icon.html",
        width: 320,
        height: 451,
        data: {
        },
        hiddenClose: false,
        floatWindow: true,
        identifier: "icon",
        callback: function( data ){
			NSApp.displayDialog('1');
        },
        addCallback: function(windowObject){
			NSApp.displayDialog('2');
        },
        importCallback: function(windowObject){
			NSApp.displayDialog('3');
            
        },
        exportCallback: function(windowObject){
			NSApp.displayDialog('4');
            
        },
        exportXMLCallback: function(windowObject){
			NSApp.displayDialog('5');
        }
    });
}