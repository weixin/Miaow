@import "common.js"
@import "organizer.js"
var importUrlKey = "com.sketchplugins.wechat.importuikiturl";

var onRun = function(context){

  function isSame(a,b){
    var layers = a.layers();
    if(layers.count() != b.layers().count()){
      return false;
    }
    // if(a.rect() && b.rect() && a.rect().toString() != b.rect().toString()){
    //  return false;
    // }
    for(var i = 0;i < layers.count(); i++){
      var layer = layers[i];

      //名字顺序也会变
      if(encodeURIComponent(layer.name()) != encodeURIComponent(b.layers()[i].name())){
        return false;
      }
      if(encodeURIComponent(layer.rect().toString()) != encodeURIComponent(b.layers()[i].rect().toString())){
        return false;
      }
      
      if(layer.class() == 'MSTextLayer'){
        if(encodeURIComponent(layer.textColor().toString()) != encodeURIComponent(b.layers()[i].textColor().toString()) || encodeURIComponent(layer.font()) != encodeURIComponent(b.layers()[i].font()) || encodeURIComponent(layer.stringValue().trim()) != encodeURIComponent(b.layers()[i].stringValue().trim())){
          return false;
        }
      }
      // if(layer.class() == 'MSRectangleShape' || layer.class() == 'MSOvalShape' || layer.class() == 'MSShapePathLayer'){
        
      // }
      if(layer.class() == 'MSLayerGroup' && layer.style().fills().count() != 0){
        if(encodeURIComponent(layer.style().fills()[0].color().toString()) != encodeURIComponent(b.layers()[i].style().fills()[0].color().toString())){
          return false;
        }
      }
      if(layer.class() == 'MSLayerGroup' || layer.class() ==  'MSShapeGroup'){
        var boolChild = isSame(layer,b.layers()[i]);
        if(!boolChild){
          return false;
        }
      }
      
    }
    return true;
    
  }

  var i18 = _(context).importUIkit;

  var doc = context.document;
  var app = NSApp.delegate();
  var panel = [NSOpenPanel openPanel];
  var getLocal = NSUserDefaults.standardUserDefaults().objectForKey(importUrlKey);
  if(getLocal){
    [panel setDirectoryURL:[NSURL URLWithString:getLocal]];
  }
  [panel setCanChooseDirectories:false];
  [panel setCanCreateDirectories:false];
  panel.setAllowedFileTypes([@"sketch"]);
  panel.setAllowsOtherFileTypes(false);
  panel.setExtensionHidden(false);

  var clicked = [panel runModal];
  if (clicked != NSFileHandlingPanelOKButton) {
    return;
  }
  var firstURL = [[panel URLs] objectAtIndex:0];
  var unformattedURL = [NSString stringWithFormat:@"%@", firstURL];
  var file_path = [unformattedURL stringByRemovingPercentEncoding];
  var urlSave = file_path.replace('file:///','');
  urlSave = urlSave.substr(0,urlSave.lastIndexOf('/'));
  NSUserDefaults.standardUserDefaults().setObject_forKey(urlSave, importUrlKey);

  var saveArtBoard = [];
  var sourceDoc = MSDocument.new();
  if(sourceDoc.readFromURL_ofType_error(NSURL.fileURLWithPath(panel.URL().path()), "com.bohemiancoding.sketch.drawing", nil)) {
      var doc = context.document;
      var savePage;
      var pages = doc.pages();

      var sourcePages = sourceDoc.documentData().pages();

      var addSymbolCount = 0;
      var addPageCount = 0;

      var firstSymbols = false;
      var deleteFlag = [];

      for(var i=0;i<sourcePages.count();i++){
        if(sourcePages[i].name() != 'Symbols' && firstSymbols == false){
          continue;
        }
        if(sourcePages[i].name() == 'Symbols' && firstSymbols == true){
          continue;
        }
        // context.document.removePage(pages[i]);
        var saveArtBoard2 = [];
        var sourcePageName = sourcePages[i].name();
        var sourceSymbol = sourcePages[i].artboards();

        var flagForOldPage = false;
        var nowK = k;
        for(var k=0;k<pages.count();k++){
          //如果有同一个page名
          if(encodeURIComponent(pages[k].name().trim()) == encodeURIComponent(sourcePageName.trim())){
            deleteFlag.push(pages[k]);
            flagForOldPage = true;

            //比对一下
            var localSymobl = pages[k].artboards();
            var deleteObject = {};
            var pushAllArtboards = [];

            for(var f=0;f<sourceSymbol.count();f++){
              var s = sourceSymbol[f];
              var flagForNewSymbol = false;
              for(var g=0;g<localSymobl.count();g++){
                if(encodeURIComponent(s.name().trim()) == encodeURIComponent(localSymobl[g].name().trim())){
              
                  
                  flagForNewSymbol = true;

                  // 找出相同名字的，内容相同不处理，内容不同，使用source的，并把local的放到save
                  if(!isSame(s,localSymobl[g])){
                    //添加现在画布上的到冲突
                    saveArtBoard.push(localSymobl[g]);
                    //删除画布上的
                    // localSymobl[g].moveToLayer(saveArtBoard);
                    // localSymobl[g].removeFromParent();
                    //添加线上的到画布
                    // pushAllArtboards.push(s);
                  }
                  deleteObject['g_'+g] = true;
                  break;
                }
              }
              if(!flagForNewSymbol){
                //没找着，直接添加source的到现有的画布
                // saveArtBoard2.push(s);
                // pushAllArtboards.push(s);
                
                addSymbolCount++;
              }
            }
            //线上源中没找着，直接添加source的到冲突画布
            for(var g=0;g<localSymobl.count();g++){
              if(!deleteObject['g_'+g]){
                saveArtBoard.push(localSymobl[g]);
                // localSymobl[g].removeFromParent();
              }
            }

            // 这里全部换一种实现，先将冲突提出来换到冲突画板，然后把整张画布删除再copy一份
            // pages[k].addLayers(pushAllArtboards);

            break;
          }
        }
        

        if(!flagForOldPage){
          addPageCount++; 
        }
        var newPage = doc.addBlankPage();
        newPage.setName(sourcePageName);
        newPage.addLayers(sourceSymbol);
        // newPage.addLayers(saveArtBoard2);
        doc.setCurrentPage(doc.documentData().symbolsPageOrCreateIfNecessary());
        if(sourcePages[i].name() == 'Symbols'){
          firstSymbols = true;
          i = -1;
        }
      }
      for(var i = 0;i<deleteFlag.length;i++){
        context.document.removePage(deleteFlag[i]);
      }
  }
  sourceDoc.close();
  sourceDoc = nil;
  var alertData = (i18.m1+ addPageCount + i18.m2 +'，' + addSymbolCount + i18.m3 + '，');
  if(saveArtBoard.length != 0){
    alertData += (i18.m4 + saveArtBoard.length + i18.m5);
  }
  alertData += (i18.m6+'！');
  if(addPageCount == 0 && addSymbolCount == 0 && saveArtBoard.length == 0){
    alertData = (i18.m7+'！');
  }
  if(saveArtBoard.length>0){
    var savePage = doc.addBlankPage();
    savePage.setName(i18.m8);
    for(var i=0;i<saveArtBoard.length;i++){
      saveArtBoard[i].setName(saveArtBoard[i].name()+ '(Old)');
      saveArtBoard[i].moveToLayer_beforeLayer(savePage,savePage);
    }
    doc.setCurrentPage(savePage);
    Organizer(context);
  }
  if(context.document.pages()[0].children().count() == 1){
    context.document.removePage(context.document.pages()[0]);
  }

  context.document.showMessage(alertData);
}
