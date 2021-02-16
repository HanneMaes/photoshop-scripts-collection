// by RanzigenDanny
// Quick export
// v7

// GUIDE
// gives the option to save all the open docs
// saves to open document so there is no need to open save for web and wait a long time when your file is huge
// you can save a small,large or both
// saves docname_size.png
// saves on the same location as the open document
// you can save a seletion of the image

// TODO
// selection and multiple open docs do not work
// als er comps zijn vragen om ook alle comps te exporteren
// progress window het nr van de image die hij aan het exporte is klopt niet
// the script takes a very long time when there are multiple layers because we do not specify a slice group - so maybe we should specify a slice group are the slice layers as an object or the bounds

//@include "functions/ErrorHandler.jsx"
//@include "functions/saveFunctions.jsx"
//@include "functions/progressWindow.jsx"
//@include "functions/layerFunctions.jsx"
//@include "functions/dialogPlus.jsx"

//****************************************************************************************************************************************************
//****************************************************************************************************************************************************
//****************************************************************************************************************************************************

// check if we have a selection
var userSelection = false;
var sliceSelection = app.activeDocument.selection; // we save the slice selection here because we maybe need to replicate it for multiple documents
try {
  sliceSelection.expand( 5 );
  userSelection = true;
} catch (e) {}

// show the dialog
var dialogValues = showDialog(userSelection, app.documents.length);

// check if did not press cancel in our dialog
if(dialogCanceled) var scriptCanceled = true; // we need dialogPlusCanceled for compatebility with errorHandler
else {

  // interperate the dialogValues
  var exportName = dialogValues['Name'];

  if(dialogValues["Size"] == 0) exportSize = ["small"];
  if(dialogValues["Size"] == 1) exportSize = ["fullsize"];
  if(dialogValues["Size"] == 2) exportSize = ["small", "fullsize"];

  var exportSelection = dialogValues["Use selection"];
  if(typeof exportSelection === "undefined") var exportSelection = false;

  var exportAllDocs = dialogValues["Export all open docs"];
  if(typeof exportAllDocs === "undefined") var exportAllDocs = false;

  // execute the export
  export_Engine(exportSize, exportName, exportSelection, exportAllDocs);
}

//****************************************************************************************************************************************************
//****************************************************************************************************************************************************
//****************************************************************************************************************************************************

function export_Engine(modes, imageName, selection, openDocsBool) {
// modes can be ["small"], ["fullsize"], ["small", "fullsize"]
// selection = true or false
// openDocsBool = true of false

  showProgressWindow();
  updateProgressWindow('Preparing...', 'title');

  // if we export multiple docs and the export name becomes a suffix
  var multiDocSuffix = "";
  if(openDocsBool) {

    // loop trough all the doc names to see if one of the sames is the same as imageName
    var sameNameFound = false;

    var num = app.documents.length;
    for(var j = 0; j < num; j++){
      app.activeDocument = app.documents[j];
      if(imageName == removeExtention(app.documents[j].name)) {
        sameNameFound = true;
        break;
      }
    }

    if(!sameNameFound) multiDocSuffix = imageName;
  }

  // making the slice layer from the selection
  var selectionSuffix = "";
  if(selection != false) {

    updateProgressWindow('calculation the selection');

    var sliceForSave = false;

    // make a new layer
    var sliceLayer = app.activeDocument.artLayers.add();
    var sliceLayerName = "generated slice layer";
    sliceLayer.name = sliceLayerName;

    changeActiveLayerColor("red");

    // fill the selection
    var fillColor = new SolidColor();
        fillColor.rgb.red = 255;
        fillColor.rgb.green = 0;
        fillColor.rgb.blue = 0;
    sliceSelection.fill(app.foregroundColor); // we can only do this when the layer is visible

    // make the layer invisible for the exports
    // we do it after the fill because layers have to be visible in order to be filled
    sliceLayer.visible = false;

    sliceForSave = sliceLayer;
    selectionSuffix = "_selection";
  }

  // decise what docs to export
  var num;
  var docsArray;
  if(openDocsBool) {
    num = app.documents.length;
    docsArray = app.documents;
  } else {
    num = 1;
    docsArray = [app.activeDocument];
  }

  // loop trough all the open documetns or just trough the active doc
  for(var j = 0; j < num; j++){

    app.activeDocument = docsArray[j];

    // make the array of images we are about to exports
    var exportTheseImages = [];

    // loop through all the different exports
    for(var i in modes) {

      var imageAmount = Number(i + 1);
      updateProgressWindow('Export ' + imageAmount + ' preparing...', 'title');

      // special settings
      var maxSize = false;
      var suffix = "";

      if(modes[i] != "fullsize") {
      // SMALL
        updateProgressWindow('calculating fullsize size');
        maxSize = [1000, 1000];
        suffix = "";
      } else {
      // FULLSIZE
        updateProgressWindow('calculating small size size');
        suffix = "_fullsize";
      }

      // when exporting multiple docs the name becomes the doc name
      if(openDocsBool) imageName = removeExtention(app.activeDocument.name);

      // other settings
      updateProgressWindow('calculating other settings');
      var settingsObj = {};
                              settingsObj["image"] = imageName + multiDocSuffix + selectionSuffix + suffix + ".png";
                              settingsObj["path"] = app.activeDocument.path;
                              settingsObj["maxsize"] = maxSize;
      if(selection != false)  settingsObj["slice"] = sliceLayerName;

      // add to the array of imges we are going to export
      exportTheseImages.push(settingsObj);
    }

    // check and export all the images
    updateProgressWindow('exporting image ' + imageAmount);
    var imagesCorrect =       saveFilesAsCheck(exportTheseImages);

    if(imagesCorrect == true) saveFilesAs(exportTheseImages);
    else                      alert(imagesCorrect);

    // delete the generated slice layer
    if(selection != false) {
      updateProgressWindow('deleting the generated slice layer');
      app.activeDocument.activeLayer = sliceLayer;
      app.activeDocument.activeLayer.remove();
    }

  }

  // the end
  report('endScript');
  closeProgressWindow();
}

//****************************************************************************************************************************************************

function showDialog(select, amountOfDocs) {
// select = true or false
// amountOfDocs = the amount of open docs

  var newDialogContent = [];

  // basic options
  newDialogContent.push(['edittext', 'Name:', removeExtention(app.activeDocument.name)]);
  if(amountOfDocs > 1) newDialogContent.push(['aftertext', 'Name becomes a suffix when exporting multiple docs']);
  newDialogContent.push(['dropdown', 'Size:', ['small', 'fullsize', 'all sizes']]);

  // extra options
  if(select) newDialogContent.push(['checkbox', 'Use selection', true]);
	if(amountOfDocs > 1) newDialogContent.push(['checkbox', 'Export all open docs', true]);

  return createDialogPlus(newDialogContent, 'showDialog', 'id', 'noJsonSave');  // "index" or "id", "noJsonSave" = json save or not or the name of the json file
}

//****************************************************************************************************************************************************
