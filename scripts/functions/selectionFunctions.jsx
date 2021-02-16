// by RanzigenDanny
// selectionFunctions
// v2

// GUIDE

// TODO

//****************************************************************************************************************************************************

function deselect() {

  var idsetd = charIDToTypeID( "setd" );
      var desc1979 = new ActionDescriptor();
      var idnull = charIDToTypeID( "null" );
          var ref846 = new ActionReference();
          var idChnl = charIDToTypeID( "Chnl" );
          var idfsel = charIDToTypeID( "fsel" );
          ref846.putProperty( idChnl, idfsel );
      desc1979.putReference( idnull, ref846 );
      var idT = charIDToTypeID( "T   " );
      var idOrdn = charIDToTypeID( "Ordn" );
      var idNone = charIDToTypeID( "None" );
      desc1979.putEnumerated( idT, idOrdn, idNone );
  executeAction( idsetd, desc1979, DialogModes.NO );

}

//****************************************************************************************************************************************************

function invertSelection() {

  var idInvs = charIDToTypeID( "Invs" );
  executeAction( idInvs, undefined, DialogModes.NO );

}

//****************************************************************************************************************************************************

function selectWholeCanvas() {

  selection(0, 0, app.activeDocument.width, app.activeDocument.height);

}

//****************************************************************************************************************************************************

function selection(left, top, right, bottom) {
// rectangular selection

  app.activeDocument.selection.select([ [left,top], [left,bottom], [right,bottom], [right,top] ]);

}

//****************************************************************************************************************************************************

function circularSelection(left, top, right, bottom, antiAlias) {
// antiAlias: bool

  var circleSelection = charIDToTypeID( "setd" );
      var descriptor = new ActionDescriptor();
      var id71 = charIDToTypeID( "null" );
          var ref5 = new ActionReference();
          var id72 = charIDToTypeID( "Chnl" );
          var id73 = charIDToTypeID( "fsel" );
          ref5.putProperty( id72, id73 );
      descriptor.putReference( id71, ref5 );
      var id74 = charIDToTypeID( "T   " );
          var desc12 = new ActionDescriptor();

          var top1 = charIDToTypeID( "Top " );
          var top2 = charIDToTypeID( "#Pxl" );
          desc12.putUnitDouble( top1, top2, top );

          var left1 = charIDToTypeID( "Left" );
          var left2 = charIDToTypeID( "#Pxl" );
          desc12.putUnitDouble( left1, left2, left );

          var bottom1 = charIDToTypeID( "Btom" );
          var bottom2 = charIDToTypeID( "#Pxl" );
          desc12.putUnitDouble( bottom1, bottom2, bottom );

          var right1 = charIDToTypeID( "Rght" );
          var right2 = charIDToTypeID( "#Pxl" );
          desc12.putUnitDouble( right1, right2, right );

      var id83 = charIDToTypeID( "Elps" );
      descriptor.putObject( id74, id83, desc12 );
      var id84 = charIDToTypeID( "AntA" );
      descriptor.putBoolean( id84, antiAlias );
  executeAction( circleSelection, descriptor, DialogModes.NO );
}

//****************************************************************************************************************************************************
