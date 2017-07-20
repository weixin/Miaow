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
                
                var nowcontext = uploadContext(context);
                if(nowcontext.selection.length == 0){
                    return;
                }
                var fontfamily = [NSFont fontWithName:data.fontFamily size:14.0];
                var layer = nowcontext.selection[0];
                var fontSize = layer.fontSize();
                layer.setFont(fontfamily);
                layer.setFontSize(fontSize);
                function bzone(d){
                    if(d.length != 4){
                        d = '0' + d;
                        return bzone(d);
                    }else{
                        return d;
                    }
                }
                var ustr = '\\u'+bzone(data.chari);
                var obj = '{"ustr": "'+ ustr +'"}';
                obj = JSON.parse(obj);
                if(layer.class() ==  'MSTextLayer'){
                    if(layer.editingDelegate()){
                        var range = layer.editingDelegate().textView().selectedRange();
                        var value = layer.stringValue();
                        var start = value.substr(0,range.location);
                        var end = value.substr(range.length+range.location);
                        var newLayer = layer.duplicate();
                        newLayer.setStringValue(start + obj.ustr + end);
                        newLayer.setName(start + obj.ustr + end);
                        newLayer.setNameIsFixed(0);
                        layer.removeFromParent();
                        newLayer.adjustFrameToFit();
                        layer.adjustFrameToFit();
                        newLayer.select_byExpandingSelection(true,true);
                    }else{
                        layer.setStringValue(obj.ustr);
                    }
                }else{
                    return NSApp.displayDialog('please choose Text');
                }
                
                // windowObject.evaluateWebScript("window.location.hash = '';");
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