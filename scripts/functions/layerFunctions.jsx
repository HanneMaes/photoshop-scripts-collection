// by RanzigenDanny
// layerFunctions
// v28

// GUIDE

// TODO

// INFO
// all text object keys: http://jongware.mit.edu/pscs5js_html/psjscs5/pc_TextItem.html

//****************************************************************************************************************************************************

function getLayerHeight() { return app.activeDocument.activeLayer.bounds[2] - app.activeDocument.activeLayer.bounds[0]; }
function getLayerWidth()  { return app.activeDocument.activeLayer.bounds[3] - app.activeDocument.activeLayer.bounds[1]; }

//****************************************************************************************************************************************************

function unlockBaseLayer() {
// if the base layer is locked (with downloaded images for example)
// this piece of code double clicks the base layer

  var idsetd = charIDToTypeID( "setd" );
      var desc35 = new ActionDescriptor();
      var idnull = charIDToTypeID( "null" );
          var ref20 = new ActionReference();
          var idLyr = charIDToTypeID( "Lyr " );
          var idBckg = charIDToTypeID( "Bckg" );
          ref20.putProperty( idLyr, idBckg );
      desc35.putReference( idnull, ref20 );
      var idT = charIDToTypeID( "T   " );
          var desc36 = new ActionDescriptor();
          var idOpct = charIDToTypeID( "Opct" );
          var idPrc = charIDToTypeID( "#Prc" );
          desc36.putUnitDouble( idOpct, idPrc, 100.000000 );
          var idMd = charIDToTypeID( "Md  " );
          var idBlnM = charIDToTypeID( "BlnM" );
          var idNrml = charIDToTypeID( "Nrml" );
          desc36.putEnumerated( idMd, idBlnM, idNrml );
      var idLyr = charIDToTypeID( "Lyr " );
      desc35.putObject( idT, idLyr, desc36 );
  executeAction( idsetd, desc35, DialogModes.NO );

}

//*************************************************************************************************************************************************************************

function getSelectedLayers() {
// returns an array of layer objects

  var resultLayers=new Array();
  try{
    var idGrp = stringIDToTypeID( "groupLayersEvent" );
    var descGrp = new ActionDescriptor();
    var refGrp = new ActionReference();
    refGrp.putEnumerated(charIDToTypeID( "Lyr " ),charIDToTypeID( "Ordn" ),charIDToTypeID( "Trgt" ));
    descGrp.putReference(charIDToTypeID( "null" ), refGrp );
    executeAction( idGrp, descGrp, DialogModes.NO );
    for (var ix=0;ix<app.activeDocument.activeLayer.layers.length;ix++){resultLayers.push(app.activeDocument.activeLayer.layers[ix])}
    var id8 = charIDToTypeID( "slct" );
    var desc5 = new ActionDescriptor();
    var id9 = charIDToTypeID( "null" );
    var ref2 = new ActionReference();
    var id10 = charIDToTypeID( "HstS" );
    var id11 = charIDToTypeID( "Ordn" );
    var id12 = charIDToTypeID( "Prvs" );
    ref2.putEnumerated( id10, id11, id12 );
    desc5.putReference( id9, ref2 );
    executeAction( id8, desc5, DialogModes.NO );
  } catch (err) { }

  return resultLayers;
}

//*************************************************************************************************************************************************************************

function gatherArtLayers_multiple(layerSetsArray) {
  // DANGEROUS SLOWS YOUR SCRIPT DOWN ALOT!
  // returns an abject
  // { "slice group folder name": [array of layers in the group],
  //	 "slice group folder name": [array of layers in the group],
  //   "slice group folder name": [array of layers in the group], }

  var layersSetsObj = {};
  var checkedLayerSets = [];

  for(var i in layerSetsArray) {

    // because this takes a very long to calculate we check if we do not already have gathers all the art layers of that layer set
    var gather = true;
    for(var j in checkedLayerSets) {
      if(layerSetsArray[i] == checkedLayerSets[j]) {
        gather = false;
        break;
      }
    }

    // add to object
    if(gather) {
      // alert("these are the layers in " + layerSetsArray[i]);
      layersSetsObj[layerSetsArray[i]] = gatherArtLayers(layerSetsArray[i]);
      // for(var j in layersSetsObj[layerSetsArray[i]]) alert(layersSetsObj[layerSetsArray[i]][j])
    }

    checkedLayerSets.push(layerSetsArray[i]);
  }

  return layersSetsObj;
}

