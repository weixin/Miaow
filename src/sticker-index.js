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
import * as colorUtil from './color-util';
import {ProgressReporter} from './util-progress-reporter';

const INDEX_FORMAT_VERSION = 4;
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

    // for this library, checksum the contents so we can later check if it's changed
    // NOTE: performance should be pretty good for files a few MB in size
    let fileHash = String(NSFileManager.defaultManager()
        .contentsAtPath(lib.sketchFilePath).sha1AsString());

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
        libraryIndex.fileHash !== fileHash ||
        (libraryIndex.formatVersion || 0) < INDEX_FORMAT_VERSION) {
      // need to rebuild the cached index
      let doc = util.loadDocFromSketchFile(lib.sketchFilePath);
      doc.setFileURL(NSURL.fileURLWithPath(lib.sketchFilePath));
      libraryIndex = await buildStickerIndexForLibrary(
          lib.libraryId, doc, childProgressReporters[i]);

      // store library colors
      const colors = doc.documentData().assets().colors();
      if (colors.length) {
        libraryIndex.colors = Array.from(colors).map(c => colorUtil.msColorToSVGColor(c));
      }

      // cache the index
      util.mkdirpSync(path.dirname(indexCachePath));
      fs.writeFileSync(indexCachePath,
          JSON.stringify(Object.assign(libraryIndex, {
            archiveVersion: Number(MSArchiveHeader.metadataForNewHeader()['version']),
            formatVersion: INDEX_FORMAT_VERSION,
            fileHash
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
  let libraryIndex = {id: libraryId, sections: []};

  let cachePath = path.join(util.getPluginCachePath(), libraryId);

  // first, find sticker sections (stored in text layers)
  let sectionsById = {};

  let allTextLayers = util.getAllLayersMatchingPredicate(
      document,
      NSPredicate.predicateWithFormat('className == %@', 'MSTextLayer'));
  allTextLayers.reverse(); // layer list order, not stacking order
  for (let textLayer of allTextLayers) {
    let text = textLayer.stringValue();
    if (text.indexOf('!Sticker') < 0) {
      continue;
    }

    let parsedMetadata = parseStickerMetadata(text);
    for (let section of parsedMetadata.sections) {
      section.libraryId = libraryId;

      if (section.id in sectionsById) {
        log(`Duplicate sticker section id ${section.id}, skipping duplicates`);
      } else {
        sectionsById[section.id] = section;
        libraryIndex.sections.push(section);
      }
    }

    if (parsedMetadata.libraryMeta.title) {
      libraryIndex.title = parsedMetadata.libraryMeta.title;
    }
    if (parsedMetadata.libraryMeta.subtitle) {
      libraryIndex.subtitle = parsedMetadata.libraryMeta.subtitle;
    }
  }

  // nest sections
  for (let section of Array.from(libraryIndex.sections)) {
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
      libraryIndex.sections.splice(libraryIndex.sections.indexOf(section), 1);
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
    if (layer instanceof MSTextLayer && String(layer.name()).startsWith('!Sticker')) {
      // for text layers containing actual metadata, don't treat it as a sticker
      continue;
    }

    let parsedName = parseLayerName(layer.name(), sectionId => sectionId in sectionsById);

    // if this is an icon, capture it as the icon
    if (parsedName.specialInstructions.icon) {
      libraryIndex.iconPath = path.join(cachePath, 'icon.png');
      util.captureLayerImage(document, layer, libraryIndex.iconPath);
    }

    if (parsedName.isSticker) {
      // this is a sticker
      let layerId = String(layer.objectID());
      let id = libraryId + '.' + layerId;
      let layerInfo = {
        type: 'layer',
        id,
        layer,
        name: parsedName.sanitizedName,
        imagePath: path.join(cachePath, layerId + '.png'),
        contentPath: path.join(cachePath, layerId + '.json'),
        width: Number(layer.absoluteInfluenceRect().size.width),
        height: Number(layer.absoluteInfluenceRect().size.height),
      };

      // capture layer image
      util.captureLayerImage(document, layer, layerInfo.imagePath);

      // capture layer content
      let imm = layer.immutableModelObject();
      imm.setName(parsedName.sanitizedName);
      let serializedLayer = JSON.parse(MSJSONDataArchiver.archiveStringWithRootObject_error_(
          imm, null));
      fs.writeFileSync(layerInfo.contentPath, JSON.stringify(serializedLayer), {encoding: 'utf8'});
      await util.unpeg();

      for (let sectionId of parsedName.sectionIds) {
        let section = sectionsById[sectionId];
        section.items = section.items || [];
        section.items.push(layerInfo);
      }
    }
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

  libraryIndex.sections = nonEmptyItems(libraryIndex.sections);

  libraryIndex.title = libraryIndex.title || util.getDocumentName(document);
  return libraryIndex;
}


/**
 * Parses the given string for stickers metadata (i.e. "!StickerSection ...")
 */
function parseStickerMetadata(str) {
  let parsed = {sections:[], libraryMeta:{}};
  let items = str
      .replace(/[‘’]/g, `'`)
      .replace(/[“”]/g, `"`)
      .split(/!Sticker(Section|Library)\s*/g)
      .slice(1)
      .reduce((result, value, index, array) => {
        // split array [1,2,3,4] into pairs [[1,2],[3,4]]
        if (index % 2 == 0) {
          result.push(array.slice(index, index + 2));
        }
        return result;
      }, []);
  for (let [type, text] of items) {
    if ('Section' === type) {
      let sectionIdMatch = text.match(/^@[\w\.]+$/igm);
      if (!sectionIdMatch) {
        continue;
      }

      let id = sectionIdMatch[0];

      try {
        parsed.sections.push(Object.assign(
            {title: id},
            yaml.safeLoad(text.substr(sectionIdMatch[0].length)),
            {id, items: [], type: 'section'}));
      } catch (e) {
        log(`Error parsing sticker section YAML for ${id}`);
      }
    } else if ('Library' === type) {
      try {
        Object.assign(parsed.libraryMeta, yaml.safeLoad(text));
      } catch (e) {
        log(`Error parsing library metadata YAML`);
      }
    }
  }

  return parsed;
}


const SPECIAL_INSTRUCTIONS = new Set(['icon']);


/**
 * Parses the given layer name. The second arg is a function
 * that returns true if the given section ID (e.g. "@Foo.Bar") is a
 * valid section ID.
 */
function parseLayerName(name, isValidSectionIdFn) {
  let parsed = {
    isSticker: false,
    sectionIds: [],
    sanitizedName: name,
    specialInstructions: {},
  };

  name = String(name || '');
  let unspecialParts = name
      .split(/(@+[\w\.]+)/)
      .filter(part => {
        if ('@' === part.charAt(0)) {
          if ('@' === part.charAt(1)) {
            // special instruction
            let instr = part.slice(2);
            if (SPECIAL_INSTRUCTIONS.has(instr)) {
              parsed.specialInstructions[instr] = true;
              return false; // remove from sanitized name
            }
          } else {
            // possible section id
            if (isValidSectionIdFn(part)) {
              parsed.sectionIds.push(part);
              parsed.isSticker = true;
              return false // remove from sanitized name
            } else {
              //   log(`Sticker section not found ${sectionId} for layer named ${name}`);
              //   continue;
            }
          }
        }

        return true;
      });

  parsed.sanitizedName = unspecialParts.join('').replace(/^\s+|\s+$/g, '').replace(/\s+/, ' ');
  return parsed;
}
