@import "common.js"
@import "link.js"
@import "commonPreviewJson.js"

function webPreview(context){
	var webPreviewUrl = 'https://sketch.weapi.io';
	function chooseFilePath(){
		var save = NSSavePanel.savePanel();
		save.setAllowsOtherFileTypes(true);
		save.setExtensionHidden(false);
		return save.URL().path()+'/'+(Math.random());
	}
	var filePath = chooseFilePath();
	var flag = commonPreviewJson(context,filePath);
	if(!flag){
		return;
	}
    zip(['-q','-r','-m','-o','-j',filePath+'.zip',filePath]);
    var settingsWindow = COSAlertWindow.new();
    settingsWindow.addButtonWithTitle('确定');
    settingsWindow.addButtonWithTitle('取消');

    settingsWindow.setMessageText('确定将页面传到服务器吗？');
    settingsWindow.setInformativeText('警告，免费服务，作者不承担可能的泄漏风险，你也可以选择导出到本地自行预览');

    if(settingsWindow.runModal() == "1000"){
    	var returnData = networkRequest(['-F','image=@'+filePath+'.zip',iconQueryUrl+'/users/uploadHtml']);
    	var jsonData = [[NSString alloc] initWithData:returnData encoding:NSUTF8StringEncoding];
    	jsonData = JSON.parse(jsonData);
		var pluginSketch = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("library").path();
		SMPanel({
	        url: pluginSketch + "/panel/webPreview.html",
	        width: 280,
	        height: 320,
	        data:{
	        	link:webPreviewUrl+'/'+jsonData.dir+'/index.html'
	        },
	        hiddenClose: false,
	        floatWindow: false,
	        identifier: "preview",
	        callback: function( data ){
                openUrlInBrowser(data.link);
	        },
	        closeCallback: function(){
	        	// NSApp.displayDialog(1);
	        }
	    });
    }
	var fm  =[NSFileManager defaultManager];
    fm.removeItemAtPath_error(filePath,nil);
    fm.removeItemAtPath_error(filePath+'.zip',nil);
}

var onRun = function(context){
	webPreview(context);
}