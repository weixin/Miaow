var onRun = function(context){

    var pluginSketch = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("library");

    function getImage(size, name){
        // var isRetinaDisplay = (NSScreen.mainScreen().backingScaleFactor() > 1)? true: false;
        var imageURL = pluginSketch.URLByAppendingPathComponent("toolbar").URLByAppendingPathComponent(name + '.png');
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

    var identifier = "com.sketchplugins.wechat",
        threadDictionary = NSThread.mainThread().threadDictionary(),
        Toolbar = threadDictionary[identifier];

    if(!Toolbar){
        coscript.setShouldKeepAround(true);

        Toolbar = NSPanel.alloc().init();
        Toolbar.setStyleMask(NSTitledWindowMask + NSFullSizeContentViewWindowMask);
        Toolbar.setBackgroundColor(NSColor.colorWithRed_green_blue_alpha(0.10, 0.10, 0.10, 1));
        Toolbar.setTitleVisibility(NSWindowTitleHidden);
        Toolbar.setTitlebarAppearsTransparent(true);

        Toolbar.setFrame_display(NSMakeRect(0, 0, 584, 48), false);
        Toolbar.setMovableByWindowBackground(true);
        Toolbar.becomeKeyWindow();
        Toolbar.setLevel(NSFloatingWindowLevel);

        var contentView = Toolbar.contentView();
        var closeButton = addButton( NSMakeRect(14, 14, 20, 20), "icon-close",
                    function(sender){
                        coscript.setShouldKeepAround(false);
                        threadDictionary.removeObjectForKey(identifier);
                        Toolbar.close();
                    });
        contentView.addSubview(closeButton);
        threadDictionary[identifier] = Toolbar;

        Toolbar.center();
        Toolbar.makeKeyAndOrderFront(nil);
    }
}