//*************************************************************************************************************************************************************************

// MAYBE THIS CODE IS FASTER ???
/*
function collectLayers (layer, collect) {
	for (var i = 0, n = layer.layers.length; i < n; i++) {
		var child = layer.layers[i];
		if (ignoreHiddenLayers && !child.visible) continue;
		if (child.bounds[2] == 0 && child.bounds[3] == 0) continue;
		if (child.layers && child.layers.length > 0)
			collectLayers(child, collect);
		else if (child.kind == LayerKind.NORMAL) {
			collect.push(child);
			child.visible = false;
		}
	}
}
*/

function gatherArtLayers(layerSet) {
// DANGEROUS SLOWS YOUR SCRIPT DOWN ALOT!

// layerSet can be a string or app.activeDocument.layers.getByName(string) or app.activeDocument for all the layers
// return an array with all the layers in a layer set (layer group)
// puts all the layers in a layer set (folder) in the array 'artLayers' (groups not included)
// if layerSet is a folder the folder must be top level!
// layers are arranged from top to bottom	and level down trough the map structure

  var artLayers = [];

  if(typeof layerSet === "undefined") var layerSet = app.activeDocument;
  // alert(layerSet);

  // if layerSet is a string make it a layer set object
  try {
    layerSet.artLayers.length;
  } catch(err) {
    try {
      layerSet = app.activeDocument.layers.getByName(layerSet);
    } catch(err) {
      return false;
    }
  }

  // part I
  for (var i = 0; i < layerSet.artLayers.length; i++) {
    artLayers.push(layerSet.artLayers[i]);
  }

  // part II
  for (i = 0; i < layerSet.layerSets.length; i++) {
    gatherArtLayers(layerSet.layerSets[i]);
  }

  // var layersTxt = "length: " + artLayers.length;
  // for(var i in artLayers) layersTxt += "\n" + artLayers[i].name;
  // alert(layersTxt);

  return artLayers;
}

//*************************************************************************************************************************************************************************

function getTextLayerContent(name) {
// return the text of a text layer
// returns false if the layer is not found
// will only look trough the top of the layers hierarghy
// if there are multiple layers with the name he will take the top one

  try {
    var layer = app.activeDocument.artLayers.getByName(name);
    return layer.textItem.contents;
  } catch(e) {
    return false;
  }
}

//*************************************************************************************************************************************************************************

function setTextLayerContent(name, content) {
// will only look trough the top of the layers hierarghy
// if there are multiple layers with the name he will take the top one
// returns false if the layer is not found

  try {
    var layer = app.activeDocument.artLayers.getByName(name);
    layer.textItem.contents = content;
    return layer.textItem.contents;
  } catch(e) {
    return false;
  }
}

//*************************************************************************************************************************************************************************

// function findLayer(lyrName, lyrSet) {
// // will only look trough the top of the layers hierarghy
// // will return false if the layer is not found
// // is the layer is one of the first layers the script will be much faster
//
// // no lyrSet = app.activeDocument.artLayers
//
//     if(typeof lyrSet === "undefined")    lyrSet = app.activeDocument.artLayers;
//     if(typeof lyrName === "undefined") {
//         alert("layerFunction.jsx\nfound no layer for findLayer()");
//         return false;
//     }
//
//     // find
//     var foundLayer = lyrSet.getByName(lyrName);
//
//     // return
//     if(foundLayer.name == lyrName)  return foundLayer;
//     else                            return false;
// }

