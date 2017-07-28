@import 'common.js';
@import 'commonPreview.js';
@import 'localPreview.js';
@import 'h5Preview.js';


function previewToolbar(context,auto){
    
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

    var pluginSketch = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("library");
    var identifier = "com.sketchplugins.wechat.preview",
        threadDictionary = NSThread.mainThread().threadDictionary(),
        Toolbar = threadDictionary[identifier];
    var lang = NSUserDefaults.standardUserDefaults().objectForKey(i18nKey);
    var prefix = '-'+lang.toString();

    if(!Toolbar){
        coscript.setShouldKeepAround(true);
        Toolbar = NSPanel.alloc().init();
        Toolbar.setStyleMask(NSTitledWindowMask + NSFullSizeContentViewWindowMask);
        Toolbar.setBackgroundColor(NSColor.colorWithRed_green_blue_alpha(0.92, 0.92, 0.92, 1));
        Toolbar.setTitleVisibility(NSWindowTitleHidden);
        Toolbar.setTitlebarAppearsTransparent(true);



        var locationx = NSScreen.mainScreen().frame().size.width - 260;
        var locationy = NSScreen.mainScreen().frame().size.height - 365;
        
        Toolbar.setFrame_display(NSMakeRect(locationx, locationy, 45, 300), false);
        Toolbar.setMovableByWindowBackground(true);
        Toolbar.becomeKeyWindow();
        Toolbar.setLevel(NSFloatingWindowLevel);


        var contentView = Toolbar.contentView();
        var closeButton = addButton( NSMakeRect(13, 280, 18, 18), "close",
                    function(sender){
                        coscript.setShouldKeepAround(false);
                        threadDictionary.removeObjectForKey(identifier);
                        Toolbar.close();
                    });
        contentView.addSubview(closeButton);


        var linkButton = addButton( NSMakeRect(0, 235, 0, 45), "link"+prefix,
                    function(sender){
                        var nowcontext = uploadContext(context);
                        setIndex(nowcontext);      
                    });

        contentView.addSubview(linkButton);

        var linkButton2 = addButton( NSMakeRect(0, 190, 0, 45), "link"+prefix,
                    function(sender){
                        var nowcontext = uploadContext(context);
                        setDialog(nowcontext);      
                    });

        contentView.addSubview(linkButton2);

        var linkButton3 = addButton( NSMakeRect(0, 145, 0, 45), "link"+prefix,
                    function(sender){
                        var nowcontext = uploadContext(context);
                        setFixed(nowcontext);      
                    });

        contentView.addSubview(linkButton3);

        var linkButton4 = addButton( NSMakeRect(0, 100, 0, 45), "link"+prefix,
                    function(sender){
                        var nowcontext = uploadContext(context);
                        setBack(nowcontext);      
                    });

        contentView.addSubview(linkButton4);

        var linkButton5 = addButton( NSMakeRect(0, 55, 0, 45), "link"+prefix,
                    function(sender){
                        var nowcontext = uploadContext(context);
                        localPreview(nowcontext);      
                    });

        contentView.addSubview(linkButton5);

        var linkButton6 = addButton( NSMakeRect(0, 10, 0, 45), "link"+prefix,
                    function(sender){
                        var nowcontext = uploadContext(context);
                        h5Preview(nowcontext);      
                    });

        contentView.addSubview(linkButton6);


        threadDictionary[identifier] = Toolbar;
        Toolbar.makeKeyAndOrderFront(nil);
    }else{
        coscript.setShouldKeepAround(false);
        threadDictionary.removeObjectForKey(identifier);
        Toolbar.close();
    }
}

var onRunToolBar = function(context){
    previewToolbar(context);
}