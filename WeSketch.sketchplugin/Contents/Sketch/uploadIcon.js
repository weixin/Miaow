@import "common.js";

var loginKey = "com.sketchplugins.wechat.iconLogin";

function iconLogin(data){
    return post(['/users/login','username='+data.username + '&password='+data.password]);
}

function choiceSVG(layer,doc){
    var slice = MSExportRequest.exportRequestsFromExportableLayer(layer).firstObject();
    slice.scale = '1';
    slice.format = 'svg';
    var save = NSSavePanel.savePanel();
    var savePath = save.URL().path() + '.svg';
    doc.saveArtboardOrSlice_toFile(slice, savePath);
    var content = NSData.dataWithContentsOfURL(NSURL.URLWithString('file://'+savePath));
    var string = [[NSString alloc] initWithData:content encoding:NSUTF8StringEncoding];
    var fm  =[NSFileManager defaultManager];
    fm.removeItemAtPath_error(savePath,nil);
    return string;
}

function getLogin(){
    return post(['/users/login']);
}

function queryProject(){
    var r = post(['/users/queryProject']);
    return r;
}

function uploadIconFunc(data){
    return post(['/users/single_upload','name='+data.name + '&content='+ data.content + '&projectid=' + data.project + '&categoryid=' + data.type ]);
}

var onRun = function(context){
    var isLogin = getLogin();
    var project = [];
    if(isLogin.status != 200){
        isLogin = false;
    }else{
        isLogin = true;
        project = queryProject().list;
    }
    var selection = context.selection;
    if(selection.length == 1){
        selection = selection[0];
    }else{
        return NSApp.displayDialog('请选中一个您需要上传到项目管理的图标');
    }
    var svgname = encodeURIComponent(selection.name().toString());
    var svg = encodeURIComponent(choiceSVG(selection,context.document));
    var pluginSketch = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("library").path();
	var panel = SMPanel({
        url: pluginSketch + "/panel/uploadIcon.html",
        width: 300,
        height: 430,
        data:{svg:svg,svgtest:svgname,isLogin:isLogin,project:project},
        hiddenClose: false,
        floatWindow: true,
        identifier: "uploadIcon",
        callback: function( data ){
            var result = uploadIconFunc(data);
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
                project = queryProject().list;
                reuslt.project = project;
                NSUserDefaults.standardUserDefaults().setObject_forKey(reuslt.sig,loginKey);
            }
            windowObject.evaluateWebScript("sLogin("+JSON.stringify(reuslt)+")");
            // NSApp.displayDialog(JSON.stringify(reuslt));
        }
    });
}