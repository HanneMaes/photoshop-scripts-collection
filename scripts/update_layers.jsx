// by RanzigenDannylayer
// by RanzigenDannylayer
// UpdateLayerStyle
// v22

// GUIDE
// you can select multiple layers with different layers tags to update multiple layer tags
// I will copy:
//		the layer fx
//		the layer settings: blend mode, opacity
//		the layer mask
//		almost all text settins

// TODO
// na het script opent hij elke map waarnaar we copieren zodat we elke layers zien, maar dat zoou niet mogen voor reset document state
// zowel the copyen als het pasten van de fx zit in de functie copyPasteLayerFx(), maar dan copy je ook voor elke keer je paste, het zou beter zijn als ke 1keer de fx copieerd en ivp elke keer

//@include "functions/layerFunctions.jsx"
//@include "functions/progressWindow.jsx"
//@include "functions/errorHandler.jsx"
//@include "functions/copyPasteLayerFx.jsx"
//@include "functions/regexFunctions.js"
//@include "functions/dialogPlus.jsx"

//****************************************************************************************************************************************************
//****************************************************************************************************************************************************

var layerColor = "green";
var tags = []; // all the tags we want to update
var copyLayers = [];	// the layers we want to copy from
var pasteLayers = []; // has a dimention for every tag we want to update
var allLayers = [];

showProgressWindow();
updateProgressWindow('Update Layers', 'Title');

// get the original document state
var activeDoc;
var activeLayer;
getDocumentState();

// get copy layers
updateProgressWindow('Getting selected layers');
copyLayers = getSelectedLayers();

// get tags from the copy layers
tags = getTagsFromSelectedLayers();

// gather all layers
updateProgressWindow('gatherArtLayers()');
allLayers = gatherArtLayers();

// get paste layers
pasteLayers = getCopyLayers();

// copy paste
doCopyPaste();

// // loop trough all selected layers
// for(var i in selectedLayers) {
//
// 	// make the layers we are copying from the active layer
// 	var rootLayer = selectedLayers[i];
// 	var layerName = rootLayer.name;
// 	app.activeDocument.activeLayer = rootLayer;
//
// 	// change to color of the root layer
// 	changeActiveLayerColor(layerColor);
//
// 	// get the layer tag
// 	updateProgressWindow('get layer tag');
// 	allTags[i] = "#" + findWordStartingWith(layerName, "#");
// 	updateProgressWindow('tag found: ' + allTags[i]);
//
// 	// find other layers with tag except the root layer
// 	updateProgressWindow('find other layers with tag');
// 	copyLayers[i] = findOtherLayersWithTag(allLayers, allTags[i], rootLayer);
//
// 	// copy text properties
// 	updateProgressWindow('Get text properties if needed');
// 	var textProperties = {};
// 	if(rootLayer.kind == LayerKind.TEXT) {
// 		updateProgressWindow('Rootlayer is a text layer so copy text properties');
// 		textProperties = getTextProperties(rootLayer);
// 	}
// } // for i in all layers

		// // paste stuff
		// updateProgressWindow('Pasting layer fx with tag: ' + layerName, 'Title');
		// for(var i in copyLayers) {
		//
		// 	updateProgressWindow('copying for ' + rootLayer + ' to ' + copyLayers[i]);
		//
		// 	// editing the layer sets the layer automatically to visible
		// 	var visibility = copyLayers[i].visible;
		//
		// 	// copy layer FX, blend mode and layer settings
		// 	copyPasteLayerFx(rootLayer, copyLayers[i]);
		//
		// 	// copy text font and color
		// 	if((rootLayer.kind == LayerKind.TEXT) && (copyLayers[i].kind == LayerKind.TEXT)) pasteTextProperties(copyLayers[i], textProperties);
		//
		// 	// change the color of the layer
		// 	app.activeDocument.activeLayer = copyLayers[i];
		// 	changeActiveLayerColor(layerColor);
		//
		// 	// restore the layer visibility
		// 	copyLayers[i].visible = visibility;
		// }

// the end
resetDocumentState();
closeProgressWindow();
report('endScript');

//****************************************************************************************************************************************************
//****************************************************************************************************************************************************

function getTagsFromSelectedLayers() {

	var allTags = [];

	// loop trough all selected layers
	for(var i in copyLayers) {

		// get the layer tag
		updateProgressWindow('get layer tag');
		allTags[i] = "#" + findWordStartingWith(copyLayers[i].name, "#");
		updateProgressWindow('tag found: ' + allTags[i]);
	}

	return allTags;
}

//****************************************************************************************************************************************************

