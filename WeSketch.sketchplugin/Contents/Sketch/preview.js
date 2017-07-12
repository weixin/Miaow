@import "common.js"

function previewHtml(){
	var nonbounce = function (elems) {
	    var cont;
	    var startY;
	    var idOfContent = "";
	    nonbounce_touchmoveBound = false;
	    var isContent = function (elem) {
	        var id = elem.getAttribute("id");
	        while (id !== idOfContent && elem.nodeName.toLowerCase() !== "body") {
	            elem = elem.parentNode;
	            id = elem.getAttribute("id")
	        }
	        return (id === idOfContent)
	    };
	    var touchstart = function (evt) {
	        if (!isContent(evt.target)) {
	            evt.preventDefault();
	            return false
	        }
	        startY = (evt.touches) ? evt.touches[0].screenY : evt.screenY
	    };
	    var touchmove = function (evt) {
	        var elem = evt.target;
	        var y = (evt.touches) ? evt.touches[0].screenY : evt.screenY;
	        if (cont.scrollTop === 0 && startY <= y) {
	            evt.preventDefault()
	        }
	        if (cont.scrollHeight - cont.offsetHeight === cont.scrollTop && startY >= y) {
	            evt.preventDefault()
	        }
	    }
	    if (typeof elems === "string") {
	        cont = document.getElementById(elems);
	        if (cont) {
	            idOfContent = cont.getAttribute("id");
	            window.addEventListener("touchstart", touchstart, false)
	        }
	    }
	    if (!nonbounce_touchmoveBound) {
	        window.addEventListener("touchmove", touchmove, false)
	    }
	};
	nonbounce("content");
}

var onRun = function(context){

	function exportSVG(layer,context,file,fileName,scale){
		// 去头 算了不去了
		var slice = MSExportRequest.exportRequestsFromExportableLayer(layer).firstObject();
	    slice.scale = scale;
	    slice.format = 'png';
	    var savePath = file + '/images/' + fileName + '.png';
	    context.document.saveArtboardOrSlice_toFile(slice, savePath);
	    linkJson[fileName] = {};
	    linkJson[fileName].image = fileName;
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

	var filePath = chooseFilePath();
	writeDirectory(filePath);
	var scale = 1;
	var linkJson = {};

	var nowPage = context.document.currentPage();
	var artBoards = nowPage.artboards();
	for(var i = 0;i<artBoards.length;i++){
		var width = artboard.size().width;
		if(size == 320 || size == 414 || size == 375){
			scale = 2;
		}
		var fileName = 'page';
		exportSVG(artBoards[i],context,filePath,fileName+'1',scale);
		exportLink(artBoards[i],context);
	}
}