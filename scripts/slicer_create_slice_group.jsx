// by RanzigenDanny
// Slicer Create Slice Group
// v3

// GUIDE
// create a slice group

// TODO

//@include "functions/slicerEngine.jsx"

//****************************************************************************************************************************************************

// IF THERE IS A USER INPUT LAYER
var userInputText = getTextLayerContent();
if(userInputText) {

  createslicegroup();
  addDefaultLine("slicegroup");
  alert("I created:\r" + getSliceGroupNames()[0] + ": for all your slices", 'RanzScrip talks to you');

} else {
// IF THERE IS NO USER INPUT LAYER

  // create a user input layer and slice group
  Slicer_Engine("createslicegroup");
}

//****************************************************************************************************************************************************
