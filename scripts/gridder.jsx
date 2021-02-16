// by RanzigenDanny
// Gridder
// v8

// GUIDE

// TODO

#target photoshop; // enable double clicking from the Macintosh Finder or the Windows Explorer

//@include "functions/dialogPlus.jsx"
//@include "functions/selectionFunctions.jsx"

//****************************************************************************************************************************************************
//****************************************************************************************************************************************************

// guide options
var cellWidth = 512;
var cellHeight = 512;
var columns = 6;
var rows = 2;
var margin = 64;
var fgColor = app.foregroundColor.rgb;
var bgColor = app.backgroundColor.rgb;

// document options
var newDocName = 'Gridder';
var newDocMode = 'rgb';
var newDocResolution = 72;

// create the dialog and update the above variables
createDialog();
getDialogValues();

createNewDoc();

createGuides('horizontal');
createGuides('vertical');

createBackgrounds();

// the end

//****************************************************************************************************************************************************
//****************************************************************************************************************************************************

function createDialog() {

    var newDialogContent = [];
		newDialogContent.push(['numberpositive', 'CellWidth px:', cellWidth]);
		newDialogContent.push(['numberpositive', 'CellHeight px:', cellHeight]);
		newDialogContent.push(['numberpositive', 'Nr of columns:', columns]);
		newDialogContent.push(['numberpositive', 'Nr of rows:', rows]);
		newDialogContent.push(['numberpositive', 'Margin:', margin]);
        newDialogContent.push(['rgb', 'Rgb:', fgColor]);

    dialogValues = []; // GLOBAL
    dialogValues = createDialogPlus(newDialogContent, 'showDialog', 'index', 'noJsonSave');
}

//****************************************************************************************************************************************************

function getDialogValues() {

    cellWidth = dialogValues[0];
    cellHeight = dialogValues[1];
    columns = dialogValues[2];
    rows = dialogValues[3];
    margin = dialogValues[4];
    fgColor = dialogValues[5];
}

//****************************************************************************************************************************************************

function createNewDoc() {

    // calculate size
    var newDocHeight = ((margin + cellHeight) * rows) + margin; // margin on both sides of the document
    var newDocWidth = ((margin + cellWidth) * columns) + margin; // margin on both sides of the document

    // document mode
    var docMode = NewDocumentMode.RGB;
    if 		((newDocMode == 'cmyk') || (newDocMode == 'CMYK')) 	docMode = NewDocumentMode.CMYK;
    else if (newDocMode == 'grayscale') 						docMode = NewDocumentMode.GRAYSCALE;

    // create the document
    var newDoc = app.documents.add(newDocWidth, newDocHeight, newDocResolution, newDocName, docMode, DocumentFill.TRANSPARENT);
}

//****************************************************************************************************************************************************

function createGuides(horizontalOrVertical) {

    // horizont or vertical specific variablies
    horizontalOrVertical = horizontalOrVertical.toLowerCase();
    if(horizontalOrVertical == 'horizontal') {

        var colsOrRows = rows;
        var cellSize = cellHeight;

    } else if (horizontalOrVertical == 'vertical') {

        var colsOrRows = columns;
        var cellSize = cellWidth;

    } else alert(('createGuides() must be horizontal or vertical not: ' + horizontalOrVertical), 'ranzScript ERROR');

    // create the guides
    var pos = 0;

    for(var i = 0; i < colsOrRows; i++) {

        // margin left
        if(margin) {
            pos += margin;
            guide(pos, horizontalOrVertical);
        }

        // cell
        pos += cellSize;
        guide(pos, horizontalOrVertical);
    }
}

//****************************************************************************************************************************************************

function guide(position, direction) {
// position in PIXELS
// direction must be 'horizontal' or 'vertical'

    var type;
    if      (direction.toLowerCase() == 'horizontal')  type = 'Hrzn';
    else if (direction.toLowerCase() == 'vertical')    type = 'Vrtc';

   // script listener code
   var id296 = charIDToTypeID( "Mk  " );
       var desc50 = new ActionDescriptor();
       var id297 = charIDToTypeID( "Nw  " );
           var desc51 = new ActionDescriptor();
           var id298 = charIDToTypeID( "Pstn" );
           var id299 = charIDToTypeID( "#Pxl" );
           desc51.putUnitDouble( id298, id299, position );
           var id300 = charIDToTypeID( "Ornt" );
           var id301 = charIDToTypeID( "Ornt" );
           var id302 = charIDToTypeID( type );
          desc51.putEnumerated( id300, id301, id302 );
          var id303 = charIDToTypeID( "Gd  " );
       desc50.putObject( id297, id303, desc51 );
   executeAction( id296, desc50, DialogModes.NO );
};

//****************************************************************************************************************************************************

function createBackgrounds() {

    // create a background for the whole document with the background color
    app.activeDocument.selection.select([
        [0, 0,],                                                // top left
        [0, app.activeDocument.width],                          // top right
        [app.activeDocument.height, app.activeDocument.width],  // bottom right
        [app.activeDocument.height, 0],                         // bottom left
    ]);
    app.activeDocument.selection.fill(bgColor);
    app.activeDocument.activeLayer.name = "background";

    // calculate the positions
    var xPos = [];
    var yPos = [];

    for(var i = 0; i < columns; i++) xPos[i] = ((margin + cellWidth ) * i) + margin;                // x pos
    for(var i = 0; i < rows; i++)    yPos[i] = ((margin + cellHeight) * i) + margin + cellHeight;   // x pos

    // create the layers
    var xCount = 0;
    var yCount = 0;

    for(var i = 0; i < columns*rows; i++) {
        var topLeft =     [xPos[xCount],                    yPos[yCount] - cellHeight];
        var topRight =    [xPos[xCount] + cellWidth,        yPos[yCount] - cellHeight];
        var bottomLeft =  [xPos[xCount],                    yPos[yCount]];
        var bottomRight = [xPos[xCount] + cellWidth,        yPos[yCount]];

        xCount++;
        if(xCount >= columns) {
            xCount = 0;
            yCount++;
        }

        var newLayer = app.activeDocument.artLayers.add();
        app.activeDocument.activeLayer.name = 'gridder ' + (xCount + yCount);
        app.activeDocument.selection.select([topLeft, topRight, bottomRight, bottomLeft]);
        app.activeDocument.selection.fill(fgColor);
    }

    // deselect the last selection
    deselect();
}

//****************************************************************************************************************************************************
