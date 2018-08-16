
/**
 * Returns true if every color in the array of SVG colors is already
 * in the document.
 */
export function areAllLibraryColorsInDocument(libSvgColors, document) {
  let assets = document.documentData().assets();
  let libMSColors = libSvgColors.map(c => svgColorToMSColor(c));

  // collect all colors currently in this doc that aren't in the
  // target colors and save them, to add back at the end
  let existingColors = Array.from(assets.colors());
  let libColorsInDoc = libMSColors
      .filter(libColor => existingColors.find(docColor => docColor.isEqual(libColor)));
  return libColorsInDoc.length == libMSColors.length;
}


/**
 * Adds all the colors in the given array of SVG colors to the document's
 * colors.
 */
export function addLibraryColorsToDocument(libSvgColors, document) {
  let assets = document.documentData().assets();
  let libMSColors = libSvgColors.map(c => svgColorToMSColor(c));

  // collect all colors currently in this doc that aren't in the
  // target colors and save them, to add back at the end
  let existingColorsToKeep = Array.from(assets.colors())
      .filter(color =>
          libMSColors.reduce(
              (keep, libColor) => keep && !color.isEqual(libColor), true));

  assets.removeAllColors();

  libMSColors.forEach(color => assets.addColor(color));
  existingColorsToKeep.forEach(color => assets.addColor(color));
}


/**
 * Converts an SVG/CSS color string like '#fff' or 'rgba(...)'
 * to an MSColor
 */
export function svgColorToMSColor(color) {
  let ic = MSImmutableColor.colorWithSVGString(color);
  return MSColor.alloc().initWithRed_green_blue_alpha_(
      ic.red(), ic.green(), ic.blue(), ic.alpha());
}


/**
 * Converts an MSColor to an SVG/CSS color string.
 */
export function msColorToSVGColor(color) {
  let r = Math.round(255 * color.red());
  let g = Math.round(255 * color.green());
  let b = Math.round(255 * color.blue());
  let a = Number(Number(color.alpha()).toFixed(2));
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}