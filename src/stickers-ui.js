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

import path from '@skpm/path';
import fs from '@skpm/fs';
import BrowserWindow from 'sketch-module-web-view';

import * as libraries from './util-libraries';
import * as util from './util';
import * as colorUtil from './color-util';

import {makeStickerIndexForLibraries} from './sticker-index';

const THREAD_DICT_KEY = 'stickers.BrowserWindow';
const UI_MODE = 'cover';


export class StickersUI {
  constructor(context) {
    this.context = context;
  }

  /**
   * Shows or hides the Stickers window (if already shown).
   * The state is stored in the main thread's threadDictionary.
   */
  showHide() {
    let browserWindow = this.getPersistedObj();
    if (browserWindow) {
      browserWindow.close();
      this.setPersistedObj(null);
    } else {
      this.createAndShow();
    }
  }


  getPersistedObj() {
    let threadDict = NSThread.mainThread().threadDictionary();
    return threadDict[THREAD_DICT_KEY];
  }


  setPersistedObj(obj) {
    let threadDict = NSThread.mainThread().threadDictionary();
    if (obj) {
      threadDict[THREAD_DICT_KEY] = obj;
    } else {
      threadDict.removeObjectForKey(THREAD_DICT_KEY);
    }
  }


  runWebCallback(callbackName, ...args) {
    let js = (
        `window['${callbackName}'](` +
        args.map(arg => JSON.stringify(arg)).join(', ') +
        `);`);
    try {
      this.webContents.executeJavaScript(js);
    } catch (e) {
      log(e.message);
      log(e);
    }
  }


  createAndShow() {
    let docWindow = this.context.document.documentWindow();

    this.browserWindow = new BrowserWindow({
      backgroundColor: '#ffffffff',
      identifier: 'stickers.web',
      width: 800,
      height: 600,
      show: false,
      frame: UI_MODE == 'palette',
      hasShadow: UI_MODE == 'palette',
      acceptsFirstMouse: true,
    });

    this.webContents = this.browserWindow.webContents;
    this.setupWebAPI();

    this.browserWindow.on('closed', () => {
      this.setPersistedObj(null);
      coscript.setShouldKeepAround(false);
    });

    this.browserWindow.on('blur', () => this.browserWindow.close());

    if (UI_MODE == 'cover') {
      this.browserWindow.setResizable(false);
      this.browserWindow._panel.setFrame_display_animate_(docWindow.frame(), false, false);
      this.browserWindow._panel.setHidesOnDeactivate(false);
    }
    this.browserWindow.once('ready-to-show', () => this.browserWindow.show());
    this.browserWindow.loadURL(String(
        this.context.plugin.urlForResourceNamed('index.html') +
        `?uiMode=${UI_MODE}`));

    if (UI_MODE == 'cover') {
      docWindow.addChildWindow_ordered_(this.browserWindow._panel, NSWindowAbove);
    }
    this.setPersistedObj(this.browserWindow);
  }


  setupWebAPI() {
    let libraryIndexesById = {};
    this.webContents.on('loadStickerIndex', (callbackName, progressCallbackName) => {
      // trigger the creation of the sticker index
      makeStickerIndexForLibraries(
          {onProgress: progress => this.runWebCallback(progressCallbackName, progress)})
          .then(stickerIndex => {
            stickerIndex.libraries.forEach(libraryIndex => {
              if (libraryIndex.colors) {
                libraryIndex.colorsAdded = colorUtil.areAllLibraryColorsInDocument(
                    libraryIndex.colors, this.context.document);
              }
              libraryIndexesById[libraryIndex.id] = libraryIndex;
            });
            this.runWebCallback(callbackName, stickerIndex);
          })
          .catch(e => log(e.message));
    });

    this.webContents.on('openUrl', url => {
      NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString(url));
    });

    // add a handler for a call from web content's javascript
    this.webContents.on('close', () => this.browserWindow.close());

    this.webContents.on('requestLayerImageUrl', (stickerId, callbackName) => {
      let imagePath = this.getStickerCachedImagePath(stickerId);
      // let url = nsImageToDataUri(NSImage.alloc().initWithContentsOfFile(imagePath));
      let url = 'file://' + imagePath;
      this.runWebCallback(callbackName, stickerId, url);
    });

