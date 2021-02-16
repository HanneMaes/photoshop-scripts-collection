// by RanzigenDanny
// Texturizer
// v1

// GUIDE
// ! the folder with the textures may only contain images files
// ! somethimes downloaded images are locked and are protected against unlocking then, I think then the script will crash
// choose a folder and I will import all the images into tho document
// the images will be placed according to the slected layer

//@include "functions/errorHandler.jsx"
//@include "functions/progressWindow.jsx"
//@include "functions/saveFunctions.jsx"
//@include "functions/layerFunctions.jsx"
//@include "functions/selectionFunctions.jsx"

//****************************************************************************************************************************************************
//****************************************************************************************************************************************************

// create and show dialog and continue of pressed ok
var dialogValues = createDialog();
if(dialogCanceled) var scriptCanceled = true; // we need dialogPlusCanceled for compatebility with errorHandler
else {

  // choose a folder
  var fileList = getFilesInFolder(false,Folder.selectDialog("Select a folder to tag"));

  showProgressWindow();
  updateProgressWindow('Preparing...', 'title');

  var rootDoc =   app.activeDocument;
  var centerPosRoot = getActiveLayersPositions('center');
  var layerWidth  = getLayerWidth();
  var layerHeight = getLayerHeight();

  // get the values from the dialog
  updateProgressWindow('getting dialog values');
  if(dialogValues['Image placement'] == 1)  var imageFitting = true;
  else                                      var imageFitting = false;

  // loop trough all the files
  for(var i in fileList) {

    updateProgressWindow(fileList[i].name, 'title');

    // open the file
    updateProgressWindow(fileList[i].name + ' opening file');
    newDoc = app.open(fileList[i]);

    // copy, paste & close to the root doc
    updateProgressWindow(fileList[i].name + ' copy pasting file');
    copyCanvasToDocument(newDoc, rootDoc, "Texturizer: " + fileList[i].name);
    newDoc.close(SaveOptions.DONOTSAVECHANGES);

    // position the center of the texutre to the center of the layer
    positionTexture();

    // fit the texture to the layer
    if(imageFitting) fitTexture();

  } // i in filelist

  // The End
  closeProgressWindow();
  report('endScript');
}

//****************************************************************************************************************************************************
//****************************************************************************************************************************************************

function createDialog() {

  var newDialogContent = [];
      newDialogContent.push(['dropdown', 'Image placement:', ['Original image size', 'Fit images'], 0]);
      // newDialogContent.push(['path', 'Choose Path:']);

  // return createDialogPlus(newDialogContent, 'showDialog', 'id', 'texturizer');  // "index" or "id", "noJsonSave" = json save or not or the name of the json file
  return createDialogPlus(newDialogContent, 'showDialog', 'id', false);  // "index" or "id", "noJsonSave" = json save or not or the name of the json file
}

//****************************************************************************************************************************************************

function copyCanvasToDocument(copyDoc, pasteDoc, newLayerName) {
// copies and pasts the whole convas
// I think it does not collapse all the layers
// at the end of this function the pasteDoc is the active document

  /********/
  /* COPY */
  /********/

  unlockBaseLayer(); // if the base layer is locked (with downloaded images for example), this piece of code double clicks the base layer
  selectWholeCanvas();
  app.activeDocument.selection.copy(true);

  /*********/
  /* PASTE */
  /*********/

  app.activeDocument = pasteDoc;
  app.activeDocument.paste();
  app.activeDocument.activeLayer.name = newLayerName;
  app.activeDocument.activeLayer.grouped = true;  // make clipping mask
}

//****************************************************************************************************************************************************

function positionTexture() {
// position the center of the texutre to the center of the layer

  var centerPosTexture = getActiveLayersPositions('center');
  var centerPosOffset = [
    centerPosRoot[0] - centerPosTexture[0],
    centerPosRoot[1] - centerPosTexture[1]
  ];

  // apparently he positions the image on pixel to far to the right and one to far to the bottom
  var extraOffset = -1;

  // do the translate
  app.activeDocument.activeLayer.translate(centerPosOffset[0] + extraOffset, centerPosOffset[1] + extraOffset);

}

//****************************************************************************************************************************************************

function fitTexture() {
// fit the texture to the layer

  var clippingLayerHeight = getLayerHeight();
  var clippingLayerWidth  = getLayerWidth();

  var normalizedHeigt = layerHeight / clippingLayerHeight * 100;
  var normalizedWidth = layerWidth / clippingLayerWidth * 100;

  if(normalizedHeigt > normalizedWidth) scaleFactor = normalizedHeigt;
  else                                  scaleFactor = normalizedWidth;

  app.activeDocument.activeLayer.resize(scaleFactor, scaleFactor);

}

//****************************************************************************************************************************************************
