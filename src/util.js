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


/**
 * Performs a depth-first traversal of the layer tree, starting
 * at the provided root layer.
 */
export function walkLayerTree(rootLayer, visitFunction, {reverse} = {reverse: false}) {
  let visit_ = layer => {
    // visit this layer
    visitFunction(layer);

    // visit children
    let subLayers;
    if ('layers' in layer) {
      subLayers = arrayFromNSArray(layer.layers());
    } else if ('artboards' in layer) {
      subLayers = arrayFromNSArray(layer.artboards());
    } else {
      return;
    }

    if (reverse) {
      subLayers.reverse();
    }

    subLayers.forEach(subLayer => visit_(subLayer));
  };

  visit_(rootLayer);
}


/**
 * Converts an NSArray to a JS array
 */
export function arrayFromNSArray(nsArray) {
  // TODO: this may no longer be needed... as of recent versions of sketch
  // NSArray seems to be array-like. or at least replace with Array.from(nsarray)
  let arr = [];
  let count = nsArray.count();
  for (let i = 0; i < count; i++) {
    arr.push(nsArray.objectAtIndex(i));
  }
  return arr;
}


/**
 * Convert an NSDictionary-type object to a JS dict.
 * As of Sketch 50.2, this is needed for some cases of symbol instance overrides
 */
export function dictFromNSDict(nsDict) {
  let dict = {};
  for (let key in nsDict) {
    dict[key] = nsDict[key];
  }
  return dict;
}


/**
 * Returns the first layer matching the given NSPredicate
 *
 * @param {MSDocument|MSLayerGroup} parent The document or layer group to search.
 * @param {NSPredicate} predicate Search predicate
 */
export function getAllLayersMatchingPredicate(parent, predicate) {
  if (parent instanceof MSDocument) {
    // MSDocument
    return parent.pages().reduce(
        (acc, page) => acc.concat(getAllLayersMatchingPredicate(page, predicate)),
        []);
  }

  // assume MSLayerGroup
  return Array.from(parent.children().filteredArrayUsingPredicate(predicate));
}


/**
 * Returns the first layer matching the given NSPredicate
 *
 * @param {MSDocument|MSLayerGroup} parent The document or layer group to search.
 * @param {NSPredicate} predicate Search predicate
 */
export function getFirstLayerMatchingPredicate(parent, predicate) {
  if (parent instanceof MSDocument) {
    // MSDocument
    let results;
    for (page of Array.from(parent.pages())) {
      let firstInPage = getFirstLayerMatchingPredicate(page, predicate);
      if (firstInPage) {
        return firstInPage;
      }
    }
    return null;
  }

  // assume MSLayerGroup
  return getAllLayersMatchingPredicate(parent, predicate)[0] || null;
}


/**
 * Finds the layer with the given objectID in the given document.
 */
export function getLayerById(document, layerId) {
  return getFirstLayerMatchingPredicate(document,
      NSPredicate.predicateWithFormat('objectID == %@', layerId));
}


/**
 * Copied from @skpm/fs with intermediate directories.
 */
export function mkdirpSync(path, mode) {
  mode = mode || 0o777;
  let err = MOPointer.alloc().init();
  let fileManager = NSFileManager.defaultManager();
  fileManager.createDirectoryAtPath_withIntermediateDirectories_attributes_error(path, true, {
    NSFilePosixPermissions: mode
  }, err);

  if (err.value() !== null) {
    throw new Error(err.value());
  }
}


/**
 * Returns an MSDocument for the given .sketch file path. May take
 * a long time!
 */
export function loadDocFromSketchFile(filePath) {
  let doc = MSDocument.new();
  doc.readDocumentFromURL_ofType_error_(
      NSURL.fileURLWithPath(filePath),
      'com.bohemiancoding.sketch.drawing',
      null);
  
  return doc;
}


/**
 * Returns an NSImage for the given layer in the given document.
 */
export function getLayerImage(document, layer) {
  let tempPath = NSTemporaryDirectory().stringByAppendingPathComponent(
      NSUUID.UUID().UUIDString() + '.png');
  captureLayerImage(document, layer, tempPath);
  return NSImage.alloc().initWithContentsOfFile(tempPath);
}


/**
 * Saves the given layer in the given document to a PNG file at the given path.
 */
export function captureLayerImage(document, layer, destPath) {
  let air = layer.absoluteInfluenceRect();
  let rect = NSMakeRect(air.origin.x, air.origin.y, air.size.width, air.size.height);
  let exportRequest = MSExportRequest.exportRequestsFromLayerAncestry_inRect_(
      MSImmutableLayerAncestry.ancestryWithMSLayer_(layer),
      rect // we pass this to avoid trimming
      ).firstObject();
  exportRequest.format = 'png';
  exportRequest.scale = 2;
  // exportRequest.shouldTrim = false;
  document.saveArtboardOrSlice_toFile_(exportRequest, destPath);
}


/**
 * Converts an NSImage to a data URL string (png).
 */
export function nsImageToDataUri(image) {
  let data = image.TIFFRepresentation();
  let bitmap = NSBitmapImageRep.imageRepWithData(data);
  data = bitmap.representationUsingType_properties_(NSPNGFileType, null);
  let base64 = 'data:image/png;base64,' + data.base64EncodedStringWithOptions(0);
  return base64;
}


/**
 * Returns the system cache path for the plugin.
 */
export function getPluginCachePath() {
  let cachePath = String(NSFileManager.defaultManager().URLsForDirectory_inDomains_(
      NSCachesDirectory,
      NSUserDomainMask)[0].path());
  let pluginCacheKey = String(__command.pluginBundle().identifier()); // TODO: escape if needed
  return path.join(cachePath, pluginCacheKey);
}


/**
 * Deletes the given file or directory recursively (i.e. it and its
 * subfolders).
 */
export function rmdirRecursive(path) {
  NSFileManager.defaultManager().removeItemAtPath_error_(path, null);
}


/**
 * Give the CPU some breathing room.
 */
export function unpeg() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), 0);
  });
}


/**
 * Profile the running time of a method
 */
export function _profile(fnOrPromise, tag = '') {
  tag = tag ? ` [${tag}]` : '';
  let t = Number(new Date());

  let finish = () => {
    t = Number(new Date()) - t;
    log(`profile${tag}: ${t}ms`);
  };

  if (fnOrPromise instanceof Promise) {
    fnOrPromise.then(() => finish());
    return fnOrPromise;
  } else {
    fnOrPromise();
    finish();
  }
}


/**
 * Returns the name of the given document, if it has one.
 *
 * @param {MSDocument} document
 */
export function getDocumentName(document) {
  let fileURL = document.fileURL();
  if (fileURL) {
    fileURL = String(fileURL.path());
    return path.basename(fileURL).replace(/\.[^.]+$/, ''); // strip extension
  }

  return null;
}
