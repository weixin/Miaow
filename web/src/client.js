/*
 * Copyright 2018 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const ee = require('event-emitter');

let __layerImages__ = {};
let __layerImageResolves__ = {};

class StickersClient {
  getStickerImageUrl(stickerId) {
    return new Promise((resolve, reject) => {
      if (__layerImages__[stickerId]) {
        resolve(__layerImages__[stickerId]);
      } else if (__layerImageResolves__[stickerId]) {
        // already sent request to client, just tack on this resolve() fn
        __layerImageResolves__[stickerId].push(resolve);
      } else {
        // no request for this layer sent yet
        __layerImageResolves__[stickerId] = [resolve];
        pluginCall('requestLayerImageUrl', stickerId, '__onLayerImageAvailable__');
      }
    });
  }

  __onLayerImageAvailable__(stickerId, url) {
    __layerImages__[stickerId] = url;
    (__layerImageResolves__[stickerId] || []).forEach(resolve => resolve(url));
  }

  init() {
    pluginCall('loadStickerIndex', '__onLoadComplete__', '__onLoadProgress__');
  }

  close() {
    pluginCall('close');
  }

  openUrl(url) {
    pluginCall('openUrl', url);
  }

  startDragging(stickerId, rect) {
    pluginCall('startDragging', stickerId, rect);
  }
};

ee(StickersClient.prototype);

let instance = new StickersClient();

window.__onLayerImageAvailable__ = instance.__onLayerImageAvailable__.bind(instance);

window.__onLoadProgress__ = f => {
  instance.emit('load-progress', f);
};

window.__onLoadComplete__ = stickerIndex => {
  instance.stickerIndex = stickerIndex;
  instance.emit('load-progress', 1);
  instance.emit('loaded', stickerIndex);
};


module.exports = instance;