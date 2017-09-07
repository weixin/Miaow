@import 'common.js';
@import 'flag.js';
@import 'link.js';
@import 'fontReplace.js';
@import 'fontCharacters.js';
@import 'textReplace.js';
@import 'colorReplace.js';
@import 'iconQ.js';
@import 'syncUIkit.js';
@import 'syncColor.js';
@import 'exportSlice.js';
@import 'codeStyle.js';
@import 'codeColor.js';
@import 'previewToolbar.js';
@import 'sortingLayers.js';


function toolbar(context,auto){
    var i18 = _(context).toolbar;
    var i18nKey = "com.sketchplugins.wechat.i18n";
    var lang = NSUserDefaults.standardUserDefaults().objectForKey(i18nKey);
    var prefix = '-'+lang.toString();

    var toolbarAutoShow = "com.sketchplugins.wechat.toolbarautoshow";
    var toolbarAuto = NSUserDefaults.standardUserDefaults().objectForKey(toolbarAutoShow) || '';


    var pluginSketch = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("library");

    function getImage(size, name){
        var isRetinaDisplay = NSScreen.mainScreen().backingScaleFactor() > 1? true: false;
        var suffix = isRetinaDisplay? '@2x': '';
        var imageURL = pluginSketch.URLByAppendingPathComponent("toolbar").URLByAppendingPathComponent(name + suffix + '.png');
        var image = NSImage.alloc().initWithContentsOfURL(imageURL);
        return image
    }
    function addImage(rect, name){
        var view = NSImageView.alloc().initWithFrame(rect),
            image = getImage(rect.size, name);
        view.setImage(image);
        return view;
    }
    function addButton(rect, name, callAction){
        var button = NSButton.alloc().initWithFrame(rect),
            image = getImage(rect.size, name);
        button.setImage(image);
        button.setBordered(false);
        button.sizeToFit();
        button.setButtonType(NSMomentaryChangeButton)
        button.setCOSJSTargetFunction(callAction);
        button.setAction("callAction:");
        return button;
    }

    var manifestPath = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("manifest.json").path(),
        manifest = NSJSONSerialization.JSONObjectWithData_options_error(NSData.dataWithContentsOfFile(manifestPath), NSJSONReadingMutableContainers, nil),
        commands = manifest.commands;

    var obj = [];
    for(var i = 0;i < commands.length;i++){
        if(commands[i].istool == 'true'){
            obj.push(commands[i].identifier);
        }
    }

    var identifier = "com.sketchplugins.wechat.toolbar",
        threadDictionary = NSThread.mainThread().threadDictionary(),
        Toolbar = threadDictionary[identifier];

    if(!Toolbar){
        coscript.setShouldKeepAround(true);
        Toolbar = NSPanel.alloc().init();
        Toolbar.setStyleMask(NSTitledWindowMask + NSFullSizeContentViewWindowMask);
        Toolbar.setBackgroundColor(NSColor.colorWithRed_green_blue_alpha(0.92, 0.92, 0.92, 1));
        Toolbar.setTitleVisibility(NSWindowTitleHidden);
        Toolbar.setTitlebarAppearsTransparent(true);


        var toolbarwidth = (obj.length * 53) + 52;

        var locationx = 0;
        if(!auto){
            var view = context.document.currentView();
            locationx = view.frame().size.height - 5;
        }else{
            // locationx = 300;
            locationx = NSScreen.mainScreen().frame().size.height - 162;
        }   
        
        Toolbar.setFrame_display(NSMakeRect(285, locationx, toolbarwidth, 65), false);
        Toolbar.setMovableByWindowBackground(true);
        Toolbar.becomeKeyWindow();
        Toolbar.setLevel(NSFloatingWindowLevel);
        obj = obj.join(',');


        var contentView = Toolbar.contentView();
        var closeButton = addButton( NSMakeRect(20, 36, 18, 18), "close",
                    function(sender){
                        coscript.setShouldKeepAround(false);
                        threadDictionary.removeObjectForKey(identifier);
                        Toolbar.close();
                        if(toolbarAuto != 'false'){
                            var settingsWindow = COSAlertWindow.new();
                            settingsWindow.addButtonWithTitle(i18.m1);
                            settingsWindow.addButtonWithTitle(i18.m2);
                            settingsWindow.setMessageText(i18.m3);
                            settingsWindow.addTextLabelWithValue(i18.m4);
                            settingsWindow.addTextLabelWithValue(i18.m5);
                            var response = settingsWindow.runModal();
                            if (response == "1000") {
                                NSUserDefaults.standardUserDefaults().setObject_forKey('true',toolbarAutoShow);
                            }else{
                                NSUserDefaults.standardUserDefaults().setObject_forKey('false',toolbarAutoShow);
                            }
                        }
                    });
        contentView.addSubview(closeButton);

        var wikiButton = addButton( NSMakeRect(22, 10, 14, 14), "wiki",
                    function(sender){
                        openUrlInBrowser('https://github.com/weixin/wesketch/wiki');
                    });
        contentView.addSubview(wikiButton);

        var xlocation = 46;

        if(obj.indexOf('link') > -1){
            var linkButton = addButton( NSMakeRect(xlocation+3, 9, 45, 45), "link"+prefix,
                        function(sender){
                            var nowcontext = uploadContext(context);
                            getLink(nowcontext);      
                        });

            contentView.addSubview(linkButton);
            xlocation = xlocation+53;
        }

        if(obj.indexOf('flag') > -1){

            var flagButton = addButton( NSMakeRect(xlocation+3, 9, 45, 45), "flag"+prefix,
                        function(sender){
                            var nowcontext = uploadContext(context);
                            getFlag(nowcontext);
                        });
            contentView.addSubview(flagButton);
            xlocation = xlocation+53;
        }

        if(obj.indexOf('sortingLayers') > -1){

            var flagButton = addButton( NSMakeRect(xlocation+3, 9, 45, 45), "sorting"+prefix,
                        function(sender){
                            var nowcontext = uploadContext(context);
                            sortingLayers(nowcontext);
                        });
            contentView.addSubview(flagButton);
            xlocation = xlocation+53;
        }

        if(obj.indexOf('iconQ') > -1){
            var iconButton = addButton( NSMakeRect(xlocation+3, 9, 45, 45), "icon"+prefix,
                        function(sender){
                            var nowcontext = uploadContext(context);
                            iconQ(nowcontext);
                        });
            contentView.addSubview(iconButton);
            xlocation = xlocation+53;
        }

        if(obj.indexOf('syncuikit') > -1){
            var syncuiButton = addButton( NSMakeRect(xlocation+3, 9, 45, 45), "syncui"+prefix,
                        function(sender){
                            var nowcontext = uploadContext(context);
                            syncUIkit(nowcontext);
                        });
            contentView.addSubview(syncuiButton);
            xlocation = xlocation+53;
        }


        if(obj.indexOf('synccolor') > -1){
            var synccolorButton = addButton( NSMakeRect(xlocation+3, 9, 45, 45), "synccolor"+prefix,
                        function(sender){
                            var nowcontext = uploadContext(context);
                            syncColor(nowcontext);
                        });
            contentView.addSubview(synccolorButton);
            xlocation = xlocation+53;
        }

        if(obj.indexOf('textReplace') > -1){
            var textButton = addButton( NSMakeRect(xlocation+3, 9, 45, 45), "text"+prefix,
                        function(sender){
                            var nowcontext = uploadContext(context);
                            textReplace(nowcontext);
                        });

            contentView.addSubview(textButton);
            xlocation = xlocation+53;
        }

        if(obj.indexOf('colorReplace') > -1){
            var colorButton = addButton( NSMakeRect(xlocation+3, 9, 45, 45), "color"+prefix,
                        function(sender){
                            var nowcontext = uploadContext(context);
                            colorReplace(nowcontext);
                        });
            contentView.addSubview(colorButton);
            xlocation = xlocation+53;
        }

        if(obj.indexOf('fontReplace') > -1){
            var fontButton = addButton( NSMakeRect(xlocation+3, 9, 45, 45), "font"+prefix,
                        function(sender){
                            var nowcontext = uploadContext(context);
                            fontReplace(nowcontext);
                        });
            contentView.addSubview(fontButton);
            xlocation = xlocation+53;
        }

        if(obj.indexOf('fontCharacters') > -1){
            var fontButton = addButton( NSMakeRect(xlocation+3, 9, 47, 45), "fontCharacters"+prefix,
                        function(sender){
                            var nowcontext = uploadContext(context);
                            fontCharacters(nowcontext);
                        });
            contentView.addSubview(fontButton);
            xlocation = xlocation+55;
        }


        if(obj.indexOf('exportSlice') > -1){
            var cutButton = addButton( NSMakeRect(xlocation+3, 9, 45, 45), "cut"+prefix,
                        function(sender){
                            var nowcontext = uploadContext(context);
                            exportSlice(nowcontext);
                        });
            contentView.addSubview(cutButton);
            xlocation = xlocation+53;
        }

        if(obj.indexOf('codeColor') > -1){
            var codecolorButton = addButton( NSMakeRect(xlocation+3, 9, 45, 45), "codecolor"+prefix,
                        function(sender){
                            var nowcontext = uploadContext(context);
                            codeC(nowcontext);
                        });
            contentView.addSubview(codecolorButton);
            xlocation = xlocation+53;
        }

        if(obj.indexOf('codeStyle') > -1){
            var codestyleButton = addButton( NSMakeRect(xlocation+3, 9, 45, 45), "codestyle"+prefix,
                        function(sender){
                            var nowcontext = uploadContext(context);
                            codeS(nowcontext);
                        });
            contentView.addSubview(codestyleButton);
            xlocation = xlocation+53;
        }

        if(obj.indexOf('previewToolbar') > -1){
            var previewToolbarButton = addButton( NSMakeRect(xlocation+3, 9, 45, 45), "preview"+prefix,
                        function(sender){
                            var nowcontext = uploadContext(context);
                            previewToolbar(nowcontext);      
                        });

            contentView.addSubview(previewToolbarButton);
            xlocation = xlocation+53;
        }


        threadDictionary[identifier] = Toolbar;
        Toolbar.makeKeyAndOrderFront(nil);
    }else{
        
    }
}

var onRunToolBar = function(context){
    toolbar(context);
}
