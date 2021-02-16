// by RanzigenDanny
// copyPasteLayerFx
// v3

// GUIDE

// TODO
// copy layer masks

//*************************************************************************************************************************************************************************

// variables for the settings we will be copy pasting
var layerOpacity;
var layerBlendMode;

function copyPasteLayerFx(layerFrom, layerTo, docFrom, docTo) {

	var layerFx; // to know which techinques are on the layer, so we know what to copy

	// are we pasting to the same doc or another one
	var differentDocs = true;
	if(docFrom == docTo) differentDocs = false;

    // check for the different techniques we need to copy
	if(differentDocs) app.activeDocument = docFrom;
	layerFx = doesLayerHaveFx();

    // copy stuff
    copyLayerSettingsAndFX(layerFrom);	// copy opacity, blend mode and FX

    // paste stuff
	if(differentDocs) app.activeDocument = docTo;
    pasteLayerSettings(layerTo); 							// paste opacity and blend mode
    if(layerFx) 	pasteLayerStyles(layerTo);	// paste layer FX

	// change the color of the layer (in the layers panel)
	//@include "functions/layerFunctions.jsx"
	changeActiveLayerColor();
}

//*************************************************************************************************************************************************************************

function doesLayerHaveFx() {
	// return true if the layer has FX else return false

	updateProgressWindow('Checking everything...', 'Title');

	var idCopyLayerFx = charIDToTypeID( "CpFX" ); // action: copy the layer Fx

	// --- does the layer have a layer style fx?
	updateProgressWindow('checking if the selected layer has a layer style');
	try {
		executeAction(idCopyLayerFx, undefined, DialogModes.NO);	// execute the action
		return true;
	} catch (e) {
		return false;
	}
}

//****************************************************************************************************************************************************

function copyLayerSettingsAndFX(layer) {
	// copy the blend mode and opacity

	layerOpacity = layer.opacity;
	layerBlendMode = layer.blendMode;
}

//****************************************************************************************************************************************************

function pasteLayerSettings(toLayer) {
	// paste blend mode and opacity

	toLayer.opacity = layerOpacity;
	toLayer.blendMode = layerBlendMode;
}


//****************************************************************************************************************************************************

function pasteLayerStyles(toLayer) {
	// the toLayer must be a layer variable

	updateProgressWindow('Pasting layer fx to layer: ' + toLayer.name);

	app.activeDocument.activeLayer = toLayer;

	removeLayerFx();

	// paste the layer Fx
	var idPasteLayerFx = charIDToTypeID( "PaFX" );				// action: paste the layer Fx
	executeAction( idPasteLayerFx, undefined, DialogModes.NO);  // execute the action
}

//****************************************************************************************************************************************************

function removeLayerFx() {
// removes the existing layer fx of the active layer

	try {
		var iddisableLayerStyle = stringIDToTypeID( "disableLayerStyle" );  // action: clear the layer Fx
		executeAction( iddisableLayerStyle, undefined, DialogModes.NO); 		// execute the action
	} catch(e) {}
}

//****************************************************************************************************************************************************
