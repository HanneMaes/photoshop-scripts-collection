// by RanzigenDanny
// Dice exporter
// v11

// GUIDE
// uses slicer engine to export dice
// creates an input layer for the export to the website and one for exports to game/assets

// TODO
// ipv een dropdown menu of ik dice of nodice naar website of assets wil exported, er checkboxes van maken zodat ik alles tegelijkertijd kan exporten
// in de created input layers staat er al standaard een defautl path en ik creeer er zelf nog een, opzich niet zo erg want hij export correct

//@include "functions/dialogPlus.jsx"
//@include "functions/slicerEngine.jsx"

//****************************************************************************************************************************************************
//****************************************************************************************************************************************************

showProgressWindow("Preparing");
updateProgressWindow('Preparing...', 'title');

var gameName = findGameName();
var dialogValuesPopup;
var inputLayerName_website =   getLayerNameDice("inputLayer-dice-website");
var inputLayerName_game =      getLayerNameDice("inputLayer-dice-assets");
var sliceGroupName =           getLayerNameDice("sliceGroup-dice");

// check if we already have in regex user input layers
// returns the user input layers text or false
var userInputText_game_dice =      getTextLayerContent(inputLayerName_game + '-dice');       // function within slicerEngine.jsx
var userInputText_game_nodice =    getTextLayerContent(inputLayerName_game + '-nodice');     // function within slicerEngine.jsx
var userInputText_website_dice =   getTextLayerContent(inputLayerName_website + '-dice');    // function within slicerEngine.jsx
var userInputText_website_nodice = getTextLayerContent(inputLayerName_website + '-nodice');  // function within slicerEngine.jsx

closeProgressWindow();

if(userInputText_website_dice != false && userInputText_game_dice != false && userInputText_website_nodice != false && userInputText_game_nodice != false)    exportDice();               // EXPORT THE DICE
else                                                                                                                                                          createDiceExportLayers();   // CREATE INPUT LAYERS AND GROUPS

// the End

//****************************************************************************************************************************************************

function createDiceExportLayers() {

  // show dialog
  dialogValuesPopup = createDialogSelector(true);

  // check if did not press cancel in our dialog
  if(dialogCanceled) var scriptCanceled = true; // we need dialogPlusCanceled for compatebility with errorHandler
  else {

    // show the progress window
  	showProgressWindow("Create dice exports"); // when we have multiple progressWindows in one script we want to have dirrerent json names for our files so you must specify a suffix
    updateProgressWindow('Creating dice exporter slicer comps & layers', 'title');

    // create the input layers if needed
    if(userInputText_game_dice      == false) createInputLayer('game', 'dice');
    if(userInputText_game_nodice    == false) createInputLayer('game', 'nodice');
    if(userInputText_website_dice   == false) createInputLayer('website', 'dice');
    if(userInputText_website_nodice == false) createInputLayer('website', 'nodice');

    // create slice group
    if(dialogValuesPopup['Use slices'] == true) createslicegroup(sliceGroupName);

  }
}

//****************************************************************************************************************************************************

function exportDice() {

  // show dialog
  dialogValuesPopup = createDialogSelector(false);

  // check if did not press cancel in our dialog
  if(dialogCanceled) var scriptCanceled = true; // we need dialogPlusCanceled for compatebility with errorHandler
  else {

    // show the progress window
  	showProgressWindow("Export dice"); // when we have multiple progressWindows in one script we want to have dirrerent json names for our files so you must specify a suffix
    updateProgressWindow('Exporting Dice', 'title');

    // create the text layer with slicerEngine.jsx
    if(dialogValuesPopup['Export type'] == 0) var userInputLayerToUse = inputLayerName_game;
    else                                      var userInputLayerToUse = inputLayerName_website;
    if(dialogValuesPopup['Dice or no dice'] == 0) userInputLayerToUse += '-dice';
    else                                          userInputLayerToUse += '-nodice';
    Slicer_Engine("dice", userInputLayerToUse);

  }
}

//****************************************************************************************************************************************************
//****************************************************************************************************************************************************

