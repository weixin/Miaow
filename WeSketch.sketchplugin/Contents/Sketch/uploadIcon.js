@import "common.js";

var loginKey = "com.sketchplugins.wechat.iconLogin";



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

function queryProject(){
    var sig = NSUserDefaults.standardUserDefaults().objectForKey(loginKey);
    var r = post('/users/queryProject','&sig'+sig);
    NSApp.displayDialog(JSON.stringify(r));
}

function uploadIconFunc(data){
    var sig = NSUserDefaults.standardUserDefaults().objectForKey(loginKey);
    return post('/users/single_upload','name='+data.name + '&content='+ data.content + '&sig'+sig);
}

var onRun = function(context){
    queryProject();
    var selection = context.selection;
    if(selection.length == 1){
        selection = selection[0];
    }else{
        return NSApp.displayDialog('请选中一个您需要上传到项目管理的图标');
    }
    var svg = encodeURIComponent(choiceSVG(selection,context.document));
    var pluginSketch = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("library").path();
	SMPanel({
        url: pluginSketch + "/panel/uploadIcon.html",
        width: 300,
        height: 430,
        data:{svg:svg,svgname:selection.name()},
        hiddenClose: false,
        floatWindow: true,
        identifier: "uploadIcon",
        callback: function( data ){
            var result = uploadIconFunc(data);
            if(result.status == 200){
                NSApp.displayDialog('上传成功');
            }
        }
    });
}