@import "common.js"

var onRun = function (context) {
    var selection   = context.selection;
    var document    = context.document;
    var currentPage = [document currentPage];
    var layerCount  = selection.count();

    var colorToFind = '',
        colorToFind2 = '',
        colorToReplace = '',
        searchScope = 0,
        replaceElementType = 0,
        replaceCount = 0;
    var userInterface,
        findedColorWell,
        replaceColorWell;

    if (layerCount == 0) {
     document.displayMessage('没有选择图层');
    }
    else {
     var selectedLayer = getSelectedLayer(selection.firstObject());
     var selectedLayerType = selectedLayer.class();

     if (selection && selection.count() == 1) {
       colorToFind = colorToFind2 = getColour(selectedLayer);
     }

     if(createUserInterface(colorToFind) != '1000'){
           return;
       }
     else {
       processButtonClick();

       doFindAndReplace();
     }
    }

    function hexToRgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

     if (result) {
      result = {
             r : parseInt(result[1], 16),
             g : parseInt(result[2], 16),
             b : parseInt(result[3], 16),
            };
     } else {
      result = null;
     }

     return result;
     }

    function getColour(layer) {
     var colour;
     var fill;
     var selectedLayerType = layer.class();

     if (selectedLayerType == 'MSTextLayer') {
      colour = layer.textColor();

      fill = layer.style().fills().firstObject();

      if (fill != undefined && fill.isEnabled()) {
       colour = fill.color();
      }
      // log(colour.immutableModelObject().hexValue())
     } else if (selectedLayerType == 'MSShapeGroup') {
      fill = layer.style().fills().firstObject();

      if (fill != undefined && fill.isEnabled()) {
       colour = fill.color();
      }
     }

     if (colour != undefined) {
      colour = colour.immutableModelObject();
     }

     return colour;
    }

    function setColour(layer, layerType, colorToReplace) {
     var layerColour = getColour(layer); // 可能匹配的图层颜色
     var hexColour = '#' + layerColour.hexValue();
     if (hexColour == colorToFind) {
      replaceCount++;
      if (layerType == MSShapeGroup) {
       var fill = layer.style().fills().firstObject();
       if (fill != undefined) {
        fill.color = MSColor.colorWithRed_green_blue_alpha(colorToReplace.r / 255, colorToReplace.g / 255, colorToReplace.b / 255, 1.0);
       }
      }
      else {
       layer.textColor = MSColor.colorWithRed_green_blue_alpha(colorToReplace.r / 255, colorToReplace.g / 255, colorToReplace.b / 255, 1.0);
      }
     }
    }

    function getSelectedLayer(selectedLayer) {
     var selectedLayerType = selectedLayer.class();

     if (selectedLayerType == MSLayerGroup) {
      return getSelectedLayer(selectedLayer.layers().firstObject());
     } else {
      return selectedLayer;
     }
    }

      function createUserInterface(colorToFind) {
          userInterface = COSAlertWindow.new(); // 创建弹框

          userInterface.setMessageText("颜色批量替换");

          userInterface.addTextLabelWithValue("查找颜色(默认值为当前选择颜色)：");
          findedColorWell = NSColorWell.alloc().initWithFrame(NSMakeRect(0, 0, 50, 25));
         var findedColorHex = '#' + colorToFind.hexValue();
         var findedColorAlpha = 1;
         var findedMSColor = MSImmutableColor.colorWithSVGString(findedColorHex);
         findedMSColor.setAlpha(findedColorAlpha);
         var findedColor = findedMSColor.NSColorWithColorSpace(NSColorSpace.deviceRGBColorSpace());
         findedColorWell.setColor(findedColor);
         var findedColorView = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 50, 25)); // 创建包含被选择颜色控件的容器
         findedColorView.addSubview(findedColorWell);
      userInterface.addAccessoryView(findedColorView);

          userInterface.addTextLabelWithValue("替换为：");
      replaceColorWell = NSColorWell.alloc().initWithFrame(NSMakeRect(0, 0, 50, 25));
         var replaceColorHex = '#' + colorToFind.hexValue() || "#1AAD19"; // #1AAD19 同设置中的默认值
         var replaceColorAlpha = 1;
         var replaceMSColor = MSImmutableColor.colorWithSVGString(replaceColorHex);
         replaceMSColor.setAlpha(replaceColorAlpha);
         var replaceColor = replaceMSColor.NSColorWithColorSpace(NSColorSpace.deviceRGBColorSpace());
         replaceColorWell.setColor(replaceColor);
         var replaceColorView = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 50, 25)); // 创建包含要替换颜色控件的容器
         replaceColorView.addSubview(replaceColorWell);
      userInterface.addAccessoryView(replaceColorView);

          userInterface.addTextLabelWithValue("Page 生效范围：");
          var options = ["所有 Page","当前工作 Page"];
          userInterface.addAccessoryView(createRadioButtons(options, options[0]));

      // userInterface.addTextLabelWithValue("替换元素类型：");
          // var options = ["所有元素","同种类型元素"];
          // userInterface.addAccessoryView(createRadioButtons(options, options[0]));

          userInterface.addButtonWithTitle('确定');
          userInterface.addButtonWithTitle('取消');

          return userInterface.runModal();
      }

      function processButtonClick() {
      colorToFind = colorToFind2 = MSColor.colorWithNSColor(findedColorWell.color()).immutableModelObject().svgRepresentation();
      colorToReplace = hexToRgb(MSColor.colorWithNSColor(replaceColorWell.color()).immutableModelObject().svgRepresentation());
      searchScope = [[[userInterface viewAtIndex: 5] selectedCell] tag];
      // replaceElementType = [[[userInterface viewAtIndex: 7] selectedCell] tag];
      }

      function doFindAndReplace() {
      switch (searchScope) {
        case 0:
          searchInLayer(document);
          break;
        case 1:
          searchInLayer(currentPage);
          break;
      }
      }

    function searchInLayer(layer) {
     var layerType = layer.class();

     switch (layerType) {
       case MSTextLayer:
       case MSShapeGroup:
         if (layerType == selectedLayerType) {
          setColour(layer, layerType, colorToReplace);
         }
         break;
       case MSDocument:
         var documentPages = [layer pages];
         for (var i = 0; i < [documentPages count]; i++) {
           var documentPage = [documentPages objectAtIndex:i];
           searchInLayer(documentPage);
         }
         break;
       case MSPage:
       case MSLayerGroup:
       case MSArtboardGroup:
         var sublayers = [layer layers];
         for (var i = 0; i < [sublayers count]; i++) {
           var sublayer = [sublayers objectAtIndex: i];
           searchInLayer(sublayer);
         }
         break;
     }
   }

   if(replaceCount){
       NSApp.displayDialog('替换成功，共找到' + replaceCount + '处\r\n');
   }
   else{
       NSApp.displayDialog('没有找到"' + textToFind + '"');
   }
}
