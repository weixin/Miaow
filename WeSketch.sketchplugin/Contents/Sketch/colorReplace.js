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
        replaceCount = 0,
        replaceElementTypeAll = 0;
    var userInterface,
        findedColorWell,
        replaceColorWell;

    if (layerCount == 0) {
     colorToFind = colorToFind2 = '';
    }
    else {
      var selectedLayer = getSelectedLayer(selection.firstObject());
      var selectedLayerType = selectedLayer.class();
      colorToFind = colorToFind2 = getColour(selectedLayer);
      if(colorToFind == undefined){
        colorToFind = colorToFind2 = getboderColor(selectedLayer);
      }
    }
    if(createUserInterface(colorToFind) != '1000'){
          return;
      }
    else {
      processButtonClick();

      doFindAndReplace();
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
     } else if (selectedLayerType == 'MSShapeGroup') {
      fill = layer.style().fills().firstObject();

      if (fill != undefined && fill.isEnabled()) {
        colour = fill.color();
      }
     }else{
      return false;
     }

     if (colour != undefined) {
      colour = colour.immutableModelObject();
     }
     return colour;
    }

    function getboderColor(layer){
      var colour;
      var fill;
      var selectedLayerType = layer.class();

      
      border = layer.style().borders().firstObject();

      if (border != undefined && border.isEnabled()) {
        colour = border.color();
      }else{
        return false;
      }
      if (colour != undefined) {
        colour = colour.immutableModelObject();
      }else{
        return false;
      }
      
      return colour;
    }

    function setColour(layer , colorToReplace) {
      function setColor(layer,hexColour){
       if (hexColour == colorToFind) {
         var fill = layer.style().fills().firstObject();
         if (fill != undefined) {
          replaceCount++;
          fill.color = MSColor.colorWithRed_green_blue_alpha(colorToReplace.r / 255, colorToReplace.g / 255, colorToReplace.b / 255, 1.0);
         }
       }
      }
      function setBorderColor(layer,hexColour){
        if (hexColour == colorToFind) {
          log(layer.style().borders());
          var fill = layer.style().borders().firstObject();
          if (fill != undefined) {
            replaceCount++;
            fill.color = MSColor.colorWithRed_green_blue_alpha(colorToReplace.r / 255, colorToReplace.g / 255, colorToReplace.b / 255, 1.0);
          }
        }
      }
      var layerColour = getColour(layer);
      log(layerColour);
      var borderColour = getboderColor(layer);
      if(!layerColour && !borderColour){
        return;
      }else if(layerColour && borderColour){
        var hexColour = '#' + layerColour.hexValue();
        var hexBorderColour = '#' + borderColour.hexValue();
        setColor(layer,hexColour);
        setBorderColor(layer,hexBorderColour);
      }else if(layerColour){
        var hexColour = '#' + layerColour.hexValue();
        setColor(layer,hexColour);
      }else if(borderColour){
        var hexBorderColour = '#' + borderColour.hexValue();
        setBorderColor(layer,hexBorderColour);
      }
    }

    function setTextColor(layer,colorToReplace){
      replaceCount++;
      layer.textColor = MSColor.colorWithRed_green_blue_alpha(colorToReplace.r / 255, colorToReplace.g / 255, colorToReplace.b / 255, 1.0);
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

      userInterface.addTextLabelWithValue("查找颜色(默认值为当前选中元素颜色)：");
      findedColorWell = NSColorWell.alloc().initWithFrame(NSMakeRect(0, 0, 50, 25));
      var findedColorHex = colorToFind ? '#' + colorToFind.hexValue() : "#1AAD19";
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
      var replaceColorHex = colorToFind ? '#' + colorToFind.hexValue() : "#1AAD19"; // #1AAD19 同设置中的默认值
      var replaceColorAlpha = 1;
      var replaceMSColor = MSImmutableColor.colorWithSVGString(replaceColorHex);
      replaceMSColor.setAlpha(replaceColorAlpha);
      var replaceColor = replaceMSColor.NSColorWithColorSpace(NSColorSpace.deviceRGBColorSpace());
      replaceColorWell.setColor(replaceColor);
      var replaceColorView = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 50, 25)); // 创建包含要替换颜色控件的容器
      replaceColorView.addSubview(replaceColorWell);
      userInterface.addAccessoryView(replaceColorView);

      userInterface.addTextLabelWithValue("生效范围：");
      var options = ["所有 Page","当前工作 Page"];
      userInterface.addAccessoryView(createRadioButtons(options, options[0]));

      userInterface.addTextLabelWithValue("生效元素：");
      var options2 = ["同类型元素","所有元素"];
      userInterface.addAccessoryView(createRadioButtons(options2, options2[0]));

      userInterface.addButtonWithTitle('确定');
      userInterface.addButtonWithTitle('取消');

      return userInterface.runModal();
    }

    function processButtonClick() {
      colorToFind = colorToFind2 = MSColor.colorWithNSColor(findedColorWell.color()).immutableModelObject().svgRepresentation();
      colorToReplace = hexToRgb(MSColor.colorWithNSColor(replaceColorWell.color()).immutableModelObject().svgRepresentation());
      searchScope = [[[userInterface viewAtIndex: 5] selectedCell] tag];
      replaceElementTypeAll = [[[userInterface viewAtIndex: 7] selectedCell] tag];
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
        if (layerType == selectedLayerType || replaceElementTypeAll == 1) {
          setTextColor(layer, colorToReplace);
        }
        break;
       case MSShapeGroup:
         if (layerType == selectedLayerType || replaceElementTypeAll == 1) {
          setColour(layer, colorToReplace);
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
       context.document.showMessage('替换成功，共找到' + replaceCount + '处\r\n');
   }
   else{
       context.document.showMessage('没有找到需要替换的颜色');
   }
}
