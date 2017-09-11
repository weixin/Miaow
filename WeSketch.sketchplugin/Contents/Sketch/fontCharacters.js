@import "common.js";

var FontSetKey = "com.sketchplugins.wechat.fontsetkey";


var fontCharacters = function (context) {
    var i18 = _(context).fontCharacters;

    var pluginSketch = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("library").path();
    var options = [[[NSFontManager sharedFontManager] availableFontFamilies]][0];

    var param = [];
    for (var i = 0; i < options.length; i++) {
        param.push(encodeURIComponent(options[i]));
    }
    var initData = {
        fontFamily: param
    };
    var initFamily = NSUserDefaults.standardUserDefaults().objectForKey(FontSetKey);
    if (initFamily) {
        initData.initFamily = encodeURIComponent(initFamily);
    }

    SMPanel({
        url: pluginSketch + "/panel/fontSet.html",
        width: 362,
        height: 548,
        data: initData,
        hiddenClose: false,
        floatWindow: true,
        identifier: "fontSet",
        callback: function (data) {

        },
        pushdataCallback: function (data, windowObject) {
            if (data.action == 'insert') {
                var nowcontext = uploadContext(context);
                if (nowcontext.selection.length == 0) {
                    return NSApp.displayDialog(i18.m1);
                }
                var fontfamily = [NSFont fontWithName: data.fontFamily size: 14.0];
                var layer = nowcontext.selection[0];

                function bzone(d) {
                    if (d.length != 4) {
                        d = '0' + d;
                        return bzone(d);
                    } else {
                        return d;
                    }
                }
                var ustr = '\\u' + bzone(data.chari);
                var obj = '{"ustr": "' + ustr + '"}';
                obj = JSON.parse(obj);
                if (layer.class() == 'MSTextLayer') {
                    if (layer.editingDelegate()) {
                        var range = layer.editingDelegate().textView().selectedRange();
                        layer.editingDelegate().textView().replaceCharactersInRange_withString(range, obj.ustr);
                        var range2 = layer.editingDelegate().textView().selectedRange();
                        range2 = {
                            location: range2.location - 1,
                            length: 1
                        };
                        layer.editingDelegate().textView().setFont_range(fontfamily, range2);
                    } else {
                        var fontSize = layer.fontSize();
                        layer.setFont(fontfamily);
                        layer.setFontSize(fontSize);
                        layer.setStringValue(obj.ustr);
                    }
                } else {
                    NSApp.displayDialog(i18.m1);
                }

                windowObject.evaluateWebScript("window.location.hash = '';");
            } else {

                NSUserDefaults.standardUserDefaults().setObject_forKey(data.fontFamily, FontSetKey);

                var font = [NSFont fontWithName: data.fontFamily size: 14.0];
                var set = [font coveredCharacterSet];
                var chari = [];
                for (var i = 0; i <= 0xffff; i++) {
                    if ([set characterIsMember: i]) {
                        chari.push(i);
                    }
                }
                windowObject.evaluateWebScript("pushdata(" + JSON.stringify(chari) + ")");
                windowObject.evaluateWebScript("window.location.hash = '';");
            }
        }
    });
    var ga = new Analytics(context);
    if (ga) ga.sendEvent('fontCharacters', 'open');
}

var onRun = function (context) {
    fontCharacters(context);
}