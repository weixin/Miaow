//author: utom
//address: https://gist.github.com/utom/915356b9d1f79977fa5fd7ed9a8afcc6


export class Analytics {
    constructor(context) {
        var screen = NSScreen.mainScreen(),
            scale = screen.backingScaleFactor(),
            rect = screen.frame(),
            width = rect.size.width * scale,
            height = rect.size.height * scale;
        this.payload = {
            v: 1,
            tid: 'UA-106220403-1',
            cid: this.getUUID(),
            t: 'event',
            an: 'WeSketch',
            aid: context.plugin.identifier(),
            av: context.plugin.version(),
            sr: `${width}x${height}`
        }
    }

    getUUID() {
        var kUUIDKey = 'google.analytics.uuid';
        var uuid = NSUserDefaults.standardUserDefaults().objectForKey(kUUIDKey);
        if (!uuid) {
            uuid = NSUUID.UUID().UUIDString();
            NSUserDefaults.standardUserDefaults().setObject_forKey(uuid, kUUIDKey);
        }
        return uuid;
    }

    jsonToQueryString(json) {
        return '?' + Object.keys(json).map(function (key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
        }).join('&')
    }

    send(props) {
        var self = this;
        Object.keys(props).forEach(function (key) {
            self.payload[key] = props[key];
        });

        var url = NSURL.URLWithString(NSString.stringWithFormat("https://www.google-analytics.com/collect%@", this.jsonToQueryString(this.payload)));
        if (url) {
            NSURLSession.sharedSession().dataTaskWithURL(url).resume()
        }
    }

    sendEvent(category, action, label, value) {
        var props = {};
        if (category) {
            props.ec = category
        }
        if (action) {
            props.ea = action
        }
        if (label) {
            props.el = label
        }
        if (value) {
            props.ev = value
        }
        this.send(props);
    }

    sendError(error) {
        var props = {};
        if (error) {
            props.exd = error
        }
        this.send(props);
    }
}