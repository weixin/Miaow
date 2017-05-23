@import "common.js";

var usualKey = "com.sketchplugins.wechat.iconusual";
var loginKey = "com.sketchplugins.wechat.iconLogin";
var sig = NSUserDefaults.standardUserDefaults().objectForKey(loginKey);

var onRun = function(context){
    function unique(a) {  
      var res = [];  
      
      for (var i = 0, len = a.length; i < len; i++) {  
        var item = a[i];  
      
     for (var j = 0, jLen = res.length; j < jLen; j++) {  
          if (res[j] === item)  
            break;  
        }  
      
        if (j === jLen)  
          res.push(item);  
      }  
      
      return res;  
    }

    var usualArr = NSUserDefaults.standardUserDefaults().objectForKey(usualKey);
    if(usualArr){
        usualArr = usualArr.split(',');
    }else{
        usualArr = [];
    }
    usualArr = unique(usualArr);
    var pluginSketch = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("library").path();

    var theResponseData = networkRequest(['http://123.207.94.56:3000/users/getFiles']);
    var jsonData = NSJSONSerialization.JSONObjectWithData_options_error(theResponseData,0,nil);
    var object = [];
    var flagFirstArr = [];
    for (var i = 0; i < jsonData.data.length; i++) {
        var flagFirst = false;
        for(var k = 0;k < usualArr.length; k ++){
            if(usualArr[k].replace('.svg','') == jsonData.data[i].name.replace('.svg','')){
                flagFirstArr[usualArr.length - 1 - k] = {name:encodeURIComponent(jsonData.data[i].name),content:encodeURIComponent(jsonData.data[i].content)};
                flagFirst = true;
            }
        }
        if(!flagFirst){
            var name = encodeURIComponent(jsonData.data[i].name);
            var content = encodeURIComponent(jsonData.data[i].content);
            object.push({name:name,content:content});
        }
    };
    object = flagFirstArr.concat(object);
    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        if (result) {
        result = {
             r : parseInt(result[1], 16),
             g : parseInt(result[2], 16),
             b : parseInt(result[3], 16),
            };
        } else {
        result = null;
        }

        return result;
     }

    var svgtitle = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>';

    function iconLogin(data){
        var returnData = networkRequest(['http://123.207.94.56:3000/users/login?userName='+data.username + '&password='+data.password]);
        var jsonData = NSJSONSerialization.JSONObjectWithData_options_error(returnData,0,nil);
        jsonData = {
            msg: encodeURIComponent(jsonData.msg),
            sig: encodeURIComponent(jsonData.sig),
            status: encodeURIComponent(jsonData.status)
        }
        
        if(jsonData.status == 200){
            sig = jsonData.sig;
            NSUserDefaults.standardUserDefaults().setObject_forKey(jsonData.sig,loginKey);
            return jsonData;
        }else{
            NSApp.displayDialog(jsonData.msg);
            return jsonData;
        }
    }

	SMPanel({
        url: pluginSketch + "/panel/icon.html?12",
        width: 362,
        height: 548,
        data: {data:object},
        hiddenClose: false,
        floatWindow: true,
        identifier: "icon",
        callback: function( data ){
            if(data.type == 'link'){
                openUrlInBrowser(data.link);
                return;
            }else if(data.type == 'show'){
                usualArr = NSUserDefaults.standardUserDefaults().objectForKey(usualKey);
                if(usualArr){
                    usualArr = usualArr.split(',');
                }else{
                    usualArr = [];
                }
                data.name = data.name.replace('.svg','');
                usualArr.push(data.name);
                NSUserDefaults.standardUserDefaults().setObject_forKey(unique(usualArr).join(','), usualKey);
                var x = 0;
                var y = 0;
                var selection = context.selection;
                if(selection) {
                    selection = selection[0];
                    if(selection.className() == 'MSSymbolMaster' || selection.className() == 'MSArtboardGroup'){
                        x = selection.absoluteRect().size().width/2 - data.width/2;
                        y = selection.absoluteRect().size().height/2 - data.height/2;
                    }else{
                        x = selection.frame().x;
                        y = selection.frame().y;
                    }
                }

                logo = decodeURIComponent(data.content);
                logo = svgtitle + logo.replace('xmlns="http://www.w3.org/2000/svg"','version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"');
                logo = NSString.stringWithString(logo);
                logo = [logo dataUsingEncoding: NSUTF8StringEncoding];
                var svgImporter = MSSVGImporter.svgImporter();
                svgImporter.prepareToImportFromData(logo);
                var importedSVGLayer = svgImporter.importAsLayer();
                var svgFrame = importedSVGLayer.frame();
                importedSVGLayer.name = data.name;
                [svgFrame setWidth:data.width];
                [svgFrame setHeight:data.height];
                var children = importedSVGLayer.children();
                var colorToReplace = hexToRgb(data.color);
                for(var j = 0;j<children.length;j++){
                    if(children[j].className() == 'MSShapeGroup'){
                        var fill = children[j].style().fills().firstObject();
                        fill.color = MSColor.colorWithRed_green_blue_alpha(colorToReplace.r / 255, colorToReplace.g / 255, colorToReplace.b / 255, 1.0);
                    }
                }

                [svgFrame setX:x];
                [svgFrame setY:y];
                var page = context.document.currentPage();
                var canvas = page.currentArtboard() || page;
                canvas.addLayers([importedSVGLayer]);
            }else if(data.type == 'login'){

            }
        },loginCallback:function( windowObject ){
            var data = JSON.parse(decodeURI(windowObject.valueForKey("SMData")));
            var reuslt = iconLogin(data);
            windowObject.evaluateWebScript("sLogin("+JSON.stringify(reuslt)+")");
            // NSApp.displayDialog(JSON.stringify(reuslt));
        }
    });
}