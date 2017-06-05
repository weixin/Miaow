@import "common.js";

var usualKey = "com.sketchplugins.wechat.iconusual";
var loginKey = "com.sketchplugins.wechat.iconLogin";
var loginNameKey = "com.sketchplugins.wechat.iconLoginName";
var sig = NSUserDefaults.standardUserDefaults().objectForKey(loginKey);


function iconLogin(data){
    var r = post(['/users/login','username='+data.username + '&password='+data.password]);
    if(r.status == 200){
        NSUserDefaults.standardUserDefaults().setObject_forKey(data.username,loginNameKey);
    }
    return r;
}

function getSvg(){
    return post(['/users/getFiles']);
}

function getLogin(){
    return post(['/users/login']);
}

function queryProject(){
   var r = post(['/users/queryProject']);
   return r;
}

function queryProjectIcon(projectid){
   var r = post(['/users/queryIconByProId','projectid='+projectid]);
   return r;
}

function queryTypeIcon(categoryid){
   var r = post(['/users/queryIconByCateId','categoryid='+categoryid]);
   return r;
}

var onRun = function(context){

    var svgtitle = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>';

    var pluginSketch = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("library").path();

    var baseSvg = getSvg().data;

    var isLogin;
    if(!NSUserDefaults.standardUserDefaults().objectForKey(loginKey) || NSUserDefaults.standardUserDefaults().objectForKey(loginKey).length()  != 32){
        isLogin = false;
    }else{
        isLogin = getLogin();
    }
     

    var initData = {data:baseSvg,isLogin:isLogin};
    if(isLogin != false && isLogin.status == 200){
        var username = (NSUserDefaults.standardUserDefaults().objectForKey(loginNameKey)).toString();
        var b = '';
        b += username;
        initData.nametest = b;
        var project = queryProject().list;
        initData.project = project;
        initData.isLogin = true;
    }else{
        initData.isLogin = false;
    }

	SMPanel({
        url: pluginSketch + "/panel/icon.html?12",
        width: 562,
        height: 548,
        data: initData,
        hiddenClose: false,
        floatWindow: true,
        identifier: "icon",
        callback: function( data ){
            if(data.type == 'link'){
                openUrlInBrowser(data.link);
                return;
            }else if(data.type == 'show'){
                data.name = data.name.replace('.svg','');
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

                var logo = decodeURIComponent(data.content);
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
                // var children = importedSVGLayer.children();
                // var colorToReplace = hexToRgb(data.color);
                // for(var j = 0;j<children.length;j++){
                //     if(children[j].className() == 'MSShapeGroup'){
                //         var fill = children[j].style().fills().firstObject();
                //         fill.color = MSColor.colorWithRed_green_blue_alpha(colorToReplace.r / 255, colorToReplace.g / 255, colorToReplace.b / 255, 1.0);
                //     }
                // }

                [svgFrame setX:x];
                [svgFrame setY:y];
                var page = context.document.currentPage();
                var canvas = page.currentArtboard() || page;
                canvas.addLayers([importedSVGLayer]);
            }else if(data.type == 'private'){
                data.name = data.name.replace('.svg','');
                var x = 0;
                var y = 0;
                
                var logo = (data.content);
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
                [svgFrame setX:x];
                [svgFrame setY:y];
                var page = context.document.currentPage();
                var canvas = page.currentArtboard() || page;
                canvas.addLayers([importedSVGLayer]);
            }else if(data.type == 'loginout'){
                NSUserDefaults.standardUserDefaults().setObject_forKey('',loginNameKey);
                NSUserDefaults.standardUserDefaults().setObject_forKey('',loginKey);
            }
        },loginCallback:function( windowObject ){
            var data = JSON.parse(decodeURI(windowObject.valueForKey("SMData")));
            var reuslt = iconLogin(data);

            if(reuslt.status == 200){
                NSUserDefaults.standardUserDefaults().setObject_forKey(reuslt.sig,loginKey);
                project = queryProject().list;
                reuslt.project = project;
                var username = (NSUserDefaults.standardUserDefaults().objectForKey(loginNameKey)).toString();
                var b = '';
                b += username;
                reuslt.nametest = b;
            }
            windowObject.evaluateWebScript("sLogin("+JSON.stringify(reuslt)+")");
        },pushdataCallback:function(data ,windowObject ){
            var reuslt = {};
            if(data.type == 'type'){
                reuslt = queryTypeIcon(data.id);
            }else{
                reuslt = queryProjectIcon(data.id);
            }
            windowObject.evaluateWebScript("pushdata("+JSON.stringify(reuslt)+")");

        }
    });
}