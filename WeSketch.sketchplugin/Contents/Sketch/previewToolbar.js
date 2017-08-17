@import 'common.js';
@import 'commonPreview.js';
@import 'localPreview.js';
@import 'webPreview.js';

function previewToolbar(context){
    var pluginSketch = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("library");
    var identifier = "com.sketchplugins.wechat.preview",
        threadDictionary = NSThread.mainThread().threadDictionary(),
        Toolbar = threadDictionary[identifier];
    var i18nKey = "com.sketchplugins.wechat.i18n";
    var lang = NSUserDefaults.standardUserDefaults().objectForKey(i18nKey);
    var prefix = '-'+lang.toString();

    function getImage(size, name){
        var isRetinaDisplay = NSScreen.mainScreen().backingScaleFactor() > 1? true: false;
        var suffix = isRetinaDisplay? '@2x': '';
        var imageURL = pluginSketch.URLByAppendingPathComponent("toolbar2").URLByAppendingPathComponent(name + suffix + '.png');
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

    if(!Toolbar){
        coscript.setShouldKeepAround(true);
        Toolbar = NSPanel.alloc().init();
        Toolbar.setStyleMask(NSTitledWindowMask + NSFullSizeContentViewWindowMask);
        Toolbar.setBackgroundColor(NSColor.colorWithRed_green_blue_alpha(0.92, 0.92, 0.92, 1));
        Toolbar.setTitleVisibility(NSWindowTitleHidden);
        Toolbar.setTitlebarAppearsTransparent(true);



        var view = context.document.currentView();
        var locationy = view.frame().size.height - 70;

        var toolbarwidth = (9 * 53) + 52;
        var xlocation = 46;

        
        Toolbar.setFrame_display(NSMakeRect(285, locationy, toolbarwidth, 65), false);
        Toolbar.setMovableByWindowBackground(true);
        Toolbar.becomeKeyWindow();
        Toolbar.setLevel(NSFloatingWindowLevel);


        var contentView = Toolbar.contentView();
        var closeButton = addButton( NSMakeRect(20, 24, 18, 18), "close",
                    function(sender){
                        coscript.setShouldKeepAround(false);
                        threadDictionary.removeObjectForKey(identifier);
                        Toolbar.close();
                    });
        contentView.addSubview(closeButton);

        var linkButton = addButton( NSMakeRect(xlocation+3, 9, 45, 45), "index"+prefix,
                    function(sender){
                        var nowcontext = uploadContext(context);
                        setIndex(nowcontext);
                    });

        contentView.addSubview(linkButton);
        xlocation = xlocation+53;

        var linkButton2 = addButton( NSMakeRect(xlocation+3, 9, 45, 45), "dialog"+prefix,
                    function(sender){
                        var nowcontext = uploadContext(context);
                        setDialog(nowcontext);      
                    });

        contentView.addSubview(linkButton2);
        xlocation = xlocation+53;

        var linkButton3 = addButton( NSMakeRect(xlocation+3, 9, 45, 45), "fixed"+prefix,
                    function(sender){
                        var nowcontext = uploadContext(context);
                        setFixed(nowcontext);      
                    });

        contentView.addSubview(linkButton3);
        xlocation = xlocation+53;

        var linkButton4 = addButton( NSMakeRect(xlocation+3, 9, 45, 45), "back"+prefix,
                    function(sender){
                        var nowcontext = uploadContext(context);
                        setBacks(nowcontext);      
                    });

        contentView.addSubview(linkButton4);
        xlocation = xlocation+53;

        var linkButton5 = addButton( NSMakeRect(xlocation+3, 9, 45, 45), "clear"+prefix,
                    function(sender){
                        var nowcontext = uploadContext(context);
                        clearPreview(nowcontext);      
                    });

        contentView.addSubview(linkButton5);
        xlocation = xlocation+53;

        var linkButton6 = addButton( NSMakeRect(xlocation+3, 9, 45, 45), "hide"+prefix,
                    function(sender){
                        var nowcontext = uploadContext(context);
                        hidePreview(nowcontext);      
                    });

        contentView.addSubview(linkButton6);
        xlocation = xlocation+53;

        var linkButton7 = addButton( NSMakeRect(xlocation+3, 9, 45, 45), "show"+prefix,
                    function(sender){
                        var nowcontext = uploadContext(context);
                        showPreview(nowcontext);      
                    });

        contentView.addSubview(linkButton7);
        xlocation = xlocation+53;

        var linkButton8 = addButton( NSMakeRect(xlocation+3, 9, 45, 45), "local"+prefix,
                    function(sender){
                        var nowcontext = uploadContext(context);
                        localPreview(nowcontext);      
                    });

        contentView.addSubview(linkButton8);
        xlocation = xlocation+53;

        var linkButton9 = addButton( NSMakeRect(xlocation+3, 9, 45, 45), "qr"+prefix,
                    function(sender){
                        var nowcontext = uploadContext(context);
                        webPreview(nowcontext);      
                    });

        contentView.addSubview(linkButton9);
        xlocation = xlocation+53;


        threadDictionary[identifier] = Toolbar;
        Toolbar.makeKeyAndOrderFront(nil);
    }else{
        coscript.setShouldKeepAround(false);
        threadDictionary.removeObjectForKey(identifier);
        Toolbar.close();
    }
}

var onRunPreviewToolBar = function(context){
    previewToolbar(context);
}