// by RanzigenDanny
// photography edit
// v1

// GUIDE
// adds all the layers I need to edit a photograph
//  - slicer.js: //Images
//  - color balance
//  - film grain pattern
//  - vignette
//  - levels

// TODO
// kijken in ivernote of ik nog dingen toe kan voegen

//@include "functions/slicerEngine.jsx"
//@include "functions/selectionFunctions.jsx"

var folderName = 'Fine tuning';
var vignetteBlurAmount = 250;

//****************************************************************************************************************************************************
//****************************************************************************************************************************************************

// create a layer set for all I adjustments
var newLayerSet = app.activeDocument.layerSets.add();
    newLayerSet.name = folderName;

// add all the different editing layers
levels();
brightnessContrast();
vignette();
addFilmGrainLayer();
colorBalance();

// create the slice layer
if(app.activeDocument.height > app.activeDocument.width)  var extraText = 'default size: 1000,false \r\rimage:' + app.activeDocument.name.replace(".psd", ".png");
else                                                      var extraText = 'default size: false,1000 \r\rimage:' + app.activeDocument.name.replace(".psd", ".png");
Slicer_Engine('addText', extraText);

//****************************************************************************************************************************************************
//****************************************************************************************************************************************************

function levels() {

  var idMk = charIDToTypeID( "Mk  " );
      var desc618 = new ActionDescriptor();
      var idnull = charIDToTypeID( "null" );
          var ref437 = new ActionReference();
          var idAdjL = charIDToTypeID( "AdjL" );
          ref437.putClass( idAdjL );
      desc618.putReference( idnull, ref437 );
      var idUsng = charIDToTypeID( "Usng" );
          var desc619 = new ActionDescriptor();
          var idType = charIDToTypeID( "Type" );
              var desc620 = new ActionDescriptor();
              var idpresetKind = stringIDToTypeID( "presetKind" );
              var idpresetKindType = stringIDToTypeID( "presetKindType" );
              var idpresetKindDefault = stringIDToTypeID( "presetKindDefault" );
              desc620.putEnumerated( idpresetKind, idpresetKindType, idpresetKindDefault );
          var idLvls = charIDToTypeID( "Lvls" );
          desc619.putObject( idType, idLvls, desc620 );
      var idAdjL = charIDToTypeID( "AdjL" );
      desc618.putObject( idUsng, idAdjL, desc619 );
  executeAction( idMk, desc618, DialogModes.NO );

}

//****************************************************************************************************************************************************

function brightnessContrast() {

  var idMk = charIDToTypeID( "Mk  " );
      var desc663 = new ActionDescriptor();
      var idnull = charIDToTypeID( "null" );
          var ref466 = new ActionReference();
          var idAdjL = charIDToTypeID( "AdjL" );
          ref466.putClass( idAdjL );
      desc663.putReference( idnull, ref466 );
      var idUsng = charIDToTypeID( "Usng" );
          var desc664 = new ActionDescriptor();
          var idType = charIDToTypeID( "Type" );
              var desc665 = new ActionDescriptor();
              var iduseLegacy = stringIDToTypeID( "useLegacy" );
              desc665.putBoolean( iduseLegacy, false );
          var idBrgC = charIDToTypeID( "BrgC" );
          desc664.putObject( idType, idBrgC, desc665 );
      var idAdjL = charIDToTypeID( "AdjL" );
      desc663.putObject( idUsng, idAdjL, desc664 );
  executeAction( idMk, desc663, DialogModes.NO );

}

//****************************************************************************************************************************************************

function vignette() {

  // create new layer
  var newLayer = app.activeDocument.artLayers.add();
      newLayer.name = 'vignette';
      newLayer.opacity = 0;
      newLayer.move(newLayerSet, ElementPlacement.INSIDE);

  // vignette
  circularSelection(0, 0, app.activeDocument.width, app.activeDocument.height, true); // make circular selection
  invertSelection();                                                                  // invert selection
  var black = new SolidColor();
      black.rgb.red   = 0;
      black.rgb.green = 0;
      black.rgb.blue  = 0;
  app.activeDocument.selection.fill(black); // fill selection with black
  deselect();
  app.activeDocument.activeLayer.applyGaussianBlur(vignetteBlurAmount);

}

//****************************************************************************************************************************************************

