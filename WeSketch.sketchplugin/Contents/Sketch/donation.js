@import "common.js";

var onRun = function(context){
    var pluginSketch = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("library").path();

	SMPanel({
        url: pluginSketch + "/panel/donation.html",
        width: 362,
        height: 548,
        hiddenClose: false,
        floatWindow: true,
        identifier: "donaition",
        callback: function( data ){
            
        }
    });
}