function getCopyLayers() {

	var layers = [];

	// loop trough tags
	for(var i in tags) {

		var layersFound = [];

		// loop trough all the layers in the document
		for(var j in allLayers) {

			// check if we have a layer with the correct tag
			if( findSymbol(allLayers[j].name, tags[i]) ) {
				if(allLayers[j] != copyLayers[i]) layersFound.push(allLayers[j]);
			}

		} // jar j in all layers

		layers.push(layersFound);

	} // var i in tags

	return layers;
}

//****************************************************************************************************************************************************

function doCopyPaste() {

	// loop trough all the copy layers
	for(var i in copyLayers) {

		updateProgressWindow(tags[i], 'Title');

		// make the layers we are copying from the active layer
		app.activeDocument.activeLayer = copyLayers[i];

		// change to color of the root layer
		changeActiveLayerColor(layerColor);

		// copy text properties
		updateProgressWindow('Get text properties if needed');
		var textProperties = {};
		if(copyLayers[i].kind == LayerKind.TEXT) {
			updateProgressWindow('Rootlayer is a text layer so copy text properties');
			textProperties = getTextProperties(copyLayers[i]);
		}

		// loop trough pasteLayers
		for(var j in pasteLayers[i]) {

			updateProgressWindow('copying for ' + copyLayers[i] + ' to ' + pasteLayers[i][j]);

			// editing the layer sets the layer automatically to visible
			var visibility = pasteLayers[i][j].visible;

			// copy layer FX, blend mode and layer settings
			copyPasteLayerFx(copyLayers[i], pasteLayers[i][j]);

			// copy text font and color
			if((copyLayers[i].kind == LayerKind.TEXT) && (pasteLayers[i][j].kind == LayerKind.TEXT)) pasteTextProperties(pasteLayers[i][j], textProperties);

			// change the color of the layer
			app.activeDocument.activeLayer = pasteLayers[i][j];
			changeActiveLayerColor(layerColor);

			// restore the layer visibility
			pasteLayers[i][j].visible = visibility;

		} // for j in paste layers
	}	// for i in copy layers

	// // loop trough all selected layers
	// for(var i in selectedLayers) {
	//
	// 	// make the layers we are copying from the active layer
	// 	var rootLayer = selectedLayers[i];
	// 	var layerName = rootLayer.name;
	// 	app.activeDocument.activeLayer = rootLayer;
	//
	// 	// change to color of the root layer
	// 	changeActiveLayerColor(layerColor);
	//
	// 	// get the layer tag
	// 	updateProgressWindow('get layer tag');
	// 	allTags[i] = "#" + findWordStartingWith(layerName, "#");
	// 	updateProgressWindow('tag found: ' + allTags[i]);
	//
	// 	// find other layers with tag except the root layer
	// 	updateProgressWindow('find other layers with tag');
	// 	copyLayers[i] = findOtherLayersWithTag(allLayers, allTags[i], rootLayer);
	//
	// 	// copy text properties
	// 	updateProgressWindow('Get text properties if needed');
	// 	var textProperties = {};
	// 	if(rootLayer.kind == LayerKind.TEXT) {
	// 		updateProgressWindow('Rootlayer is a text layer so copy text properties');
	// 		textProperties = getTextProperties(rootLayer);
	// 	}
	// } // for i in all layers

			// // paste stuff
			// updateProgressWindow('Pasting layer fx with tag: ' + layerName, 'Title');
			// for(var i in copyLayers) {
			//
			// 	updateProgressWindow('copying for ' + rootLayer + ' to ' + copyLayers[i]);
			//
			// 	// editing the layer sets the layer automatically to visible
			// 	var visibility = copyLayers[i].visible;
			//
			// 	// copy layer FX, blend mode and layer settings
			// 	copyPasteLayerFx(rootLayer, copyLayers[i]);
			//
			// 	// copy text font and color
			// 	if((rootLayer.kind == LayerKind.TEXT) && (copyLayers[i].kind == LayerKind.TEXT)) pasteTextProperties(copyLayers[i], textProperties);
			//
			// 	// change the color of the layer
			// 	app.activeDocument.activeLayer = copyLayers[i];
			// 	changeActiveLayerColor(layerColor);
			//
			// 	// restore the layer visibility
			// 	copyLayers[i].visible = visibility;
			// }

}

//****************************************************************************************************************************************************

function getDocumentState() {
	updateProgressWindow('Gettings document state', 'Title');

	activeDoc = app.activeDocument;
	activeLayer = app.activeDocument.activeLayer;
}

//****************************************************************************************************************************************************

function resetDocumentState() {
	// leave the document in the same state as we found it

	updateProgressWindow('Reset document state', 'Title');

	// reselect our root layer
	updateProgressWindow('Reselect our root layer');
	app.activeDocument = activeDoc;
	app.activeDocument.activeLayer = activeLayer;
}

//****************************************************************************************************************************************************
