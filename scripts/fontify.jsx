// by RanzigenDanny
// Fontify
// v32

// GUIDE

// TODO
// de layer names zijn allemaal het zelfde
// give the total steps to progressWindow.jsx en bereken het aan de hand van het aantal fonts in de geselecteerde font groups
// check if font are installed
// scrip maken voor illustrator en de fonts uitlezen via een json zodat ik altijd dezelfde fonts heb

//@include "functions/dialogPlus.jsx"
//@include "functions/progressWindow.jsx"
//@include "functions/detectOs.jsx"
//@include "functions/layerFunctions.jsx"
//@include "functions/errorHandler.jsx"

//****************************************************************************************************************************************************
//****************************************************************************************************************************************************

var activeLayer = app.activeDocument.activeLayer;
var layerSet; // the layer group in whick we will put all our new text layers

// load the correct fonts according to the os
var fontGroups = [];	// all the groups a font can be part of
var myFonts = {};			// all the font { fontgroup: [fontnames] }
var os = detectOs();
if   		(os == "mac")  			fillInFontMac();      // fills in myFont[] and fontGroups[]
else if (os == "windows")   fillInFontWindows();	// fills in myFont[] and fontGroups[]
else												alert('ERROR: Your OS is not Windows or Mac');

// get active text layer's propertoes
var textProperties = getTextProps(activeLayer);

// get dialog values
var dialogValues = createDialogPlus(dialogContent(), 'showDialog', 'id', 'fontify'); // fontify = json suffix

// update the textProperties object with the new things the user selected in the dialog
updateTextProps();

// check if did not press cancel in our dialog
if(dialogCanceled) var scriptCanceled = true; // we need dialogPlusCanceled for compatebility with errorHandler
else {

	showProgressWindow();
	updateProgressWindow('Preparing', 'title');

	// create a layer set for our text
	layerSet = createLayerSetForText();
	textProperties["layerSet"] = layerSet;

	// loop trough the font groups
	for(i in fontGroups) {

		// continue if the user selected this font group
		if(dialogValues[fontGroups[i]]) {

			// loop through all font
			for(var j in myFonts[fontGroups[i]]) {

				textProperties["font"] = myFonts[fontGroups[i]][j];
				var newTextLayer = createTextLayer(textProperties);

			  // alert("AFTER:/nnewTextLayer.underline: " + newTextLayer.underline + "\newTextLayer.verticalScale: " + newTextLayer.verticalScale);

			} // fonts loop
		} // in in font group
	} // loop through fonts group

	updateProgressWindow('Reset document state', 'title');
	resetDocumentState();

	// The End
	closeProgressWindow();
	report('endScript');
}

//****************************************************************************************************************************************************
//****************************************************************************************************************************************************

function getTextProps(textLayer) {
// if the active layer is a text layer get all it properties

	var props = {};

	if(activeLayer.kind == LayerKind.TEXT) {

		props = getTextProperties(textLayer);

	} else {

		props["text"] = 'Fontify';
		props["size"] = 50;
		props["pos"] = [app.activeDocument.width/2, app.activeDocument.height/2];
		props["justification"] = Justification.CENTER;

	}

	// set default values
	props["visible"] = false;
	props['panelcolor'] = "blue";

	return props;
}

//****************************************************************************************************************************************************

function dialogContent() {

	var justification = 0;
	if   		(textProperties["justification"] == Justification.CENTER) 	justification = 1;
	else if (textProperties["justification"] == Justification.RIGHT)		justification = 2;

	var newDialogContent = [];
													newDialogContent.push(['edittext', 'Text:', textProperties["text"] ]);
													newDialogContent.push(['numberpositive', 'Size:', textProperties["size"] ]);
													newDialogContent.push(['rgb', 'Color:', textProperties["color"] ]);
													newDialogContent.push(['dropdown', 'Justification:', ['left', 'center', 'right'], justification]);
	for(i in fontGroups)  	newDialogContent.push(['checkbox', fontGroups[i]])

	return newDialogContent;
}

//****************************************************************************************************************************************************

function updateTextProps(){

	// basic options
	textProperties["text"] = dialogValues["Text"];
	textProperties["size"] = dialogValues["Size"];
	textProperties["color"] = dialogValues["Color"];

	// justification
	var justification = Justification.LEFT
	if     (dialogValues["Justification"] == 1)  justification = Justification.CENTER;
	else if(dialogValues["Justification"] == 2)  justification = Justification.RIGHT;
	textProperties["justification"] = justification;
}

