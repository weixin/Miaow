@import "common.js"
@import "svgoco.js"


var BQ = {
	LinearLayout:'LinearLayout',   //group 
	ImageView:'com.tencent.mm.ui.MMImageView',  //group with icon
	TextView:'TextView',   //text
	ProgressBar:'ProgressBar',  //progress
	Button:'Button'  //spical button
}

var Layout = {
	layout_width:'layout_width',
	layout_height:'layout_height',
	paddingLeft:'paddingLeft',
	paddingRight:'paddingRight',
	paddingTop:'paddingTop',
	paddingBottom:'paddingBottom',
	layout_marginTop:'layout_marginTop',
	layout_marginLeft:'layout_marginLeft',
	layout_marginRight:'layout_marginRight',
	layout_marginBottom:'layout_marginBottom',
	background:'',
	text:'',
	minWidth:'',
	maxWidth:'',
	minHeight:'',
	maxWidth:'',	
	orientation:'orientation',
	maxLines:'',
	ellipsize:''
}

var spcialName = ['Actionbar','navigationbar'];

function getCode(layer,doc){
	if(layer.name().indexOf('icon') > -1){
		exportSVG(layer,doc,file);
		return;
	}

	for(var i = 0;i<spcialName.length;i++){
		if(layer.name().indexOf('spcialName') > -1){
			return;
		}
	}

	switch ([layer class]) {

        case MSTextLayer:
       		log(layer);
        break;

        case MSLayerGroup:
        case MSSymbolMaster:
        case MSArtboardGroup:
       		log(layer);
        break;
    }
}

function chooseFilePath(){
	var save = NSSavePanel.savePanel();
	save.setAllowsOtherFileTypes(true);
	save.setExtensionHidden(false);
	if(save.runModal()){
		return save.URL().path();
	}else{
		return false;
	}

}
function writeDirectory(filePath){
	NSFileManager
            .defaultManager()
            .createDirectoryAtPath_withIntermediateDirectories_attributes_error(filePath, true, nil, nil);
}
function writeFile(options){
	var fileName = options.fileName;
	var file = NSString.stringWithString(options.content);
	[file writeToFile:fileName atomically:true encoding:NSUTF8StringEncoding error:null];
}

function minSVG(){
	var parsedSVGOPlugins = [];
	for (var j = 0; j < svgoJSON.plugins.length; j++) {
	var item = svgoJSON.plugins[j];
	var plugin = eval(item.name);
	log('Enabled plugin: ' + item.name);
	plugin.pluginName = item.name;
	plugin.active = true;
	if (plugin.params) {
	  // Plugin supports params
	  log('—› default params: ' + JSON.stringify(plugin.params, null, 2));
	}
	if (item.params != null) {
	  log('—› new params: ' + JSON.stringify(item.params, null, 2));
	  if (plugin.params == undefined) {
	    plugin.params = {};
	  }
	  for (var attrname in item.params) {
	    plugin.params[attrname] = item.params[attrname];
	  }
	  log('—› resulting params: ' + JSON.stringify(plugin.params, null, 2));
	}
	parsedSVGOPlugins.push([plugin]);
	}

	var exports = context.actionContext.exports;
	var filesToCompress = [];
	for (var i = 0; i < exports.count(); i++) {
	var currentExport = exports.objectAtIndex(i);
	if (currentExport.request.format() == 'svg') {
	  filesToCompress.push(currentExport.path);
	}
	}

	if (filesToCompress.length > 0) {
	var originalTotalSize = 0;
	var compressedTotalSize = 0;
	if (svgoJSON.pretty == null) {
	  svgoJSON.pretty = true;
	}
	if (svgoJSON.indent == null) {
	  svgoJSON.indent = 2;
	}
	var svgCompressor = new svgo({
	  full: true,
	  js2svg: {
	    pretty: svgoJSON.pretty,
	    indent: svgoJSON.indent
	  },
	  plugins: parsedSVGOPlugins
	});
	for (var i = 0; i < filesToCompress.length; i++) {
	  var currentFile = filesToCompress[i];
	  var svgString = "" + NSString.stringWithContentsOfFile_encoding_error(currentFile, NSUTF8StringEncoding, nil);
	  originalTotalSize += svgString.length;
	  for (var pluginIndex = 0; pluginIndex < svgCompressor.config.plugins[0].length; pluginIndex++) {
	    var plugin = svgCompressor.config.plugins[0][pluginIndex];
	    if (plugin.pluginName == "cleanupIDs") {
	      var prefix = currentFile.lastPathComponent().stringByDeletingPathExtension().replace(/\s+/g, '-').toLowerCase() + "-";
	      log('Setting cleanupIDs prefix to: ' + prefix);
	      plugin.params['prefix'] = prefix;
	    }
	  }
	  svgCompressor.optimize(svgString, function (result) {
	    compressedTotalSize += result.data.length;
	    NSString.stringWithString(result.data).writeToFile_atomically_encoding_error(currentFile, true, NSUTF8StringEncoding, nil);
	  });
	}
	}
}

function exportSVG(layer,doc,file){
	var slice = MSExportRequest.exportRequestsFromExportableLayer(layer).firstObject();
    slice.scale = '1';
    slice.format = 'svg';
    log(slice);
    var savePath = file + '/svg/' + layer.name() + '.svg';
    doc.saveArtboardOrSlice_toFile(slice, savePath);
    var content = networkRequest([savePath]);
    log(content);
}



	var artboards = context.document.currentPage().artboards();
	var file = chooseFilePath();
	writeDirectory(file);
	for(var i = 0;i < artboards.length;i++){
		var artboard = artboards[i];
		var layers = artboard.layers();
		
		for(var k = 0;k<layers.length;k++){
			getCode(layers[k],context.document,file);
		}
	}