//*************************************************************************************************************************************************************************
/*
function findLayer(lyrName, lyrKind) {
// will only look trough the top of the layers hierarghy
// will return false if the layer is not found
// is the layer is one of the first layers the script will be much faster

// lyrKind = "text", "normal", "groups"
// no lyrKind = "text"
// no lyrSet = app.activeDocument.artLayers

    if(typeof lyrName === "undefined") {
        alert("layerFunction.jsx\nfound no layer for findLayer()");
        return false;
    }

    if(typeof lyrKind === "undefined")    lyrKind = LayerKind.NORMAL;
    else if (lyrKind == "text")           lyrKind = LayerKind.TEXT;

    // go trough all layers
    var lyrSet = app.activeDocument.artLayers;
    for (var i = 0; i < lyrSet.length; i++) {

        // check if the name and layer kind are correct
        var trimmedLayerName = trim(lyrSet[i].name)
        if( (trimmedLayerName == lyrName) && (lyrSet[i].kind == lyrKind) ) {
            // return the layer object
            return lyrSet[i];
        }
    }

    // return false if we did not find our layer
    return false;
}

// imported from regexfunctions.js
// v6
function trim(string) {
	// delete all the whitespaces before and after the text

	if(string == '') return '';
	else {

		var stringTrimmed = '';
			stringTrimmed = string.replace(/^\s+|\s+$/g,'');

		return stringTrimmed;
	}
}
*/
//*************************************************************************************************************************************************************************

function deleteLayer(name) { removeLayer(name); }
function removeLayer(name) {
// will only look trough the top of the layers hierarghy
// and delete the layer

    var layer = app.activeDocument.artLayers.getByName(name);
    // var layer = findLayer(name);
    app.activeDocument.activeLayer = layer;
    app.activeDocument.activeLayer.remove();
}

//*************************************************************************************************************************************************************************

function changeActiveLayerColor(color) {

    if(typeof color === "undefined") color = "Bl  ";
    color = color.toLowerCase();
    if      (color == "blue")   color = "Bl  ";
    else if (color == "violet") color = "Vlt ";
    else if (color == "green")  color = "Grn ";
    else if (color == "red")    color = "Rd  ";

    // script listener stuff
	var color = charIDToTypeID( color );
    var ref = new ActionReference();
        ref.putEnumerated( charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );
	var desc = new ActionDescriptor();
    	desc.putReference( charIDToTypeID('null'), ref );
    var colorEnumDesc = new ActionDescriptor();
        colorEnumDesc.putEnumerated( charIDToTypeID('Clr '), charIDToTypeID('Clr '), color );
    desc.putObject( charIDToTypeID('T   '), charIDToTypeID('Lyr '), colorEnumDesc );
    executeAction( charIDToTypeID('setd'), desc, DialogModes.NO );
}

//*************************************************************************************************************************************************************************