//****************************************************************************************************************************************************

function createLayerSetForText() {
// create a layer set for our new text layers

	updateProgressWindow('Creating a layer set for our new text layers');
	newLayerSet = app.activeDocument.layerSets.add();

	// if we selected a text layer we move the group to this position and have the same name
	// else we want it to be the top layer and have the name of the text
	if(activeLayer.kind == LayerKind.TEXT) {

		newLayerSet.move(activeLayer, ElementPlacement.PLACEAFTER);
		newLayerSet.name = activeLayer.name;


	} else {
		newLayerSet.name = dialogValues["Text"];
	}

	return newLayerSet;
}

//*****************************************************************************************************************************************************

function resetDocumentState() {
	// unhide the last layer
	updateProgressWindow('Unhide our last layer');
	app.activeDocument.activeLayer.visible = true;
}

//****************************************************************************************************************************************************

function alertValues() {

	var alertTxt = "";
	alertTxt += "text: " + dialogValues["Text"] + "\r";
	alertTxt += "size: " + dialogValues["Size"] + "\r";
	alertTxt += "color: " + dialogValues["Color"] + "\r";
	for(i in fontGroups)  alertTxt += fontGroups[i] + ": " + dialogValues[fontGroups[i]] + "\r";

	alert(alertTxt);
}

//****************************************************************************************************************************************************

