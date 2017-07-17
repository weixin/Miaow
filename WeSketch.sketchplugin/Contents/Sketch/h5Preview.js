@import "common.js"
@import "link.js"
@import "commonPreview.js"

function h5Preview(context){
	function chooseFilePath(){
		var save = NSSavePanel.savePanel();
		save.setAllowsOtherFileTypes(true);
		save.setExtensionHidden(false);
		return save.URL().path()+'/'+(Math.random());
	}
	var filePath = chooseFilePath();
	commonCodeJson(context,filePath);
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
	        url: pluginSketch + "/panel/preview.html",
	        width: 240,
	        height: 280,
	        data:{
	        	link:iconQueryUrl.replace(':3000','')+'/'+jsonData.dir+'/index.html'
	        },
	        hiddenClose: false,
	        floatWindow: true,
	        identifier: "preview",
	        callback: function( data ){
                openUrlInBrowser(data.link);
	        }
	    });
    }
	var fm  =[NSFileManager defaultManager];
    fm.removeItemAtPath_error(filePath,nil);
    fm.removeItemAtPath_error(filePath+'.zip',nil);
}

var onRun = function(context){
	h5Preview(context);
}