function getTextProperties(textLayer) {
// return all the text properties of textLayer

    var textProps = {};

    if(textLayer.kind == LayerKind.TEXT) {

        textItem = textLayer.textItem;
        textProps['text'] = 			                              textItem.contents;
        // textProps['size'] = 			                              textItem.size.value; 	// bijvoorbeeld 120
        // textProps['sizeNotValue'] =                          textItem.size;			  // bijvoorbeeld "120 px"
        //textProps['color'] = 			                              textItem.color.rgb;
        //textProps['justification'] = 	                          textItem.justification; // Justification.LEFT, Justification.CENTER, Justification.RIGHT, Justification.LEFTJUSTIFIED, Justification.CENTERJUSTIFIED, Justification.RIGHTJUSTIFIED, Justification.FULLYJUSTIFIED
        textProps['pos'] = 				                              textItem.position;
        textProps['bounds'] = 			                            textItem.bounds;
        //textProps['font'] = 			                              textItem.font;
        /*textProps['tracking'] = 			                          textItem.tracking; // spacing between letters
        // textProps['useAutoLeading'] =                           textItem.useAutoLeading; // boolean
        // if(!textProps['useAutoLeading']) textProps['leading'] = textItem.leading; // spacing between 2 lines
        textProps['verticalScale'] =                            textItem.verticalScale;
        textProps['horizontalScale'] =                          textItem.horizontalScale;
        // textProps['baselineShift'] =                         textItem.baselineShift;
        // textProps['baselineShift'] =                         textItem.autoKerning;
        textProps['fauxBold'] =                                 textItem.fauxBold;
        textProps['fauxItalic'] =                               textItem.fauxBold;
        textProps['capitalization'] =                           textItem.capitalization; // Case.NORMAL, Case.ALLCAPS, Case.SMALLCAPS
        // textProps['superscript'] =                           textItem.superscript;
        // textProps['subscript'] =                             textItem.subscript;
        textProps['underline'] =                                textItem.underline; // UnderlineType.UNDERLINEOFF, UnderlineType.UNDERLINERIGHT, UnderlineType.UNDERLINELEFT
        textProps['strikeThru'] =                               textItem.strikeThru; // UnderlineType.UNDERLINEOFF, UnderlineType.UNDERLINERIGHT, UnderlineType.UNDERLINELEFT
        // textProps['language'] =                              textItem.language; // for hybernation and spelling
        textProps['antiAliasMethod'] =                          textItem.antiAliasMethod; // AntiAlias.NONE, AntiAlias.SHARP, AntiAlias.CRISP, AntiAlias.STRONG, AntiAlias.SMOOTH
        textProps['leftIndent'] =                               textItem.leftIndent;
        textProps['rightIndent'] =                              textItem.rightIndent;
        textProps['spaceAfter'] =                               textItem.spaceAfter;
        textProps['spaceBefore'] =                              textItem.spaceBefore;*/
    }
    return textProps;
}

//*************************************************************************************************************************************************************************

function pasteTextProperties(layerTo, textProps) {
// set all the properties of the textlayer layerTo
// the layer must not be active

  if(layerTo.kind == LayerKind.TEXT) {

    textItem = layerTo.textItem;

    // basic properties
    textItem.color.rgb =                                textProps['color'];
    textItem.justification =                            textProps['justification']; // Justification.LEFT, Justification.CENTER, Justification.RIGHT, Justification.LEFTJUSTIFIED, Justification.CENTERJUSTIFIED, Justification.RIGHTJUSTIFIED, Justification.FULLYJUSTIFIED
    textItem.font =                                     textProps['font'];
    /*textItem.tracking =                                 textProps['tracking']; // spacing between letters
    // textItem.useAutoLeading =                           textProps['useAutoLeading']; // boolean
    // if(!textProps['useAutoLeading']) textItem.leading = textProps['leading']; // spacing between 2 lines
    textItem.verticalScale =                            textProps['verticalScale'];
    textItem.horizontalScale =                          textProps['horizontalScale'];
    // textItem.baselineShift =                         textProps['baselineShift'];
    // textItem.autoKerning =                           textProps['autoKerning'];
    textItem.fauxBold =                                 textProps['fauxBold'];
    textItem.fauxItalic =                               textProps['fauxItalic'];
    textItem.capitalization =                           textProps['capitalization']; //Case.NORMAL, Case.ALLCAPS, Case.SMALLCAPS
    // textItem.superscript =                           textProps['superscript'];
    // textItem.subscript =                             textProps['subscript'];
    textItem.underline =                                textProps['underline']; // UnderlineType.UNDERLINEOFF, UnderlineType.UNDERLINERIGHT, UnderlineType.UNDERLINELEFT
    textItem.strikeThru =                               textProps['strikeThru']; // StrikeThruType.STRIKEOFF, StrikeThruType.STRIKEHEIGHT, StrikeThruType.STRIKEBOX
    // textItem.language =                              textProps['language']; // for hybernation and spelling
    textItem.antiAliasMethod =                          textProps['antiAliasMethod']; // AntiAlias.NONE, AntiAlias.SHARP, AntiAlias.CRISP, AntiAlias.STRONG, AntiAlias.SMOOTH
    textItem.leftIndent =                               textProps['leftIndent'];
    textItem.rightIndent =                              textProps['rightIndent'];
    textItem.spaceAfter =                               textProps['spaceAfter'];
    textItem.spaceBefore =                              textProps['spaceBefore'];*/

    // size
    var size = textProps['size'] + "";
        size = size.replace(" px", "");
        size = size.replace("px", "");
        size = size + "px";
    textItem.size = size;			              // bijvoorbeeld "120 px"
    textItem.size.value = Number(size); 	// bijvoorbeeld 120
  }
}

