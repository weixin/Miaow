import {_,dialog,errorDialog,initDefaults,saveDefaults,uploadContext,paste,rgb,request,networkRequest,zip,encodeData,get,post,getConfig,openUrlInBrowser,createRadioButtons,createRadioButtons2,createArtboard,hexToRgb,unique,SMPanel} from "./common";

function sortingLayers(context) {
  var i18 = _(context).orderLayers;

  var by = function (name, minor) {
    return function (o, p) {
      var a, b;
      if (o && p && typeof o === 'object' && typeof p === 'object') {
        a = o[name];
        b = p[name];
        if (a === b) {
          return typeof minor === 'function' ? minor(o, p) : 0;
        }
        if (typeof a === typeof b) {
          return a < b ? -1 : 1;
        }
        return typeof a < typeof b ? -1 : 1;
      } else {
        thro("error");
      }
    }
  }

  var selection = context.selection;
  if (selection.length == 0) {
    return errorDialog(context,i18.m2);
  }
  if (selection[0].className() == "MSArtboardGroup" || selection[0].className() == "MSSymbolMaster") {
    return errorDialog(context,i18.m3);
  }
  var artboard = selection[0].parentGroup();
  var length = selection.length;
  var order = {};

  for (var i = 0; i < length; i++) {
    var x = selection[i].absoluteRect().x();
    var y = selection[i].absoluteRect().y();
    var width = selection[i].rect().size.width;
    var height = selection[i].rect().size.height;
    var name = selection[i].name();

    var obj = order[width + '_' + height];
    if (!obj) {
      order[width + '_' + height] = [];
      obj = order[width + '_' + height];
    }

    var object = {};
    object.x = x;
    object.y = y;
    object.width = width;
    object.height = height;
    object.name = selection[i].name();
    object.selection = selection[i];
    obj.push(object);
  }
  for (var i in order) {
    order[i].sort(by('y', by('x')));
    var layer = order[i][order[i].length - 1].selection.copy();
    for (var k = 0; k < order[i].length; k++) {
      if (k == 0) {
        artboard.addLayers([layer]);
        layer.moveToLayer_beforeLayer(artboard, order[i][k].selection);
        order[i][k].selection.moveToLayer_beforeLayer(artboard, layer);
      } else {
        order[i][k].selection.moveToLayer_beforeLayer(artboard, order[i][k - 1].selection);
      }
      order[i][k].selection.setName(order[i][0].name + (k + 1));
      if (k == order[i].length - 1) {
        layer.removeFromParent();
      }
    }
  }
  context.document.showMessage(i18.m1);
  var ga = new Analytics(context);
  if (ga) ga.sendEvent('sortingLayers', 'layers');
}

var onRun = function (context) {
  sortingLayers(context);
};