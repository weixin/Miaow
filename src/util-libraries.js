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

import * as util from './util';

/**
 * Imports the symbols in the given library into the current
 * document, and swaps any local symbols with the library versions.
 */
export function swapLocalSymbolsWithLibrary(document, library, {isInstanceActuallyUsed} = {}) {
  let symbolInfosByObjectId = {};

  // gather up a list of all available symbols in the library
  util.arrayFromNSArray(library.document().localSymbols()).forEach(localSymbol => {
    let objectId = String(localSymbol.objectID());
    let localSymbolId = String(localSymbol.symbolID());
    symbolInfosByObjectId[objectId] = {
      objectId,
      localSymbol,
      localSymbolId,
    };
  });

  // create a list of all *used* symbols in this document
  let usedSymbolIds = new Set([]);
  let allSymbolInstances =  util.getAllLayersMatchingPredicate(
      document, NSPredicate.predicateWithFormat('className == %@', 'MSSymbolInstance'));

  let markAllUsedSymbolIdsInDict = (dict) => {
    if (dict.symbolID) {
      usedSymbolIds.add(String(dict.symbolID));
    }

    for (let k in dict) {
      if (dict[k].symbolID) {
        markAllUsedSymbolIdsInDict(dict[k]);
      }
    }
  };
  
  allSymbolInstances.forEach(symbolInstance => {
    if (isInstanceActuallyUsed && !isInstanceActuallyUsed(symbolInstance)) {
      return;
    }

    let symbolId = String(symbolInstance.symbolID());
    usedSymbolIds.add(symbolId);
    for (let [overrideId, overrideDict] of
         Object.entries(util.dictFromNSDict(symbolInstance.overrides()))) {
      markAllUsedSymbolIdsInDict(overrideDict);
    }
  });

  // gather up all symbol masters used on this document that are in the library
  let symbolMastersToReplace = [];
  let allSymbolMasters = util.getAllLayersMatchingPredicate(document,
      NSPredicate.predicateWithFormat('className == %@', 'MSSymbolMaster'));
  allSymbolMasters.forEach(symbolMaster => {
    let objectId = String(symbolMaster.objectID());
    if (!(objectId in symbolInfosByObjectId)) {
      return;
    }

    // found a symbol master in the library
    symbolMastersToReplace.push(symbolMaster);

    // if it's used in the doc, flag it for import
    if (usedSymbolIds.has(String(symbolMaster.symbolID()))) {
      symbolInfosByObjectId[objectId].shouldImport = true;
    }
  });

  // import library symbols used in this document and create mapping from
  // local symbol to foreign symbol ID
  let localToForeignSymbolIdMap = {};
  Object.values(symbolInfosByObjectId).forEach(symbolInfo => {
    if (!symbolInfo.shouldImport) {
      return;
    }

    // import the symbol!
    symbolInfo.foreignSymbol = importForeignSymbolCompat(
        symbolInfo.localSymbol, library, document.documentData());
    localToForeignSymbolIdMap[symbolInfo.localSymbolId] =
        String(symbolInfo.foreignSymbol.symbolMaster().symbolID());
  });

  // Replace all symbol masters used in the doc
  symbolMastersToReplace.forEach(masterToReplace => {
    let objectId = String(masterToReplace.objectID());
    let info = symbolInfosByObjectId[objectId];

    if (info.shouldImport) {
      // kill the local symbol, swap instances with foreign version
      replaceSymbolMaster(
          masterToReplace,
          info.foreignSymbol.symbolMaster(),
          localToForeignSymbolIdMap);
    }

    // finally, remove the local symbol
    masterToReplace.removeFromParent();
  });
}


/**
 * Resets all instances of the 'from' master to the 'to' master.
 *
 * @param {MSSymbolMaster} masterFrom
 * @param {MSSymbolMaster} masterTo
 * @param {dictionary} overridesIdMapToUpdate
 */
function replaceSymbolMaster(masterFrom, masterTo, overridesIdMapToUpdate = null) {
  util.arrayFromNSArray(masterFrom.allInstances()).forEach(instance => {
    instance.changeInstanceToSymbol(masterTo);
    if (overridesIdMapToUpdate) {
      //MSLayerPaster.updateOverridesOnInstance_withIDMap_(instance, overridesIdMapToUpdate);
      instance.updateOverridesWithObjectIDMap(overridesIdMapToUpdate);
    }
  });
}


/**
 * Returns the MSAssetLibrary / MSUserAssetLibrary with the given library ID
 * (which is a UUID)
 */
export function getLibraryById(libraryId) {
  return util.arrayFromNSArray(getLibrariesController().libraries())
      .find(lib => String(lib.libraryID()) == libraryId);
}


/**
 * Adds the given .sketch file as a library in Sketch.
 */
