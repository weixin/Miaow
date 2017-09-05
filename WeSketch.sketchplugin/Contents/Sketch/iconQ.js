@import "common.js";

function iconQ(context){
    var i18 = _(context).iconQ;

    var usualKey = "com.sketchplugins.wechat.iconusual";
    var loginKey = "com.sketchplugins.wechat.iconLogin";
    var loginNameKey = "com.sketchplugins.wechat.iconLoginName";
    var iconSaveKey = "com.sketchplugins.wechat.baseicon";
    var iconVersionKey = "com.sketchplugins.wechat.baseiconversion";
    var projectChooseKey = "com.sketchplugins.wechat.saveprojectchoose";
    var categoryChooseKey = "com.sketchplugins.wechat.savecategorychoose";
    var sig = NSUserDefaults.standardUserDefaults().objectForKey(loginKey);

    var returnData = networkRequest([getConfig('config',context).VERSION])
    var jsonData = [[NSString alloc] initWithData:returnData encoding:NSUTF8StringEncoding];
    jsonData = JSON.parse(jsonData);
    var currentVersion = jsonData.currentIconVersion;

    function choiceSVG(context){
        var svgList = [];
        for(var i = 0;i<context.selection.count();i++){
            var rect;
            if(context.selection[i].className() == 'MSArtboardGroup' || context.selection[i].className() == 'MSLayerGroup'){
                var sketch = context.api();
                var myStyle = new sketch.Style()
                myStyle.fills = ['rgba(255,255,255,0)'];
                myStyle.borders = ['rgba(255,255,255,0)'];
                sketch.selectedDocument.selectedPage.newShape({frame: new sketch.Rectangle(context.selection[i].absoluteRect().x(), context.selection[i].absoluteRect().y(), context.selection[i].rect().size.width, context.selection[i].rect().size.height), style:myStyle,name:'__tc__'+context.selection[i].objectID()});
                var child = context.document.currentPage().children();
                for(var k = 0 ;k < child.length;k++){
                    if(child[k].name() == '__tc__' + context.selection[i].objectID()){
                        child[k].moveToLayer_beforeLayer(context.selection[i],context.selection[i]);
                        child[k].select_byExpandingSelection(false,false);
                        rect = child[k];
                        break;
                    }
                }
                var flagk = 0;
                for(var k = 0;k < context.selection[i].layers().length;k++){
                    if(context.selection[i].layers()[flagk].name() != '__tc__' + context.selection[i].objectID()){
                        context.selection[i].layers()[flagk].moveToLayer_beforeLayer(context.selection[i],context.selection[i]);
                    }else{
                        flagk ++;
                    }
                }
            }
            var slice = MSExportRequest.exportRequestsFromExportableLayer(context.selection[i]).firstObject();
            slice.scale = '1';
            slice.format = 'svg';
            var save = NSSavePanel.savePanel();
            var savePath = save.URL().path() + '.svg';
            context.document.saveArtboardOrSlice_toFile(slice, savePath);
            var content = NSData.dataWithContentsOfURL(NSURL.URLWithString('file:///'+encodeURIComponent(savePath)));
            var string = [[NSString alloc] initWithData:content encoding:NSUTF8StringEncoding];
            svgList.push({content:encodeURIComponent(string),name:(encodeURIComponent(context.selection[i].name().toString().replace(/\s+/g,'_')))});
            var fm  =[NSFileManager defaultManager];
            fm.removeItemAtPath_error(savePath,nil);
            if(context.selection[i].className() == 'MSArtboardGroup' || context.selection[i].className() == 'MSLayerGroup'){
                rect.removeFromParent();
            }
        }
        return svgList;
    }

    function getSvg(){
        return post(['/users/getFiles']);
    }

    function queryProjectIcon(projectid){
       var r = post(['/users/queryIconByProId','projectid='+projectid]);
       return r;
    }

    function queryTypeIcon(categoryid){
       var r = post(['/users/queryIconByCateId','categoryid='+categoryid]);
       return r;
    }

    function iconLogin(data){
        var r = post(['/users/login','username='+data.username + '&password='+data.password]);
        if(r.status == 200){
            NSUserDefaults.standardUserDefaults().setObject_forKey(data.username,loginNameKey);
        }
        return r;
    }

    function iconRegister(data){
        var r = post(['/users/register','username='+data.username + '&password='+data.password + '&mail='+data.mail]);
        if(r.status == 200){
            NSUserDefaults.standardUserDefaults().setObject_forKey(data.username,loginNameKey);
        }
        return r;
    }

    function addMember(data){
        var r = post(['/users/addMember','key='+data.invitedKey]);
        return r;
    }

    function getLogin(){
        return post(['/users/login']);
    }

    function queryProject(){
        var r = post(['/users/queryProject']);
        return r;
    }

    function version_check(data){
        var r = post(['/users/version_check','projectid='+data.projectid + '&list='+JSON.stringify(data.list)]);
        return r;
    }


    function uploadIconFunc(data){
        return post(['/users/single_upload','name='+data.name + '&content='+ data.content + '&projectid=' + data.project + '&categoryid=' + data.type + '&author='+data.author ]);
    }

    function uploadIconsFunc(data){
        return post(['/users/batch_upload','list='+JSON.stringify(data)]);
    }

    function addProject(data){
        return post(['/users/createProject','projectname='+data.projectName]);
    }

    function deleteProject(data){
        return post(['/users/deleteProject','projectid='+data.projectid]);
    }

    function queryIconByName(data){
        return post(['/users/queryIconByName','name='+data.name + '&projectid='+data.projectid]);
        
    }

    function addCategory(data){
        return post(['/users/createCategory','projectid='+data.projectId+'&categoryname='+data.categoryName]);
    }

    function deleteIcon(data){
        return post(['/users/deleteIcon','list='+JSON.stringify([data])]);
    }

    function downloadZip(data){
        return get(['/users/createZip','projectid=' + data.projectId + '&id='+encodeURIComponent(JSON.stringify(data.ids)]));
    }

    var svgtitle = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>';

    var pluginSketch = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("library").path();

    var baseSvg;
    if(!NSUserDefaults.standardUserDefaults().objectForKey(iconSaveKey) || NSUserDefaults.standardUserDefaults().objectForKey(iconVersionKey) != currentVersion){
        baseSvg = getSvg().data;
        NSUserDefaults.standardUserDefaults().setObject_forKey(currentVersion,iconVersionKey);
        NSUserDefaults.standardUserDefaults().setObject_forKey(baseSvg,iconSaveKey);
    }else{
        baseSvg = NSUserDefaults.standardUserDefaults().objectForKey(iconSaveKey);
        var encodeBaseSvg = [];
        for (var i = 0; i < baseSvg.length; i++) {
            encodeBaseSvg.push({
                author:decodeURIComponent(encodeURIComponent(baseSvg[i].author)),
                content:decodeURIComponent(encodeURIComponent(baseSvg[i].content)),
                name:decodeURIComponent(encodeURIComponent(baseSvg[i].name))
            })
        };
        baseSvg = encodeBaseSvg;
    }
    

    var isLogin;
    if(!NSUserDefaults.standardUserDefaults().objectForKey(loginKey) || NSUserDefaults.standardUserDefaults().objectForKey(loginKey).length()  != 32){
        isLogin = false;
    }else{
        isLogin = getLogin();
    }
     

    var initData = {data:baseSvg,isLogin:isLogin,i18:i18};
    if(isLogin == false || isLogin.status != 200){
        initData.isLogin = false;
    }else{
        var username = NSUserDefaults.standardUserDefaults().objectForKey(loginNameKey);
        var b = '';
        b += username;
        initData.nametest = b;
        var project = queryProject().list;
        initData.project = project;
        initData.chooseProject = encodeURIComponent(NSUserDefaults.standardUserDefaults().objectForKey(projectChooseKey) || '');
        initData.chooseCategory = encodeURIComponent(NSUserDefaults.standardUserDefaults().objectForKey(categoryChooseKey) || '');
        
        initData.isLogin = true;
    }


    SMPanel({
        url: pluginSketch + "/panel/icon.html",
        width: 560,
        height: 580,
        data: initData,
        hiddenClose: false,
        floatWindow: true,
        identifier: "icon",
        callback: function( data ){
            if(data.type == 'link'){
                openUrlInBrowser(data.link);
                return;
            }else if(data.type == 'public' || data.type == 'private'){
                var nowcontext = uploadContext(context);
                var page = nowcontext.document.currentPage();
                data.name = data.name.replace('.svg','');
                page.setCurrentArtboard(null);
                var contentDrawView = nowcontext.document.currentView();
                var midX = parseInt(Math.round((contentDrawView.frame().size.width/2 - contentDrawView.horizontalRuler().baseLine())/contentDrawView.zoomValue()));
                var midY = parseInt(Math.round((contentDrawView.frame().size.height/2 - contentDrawView.verticalRuler().baseLine())/contentDrawView.zoomValue()));
                var x = parseInt(midX - data.width/2);
                var y = parseInt(midY - data.height/2);
                var logo = (data.content);
                logo = svgtitle + logo.replace('xmlns="http://www.w3.org/2000/svg"','version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"').replace(/<title>.*?<\/title>/,'');
                logo = NSString.stringWithString(logo);
                logo = [logo dataUsingEncoding: NSUTF8StringEncoding];
                var svgImporter = MSSVGImporter.svgImporter();
                svgImporter.prepareToImportFromData(logo);
                var importedSVGLayer = svgImporter.importAsLayer();
                var svgFrame = importedSVGLayer.frame();
                importedSVGLayer.name = data.name;
                var oldWidth = svgFrame.width();
                var oldHeight = svgFrame.height();
                [svgFrame setWidth:data.width];
                svgFrame.setHeight(data.width*oldHeight/oldWidth);
                if(data.type == 'public'){
                    var children = importedSVGLayer.children();
                    var colorToReplace = hexToRgb(data.color);
                    for(var j = 0;j<children.length;j++){
                        if(children[j].className() == 'MSShapeGroup'){
                            var fill = children[j].style().fills().firstObject();
                            fill.color = MSColor.colorWithRed_green_blue_alpha(colorToReplace.r / 255, colorToReplace.g / 255, colorToReplace.b / 255, 1.0);
                        }
                    }
                }else{

                }
                [svgFrame setX:x];
                [svgFrame setY:y];
                page.addLayers([importedSVGLayer]);
                if(nowcontext.selection.length>0){
                    [svgFrame setX:nowcontext.selection[0].absoluteRect().x()];
                    [svgFrame setY:nowcontext.selection[0].absoluteRect().y()];
                    nowcontext.document.showMessage(i18.m1+ ' ' +nowcontext.selection[0].name());

                    for(var i = 0;i<nowcontext.selection.length;i++){
                        nowcontext.selection[i].select_byExpandingSelection(false,false);
                    }
                }else{
                    nowcontext.document.showMessage(i18.m2);
                }
                importedSVGLayer.select_byExpandingSelection(true, true);
            }else if(data.type == 'loginout'){
                NSUserDefaults.standardUserDefaults().setObject_forKey('',loginNameKey);
                NSUserDefaults.standardUserDefaults().setObject_forKey('',loginKey);
                NSUserDefaults.standardUserDefaults().setObject_forKey('',categoryChooseKey);
                NSUserDefaults.standardUserDefaults().setObject_forKey('',projectChooseKey);
            }else if(data.type == 'code'){
                paste(data.code);
                NSApp.displayDialog(i18.m17+ data.code +i18.m18);
            }else if(data.type == 'share'){
                var d = downloadZip(data);
                var address = 'http://sketch.weapi.io:3000/users/downloadZip?' + 'svgname=' + d.data.svgZipName + '&' + 'pngname=' + d.data.pngZipName + '&' + 'remark=' + (data.message);
                paste(address);
                NSApp.displayDialog(i18.m19 + address + i18.m18);
            }else if(data.type == 'displayDialog'){
                NSApp.displayDialog(data.data);
            }
        },loginCallback:function(data,windowObject){
            var result;
            if(data.action == 'login'){
                result = iconLogin(data);
            }else if(data.action == 'register'){
                result = iconRegister(data);
            }else if(data.action == 'addProject'){
                if(data.projectName == ''){
                    windowObject.evaluateWebScript("window.location.hash = '';");
                    return NSApp.displayDialog(i18.m20);
                }else{
                    result = addProject(data);
                    if(result.status == 200){
                        NSApp.displayDialog(i18.m21);
                    }
                }
            }else if(data.action == 'addCategory'){
                if(data.categoryName == ''){
                    windowObject.evaluateWebScript("window.location.hash = '';");
                    return NSApp.displayDialog(i18.m20);
                }else{
                    result = addCategory(data);
                    if(result.status == 200){
                        NSApp.displayDialog(i18.m21);
                    }
                }
            }else if(data.action == 'addMember'){
                if(data.invitedKey == ''){
                    windowObject.evaluateWebScript("window.location.hash = '';");
                    return NSApp.displayDialog(i18.m20);
                }else{
                    result = addMember(data);
                    if(result.status == 200){
                        NSApp.displayDialog(i18.m21);
                    }
                }
            }else if(data.action == 'deleteProject'){
                var settingsWindow = COSAlertWindow.new();
                settingsWindow.addButtonWithTitle(i18.m28);
                settingsWindow.addButtonWithTitle(i18.m29);

                settingsWindow.setMessageText(i18.m67);
                settingsWindow.setInformativeText(i18.m69);

                if(settingsWindow.runModal() == "1000"){
                    var result = deleteProject(data);
                    if(result.status == 200){
                        NSApp.displayDialog(i18.m68);
                    }
                }else{
                    return;
                }
            }
            if(result.status == 200){
                if(result.sig){
                    NSUserDefaults.standardUserDefaults().setObject_forKey(result.sig,loginKey);
                    var username = NSUserDefaults.standardUserDefaults().objectForKey(loginNameKey);
                    var b = '';
                    b += username;
                    result.nametest = b;
                }
                var project = queryProject().list;
                result.project = project;
                windowObject.evaluateWebScript("sLogin("+JSON.stringify(result)+")");
                windowObject.evaluateWebScript("window.location.hash = '';");
            }else{
                windowObject.evaluateWebScript("window.location.hash = '';");
            }
        },pushdataCallback:function(data ,windowObject ){
            if(data.action == 'boardsvg'){
                var newContext = uploadContext(context);
                if(newContext.selection.length == 0){
                    windowObject.evaluateWebScript("window.location.hash = '';");
                    return NSApp.displayDialog(i18.m22);
                }
                var svg = choiceSVG(newContext);
                var namelist = [];
                for(var i = 0;i<svg.length;i++){
                    namelist.push(svg[i].name);
                }
                var version = version_check({projectid:data.projectid,list:namelist}).list;

                for(var i = 0;i<version.length;i++){
                    svg[i].version = version[i].version;
                }

                windowObject.evaluateWebScript("boardsvg("+JSON.stringify(svg)+")");
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
                var svg = [];
                for(var i = 0;i<urls.length;i++){
                    var unformattedURL = [NSString stringWithFormat:@"%@", urls[i]];
                    var file_path = [unformattedURL stringByRemovingPercentEncoding];
                    var theResponseData = request(file_path)
                    var theText = [[NSString alloc] initWithData:theResponseData encoding:NSUTF8StringEncoding];

                    svg.push({
                        content:encodeURIComponent(theText),
                        name:file_path.substr(file_path.lastIndexOf('/')+1).replace('.svg','')
                    })
                }
                var namelist = [];
                for(var i = 0;i<svg.length;i++){
                    namelist.push(svg[i].name);
                }
                var version = version_check({projectid:data.projectid,list:namelist}).list;
                for(var i = 0;i<version.length;i++){
                    svg[i].version = version[i].version;
                }

                windowObject.evaluateWebScript("filesvg("+JSON.stringify(svg)+")");
                windowObject.evaluateWebScript("window.location.hash = '';");
            }else if(data.action == 'version'){
                var version = version_check(data);
                windowObject.evaluateWebScript("versionCheck("+JSON.stringify(version.list)+")");
                windowObject.evaluateWebScript("window.location.hash = '';");

            }else if(data.action == 'upload'){
                function upload(uploaddata){
                    for(var i = 0;i<uploaddata.length;i++){
                        uploaddata[i].name = encodeURIComponent(uploaddata[i].name);
                        uploaddata[i].content = encodeURIComponent(uploaddata[i].content);
                    }
                    var result = uploadIconsFunc(uploaddata);
                    if(result.status == 200){
                        NSApp.displayDialog(i18.m23);
                    }
                    return result;
                }
                if(data.version > 0){
                    var settingsWindow = COSAlertWindow.new();
                    settingsWindow.addButtonWithTitle(i18.m24);
                    settingsWindow.addButtonWithTitle(i18.m25);
                    settingsWindow.setMessageText(i18.m26);
                    settingsWindow.addTextLabelWithValue(data.version+i18.m27);
                    var runModals = settingsWindow.runModal();
                    if(runModals == '1000'){
                        var uploadReturn = upload(data.data);
                        windowObject.evaluateWebScript("uploadReturn("+JSON.stringify(uploadReturn)+")");
                        windowObject.evaluateWebScript("window.location.hash = '';");
                    }
                }else{
                    var uploadReturn = upload(data.data);
                    windowObject.evaluateWebScript("uploadReturn("+JSON.stringify(uploadReturn)+")");
                    windowObject.evaluateWebScript("window.location.hash = '';");
                }
            }else if(data.action == 'history'){
                var result = queryIconByName(data);
                windowObject.evaluateWebScript("pushdata3("+JSON.stringify(result)+")");
                windowObject.evaluateWebScript("window.location.hash = '';");

            }else if(data.action == 'delete'){
                var settingsWindow = COSAlertWindow.new();
                settingsWindow.addButtonWithTitle(i18.m28);
                settingsWindow.addButtonWithTitle(i18.m29);
                settingsWindow.setMessageText(i18.m30);

                var response = settingsWindow.runModal();
                if (response == "1000") {
                    deleteIcon(data.deleteid);
                    var result = queryProjectIcon(data.projectid);
                    windowObject.evaluateWebScript("pushdata("+JSON.stringify(result)+")");
                    windowObject.evaluateWebScript("window.location.hash = '';");
                }
            }
            else{
                var result = {};
                if(data.type == 'type'){
                    result = queryTypeIcon(data.id);
                    NSUserDefaults.standardUserDefaults().setObject_forKey(data.pid,categoryChooseKey);
                    NSUserDefaults.standardUserDefaults().setObject_forKey(data.id,categoryChooseKey);
                }else{
                    result = queryProjectIcon(data.id);
                    NSUserDefaults.standardUserDefaults().setObject_forKey('',categoryChooseKey);
                    NSUserDefaults.standardUserDefaults().setObject_forKey(data.id,projectChooseKey);
                }
                windowObject.evaluateWebScript("pushdata("+JSON.stringify(result)+")");
                windowObject.evaluateWebScript("window.location.hash = '';");
            }

        }
    });
}

var iconQRun = function(context){
    iconQ(context);
}