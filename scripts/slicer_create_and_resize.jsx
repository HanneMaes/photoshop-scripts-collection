// by RanzigenDanny
// Slicer Create and Resize
// v4

// GUIDE
// resize and create slice layer
// when there already is on just run Slicer_Engine()

// TODO

//@include "functions/slicerEngine.jsx"
//@include "functions/promptPlus.jsx"
//@include "functions/layerFunctions.jsx"

//****************************************************************************************************************************************************

// get the user input layer - same as in Slicer_Engine.jsx
var userInputLayerName = getLayerName("inputLayer");
var userInputText = getUserInputText();

// only execute when there is no input layer
if(!userInputText) {

  // prompt only when the user gave a wrong percentage or normalized percentage in the ctrl-shit-o script
  var percentNormalized = promptPlus('number', 'Resize percentage normalized: ', 2, 'promptPlus');

  // resize
  var newWidth = app.activeDocument.width * percentNormalized;
  var newHeight = app.activeDocument.height * percentNormalized;
  app.activeDocument.resizeImage(newWidth, newHeight, null, ResampleMethod.BICUBIC);

  // slicer
  Slicer_Engine("createandresize", percentNormalized);

} else {

  // slicer
  Slicer_Engine();

}

//****************************************************************************************************************************************************