export function addLibrary(context, librarySketchFilePath) {
  getLibrariesController().addAssetLibraryAtURL(NSURL.fileURLWithPath(librarySketchFilePath));
  getLibrariesController().notifyLibraryChange(
      getLibrariesController().userLibraries().firstObject()); // notify change on any lib
}


/**
 * Replaces all symbol instances under (and including) the given parent layer with
 * those found in the given MSAssetLibrary.
 */
export function replaceSymbolsInLayerWithLibrary(parentDocument, parentLayer, library) {
  if (parentLayer.children) {
    let allSymbolInstances =  util.getAllLayersMatchingPredicate(
        parentLayer, NSPredicate.predicateWithFormat('className == %@', 'MSSymbolInstance'));

    let maybeImportForeignSymbolWithSymbolId = symbolId => {
      let librarySymbolMaster = library.document().symbolWithID(symbolId);
      if (librarySymbolMaster) {
        if (librarySymbolMaster.foreignObject()) {
          // the symbol in the target library is a foreign symbol from yet
          // another library, just grab the MSForeignSymbol/MSForeignObject
          // and add it to the target document
          let foreignSymbol = librarySymbolMaster.foreignObject();
          parentDocument.documentData().addForeignSymbol(foreignSymbol);
          return foreignSymbol;
        }

        // the symbol in the target library is local to the library, import it
        // from the library
        return importForeignSymbolCompat(librarySymbolMaster, library,
            parentDocument.documentData());
      }

      return null;
    };

    // Imports an override dictionary of the form:
    //
    // { 'symbolID': '123',
    //   '456': { 'symbolID': '789', ... },
    //   ...  }
    //
    // This is necessary when importing override symbols that themselves have overrides
    let deepImportOverrides = (dict, localToForeignSymbolIdMap) => {
      if (dict.symbolID) {
        let foreignSymbol = maybeImportForeignSymbolWithSymbolId(dict.symbolID);
        if (foreignSymbol) {
          // swap out the symbol ID that's local to the library for the symbol ID
          // for the foreign symbol in the new document linked to the library
          localToForeignSymbolIdMap[String(dict.symbolID)] =
              String(foreignSymbol.symbolMaster().symbolID());
        }
      }

      for (let k in dict) {
        if (dict[k].symbolID) {
          deepImportOverrides(dict[k], localToForeignSymbolIdMap);
        }
      }
    };

    allSymbolInstances.forEach(symbolInstance => {
      let symbolId = symbolInstance.symbolID();
      let foreignSymbol = maybeImportForeignSymbolWithSymbolId(symbolId);
      if (foreignSymbol) {
        symbolInstance.changeInstanceToSymbol(foreignSymbol.symbolMaster());
      }

      let localToForeignSymbolIdMap = {};
      for (let [overrideId, overrideDict] of
           Object.entries(util.dictFromNSDict(symbolInstance.overrides()))) {
        deepImportOverrides(overrideDict, localToForeignSymbolIdMap);
      }

      symbolInstance.updateOverridesWithObjectIDMap(localToForeignSymbolIdMap);
    });
  }
}


/**
 * Compatibility layer for importForeignSymbol_fromLibrary_intoDocument,
 * removed in Sketch 50.
 *
 * @param {MSSymbolMaster} librarySymbolMaster The symbol master in the library to import
 * @param {MSAssetLibrary} library The library to import from
 * @param {MSDocumentData} parentDocumentData The document data to import into
 * @returns {MSForeignSymbol}
 */
function importForeignSymbolCompat(librarySymbolMaster, library, parentDocumentData) {
  let librariesController = getLibrariesController();
  if (librariesController.importForeignSymbol_fromLibrary_intoDocument) {
    // Sketch < 50
    return librariesController.importForeignSymbol_fromLibrary_intoDocument(
        librarySymbolMaster, library, parentDocumentData);
  } else {
    // Sketch 50
    let shareableObjectReference = MSShareableObjectReference.referenceForShareableObject_inLibrary(
        librarySymbolMaster, library);
    return librariesController.importShareableObjectReference_intoDocument(
        shareableObjectReference, parentDocumentData);
  }
}


/**
 * Returns an MSDocument for the library with the given ID (cached).
 * Note: this operation may take a while.
 */
export function docForLibraryId(libraryId) {
  docForLibraryId.__cache__ = docForLibraryId.__cache__ || {};
  if (!(libraryId in docForLibraryId.__cache__)) {
    let library = Array.from(getLibrariesController().libraries())
        .find(lib => String(lib.libraryID()) == libraryId);
    if (!library) {
      return null;
    }

    docForLibraryId.__cache__[libraryId] = utils.loadDocFromSketchFile(
        String(library.locationOnDisk().path()));
  }

  return docForLibraryId.__cache__[libraryId];
}


/**
 * Gets the app instance's MSAssetLibraryController
 */
function getLibrariesController() {
  return AppController.sharedInstance().librariesController();
}
