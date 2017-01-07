@import "common.js"

var onRun = function(context){
	NSApp.displayDialog(getConfig('config',context).COLOR);
	NSApp.displayDialog(getConfig('config',context).VERSION);
	NSApp.displayDialog(getConfig('config',context).UIKIT);
}