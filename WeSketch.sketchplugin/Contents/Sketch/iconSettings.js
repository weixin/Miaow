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

function iconRegister(data){
    var r = post(['/users/register','username='+data.username + '&password='+data.password]);
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

function addProject(data){
    var r = post(['/users/createProject','projectname='+data.projectName]);
    return r;
}

function addCategory(data){
    var r = post(['/users/createCategory','projectid='+data.projectId+'&categoryname='+data.categoryName]);
    return r;
}


var onRun = function(context){
    var isLogin;
    var initData = {};
    if(!NSUserDefaults.standardUserDefaults().objectForKey(loginKey) || NSUserDefaults.standardUserDefaults().objectForKey(loginKey).length() != 32){
        isLogin = false;
    }else{
        isLogin = getLogin();
    }
    initData.isLogin = isLogin;
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
        url: pluginSketch + "/panel/iconSetting.html",
        width: 300,
        height: 430,
        data:initData,
        hiddenClose: false,
        floatWindow: true,
        identifier: "iconSetting",
        callback: function( data ){
            if(data.action == 'loginout'){
                NSUserDefaults.standardUserDefaults().setObject_forKey('',loginNameKey);
                NSUserDefaults.standardUserDefaults().setObject_forKey('',loginKey);
            }
        },loginCallback:function( windowObject ){
            var data = JSON.parse(decodeURI(windowObject.valueForKey("SMData")));
            var reuslt;
            if(data.action == 'login'){
                reuslt = iconLogin(data);
            }else if(data.action == 'register'){
                reuslt = iconRegister(data);
            }else if(data.action == 'addProject'){
                if(data.projectName == ''){
                    NSApp.displayDialog('不能为空');
                }else{
                    reuslt = addProject(data);
                    if(reuslt.status == 200){
                        NSApp.displayDialog('创建成功');
                        var project = queryProject().list;
                        windowObject.evaluateWebScript("refurshType("+JSON.stringify(project)+")");
                        windowObject.evaluateWebScript("window.location.hash = '';");
                    }
                }
                return;
            }else if(data.action == 'addCategory'){
                if(data.categoryName == ''){
                    NSApp.displayDialog('不能为空');
                }else{
                    reuslt = addCategory(data);
                    if(reuslt.status == 200){
                        NSApp.displayDialog('创建成功');
                        var project = queryProject().list;
                        windowObject.evaluateWebScript("refurshType("+JSON.stringify(project)+")");
                        windowObject.evaluateWebScript("window.location.hash = '';");

                    }
                }
                return;
            }else if(data.action == 'addMember'){
                var result = addMember(data);
                if(result.status == 200){
                    NSApp.displayDialog('加入项目成功');
                }
                windowObject.evaluateWebScript("refurshType("+JSON.stringify(project)+")");
                windowObject.evaluateWebScript("window.location.hash = '';");
                return;
            }
            if(reuslt.status == 200){
                NSUserDefaults.standardUserDefaults().setObject_forKey(reuslt.sig,loginKey);
                var username = NSUserDefaults.standardUserDefaults().objectForKey(loginNameKey);
                var b = '';
                b += username;
                reuslt.nametest = b;
                reuslt.project = queryProject().list;
                windowObject.evaluateWebScript("sLogin("+JSON.stringify(reuslt)+")");
                windowObject.evaluateWebScript("window.location.hash = '';");
            }
            windowObject.evaluateWebScript("window.location.hash = '';");

        }
    });
}