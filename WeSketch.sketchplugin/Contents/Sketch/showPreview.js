@import "common.js"
@import "link.js"
@import "commonPreviewJson.js"

function showPreview(context) {
	var i18 = _(context).webPreview;
	context.document.showMessage(i18.m5);

	function chooseFilePath() {
		var save = NSSavePanel.savePanel();
		save.setAllowsOtherFileTypes(true);
		save.setExtensionHidden(false);
		return save.URL().path() + '/' + (Math.random());
	}
	var filePath = chooseFilePath();
	var flag = commonPreviewJson(context, filePath, true);
	if (!flag) {
		return;
	}
	var fx;
	var width = 414;
	var height = 716;
	function chooseDialog() {
		var settingsWindow = dialog(context);
		settingsWindow.addButtonWithTitle('确定');
		settingsWindow.addButtonWithTitle('取消');

		settingsWindow.setMessageText('请选择预览尺寸');

		var ButtonList = ['iPhone 6P', 'iPhone 6'];

		fx = createRadioButtons(ButtonList, 0);
		settingsWindow.addAccessoryView(fx);
		return settingsWindow.runModal();
	}
	if(chooseDialog() == '1000'){
		fx = fx.selectedCell();
		var index = [fx tag];
		if (index == 1) {
			width = 375;
			height = 647;
		}


		var pluginSketch = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("library").path();
		SMPanel({
			url: filePath+'/index.html',
			width: width,
			height: height,
			hiddenClose: false,
			floatWindow: false,
			identifier: "preview",
			callback: function (data) {
			},
			closeCallback: function () {
				var fm = [NSFileManager defaultManager];
				fm.removeItemAtPath_error(filePath, nil);
			}
		});
	}
	var ga = new Analytics(context);
	if (ga) ga.sendEvent('showPreview', 'preview');

}

var onRun = function (context) {
	showPreview(context);
}