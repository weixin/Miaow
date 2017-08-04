@import "common.js";

var loginKey = "com.sketchplugins.wechat.iconLogin";
var loginNameKey = "com.sketchplugins.wechat.iconLoginName";

function iconLogin(data){
    var r = post(['/users/login','username='+data.username + '&password='+data.password]);
    if(r.status == 200){
        NSUserDefaults.standardUserDefaults().setObject_forKey(data.username,loginNameKey);
    }
    return r;
}

function choiceSVG(context){
    var svgList = [];
    for(var i = 0;i<context.selection.count();i++){
        var slice = MSExportRequest.exportRequestsFromExportableLayer(context.selection[i]).firstObject();
        slice.scale = '1';
        slice.format = 'svg';
        var save = NSSavePanel.savePanel();
        var savePath = save.URL().path() + '.svg';
        context.document.saveArtboardOrSlice_toFile(slice, savePath);
        var content = NSData.dataWithContentsOfURL(NSURL.URLWithString('file:///'+encodeURIComponent(savePath)));
        var string = [[NSString alloc] initWithData:content encoding:NSUTF8StringEncoding];
        svgList.push({content:encodeURIComponent(string),name:encodeURIComponent(context.selection[i].name().toString())});
        var fm  =[NSFileManager defaultManager];
        fm.removeItemAtPath_error(savePath,nil);
    }
    return svgList;
}

function getLogin(){
    return post(['/users/login']);
}

function queryProject(){
    var r = post(['/users/queryProject']);
    return r;
}

function uploadIconFunc(data){
    return post(['/users/single_upload','name='+data.name + '&content='+ data.content + '&projectid=' + data.project + '&categoryid=' + data.type + '&author='+data.author ]);
}

function uploadIconsFunc(data){
    NSApp.displayDialog(JSON.stringify(data));
    return post(['/users/batch_upload','list='+JSON.stringify(data)]);
}

function version_check(data){
    var r = post(['/users/version_check','list='+JSON.stringify(data)]);
    return r;
}

var onRun = function(context){
    var isLogin;
    if(!NSUserDefaults.standardUserDefaults().objectForKey(loginKey) || NSUserDefaults.standardUserDefaults().objectForKey(loginKey).length() != 32){
        isLogin = false;
    }else{
        isLogin = getLogin();
    }
    var project = [];
    var svg = choiceSVG(context);
    var initData = {svg:svg,isLogin:isLogin};
    if(isLogin == false || isLogin.status != 200){
        initData.isLogin = false;
    }else{
        var username = NSUserDefaults.standardUserDefaults().objectForKey(loginNameKey);
        var b = '';
        b += username;
        initData.nametest = b;
        initData.isLogin = true;
        initData.project = queryProject().list;
    }


    var pluginSketch = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("library").path();
	var panel = SMPanel({
        url: pluginSketch + "/panel/uploadIcon.html",
        width: 680,
        height: 346,
        data:initData,
        hiddenClose: false,
        floatWindow: true,
        identifier: "uploadIcon",
        callback: function( data ){
            if(data.type == 'link'){
                openUrlInBrowser(data.link);
                return;
            }else if(data.type == 'loginout'){
                NSUserDefaults.standardUserDefaults().setObject_forKey('',loginNameKey);
                NSUserDefaults.standardUserDefaults().setObject_forKey('',loginKey);
                return;
            }
            var result = uploadIconsFunc(data);
            NSApp.displayDialog(JSON.stringify(result));
            if(result.status == 200){
                NSApp.displayDialog('上传成功，预览地址已经放入剪贴板');
                return true;
            }else{
                return false;
            }
        },loginCallback:function( windowObject ){
            var data = JSON.parse(decodeURI(windowObject.valueForKey("SMData")));
            var reuslt = iconLogin(data);
            if(reuslt.status == 200){
                var username = NSUserDefaults.standardUserDefaults().objectForKey(loginNameKey);
                var b = '';
                b += username;
                reuslt.nametest = b;
                NSUserDefaults.standardUserDefaults().setObject_forKey(reuslt.sig,loginKey);
                project = queryProject().list;
                reuslt.project = project;
            }
            windowObject.evaluateWebScript("sLogin("+JSON.stringify(reuslt)+")"); 
        },pushdataCallback:function(data ,windowObject){
            if(data.action == 'boardsvg'){
                var newContext = uploadContext(context);
                if(newContext.selection.length == 0){
                    return NSApp.displayDialog('请选中 Pages 中要上传的元素');
                }
                var svg = choiceSVG(newContext);
                windowObject.evaluateWebScript("svgUpload("+JSON.stringify(svg)+")");
                windowObject.evaluateWebScript("window.location.hash = '';");
            }else if(data.action == 'filesvg'){
                var panel = [NSOpenPanel openPanel];
                [panel setCanChooseDirectories:false];
                [panel setCanCreateDirectories:false];
                [panel setAllowsMultipleSelection:true];
                panel.setAllowedFileTypes([@"svg"]);
                panel.setAllowsOtherFileTypes(false);
                panel.setExtensionHidden(false);
                var clicked = [panel runModal];
                if (clicked != NSFileHandlingPanelOKButton) {
                  return;
                }
                var urls = [panel URLs];
                var svgList = [];
                for(var i = 0;i<urls.length;i++){
                    var unformattedURL = [NSString stringWithFormat:@"%@", urls[i]];
                    var file_path = [unformattedURL stringByRemovingPercentEncoding];
                    var theResponseData = request(file_path)
                    var theText = [[NSString alloc] initWithData:theResponseData encoding:NSUTF8StringEncoding];

                    svgList.push({
                        content:encodeURIComponent(theText),
                        name:file_path.substr(file_path.lastIndexOf('/')+1).replace('.svg','')
                    })
                }
                var ppp = [];

                windowObject.evaluateWebScript("svgUpload("+JSON.stringify(svgList)+")");
                windowObject.evaluateWebScript("window.location.hash = '';");

            }else if(data.action == 'version'){
                var version = version_check(data.list);
                NSApp.displayDialog(JSON.stringify(version));
                windowObject.evaluateWebScript("versionCheck("+JSON.stringify(version)+")");
                windowObject.evaluateWebScript("window.location.hash = '';");

            }
            
        }
    });
}