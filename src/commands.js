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

if (!global._babelPolyfill) {
	require('babel-polyfill');
}

import {StickersUI} from './stickers-ui.js';
import * as util from './util';

export function onShowStickers(context) {
  let window = new StickersUI(context);
  window.showHide();
}

export function onClearCache(context) {
  util.rmdirRecursive(util.getPluginCachePath());
  context.document.showMessage(`✅ Sticker library index cleared`);
}
