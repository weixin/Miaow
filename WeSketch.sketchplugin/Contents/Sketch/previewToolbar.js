@import 'common.js';
@import 'commonPreview.js';
@import 'localPreview.js';
@import 'webPreview.js';


function previewToolbar(context){
    var pluginSketch = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("library").path();
    SMPanel({
        url: pluginSketch + "/panel/previewToolbar.html",
        width: 122,
        height: 282,
        hiddenClose: false,
        floatWindow: true,
        identifier: "previewToolbar",
        pushdataCallback: function( data,windowObject ){
            var nowcontext = uploadContext(context);
            switch(data.action){
                case "first":
                setIndex(nowcontext);
                break;

                case "dialog":
                setDialog(nowcontext);
                break;

                case "fixed":
                setFixed(nowcontext);
                break;

                case "back":
                setBack(nowcontext);
                break;

                case "local":
                localPreview(nowcontext);
                break;

                case "remote":
                webPreview(nowcontext);
                break;
            }
            windowObject.evaluateWebScript("window.location.hash = '';");
        }
    });
}

var onRunPreviewToolBar = function(context){
    previewToolbar(context);
}