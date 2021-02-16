// by RanzigenDannylayer
// Remove Layer FX
// v2

// GUIDE

// TODO

//@include "functions/copyPasteLayerFx.jsx"
//@include "functions/layerFunctions.jsx"

//****************************************************************************************************************************************************

var selectedLayers = getSelectedLayers();

for(var i in selectedLayers) {
  app.activeDocument.activeLayer = selectedLayers[i];
  removeLayerFx();
}

//****************************************************************************************************************************************************
