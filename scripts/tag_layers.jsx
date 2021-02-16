// by RanzigenDanny
// Tag Layers
// v5

// GUIDE
// tags the (multiple) layer name(s): 'Layer 0' > 'Layer 0 #Tag'

// TODO

//@include "functions/layerFunctions.jsx"
//@include "functions/dialogPlus.jsx"
//@include "functions/progressWindow.jsx"
//@include "functions/errorHandler.jsx"

//****************************************************************************************************************************************************
//****************************************************************************************************************************************************

// get all the layers we want to tag
var selectedLayers = getSelectedLayers();
var tagAllLayers = false;

// show the dialog
var dialogValues = createAndShowDialog(selectedLayers);

// check if did not press cancel in our dialog
if(dialogCanceled)  var scriptCanceled = true; // we need dialogPlusCanceled for compatebility with errorHandler
else {

  // show the window
	showProgressWindow();
  updateProgressWindow('Preparing...', 'title');

  // gather all the art layers if the user wants to tag all the layers
  updateProgressWindow('Gathering all layers');
  if(tagAllLayers) selectedLayers = gatherArtLayers();

  // loop through all the layers
	for(var i in selectedLayers) {

    updateProgressWindow(selectedLayers[i].name, 'title');

    // exceptions
    if(selectedLayers[i].name != "// User input" && selectedLayers[i].name != "#RanzScript user input") {

      // reaming the layer sets the layer automatically to visivbe
      var visibility = selectedLayers[i].visible;

      // rename
      updateProgressWindow('renaming layer');
      selectedLayers[i].name += " " + dialogValues["Tag"];

      // restore the visibility
      selectedLayers[i].visible = visibility;
    }
  }

  // The End
  closeProgressWindow();
  report('endScript');

} // if(dialogCanceled)

//****************************************************************************************************************************************************
//****************************************************************************************************************************************************

function createAndShowDialog(selectedLayers) {

  var newDialogContent = [];
      newDialogContent.push(['edittext', 'Tag:', '#']);

  // if we have 1 layer selected it is easier to do strayed from photoshop
  // so ask to to tag all the layers
  if(selectedLayers.length <= 1) {
     tagAllLayers = true;

     newDialogContent.push(['title', 'Do I tag all layers?']);
     newDialogContent.push(['btnyes', 'All layers']);
     newDialogContent.push(['btnno', 'Cancel']);
  }

  return createDialogPlus(newDialogContent, 'showDialog', 'id', 'noJsonSave');  // "index" or "id", "noJsonSave" = json save or not or the name of the json file
}

//****************************************************************************************************************************************************