//*************************************************************************************************************************************************************************

function createTextLayer(textProps, blendMode) {
// creates a text layer with the properties of textProps
// textProps['color'] = [255,0,0] or javascript color object userColor.rgb.red - automatically knows which
// textProps['size'] = 14 or "14px";
// textProps['pos'] = [25,25]
// textProps['layerSet'] = the name of a layerset or the layer object - automatically knows which
// textProps['layerFX'] = true or false
// textProps['visible'] = true or false
// textProps['panelcolor'] = 'blue', green, red or violet
// blendmode can be: layer.COLORBURN layer.COLORDODGE layer.DARKEN layer.DIFFERENCE layer.DISSOLVE layer.DIVIDE layer.EXCLUSION layer.HARDLIGHT layer.HARDMIX layer.HUE layer.LIGHTEN layer.LINEARBURN layer.LINEARDODGE layer.LINEARLIGHT layer.LUMINOSITY layer.MULTIPLY layer.NORMAL layer.OVERLAY layer.PASSTHROUGH layer.PINLIGHT layer.SATURATION layer.SCREEN layer.SOFTLIGHT layer.SUBTRACT layer.VIVIDLIGHT

	if(typeof textProps['size'] === "undefined") 		textProps['size'] = "12pt";
	else {
    textProps['size'] += ""; // must be there or will crash on next line
    textProps['size'] = textProps['size'].replace(" pt", "");
    textProps['size'] = textProps['size'].replace("pt", ""); // for that one time I ended up with "14pxpxpxpxpxpxpxpxpxpxpxpxpx" - for real
    textProps['size'] += "pt";
  }
	if(typeof textProps['pos'] === "undefined") 		     textProps['pos'] = [25,25];
	if(typeof textProps['layerName'] === "undefined") 	 textProps['layerName'] = '' + textProps['text'] + ' ' + textProps['font'];
	if(typeof textProps['color'] === "undefined") 		   textProps['color'] = [255,255,255];
	if(typeof textProps['visible'] === "undefined") 	   textProps['visible'] = true;
	if(typeof textProps['panelcolor'] === "undefined") 	 textProps['panelcolor'] = false;

	// create a layer
	var textLayer = app.activeDocument.artLayers.add();
		  textLayer.name = textProps['layerName'];
      if(typeof blendMode !== "undefined") textLayer.blendMode = blendMode;

	// move inside a layer set
	if(textProps['layerSet']) textLayer.move(textProps['layerSet'], ElementPlacement.INSIDE);

	// make it a text layer
	textLayer.kind = LayerKind.TEXT;
	nwTextItem = textLayer.textItem;

	// color
  var textColor = new SolidColor();
  if(typeof textProps['color'][0] !== "undefined") {
    textColor.rgb.red   = textProps['color'][0];
    textColor.rgb.green = textProps['color'][1];
    textColor.rgb.blue  = textProps['color'][2];
    textProps['color'] = textColor;
  } else {
    textProps['color'] = textProps['color'];
  }

	// text settings
	if (textProps['font']) 			        nwTextItem.font = 			      textProps['font'];
	if (textProps['color']) 		        nwTextItem.color = 			      textProps['color'];
  if (textProps['text']) 			        nwTextItem.contents =         textProps['text'];
	if (textProps['justification'])     nwTextItem.justification =    textProps['justification']; // Justification.LEFT, Justification.CENTER, Justification.RIGHT, Justification.LEFTJUSTIFIED, Justification.CENTERJUSTIFIED, Justification.RIGHTJUSTIFIED, Justification.FULLYJUSTIFIED
	if (textProps['pos']) 			        nwTextItem.position =         textProps['pos'];
  /*if (textProps['tracking'])          nwTextItem.tracking =           textProps['tracking']; // spacing between letters
  // if (textProps['useAutoLeading'])    nwTextItem.useAutoLeading =     textProps['useAutoLeading']; // boolean
  // if(!textProps['useAutoLeading'])    nwTextItem.leading =            textProps['leading']; // spacing between 2 lines
  if (textProps['verticalScale'])     nwTextItem.verticalScale =      textProps['verticalScale'];
  if (textProps['horizontalScale'])   nwTextItem.horizontalScale =    textProps['horizontalScale'];
  // if (textProps['baselineShift'])  nwTextItem.baselineShift =      textProps['baselineShift'];
  // if (textProps['autoKerning'])    nwTextItem.autoKerning =        textProps['autoKerning'];
  if (textProps['fauxBold'])          nwTextItem.fauxBold =           textProps['fauxBold'];
  if (textProps['fauxItalic'])        nwTextItem.fauxItalic =         textProps['fauxItalic'];
  if (textProps['capitalization'])    nwTextItem.capitalization =     textProps['capitalization']; //Case.NORMAL, Case.ALLCAPS, Case.SMALLCAPS
  // if (textProps['superscript'])    nwTextItem.superscript =        textProps['superscript'];
  // if (textProps['subscript'])      nwTextItem.subscript =          textProps['subscript'];
  if (textProps['underline'])         nwTextItem.underline =          textProps['underline']; // UnderlineType.UNDERLINEOFF, UnderlineType.UNDERLINERIGHT, UnderlineType.UNDERLINELEFT
  if (textProps['strikeThru'])        nwTextItem.strikeThru =         textProps['strikeThru']; // StrikeThruType.STRIKEOFF, StrikeThruType.STRIKEHEIGHT, StrikeThruType.STRIKEBOX
  //if (textProps['language'])        nwTextItem.language =           textProps['language']; // for hybernation and spelling
  if (textProps['antiAliasMethod'])   nwTextItem.antiAliasMethod =    textProps['antiAliasMethod']; // AntiAlias.NONE, AntiAlias.SHARP, AntiAlias.CRISP, AntiAlias.STRONG, AntiAlias.SMOOTH
  if (textProps['leftIndent'])        nwTextItem.leftIndent =         textProps['leftIndent'];
  if (textProps['rightIndent'])       nwTextItem.rightIndent =        textProps['rightIndent'];
  if (textProps['spaceAfter'])        nwTextItem.spaceAfter =         textProps['spaceAfter'];
  if (textProps['spaceBefore'])       nwTextItem.spaceBefore =        textProps['spaceBefore'];*/
  if (textProps['size']) {		        nwTextItem.size = 			      textProps['size'];

	// EXTRA DEBUG INFO VOOR MOEST HET NOG FOUT GAAN
	// de font size houd geen rekening met dpi
	// dus moeten we de size delen door de dpi van het originele document en vermenigvuldigen de de dpi van het nieuwe document

					//nwTextItem.size = textProps['size'] * 300 / 72 ;//+ ' px';
					//nwTextItem.size.value = textProps['size'] * 300 / 72;

					// replace 100 with: 100*300/72
					//<fontsize>*<dpi>/72
					//Default is 0.013889 inches (1/72 in), which is the base conversion unit for pixels at 72 dpi.

					// en eventueel werken met
					// nwTextItem.size = new UnitValue(100,  "px");
					// of er namueel + " px" bij zetten
	}

	if(textProps['layerFX']) {
		var idsetd = charIDToTypeID( "setd" );
    	var desc4 = new ActionDescriptor();
    	var idnull = charIDToTypeID( "null" );
        var ref1 = new ActionReference();
        var idPrpr = charIDToTypeID( "Prpr" );
        var idLefx = charIDToTypeID( "Lefx" );
        ref1.putProperty( idPrpr, idLefx );
        var idLyr = charIDToTypeID( "Lyr " );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref1.putEnumerated( idLyr, idOrdn, idTrgt );
    	desc4.putReference( idnull, ref1 );
    	var idT = charIDToTypeID( "T   " );
        var desc5 = new ActionDescriptor();
        var idScl = charIDToTypeID( "Scl " );
        var idPrc = charIDToTypeID( "#Prc" );
        desc5.putUnitDouble( idScl, idPrc, 100.000000 );
        var idOrGl = charIDToTypeID( "OrGl" );
            var desc6 = new ActionDescriptor();
            var idenab = charIDToTypeID( "enab" );
            desc6.putBoolean( idenab, true );
            var idMd = charIDToTypeID( "Md  " );
            var idBlnM = charIDToTypeID( "BlnM" );
            var idNrml = charIDToTypeID( "Nrml" );
            desc6.putEnumerated( idMd, idBlnM, idNrml );
            var idClr = charIDToTypeID( "Clr " );
                var desc7 = new ActionDescriptor();
                var idRd = charIDToTypeID( "Rd  " );
                desc7.putDouble( idRd, 0.000000 );
                var idGrn = charIDToTypeID( "Grn " );
                desc7.putDouble( idGrn, 0.000000 );
                var idBl = charIDToTypeID( "Bl  " );
                desc7.putDouble( idBl, 0.000000 );
            var idRGBC = charIDToTypeID( "RGBC" );
            desc6.putObject( idClr, idRGBC, desc7 );
            var idOpct = charIDToTypeID( "Opct" );
            var idPrc = charIDToTypeID( "#Prc" );
            desc6.putUnitDouble( idOpct, idPrc, 70.000000 );
            var idGlwT = charIDToTypeID( "GlwT" );
            var idBETE = charIDToTypeID( "BETE" );
            var idSfBL = charIDToTypeID( "SfBL" );
            desc6.putEnumerated( idGlwT, idBETE, idSfBL );
            var idCkmt = charIDToTypeID( "Ckmt" );
            var idPxl = charIDToTypeID( "#Pxl" );
            desc6.putUnitDouble( idCkmt, idPxl, 100.000000 );
            var idblur = charIDToTypeID( "blur" );
            var idPxl = charIDToTypeID( "#Pxl" );
            desc6.putUnitDouble( idblur, idPxl, 250.000000 );
            var idNose = charIDToTypeID( "Nose" );
            var idPrc = charIDToTypeID( "#Prc" );
            desc6.putUnitDouble( idNose, idPrc, 0.000000 );
            var idShdN = charIDToTypeID( "ShdN" );
            var idPrc = charIDToTypeID( "#Prc" );
            desc6.putUnitDouble( idShdN, idPrc, 0.000000 );
            var idAntA = charIDToTypeID( "AntA" );
            desc6.putBoolean( idAntA, false );
            var idTrnS = charIDToTypeID( "TrnS" );
                var desc8 = new ActionDescriptor();
                var idNm = charIDToTypeID( "Nm  " );
                desc8.putString( idNm, "Default" );
                var idCrv = charIDToTypeID( "Crv " );
                    var list1 = new ActionList();
                        var desc9 = new ActionDescriptor();
                        var idHrzn = charIDToTypeID( "Hrzn" );
                        desc9.putDouble( idHrzn, 0.000000 );
                        var idVrtc = charIDToTypeID( "Vrtc" );
                        desc9.putDouble( idVrtc, 0.000000 );
                    	var idCrPt = charIDToTypeID( "CrPt" );
                    	list1.putObject( idCrPt, desc9 );
                        var desc10 = new ActionDescriptor();
                        var idHrzn = charIDToTypeID( "Hrzn" );
                        desc10.putDouble( idHrzn, 255.000000 );
                        var idVrtc = charIDToTypeID( "Vrtc" );
                        desc10.putDouble( idVrtc, 255.000000 );
                    var idCrPt = charIDToTypeID( "CrPt" );
                    list1.putObject( idCrPt, desc10 );
                desc8.putList( idCrv, list1 );
            var idShpC = charIDToTypeID( "ShpC" );
            desc6.putObject( idTrnS, idShpC, desc8 );
            var idInpr = charIDToTypeID( "Inpr" );
            var idPrc = charIDToTypeID( "#Prc" );
            desc6.putUnitDouble( idInpr, idPrc, 50.000000 );
        var idOrGl = charIDToTypeID( "OrGl" );
        desc5.putObject( idOrGl, idOrGl, desc6 );
    	var idLefx = charIDToTypeID( "Lefx" );
    	desc4.putObject( idT, idLefx, desc5 );
		executeAction( idsetd, desc4, DialogModes.NO );
	}

    // change the layer color in the layers panel
    if(textProps['panelcolor'] != false) changeActiveLayerColor(textProps['panelcolor']);

    // hide the layer if needed
    if(!textProps['visible']) textLayer.visible = false;

    // alert("IN:/nnewTextLayer.underline: " + newTextLayer.underline + "\newTextLayer.verticalScale: " + newTextLayer.verticalScale);

    return textLayer;
}