function fillInFontWindows() {

	fontGroups.push('Red Dice Fonts');
	myFonts[fontGroups[fontGroups.length - 1]] = [];
	myFonts[fontGroups[fontGroups.length - 1]].push('DINPro-Light');
	myFonts[fontGroups[fontGroups.length - 1]].push('DINPro-Black');

	fontGroups.push('Design');
	myFonts[fontGroups[fontGroups.length - 1]] = [];
	myFonts[fontGroups[fontGroups.length - 1]].push('Mexcellent-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('Mexcellent3D-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('Arkhip');
	myFonts[fontGroups[fontGroups.length - 1]].push('Borg');
	myFonts[fontGroups[fontGroups.length - 1]].push('BudmoJigglish-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('BudmoJiggler');
	myFonts[fontGroups[fontGroups.length - 1]].push('Langdon');

	fontGroups.push('Hand Written');
	myFonts[fontGroups[fontGroups.length - 1]] = [];
	myFonts[fontGroups[fontGroups.length - 1]].push('HousegrindPersonalUseOnly');
	myFonts[fontGroups[fontGroups.length - 1]].push('Stalemate-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('ArchitectsDaughter');
	myFonts[fontGroups[fontGroups.length - 1]].push('DancingScript');
	myFonts[fontGroups[fontGroups.length - 1]].push('IndieFlower');
	myFonts[fontGroups[fontGroups.length - 1]].push('KaushanScript-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('Montez-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('Pacifico-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('CraftyGirls');
	myFonts[fontGroups[fontGroups.length - 1]].push('GrandHotel-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('GreatVibes-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('HaloHandletter');

	fontGroups.push('Arabic');
	myFonts[fontGroups[fontGroups.length - 1]] = [];
	myFonts[fontGroups[fontGroups.length - 1]].push('Aladdin');
	myFonts[fontGroups[fontGroups.length - 1]].push('XXIIARABIAN-ONENIGHTSTAND-Bold');

	fontGroups.push('Car');
	myFonts[fontGroups[fontGroups.length - 1]] = [];
	myFonts[fontGroups[fontGroups.length - 1]].push('FerroRosso');
	myFonts[fontGroups[fontGroups.length - 1]].push('HousegrindPersonalUseOnly');
	myFonts[fontGroups[fontGroups.length - 1]].push('TopSpeed');
	myFonts[fontGroups[fontGroups.length - 1]].push('TopSpeedOutline');

	fontGroups.push('Chalk');
	myFonts[fontGroups[fontGroups.length - 1]] = [];
	myFonts[fontGroups[fontGroups.length - 1]].push(fontGroups.length, 'Eraser-Regular');

	fontGroups.push('Comic book');
	myFonts[fontGroups[fontGroups.length - 1]] = [];
	myFonts[fontGroups[fontGroups.length - 1]].push('AgentOrange');
	myFonts[fontGroups[fontGroups.length - 1]].push('BadaBoomBB');
	myFonts[fontGroups[fontGroups.length - 1]].push('BDCartoonShout');
	myFonts[fontGroups[fontGroups.length - 1]].push('ComicNoteSmooth');
	myFonts[fontGroups[fontGroups.length - 1]].push('ComixLoud');
	myFonts[fontGroups[fontGroups.length - 1]].push('ArchitectsDaughter');

	fontGroups.push('Mediaval');
	myFonts[fontGroups[fontGroups.length - 1]] = [];
	myFonts[fontGroups[fontGroups.length - 1]].push('WashingtonText-Regular');

	fontGroups.push('Neon');
	myFonts[fontGroups[fontGroups.length - 1]] = [];
	myFonts[fontGroups[fontGroups.length - 1]].push('Automania');
	myFonts[fontGroups[fontGroups.length - 1]].push('Beon-Medium');
	myFonts[fontGroups[fontGroups.length - 1]].push('LasEnterPersonalUseOnly');
	myFonts[fontGroups[fontGroups.length - 1]].push('Spongy-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('TextMeOne-Regular');

	fontGroups.push('Old Roman');
	myFonts[fontGroups[fontGroups.length - 1]] = [];
	myFonts[fontGroups[fontGroups.length - 1]].push('Martel-UltraLight');
	myFonts[fontGroups[fontGroups.length - 1]].push('Martel-Heavy');
	myFonts[fontGroups[fontGroups.length - 1]].push('OldStandardTT-Italic');
	myFonts[fontGroups[fontGroups.length - 1]].push('OldStandardTT-Bold');

	fontGroups.push('Stone Carved');
	myFonts[fontGroups[fontGroups.length - 1]] = [];
	myFonts[fontGroups[fontGroups.length - 1]].push('ObeliskMXVV');

	fontGroups.push('Wood Carved');
	myFonts[fontGroups[fontGroups.length - 1]] = [];
	myFonts[fontGroups[fontGroups.length - 1]].push('Janglywalk');
	myFonts[fontGroups[fontGroups.length - 1]].push('Janglywalk');

	fontGroups.push('Western');
	myFonts[fontGroups[fontGroups.length - 1]] = [];
	myFonts[fontGroups[fontGroups.length - 1]].push('CarnivaleeFreakshow');
	myFonts[fontGroups[fontGroups.length - 1]].push('RioGrande-Bold');
	myFonts[fontGroups[fontGroups.length - 1]].push('RioGrandeStriped-Bold');
	myFonts[fontGroups[fontGroups.length - 1]].push('TexasTangoBOLDPERSONALUSE');

	fontGroups.push('Horror');
	myFonts[fontGroups[fontGroups.length - 1]] = [];
	myFonts[fontGroups[fontGroups.length - 1]].push('Clarisse~');
	myFonts[fontGroups[fontGroups.length - 1]].push('PersonalDelinquent');
	myFonts[fontGroups[fontGroups.length - 1]].push('Rosemary-Roman');
	myFonts[fontGroups[fontGroups.length - 1]].push('SpidersandSparrowsDEMO');
	myFonts[fontGroups[fontGroups.length - 1]].push('ParchmentMF');
}

//****************************************************************************************************************************************************

function fillInFontMac() {

	fontGroups.push('Comic book');
	myFonts[fontGroups[fontGroups.length - 1]] = [];
	myFonts[fontGroups[fontGroups.length - 1]].push('SFWonderComicBlotch');
	myFonts[fontGroups[fontGroups.length - 1]].push('SFWonderComicInline');

	fontGroups.push('Design');
	myFonts[fontGroups[fontGroups.length - 1]] = [];
	myFonts[fontGroups[fontGroups.length - 1]].push('400ml-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('Adamas-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('BaronNeue-Normal');
	myFonts[fontGroups[fontGroups.length - 1]].push('BaronNeue-Outline');
	myFonts[fontGroups[fontGroups.length - 1]].push('BaronNeue-UltraItalic');
	myFonts[fontGroups[fontGroups.length - 1]].push('CroissantOne-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('ElsieSwashCaps-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('Federant-Medium');
	myFonts[fontGroups[fontGroups.length - 1]].push('Habana');
	myFonts[fontGroups[fontGroups.length - 1]].push('Homestead-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('Homestead-One');
	myFonts[fontGroups[fontGroups.length - 1]].push('Homestead-One');
	myFonts[fontGroups[fontGroups.length - 1]].push('Homestead-Three');
	myFonts[fontGroups[fontGroups.length - 1]].push('Homestead-Display');
	myFonts[fontGroups[fontGroups.length - 1]].push('Intro');
	myFonts[fontGroups[fontGroups.length - 1]].push('Kabel');
	myFonts[fontGroups[fontGroups.length - 1]].push('Kabel-Light');
	myFonts[fontGroups[fontGroups.length - 1]].push('Lobster');
	myFonts[fontGroups[fontGroups.length - 1]].push('LobsterTwo');
	myFonts[fontGroups[fontGroups.length - 1]].push('Merienda-Regular_0_wt');
	myFonts[fontGroups[fontGroups.length - 1]].push('Metropolis1920');
	myFonts[fontGroups[fontGroups.length - 1]].push('Molle-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('MrsEaves-Italic');
	myFonts[fontGroups[fontGroups.length - 1]].push('MrsEavesFractions');
	myFonts[fontGroups[fontGroups.length - 1]].push('MrsEavesJustLig-Italic');
	myFonts[fontGroups[fontGroups.length - 1]].push('MrsEavesJustLigRoman');
	myFonts[fontGroups[fontGroups.length - 1]].push('MrsEavesPetiteCaps');
	myFonts[fontGroups[fontGroups.length - 1]].push('MrsEavesRoman');
	myFonts[fontGroups[fontGroups.length - 1]].push('MrsEavesSmallCaps');
	myFonts[fontGroups[fontGroups.length - 1]].push('MrsEavesSmartLig-Italic');
	myFonts[fontGroups[fontGroups.length - 1]].push('MrsEavesSmartLigRoman');
	myFonts[fontGroups[fontGroups.length - 1]].push('NewYorker');
	myFonts[fontGroups[fontGroups.length - 1]].push('OleoScriptSwashCaps-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('QUB');
	myFonts[fontGroups[fontGroups.length - 1]].push('Riesling');
	myFonts[fontGroups[fontGroups.length - 1]].push('Satisfy');
	myFonts[fontGroups[fontGroups.length - 1]].push('Schablone-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('SeaweedScript-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('Sketchetik');
	myFonts[fontGroups[fontGroups.length - 1]].push('SS_Adec2.0_initials');
	myFonts[fontGroups[fontGroups.length - 1]].push('SS_Adec2.0_main');
	myFonts[fontGroups[fontGroups.length - 1]].push('SS_Adec2.0_text');
	myFonts[fontGroups[fontGroups.length - 1]].push('Tetra');
	myFonts[fontGroups[fontGroups.length - 1]].push('tetradecorative');
	myFonts[fontGroups[fontGroups.length - 1]].push('TrueLove');
	myFonts[fontGroups[fontGroups.length - 1]].push('Uplink');
	myFonts[fontGroups[fontGroups.length - 1]].push('Universum');
	myFonts[fontGroups[fontGroups.length - 1]].push('AltRenDuo');
	myFonts[fontGroups[fontGroups.length - 1]].push('AltRenRegular');
	myFonts[fontGroups[fontGroups.length - 1]].push('AltRenRetro');
	myFonts[fontGroups[fontGroups.length - 1]].push('AltRenShadow');
	myFonts[fontGroups[fontGroups.length - 1]].push('Anders');
	myFonts[fontGroups[fontGroups.length - 1]].push('Chelsea');
	myFonts[fontGroups[fontGroups.length - 1]].push('ChelseaII');
	myFonts[fontGroups[fontGroups.length - 1]].push('ChelseaIII');
	myFonts[fontGroups[fontGroups.length - 1]].push('ChelseaIV');
	myFonts[fontGroups[fontGroups.length - 1]].push('Didot');
	myFonts[fontGroups[fontGroups.length - 1]].push('HighTide');
	myFonts[fontGroups[fontGroups.length - 1]].push('HighTideSans');
	myFonts[fontGroups[fontGroups.length - 1]].push('Higher');
	myFonts[fontGroups[fontGroups.length - 1]].push('Jaapokkienchance-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('Jaapokkisubtract-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('London');
	myFonts[fontGroups[fontGroups.length - 1]].push('LondonFill');
	myFonts[fontGroups[fontGroups.length - 1]].push('Modular');
	myFonts[fontGroups[fontGroups.length - 1]].push('ModularII');
	myFonts[fontGroups[fontGroups.length - 1]].push('ModularIII');
	myFonts[fontGroups[fontGroups.length - 1]].push('ModularOutlines');
	myFonts[fontGroups[fontGroups.length - 1]].push('ModularShadow');
	myFonts[fontGroups[fontGroups.length - 1]].push('Native');
	myFonts[fontGroups[fontGroups.length - 1]].push('Nord-Bold');
	myFonts[fontGroups[fontGroups.length - 1]].push('Rispa');
	myFonts[fontGroups[fontGroups.length - 1]].push('Yuma-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('Valkyrie-CondensedItalic');
	myFonts[fontGroups[fontGroups.length - 1]].push('Valkyrie-BoldCondensedItalic');
	myFonts[fontGroups[fontGroups.length - 1]].push('Valkyrie-Italic');
	myFonts[fontGroups[fontGroups.length - 1]].push('Valkyrie-BoldItalic');
	myFonts[fontGroups[fontGroups.length - 1]].push('Valkyrie-ExtendedItalic');
	myFonts[fontGroups[fontGroups.length - 1]].push('Valkyrie-BoldExtendedItalic');
  myFonts[fontGroups[fontGroups.length - 1]].push('Glamor-Regular');
  myFonts[fontGroups[fontGroups.length - 1]].push('Vanity-Light');
  myFonts[fontGroups[fontGroups.length - 1]].push('Borg');
  myFonts[fontGroups[fontGroups.length - 1]].push('PlayfairDisplaySC-BlackItalic');
  myFonts[fontGroups[fontGroups.length - 1]].push('Butler-UltraLight');
  myFonts[fontGroups[fontGroups.length - 1]].push('Butler-ExtraBold');
  myFonts[fontGroups[fontGroups.length - 1]].push('ButlerStencil-Light');
  myFonts[fontGroups[fontGroups.length - 1]].push('ButlerStencil-ExtraBold');

	fontGroups.push('Fat');
	myFonts[fontGroups[fontGroups.length - 1]] = [];
	myFonts[fontGroups[fontGroups.length - 1]].push('Tracion-Normal');
	myFonts[fontGroups[fontGroups.length - 1]].push('CalgaryScriptOT');
	myFonts[fontGroups[fontGroups.length - 1]].push('Nord-Bold');
	myFonts[fontGroups[fontGroups.length - 1]].push('Modular');
	myFonts[fontGroups[fontGroups.length - 1]].push('OleoScriptSwashCaps-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('Null-Free');
	myFonts[fontGroups[fontGroups.length - 1]].push('Intro');
	myFonts[fontGroups[fontGroups.length - 1]].push('Homestead-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('BenderSolid');

	fontGroups.push('Inline');
	myFonts[fontGroups[fontGroups.length - 1]] = [];
	myFonts[fontGroups[fontGroups.length - 1]].push('BaronNeue-ExtraBoldultraitalic');
	myFonts[fontGroups[fontGroups.length - 1]].push('Intro-Inline');
	myFonts[fontGroups[fontGroups.length - 1]].push('Homestead-Inline');
	myFonts[fontGroups[fontGroups.length - 1]].push('Bender-Inline');
	myFonts[fontGroups[fontGroups.length - 1]].push('Bender-InlineOnly');
	myFonts[fontGroups[fontGroups.length - 1]].push('SFWonderComicInline');
	myFonts[fontGroups[fontGroups.length - 1]].push('Blanch-CapsInline');
	myFonts[fontGroups[fontGroups.length - 1]].push('Blanch-CondensedInline');

	fontGroups.push('Thin');
	myFonts[fontGroups[fontGroups.length - 1]] = [];
	myFonts[fontGroups[fontGroups.length - 1]].push('Blanch-CapsLight');
	myFonts[fontGroups[fontGroups.length - 1]].push('Blanch-CondensedLight');
	myFonts[fontGroups[fontGroups.length - 1]].push('BubblerOne');
	myFonts[fontGroups[fontGroups.length - 1]].push('FlexDisplay-Thin');
	myFonts[fontGroups[fontGroups.length - 1]].push('JosefinSans-Thin');
	myFonts[fontGroups[fontGroups.length - 1]].push('JosefinSlab-Thin');
	myFonts[fontGroups[fontGroups.length - 1]].push('JosefinSans-Bold');
	myFonts[fontGroups[fontGroups.length - 1]].push('JosefinSlab-Bold');
	myFonts[fontGroups[fontGroups.length - 1]].push('OstrichSans-Light');
	myFonts[fontGroups[fontGroups.length - 1]].push('OstrichSans-Black');
	myFonts[fontGroups[fontGroups.length - 1]].push('OstrichSansDashed-Medium');
	myFonts[fontGroups[fontGroups.length - 1]].push('OstrichSansRounded-Medium');
	myFonts[fontGroups[fontGroups.length - 1]].push('WireOne');
	myFonts[fontGroups[fontGroups.length - 1]].push('Azedo-Light');
	myFonts[fontGroups[fontGroups.length - 1]].push('Infinity');
	myFonts[fontGroups[fontGroups.length - 1]].push('Bavro-Regular');
  myFonts[fontGroups[fontGroups.length - 1]].push('Bender-Thin');
  myFonts[fontGroups[fontGroups.length - 1]].push('Butler-UltraLight');
  myFonts[fontGroups[fontGroups.length - 1]].push('Butler-ExtraBold');

	fontGroups.push('Hand written');
	myFonts[fontGroups[fontGroups.length - 1]] = [];
	myFonts[fontGroups[fontGroups.length - 1]].push('alwaysforever');
	myFonts[fontGroups[fontGroups.length - 1]].push('Arizonia-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('BadScript-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('BilboSwashCaps-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('CalgaryScriptOT');
	myFonts[fontGroups[fontGroups.length - 1]].push('ClickerScript-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('Confessions');
	myFonts[fontGroups[fontGroups.length - 1]].push('Crispy');
	myFonts[fontGroups[fontGroups.length - 1]].push('DelinquentealtIDemo');
	myFonts[fontGroups[fontGroups.length - 1]].push('DelinquenteDemo');
	myFonts[fontGroups[fontGroups.length - 1]].push('DrSugiyama-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('HaloHandletter');
	myFonts[fontGroups[fontGroups.length - 1]].push('LeagueScriptThin-LeagueScript');
	myFonts[fontGroups[fontGroups.length - 1]].push('LovedbytheKing');
	myFonts[fontGroups[fontGroups.length - 1]].push('Molle-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('MrBedfort-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('Pacifico-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('PetitFormalScript-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('Qwigley-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('Ruthie-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('Sacramento-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('Satisfy');
	myFonts[fontGroups[fontGroups.length - 1]].push('SeaweedScript-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('ShimesOnePERSONALUSE');
	myFonts[fontGroups[fontGroups.length - 1]].push('ShimesTwoPERSONALUSE');
	myFonts[fontGroups[fontGroups.length - 1]].push('Snippet');
	myFonts[fontGroups[fontGroups.length - 1]].push('SouthernAirePersonalUseOnly');
	myFonts[fontGroups[fontGroups.length - 1]].push('Stalemate-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('The-Constellation-of-Heracles');
	myFonts[fontGroups[fontGroups.length - 1]].push('WisdomScriptAI');
	myFonts[fontGroups[fontGroups.length - 1]].push('Yesteryear-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('Brocha-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('DancingScript');
	myFonts[fontGroups[fontGroups.length - 1]].push('PWScratchedfont');
	myFonts[fontGroups[fontGroups.length - 1]].push('GiddyupStd');
	myFonts[fontGroups[fontGroups.length - 1]].push('Montez-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('MarckScript-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('Waterlily-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('XPLORBold-Regular');
	myFonts[fontGroups[fontGroups.length - 1]].push('DilemHandwritten-Medium');
	myFonts[fontGroups[fontGroups.length - 1]].push('Againts');
	myFonts[fontGroups[fontGroups.length - 1]].push('thunder');
	myFonts[fontGroups[fontGroups.length - 1]].push('BadheadTypeface');
	myFonts[fontGroups[fontGroups.length - 1]].push('Cutepunk-Bold');
	myFonts[fontGroups[fontGroups.length - 1]].push('Cutepunk-Light');
	myFonts[fontGroups[fontGroups.length - 1]].push('HaloHandletter');
	myFonts[fontGroups[fontGroups.length - 1]].push('Noteworthy-Light');
	myFonts[fontGroups[fontGroups.length - 1]].push('AirwaysPERSONALUSEONLY');
	myFonts[fontGroups[fontGroups.length - 1]].push('HousegrindPersonalUseOnly');
	myFonts[fontGroups[fontGroups.length - 1]].push('BillyOhio');
	myFonts[fontGroups[fontGroups.length - 1]].push('SugarCandy');
}

//****************************************************************************************************************************************************
