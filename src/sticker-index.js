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

import fs from '@skpm/fs';
import path from '@skpm/path';
import yaml from 'js-yaml';

import * as util from './util';
import {ProgressReporter} from './util-progress-reporter';

const INDEX_FORMAT_VERSION = 3;
const FORCE_REBULD = false;


/**
 * Returns a sticker index JSON for the user's libraries, building and caching it
 * if needed.
 */
export async function makeStickerIndexForLibraries({onProgress}) {
  let libraries = Array.from(NSApp.delegate().librariesController().libraries())
      .filter(lib => !!lib.locationOnDisk() && !!lib.enabled() && !!lib.libraryID())
      .map(lib => ({
        libraryId: String(lib.libraryID()),
        sketchFilePath: String(lib.locationOnDisk().path()),
      }))
      // filter out duplicate library IDs
      .filter((lib, index, self) => {
        let firstWithId = self.findIndex(l => l.libraryId === lib.libraryId) === index;
        if (!firstWithId) {
          log(`Library at ${lib.sketchFilePath} not shown, there's already a library ` +
              `with ID ${lib.libraryId} in the list of libraries.`);
        }
        return firstWithId;
      });

  let progressReporter = new ProgressReporter();
  progressReporter.on('progress', progress => onProgress(progress));
  let childProgressReporters = progressReporter.makeChildren(libraries.length);

  // build indexes
  let compositeIndex = {libraries: []};
  for (let [i, lib] of libraries.entries()) {
    await util.unpeg();

    // for this library, get the last modified date of the sketch file
    let attrs = NSFileManager.defaultManager()
        .attributesOfItemAtPath_error_(lib.sketchFilePath, null);
    let modifiedDateMs = attrs ? attrs.fileModificationDate().timeIntervalSince1970() : 0;

    let cachePath = path.join(util.getPluginCachePath(), lib.libraryId);

    let libraryIndex = null;
    let indexCachePath = path.join(cachePath, 'index.json');

    try {
      libraryIndex = JSON.parse(fs.readFileSync(indexCachePath, {encoding: 'utf8'}));
    } catch (e) {
    }

    if (FORCE_REBULD ||
        !libraryIndex ||
        !libraryIndex.archiveVersion ||
        libraryIndex.timestamp < modifiedDateMs ||
        (libraryIndex.formatVersion || 0) < INDEX_FORMAT_VERSION) {
      // need to rebuild the cached index
      let doc = util.loadDocFromSketchFile(lib.sketchFilePath);
      doc.setFileURL(NSURL.fileURLWithPath(lib.sketchFilePath));
      libraryIndex = await buildStickerIndexForLibrary(
          lib.libraryId, doc, childProgressReporters[i]);

      // cache the index
      util.mkdirpSync(path.dirname(indexCachePath));
      fs.writeFileSync(indexCachePath,
          JSON.stringify(Object.assign(libraryIndex, {
            archiveVersion: Number(MSArchiveHeader.metadataForNewHeader()['version']),
            formatVersion: INDEX_FORMAT_VERSION,
            timestamp: modifiedDateMs + 1, // add a second to avoid precision issues
          })),
          {encoding: 'utf8'});
    } else {
      childProgressReporters[i].forceProgress(1);
    }

    compositeIndex.libraries.push(libraryIndex);
  }

  return compositeIndex;
}


/**
 * Builds the sticker index for the given library (libraryId and document).
 */
async function buildStickerIndexForLibrary(libraryId, document, progressReporter) {
  let cachePath = path.join(util.getPluginCachePath(), libraryId);

  // first, find sticker sections (stored in text layers)
  let sectionsById = {};
  let sections = [];

  let allTextLayers = util.getAllLayersMatchingPredicate(
      document,
      NSPredicate.predicateWithFormat('className == %@', 'MSTextLayer'));
  allTextLayers.reverse(); // layer list order, not stacking order
  for (let textLayer of allTextLayers) {
    let text = textLayer.stringValue().replace(/[‘’]/g, `'`).replace(/[“”]/g, `"`);
    let stickerSections = text.split(/!StickerSection\s+/g).slice(1);
    for (let text of stickerSections) {
      let sectionIdMatch = text.match(/^@[\w\.]+$/igm);
      if (!sectionIdMatch) {
        continue;
      }

      let id = sectionIdMatch[0];
      let stickerSection = {title: id};

      try {
        stickerSection = Object.assign(
            stickerSection,
            yaml.safeLoad(text.substr(sectionIdMatch[0].length)),
            {id, items: [], type: 'section', libraryId});
      } catch (e) {
        log(`Error parsing sticker section YAML for ${id}`);
      }

      if (id in sectionsById) {
        log(`Duplicate sticker section id ${id}, skipping duplicates`);
      } else {
        sectionsById[id] = stickerSection;
        sections.push(stickerSection);
      }
    }
  }

  // nest sections
  for (let section of Array.from(sections)) {
    let parentId = section.id.substr(0, section.id.lastIndexOf('.'));
    if (parentId) {
      let parentSection = sectionsById[parentId];
      if (!parentSection) {
        log(`Unknown parent section ${parentId}`);
        continue;
      }

      parentSection.items = parentSection.items || [];
      parentSection.items.push(section);

      // remove from the root
      sections.splice(sections.indexOf(section), 1);
    }
  }

  // go through all layers tagged to a section
  let possibleStickers = util.getAllLayersMatchingPredicate(
      document,
      NSPredicate.predicateWithFormat('name matches ".*@.*"'));
  possibleStickers.reverse(); // layer list order, not stacking order
  progressReporter.total = possibleStickers.length;
  for (let layer of possibleStickers) {
    progressReporter.increment();
    let name = layer.name();
    let sectionMatch = name.match(/(.*?)\s*(@[\w\.]+)$/);
    if (!sectionMatch) {
      continue;
    }

    if (layer instanceof MSTextLayer && name.startsWith('!Sticker')) {
      continue;
    }

    let parentSectionId = sectionMatch[2];
    let parentSection = sectionsById[parentSectionId];
    if (!parentSection) {
      log(`Sticker section not found ${parentSectionId} for layer named ${name}`);
      continue;
    }

    let layerId = String(layer.objectID());
    let id = libraryId + '.' + layerId;
    let layerInfo = {
      type: 'layer',
      id,
      layer,
      name: sectionMatch[1],
      imagePath: path.join(cachePath, layerId + '.png'),
      contentPath: path.join(cachePath, layerId + '.json'),
      width: Number(layer.absoluteInfluenceRect().size.width),
      height: Number(layer.absoluteInfluenceRect().size.height),
    };

    // capture layer image
    util.captureLayerImage(document, layer, layerInfo.imagePath);

    // capture layer content
    let serializedLayer = JSON.parse(MSJSONDataArchiver.archiveStringWithRootObject_error_(
        layer.immutableModelObject(), null));
    fs.writeFileSync(layerInfo.contentPath, JSON.stringify(serializedLayer), {encoding: 'utf8'});

    parentSection.items = parentSection.items || [];
    parentSection.items.push(layerInfo);
    await util.unpeg();
  }

  // cull any sections that don't indirectly or directly contain stickers
  let nonEmptyItems = items => items.filter(item => {
    if (item.type == 'layer') {
      return true;
    } else if (item.type == 'section') {
      item.items = nonEmptyItems(item.items || []);
      return item.items.length > 0;
    }
  });

  sections = nonEmptyItems(sections);

  return {
    id: libraryId,
    title: util.getDocumentName(document),
    sections
  };
}