//****************************************************************************************************************************************************

/*function showHideAllLayers(showOrHide, exceptionsArray, layerSetsArray) {
// showOrHide: 'show' or 'hide'
// exceptionsArray: array of layer names
// layerSetsArray: array of the layer groups we want to hide or show (undefiend =)

  if(showOrHide == "show")  var visibility = true;
  else                      var visibility = false;

  // gather the art layers
  if(layerSetsArray === "undefined")  var allLayers = app.activeDocument.layers;
  else                                var allLayers = gatherArtLayers_multiple(layerSetsArray);

  // loop through all layer sets
  for(var k in layerSetsArray) {

    // loop trough all layers
    for(var i = 0 ; i < allLayers[layerSetsArray].length; i++){

      // show or hide
      allLayers[layerSetsArray][i].visible = visibility;

      // check for exceptions
      for(var j in exceptionsArray) {
        var breakLoop = false;
        if(allLayers[layerSetsArray][i].name == exceptionsArray[j]) {
          allLayers[layerSetsArray][i].visible = !visibility;
          breakLoop = true;
        }
        if(breakLoop) break;
      }

    } // all layers loop
  } // all layer sets loop
}*/

//****************************************************************************************************************************************************

function createComp(name) {
// creates a comp with the layers in visibleLayersArray visible
// returns the name of the comp
//layerSetsArray: array of layer set names in witch the visibleLayers are

  // hide all layers & unhide the others
  showHideAllLayers('hide');

  app.activeDocument.layerComps.add(name, '', true, true, true);
}

