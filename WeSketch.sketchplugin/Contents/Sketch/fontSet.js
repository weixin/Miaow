@import "common.js";

var onRun = function(context){
    var pluginSketch = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("library").path();
    var options = [[[NSFontManager sharedFontManager] availableFontFamilies]][0];

    var param = [];
    for(var i = 0;i<options.length;i++){
        param.push(encodeURIComponent(options[i]));
    }

	SMPanel({
        url: pluginSketch + "/panel/fontSet.html",
        width: 362,
        height: 548,
        data:{fontFamily:param},
        hiddenClose: false,
        floatWindow: true,
        identifier: "fontSet",
        callback: function( data ){
            
        },pushdataCallback:function(data ,windowObject ){
            if(data.action == 'insert'){
                var ustr = '\\u'+data.chari;
                var obj = '{"ustr": "'+ ustr +'"}';
                obj = JSON.parse(obj);
                var nowcontext = uploadContext(context);
                var fontfamily = [NSFont fontWithName:data.fontFamily size:14.0];
                var layer = nowcontext.selection[0];
                var fontSize = layer.fontSize();
                layer.setFont(fontfamily);
                layer.setFontSize(fontSize);
                layer.setStringValue(obj.ustr);
                windowObject.evaluateWebScript("window.location.hash = '';");
            }else{
                var font = [NSFont fontWithName:data.fontFamily size:14.0];
                var set = [font coveredCharacterSet];
                var chari = [];
                for(var i = 0; i <= 0xffff;i++){
                    if ([set characterIsMember:i]) {
                        chari.push(i);
                    }
                }
                windowObject.evaluateWebScript("pushdata("+JSON.stringify(chari)+")");
                windowObject.evaluateWebScript("window.location.hash = '';");   
            }
        }
    });
}