    // add a handler for a call from web content's javascript
    this.webContents.on('startDragging', (stickerId, rect) => {
      try {
        let [libraryId, layerId] = stickerId.split(/\./, 2);
        let archiveVersion = libraryIndexesById[libraryId].archiveVersion;
        this.startDragging(libraryId, archiveVersion, stickerId, rect, this.browserWindow._webview);
      } catch (e) {
        // TODO: do this everywhere somehow
        log(e.message);
        log(e);
      }
      if (UI_MODE == 'cover') {
        this.browserWindow.close();
      }
    });

    // add a handler for a call from web content's javascript
    this.webContents.on('addLibraryColors', (libraryId) => {
      try {
        let library = libraryIndexesById[libraryId];
        colorUtil.addLibraryColorsToDocument(library.colors, this.context.document);
      } catch (e) {
        // TODO: do this everywhere somehow
        log(e.message);
        log(e);
      }
    })
  }

  /**
   * Triggers the beginning of a drag operation on the given sticker ID
   */
  startDragging(libraryId, archiveVersion, stickerId, rect, srcView) {
    let library = libraries.getLibraryById(libraryId);
    let image = NSImage.alloc().initWithContentsOfFile(this.getStickerCachedImagePath(stickerId));

    // deserialize layer
    let serializedLayerJson = fs.readFileSync(
        this.getStickerCachedContentPath(stickerId), {encoding: 'utf8'});
    let decodedImmutableObj = MSJSONDataUnarchiver
        .unarchiveObjectWithString_asVersion_corruptionDetected_error(
            serializedLayerJson, archiveVersion || 999, null, null);
    let layer = decodedImmutableObj.newMutableCounterpart();

    // create a dummy document and import the layer into it, so that
    // foreign symbols can be created in it and sent along with the layer
    // to the pasteboard
    let dummyDocData = MSDocumentData.alloc().init();
    dummyDocData.addBlankPage().addLayer(layer);

    // import any symbols used in library (either from the library itself or
    // other libraries referenced from the library... i.e. nested libraries)
    libraries.replaceSymbolsInLayerWithLibrary(dummyDocData, layer, library);
    // same thing for shared text and layer styles (Sketch 50+)
    libraries.replaceSharedStylesInLayerWithLibrary(dummyDocData, layer, library);

    // initiate cocoa drag operation
    let pbItem = NSPasteboardItem.new();
    pbItem.setDataProvider_forTypes_(
        srcView,
        NSArray.arrayWithObject(NSPasteboardTypePNG));
    let dragItem = NSDraggingItem.alloc().initWithPasteboardWriter(pbItem);
    pbItem.release();
    dragItem.setDraggingFrame_contents_(
        NSMakeRect(rect.x, rect.y, rect.width, rect.height),
        image);
    let mouse = NSEvent.mouseLocation();
    let event = NSEvent.eventWithCGEvent(CGEventCreateMouseEvent(
        null,
        kCGEventLeftMouseDown,
        CGPointMake(
            mouse.x - srcView.window().frame().origin.x,
            NSHeight(NSScreen.screens().firstObject().frame())
                - mouse.y + srcView.window().frame().origin.y),
        kCGMouseButtonLeft));
    let draggingSession = srcView.beginDraggingSessionWithItems_event_source_(
        NSArray.arrayWithObject(dragItem.autorelease()), event, srcView);
    draggingSession.setAnimatesToStartingPositionsOnCancelOrFail(false);
    draggingSession.setDraggingFormation(NSDraggingFormationNone);

    // copy to pasteboard
    let dpb = NSPasteboard.pasteboardWithName(NSDragPboard);
    dpb.clearContents();
    try {
      let newPbLayers = MSPasteboardLayers.pasteboardLayersWithLayers([layer]);
      MSPasteboardManager.writePasteboardLayers_toPasteboard(newPbLayers, dpb);
    } catch (err) {
      throw err;
    }
  }


  getStickerCachedImagePath(stickerId) {
    let [libraryId, layerId] = stickerId.split(/\./, 2);
    return path.join(util.getPluginCachePath(), libraryId, layerId + '.png');
  }


  getStickerCachedContentPath(stickerId) {
    let [libraryId, layerId] = stickerId.split(/\./, 2);
    return path.join(util.getPluginCachePath(), libraryId, layerId + '.json');
  }
}