function addFilmGrainLayer() {
//  opacity: 100
//  fill: 0
// FX Pattern Overlay settings
//    blend mode: soft light
//    opacity: 100
//    pattern (name): 'film grain'
//    scale: 100
//    link with layer: not

  // create new layer
  var newLayer = app.activeDocument.artLayers.add();
      newLayer.name = 'film grain';
      newLayer.move(newLayerSet, ElementPlacement.INSIDE);

  // =======================================================
  var idFl = charIDToTypeID( "Fl  " );
      var desc637 = new ActionDescriptor();
      var idUsng = charIDToTypeID( "Usng" );
      var idFlCn = charIDToTypeID( "FlCn" );
      var idFrgC = charIDToTypeID( "FrgC" );
      desc637.putEnumerated( idUsng, idFlCn, idFrgC );
  executeAction( idFl, desc637, DialogModes.NO );

  // =======================================================
  var idsetd = charIDToTypeID( "setd" );
      var desc638 = new ActionDescriptor();
      var idnull = charIDToTypeID( "null" );
          var ref453 = new ActionReference();
          var idPrpr = charIDToTypeID( "Prpr" );
          var idLefx = charIDToTypeID( "Lefx" );
          ref453.putProperty( idPrpr, idLefx );
          var idLyr = charIDToTypeID( "Lyr " );
          var idOrdn = charIDToTypeID( "Ordn" );
          var idTrgt = charIDToTypeID( "Trgt" );
          ref453.putEnumerated( idLyr, idOrdn, idTrgt );
      desc638.putReference( idnull, ref453 );
      var idT = charIDToTypeID( "T   " );
          var desc639 = new ActionDescriptor();
          var idScl = charIDToTypeID( "Scl " );
          var idPrc = charIDToTypeID( "#Prc" );
          desc639.putUnitDouble( idScl, idPrc, 100.000000 );
          var idpatternFill = stringIDToTypeID( "patternFill" );
              var desc640 = new ActionDescriptor();
              var idenab = charIDToTypeID( "enab" );
              desc640.putBoolean( idenab, true );
              var idMd = charIDToTypeID( "Md  " );
              var idBlnM = charIDToTypeID( "BlnM" );
              var idSftL = charIDToTypeID( "SftL" );
              desc640.putEnumerated( idMd, idBlnM, idSftL );
              var idOpct = charIDToTypeID( "Opct" );
              var idPrc = charIDToTypeID( "#Prc" );
              desc640.putUnitDouble( idOpct, idPrc, 100.000000 );
              var idPtrn = charIDToTypeID( "Ptrn" );
                  var desc641 = new ActionDescriptor();
                  var idNm = charIDToTypeID( "Nm  " );
                  desc641.putString( idNm, "film grain" );
                  var idIdnt = charIDToTypeID( "Idnt" );
                  desc641.putString( idIdnt, "f315bc13-88bf-11e7-91c4-84ae2a45d33d" );
              var idPtrn = charIDToTypeID( "Ptrn" );
              desc640.putObject( idPtrn, idPtrn, desc641 );
              var idScl = charIDToTypeID( "Scl " );
              var idPrc = charIDToTypeID( "#Prc" );
              desc640.putUnitDouble( idScl, idPrc, 100.000000 );
              var idAlgn = charIDToTypeID( "Algn" );
              desc640.putBoolean( idAlgn, false );
              var idphase = stringIDToTypeID( "phase" );
                  var desc642 = new ActionDescriptor();
                  var idHrzn = charIDToTypeID( "Hrzn" );
                  desc642.putDouble( idHrzn, 0.000000 );
                  var idVrtc = charIDToTypeID( "Vrtc" );
                  desc642.putDouble( idVrtc, 0.000000 );
              var idPnt = charIDToTypeID( "Pnt " );
              desc640.putObject( idphase, idPnt, desc642 );
          var idpatternFill = stringIDToTypeID( "patternFill" );
          desc639.putObject( idpatternFill, idpatternFill, desc640 );
      var idLefx = charIDToTypeID( "Lefx" );
      desc638.putObject( idT, idLefx, desc639 );
  executeAction( idsetd, desc638, DialogModes.NO );

  // =======================================================
  var idsetd = charIDToTypeID( "setd" );
      var desc643 = new ActionDescriptor();
      var idnull = charIDToTypeID( "null" );
          var ref454 = new ActionReference();
          var idLyr = charIDToTypeID( "Lyr " );
          var idOrdn = charIDToTypeID( "Ordn" );
          var idTrgt = charIDToTypeID( "Trgt" );
          ref454.putEnumerated( idLyr, idOrdn, idTrgt );
      desc643.putReference( idnull, ref454 );
      var idT = charIDToTypeID( "T   " );
          var desc644 = new ActionDescriptor();
          var idfillOpacity = stringIDToTypeID( "fillOpacity" );
          var idPrc = charIDToTypeID( "#Prc" );
          desc644.putUnitDouble( idfillOpacity, idPrc, 0.000000 );
      var idLyr = charIDToTypeID( "Lyr " );
      desc643.putObject( idT, idLyr, desc644 );
  executeAction( idsetd, desc643, DialogModes.NO );

}

//****************************************************************************************************************************************************

function colorBalance() {

  var idMk = charIDToTypeID( "Mk  " );
      var desc660 = new ActionDescriptor();
      var idnull = charIDToTypeID( "null" );
          var ref465 = new ActionReference();
          var idAdjL = charIDToTypeID( "AdjL" );
          ref465.putClass( idAdjL );
      desc660.putReference( idnull, ref465 );
      var idUsng = charIDToTypeID( "Usng" );
          var desc661 = new ActionDescriptor();
          var idType = charIDToTypeID( "Type" );
              var desc662 = new ActionDescriptor();
              var idShdL = charIDToTypeID( "ShdL" );
                  var list73 = new ActionList();
                  list73.putInteger( 0 );
                  list73.putInteger( 0 );
                  list73.putInteger( 0 );
              desc662.putList( idShdL, list73 );
              var idMdtL = charIDToTypeID( "MdtL" );
                  var list74 = new ActionList();
                  list74.putInteger( 0 );
                  list74.putInteger( 0 );
                  list74.putInteger( 0 );
              desc662.putList( idMdtL, list74 );
              var idHghL = charIDToTypeID( "HghL" );
                  var list75 = new ActionList();
                  list75.putInteger( 0 );
                  list75.putInteger( 0 );
                  list75.putInteger( 0 );
              desc662.putList( idHghL, list75 );
              var idPrsL = charIDToTypeID( "PrsL" );
              desc662.putBoolean( idPrsL, true );
          var idClrB = charIDToTypeID( "ClrB" );
          desc661.putObject( idType, idClrB, desc662 );
      var idAdjL = charIDToTypeID( "AdjL" );
      desc660.putObject( idUsng, idAdjL, desc661 );
  executeAction( idMk, desc660, DialogModes.NO );

}

//****************************************************************************************************************************************************
