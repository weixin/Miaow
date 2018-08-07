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

// This is a stub client used during development.
const STUB_STICKER_INDEX = require('./_stub-sticker-index.json');

const ACTIONS = {
  close() {
  },

  startDragging(id, rect) {
  },

  requestLayerImageUrl(stickerId, callbackName) {
    let sticker = __getStickerById(stickerId);
    let canvas = document.createElement('canvas');
    canvas.width = sticker.width * 2;
    canvas.height = sticker.height * 2;
    let ctx = canvas.getContext('2d');
    ctx.scale(2, 2);
    ctx.fillStyle = '#3F51B5';
    ctx.fillRect(0, 0, sticker.width, sticker.height);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = Math.ceil(Math.max(13, Math.min(sticker.width, sticker.height) / 10)) + 'px Menlo';
    ctx.fillStyle = 'rgba(255,255,255,.6)';
    ctx.fillText(`${sticker.width}x${sticker.height}`, sticker.width / 2, sticker.height / 2);
    let url = canvas.toDataURL();
    window[callbackName](stickerId, url);
  },

  loadStickerIndex(callbackName, progressCallbackName) {
    // window[progressCallbackName](0);
    // setTimeout(() => window[progressCallbackName](.3), 100);
    // setTimeout(() => window[progressCallbackName](.5), 300);
    // setTimeout(() => window[progressCallbackName](.9), 1000);
    // setTimeout(() => window[callbackName](STUB_STICKER_INDEX), 1500);
    setTimeout(() => window[callbackName](STUB_STICKER_INDEX), 0);
  }
};

window['pluginCall'] = function pluginCall(action, ...args) {
  console.log(`pluginCall: ${action} with args ${JSON.stringify(args)}`);
  ACTIONS[action].apply(null, args);
};


function __getStickerById(id) {
  let foundSticker = null;
  let findInSection = section => {
    (section.items || []).forEach(item => {
      if (item.type == 'layer' && item.id == id) {
        foundSticker = item;
      } else if (item.type == 'section') {
        findInSection(item);
      }
    });
  };

  for (let library of STUB_STICKER_INDEX.libraries) {
    for (let section of library.sections) {
      findInSection(section);
    }
  }
  return foundSticker;
}