function findGameName() {
// extracts the game name from the open documents path

  var documentPath = '' + app.activeDocument.path;
  var searchString = "Games/Videoslots/";
  var searchIndex = documentPath.search(searchString) + searchString.length;  // the index of the first character after our searchString (= the first character of our gameName)
  var subString = documentPath.substring(searchIndex);						            // make a substring form searchIndex to the end of our string
  var endIndex = subString.search('/');										                    // search the end index of our gameName
  return subString.substring(0, endIndex);
}

//****************************************************************************************************************************************************

function createInputLayer(type, diceOrNot) {
// create the dice exports text

  var defaultExports = "";

  var highlightCompName = '';
  if(diceOrNot == 'dice') highlightCompName = 'Highlight comp name Dice';
  else                    highlightCompName = 'Highlight comp name NoDice';

  // add the settings to the text layers no when we need to generate a new ony we can just copy the settings
  defaultExports += '// Game name: ' + dialogValuesPopup['Game name'] + '\r';
  defaultExports += '// Game name dice: ' + dialogValuesPopup['Game name dice'] + '\r';
  defaultExports += '// Website game type: ' + dialogValuesPopup['Website game type'] + '\r';
  defaultExports += '// Amount of dice: ' + dialogValuesPopup['Amount of dice'] + '\r';
  defaultExports += '// Amount of extra highlights: ' + dialogValuesPopup['Amount of extra highlights'] + '\r';
  defaultExports += '// Highlight comp name: ' + dialogValuesPopup[highlightCompName] + '\r';
  defaultExports += '// Use slices: ' + dialogValuesPopup['Use slices'] + '\r';
  defaultExports += '// Sharpen Symbols: ' + dialogValuesPopup['Sharpen Symbols'] + '\r';
  defaultExports += '\r';

  // video slot or skill slot
  if(dialogValuesPopup['Website game type'] == 0)   var websiteType = 'videoslots';
  else                                              var websiteType = 'skillslots';

  // create the deafult settings
  if      (type == "website" && diceOrNot == "dice")    defaultExports += "default path:/d/Svn/front/assets/Games/" + websiteType + "/" + dialogValuesPopup['Game name dice'] + "/symbols \r";
  else if (type == "website" && diceOrNot == "nodice")  defaultExports += "default path:/d/Svn/front/assets/Games/" + websiteType + "/" + dialogValuesPopup['Game name'] + "/symbols \r";
  else if (type == "game" && diceOrNot == "nodice")  defaultExports += "default path:/d/Svn/Art/Casino/Games/Videoslots/" + dialogValuesPopup['Game name'] + "/Game/Symbols/NoDice \r";
  else if (type == "game" && diceOrNot == "dice")    defaultExports += "default path:/d/Svn/Art/Casino/Games/Videoslots/" + dialogValuesPopup['Game name'] + "/Game/Symbols/Dice \r";

  // default sharpen
  if(dialogValuesPopup['Sharpen Symbols'] == true) defaultExports += "default sharpen:1\r";

  // default slice group
  if(dialogValuesPopup['Use slices'] == true) defaultExports += "default slicegroup:" + sliceGroupName + "\r\r";

  // title
  defaultExports += "title: " + diceOrNot + " export for " + type + "\r\r";

  // loop through all the dice
  for(var i = 0; i < dialogValuesPopup['Amount of dice']; i++) {

    if(type == "game") {

      //-------------------
      // GAME - text lines
      //-------------------

      var diceNr = i + 1;

      // slice
      var sliceTxt = " slice:" + diceOrNot + diceNr;

      // comp
      if(dialogValuesPopup['Amount of extra highlights'] > 0)   var compTxt = " comp:" + dialogValuesPopup[highlightCompName] + "0";
      else                                                      var compTxt = "";

      defaultExports += "\rimage:" + "sym_" + pad2(diceNr) + ".png" + sliceTxt + compTxt + " \r";

      // add the highlights
      for(var j = 1; j <= dialogValuesPopup['Amount of extra highlights']; j++) defaultExports += "image:sym_" + pad2(diceNr) + "_hl" + j + ".png" + sliceTxt + " comp:" + dialogValuesPopup[highlightCompName] + j + " \r";

      function pad2(number) {
        return (number < 10 ? '0' : '') + number
      }

    } else {

      //----------------------
      // WEBSITE - text lines
      //----------------------

      var diceNr = i;

      // for the website the last image is the scatter and the before-last (whatevah) is the wild, and for the game its the other way around
      // so we need to switch the last 2 symbols
      if(i == dialogValuesPopup['Amount of dice'] - 1)        diceNr = dialogValuesPopup['Amount of dice'] - 2;
      else if(i == dialogValuesPopup['Amount of dice'] - 2)   diceNr = dialogValuesPopup['Amount of dice'] - 1;

      // slice
      var sliceTxt = " slice:" + diceOrNot + Number(dialogValuesPopup['Amount of dice'] - i);

      // comp
      if(dialogValuesPopup['Amount of extra highlights'] > 0)   var compTxt = " comp:" + dialogValuesPopup[highlightCompName] + "0";
      else                                                      var compTxt = "";

      // add the 3 version of the dice
      defaultExports += "image:" + diceNr + ".png size:256,false" + sliceTxt + compTxt + " \r";
      defaultExports += "image:" + diceNr + "_med.png size:128,false" + sliceTxt + compTxt + " \r";
      defaultExports += "image:" + diceNr + "_small.png size:30,false" + sliceTxt + compTxt + " \r\r";

    }

  } // loop through all the dice

  defaultExports += "\r"

  // create the text layer
  var layerName = (type == 'website' ? inputLayerName_website : inputLayerName_game)+ '-' + diceOrNot;
  createUserInputLayers(defaultExports, layerName); // function from slicerEngine.jsx

  return defaultExports;
}