//****************************************************************************************************************************************************

function showHideAllLayers(showOrHide, exceptionsArray) {
// showOrHide: 'show' or 'hide'
// exceptionsArray: array of layer names
// layerSetsArray: array of the layer groups we want to hide or show (undefiend =)

  if(typeof exceptionsArray === "undefined") var exceptionsArray = [""];

  if(showOrHide == "show")  var visibility = true;
  else                      var visibility = false;

  // loop trough all layers
  for(var i = 0 ; i < app.activeDocument.layers.length; i++){

    // show or hide
    app.activeDocument.layers[i].visible = visibility;

    // check for exceptions
    for(var j in exceptionsArray) {
      var breakLoop = false;
      if(app.activeDocument.layers[i].name == exceptionsArray[j]) {
        app.activeDocument.layers[i].visible = !visibility;
        breakLoop = true;
      }
      if(breakLoop) break;
    } // for j in exceptions
  } // all layers loop
}

//****************************************************************************************************************************************************

function getActiveLayersPositions(type) {

  var bounds = app.activeDocument.activeLayer.bounds;
  // bounds[0] = x
  // bounds[1] = y
  // bounds[2] = x + width
  // bounds[3] = y + height

  // calculate everything
  var x =         bounds[0];
  var y =         bounds[1];
  var topLeft =   [bounds[0], bounds[1]];
  var width =     bounds[2] - bounds[0];
  var height =    bounds[3] - bounds[1];
  var center =    [[x + (width/2)], [y + (height/2)]];

  // return
  switch(type) {
    case "topLeft":   return topLeft;
    case "width":     return width;
    case "height":    return height;
    case "center":    return center;
  }
}

//****************************************************************************************************************************************************