//****************************************************************************************************************************************************

function createDialogSelector(noInputLayers) { // this function must have a differenct name then createDialog() in slicerEngine.jsx or he will show this dialog instaed
// creates the dialog, shows the dialog and returns the dialog values

  if(noInputLayers) {

    // CREATE INPUT LAYERS
    var newDialogContent = [];
        newDialogContent.push(['title', 'Game options']);
        newDialogContent.push(['edittext', 'Game name:', gameName]);
        newDialogContent.push(['edittext', 'Game name dice:', gameName + "Dice"]);
        newDialogContent.push(['dropdown', 'Website game type:', ['videoslots', 'skillslots']]);
        newDialogContent.push(['aftertext', 'Important for website exports']);
        newDialogContent.push(['numberpositive', 'Amount of dice:', '13']);
        newDialogContent.push(['aftertext', 'wild and scatter included']);

        newDialogContent.push(['title', 'Extra highlights']);
        newDialogContent.push(['numberpositive', 'Amount of extra highlights:', '0']);
        newDialogContent.push(['edittext', 'Highlight comp name Dice:', 'hl']);
        newDialogContent.push(['aftertext', 'hl0, hl1, hl2, ...']);
        newDialogContent.push(['edittext', 'Highlight comp name NoDice:', 'hl']);
        newDialogContent.push(['aftertext', 'hl0, hl1, hl2, ...']);

        newDialogContent.push(['title', 'Export options']);
        newDialogContent.push(['checkbox', 'Use slices', true]);
        newDialogContent.push(['aftertext', 'name your slice layers: dice1, dice2, nodice1, nodice2, ...']);
        newDialogContent.push(['checkbox', 'Sharpen Symbols', true]);

    // show dialog
	return createDialogPlus(newDialogContent, 'showDialog', 'id', false); // do not save json because it will override the game name, and we should only generate the dice input layer once

  } else {

    // EXPORT DICE
    var newDialogContent = [];
        newDialogContent.push(['title', 'Exporting ' + gameName]);
        newDialogContent.push(['dropdown', 'Export type:', ['game', 'website']]);
        newDialogContent.push(['dropdown', 'Dice or no dice:', ['dice', 'no dice']]);

    // show dialog
  	return createDialogPlus(newDialogContent, 'showDialog', 'id', 'dice_exporter');

  }
}

//****************************************************************************************************************************************************
