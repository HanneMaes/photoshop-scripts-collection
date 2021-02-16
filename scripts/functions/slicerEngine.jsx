// by RanzigenDanny
// Slicer Engine
// v67

// GUIDE
// alles in de user input layer moet ik 1 woord geschreven worden
// er mogen geen spaties zijn tussen key:value
// size can be 1024,512 - 512 - 50% - 50%,20% - 1024,50%
// maxsize can only be in pixels
// slicegroups worden niet gehide omdat het een image ken zijn die visible moet zijn & het zou het scrip vertragen
// er word niet gechecked of slice groups bestaan, ik ben bang dat dat het script trager gaat maken - nu krijg je een error per slice in de group die gebruikt word

// TODO

// groups introduceren
//	group:low1 title: dice low 1 met alle highlights
//	image:low1.png groups:low1,hl0
// in de UI het aantal exports erbij zetten zodat ik kan controlleren of ik alles ga exporten

// een array kunne meeegeven aan size [[512,''],[256,'_med'][64,'_small']]
// of een systeem zodat bij groups dat een array comma seperated is (bij size werkt dat jammer geniet niet)

// wou ik de input layers in een nested (smart layer) layer kunnen zetten, zou handig zijn met kleine bestanden en dan gaat het editten mss sneller
// group exort comp:myself
// comp kan momenteel geen nr zijn, dan gebruitk hij het nr als de hoeveelste comp hij export denkik, maar voor de dice export kan het wel handig zijn dat ik gewoon een nr kan gebruiken
// size van de input layer varieert altijd
// unispace font gebruiken
// hij crashed bi het exporteren van een layer set als de naam van de layerset niet bestaad, dan crashed bij in function gatherArtLayers(layerSet)
// sharpen werkt niet
// when workign with a slice check how many percent the slice if according to the document size -> in saveFunctions.jsx
// mss is het sneller dat ik bij saveAs() niet door de layers van een slice grou ploop maar .getByName() gebruik. dan moet ik wel uitvogelen hoe de layers in var sliceGroups = getArtLayersFromAllSLiceGroups(images) gestored worden
// de modes werken nog niet helemaal, de mode word al aangepast in het nieuwe document, maar bij het exporteren neemt hij tg weer rgb
// bij 2 images met de zelfde name gaat hij raar doen als je 1 wel en de 2de niet selecteerd -> if(userValues[imageName]) want die imagename in de uservalues array gaat hetzelfde zijn
// het mogelijk maken om als default path dit in te stellen defaulkt path: D:\Svn\front\assets\Games\TableGames en dan als path bij een image dit path:+/baccarat

//@include "functions/layerFunctions.jsx"
//@include "functions/progressWindow.jsx"
//@include "functions/dialogPlus.jsx"
//@include "functions/regexFunctions.js"
//@include "functions/saveFunctions.jsx"
//@include "functions/errorHandler.jsx"

var userInputLayerName =  getLayerName('inputLayer');
var sliceGroupName = 			getLayerName('sliceGroup');

//****************************************************************************************************************************************************
//****************************************************************************************************************************************************

function Slicer_Engine(command, extraValues) {
// slicer_export_all.js 						command: "exportall"  									extraValues: "undefined"									export all avaliable images
// slicer_create_and_resize.jsx 		command: "createandresize" 							extraValues: percentNormalized						resize and create slice layer - when there already is on just run Slicer_Engine()
// slicer_create_slice_group.jsx 		command: "createslicegroup" 						extraValues: "undefined"									create a slice group
// dice_exporter.jsx 								command: "dice" 												extraValues: "name of input layer"				runs Slicer_Engine() for the dice
// photography_edit.jsx							command: "addText"											extraValues: string of default values     adds a string a default values to the default values like this 'default size:1000,false comp:hover'

	// we do not check command and extraValues for correct values
	// because it is the responebility of the scripts calling Slicer_Engine()
	// because the checks slow down this script, it's faster to do targetted checks in the function calling Slicer_Engine()

	// check if we want to use a special user input layer (for the dice exports)
	if(command == "dice") userInputLayerName = extraValues;

	// check if we already have in regex user input layer
	// returns the user input layers text or false
	var userInputText = getTextLayerContent(userInputLayerName);

	if(!userInputText || command == "addText" || command == "createslicegroup") {
	// WE DO NOT HAVE A USER INPUT LAYER - make input layer & slices group

		createUserInputLayers(userInputText, command, extraValues);

		// alert message - I dont show this anymore because I thinks its abvious enough that a text layer appeared
		// var alertMsg = "I created:\r" + userInputLayerName + ": for all the user input";
		// if(command == "createslicegroup") alertMsg += "\r" + sliceGroupName + ": for all your slices";
	  // alert(alertMsg, 'RanzScrip talks to you');

		// The End

	} else {
	// WE HAVE A REGEX USER INPUT LAYER SO CONTINUE

		// make an array of all the seperate line
		textlines = separateLines(userInputText);

		// show dialog
		if(command == "exportall") 	var dialogValues = allValuesTrue(textlines);	// set everything to true
		else 											  var dialogValues = createDialog(textlines);		// dialogValues['imageName.extetion': true]

		// check if did not press cancel in our dialog
		if(dialogCanceled) {}
		else {

			showProgressWindow();
			updateProgressWindow('Preparing export...', 'title');

			// make an array with all the image data - contains only the images the user selected
			// we have to loop through all the image lines because we have to account for all the default lines
			// we specify images[i]["slice"] & images[i]["slice group"] as string and not as the layer object because it would take to much time to calculate for images we dont export
			// these are the exact values to pass to saveFunction.jsx so groups are expanded to images and slice:myself is accounted for
			var images = getValues(textlines, dialogValues); // images = array of objects [{},{},{}]

			// get all the layers in the different slice groups
			// sliceGroups is an object = { "slice group folder name": [array of layers in the group], "slice group folder name": [array of layers in the group] }
			// it's important we only do this once because this makes the script a lot slower
			// because var images only contains the user selected images we only search the slice groups for images the user wants to export
			// do not gather all the layers in the slice groups if no image uses a slice layer - to speed thing up
			var sliceLayerUsed = false
			for (var i in images)
				if(images[i]["slice"] != "") {
					sliceLayerUsed = true;
					break;
			}
			if(sliceLayerUsed) {
				var sliceGroups = getArtLayersFromAllSLiceGroups(images); // array of all slice groups, if we have multiple instances of the same slice group we only gather it once
			}

			// only continue is all slice groups exist
			// if(report('show')) {

				// export after images are checked for wrong values
				// return true if everything is correct, returns false if there are no errors but the user did not want to upscale the image or create the unexisting foldersor returns an array of errors
				var errorChecker = saveFilesAsCheck(images, sliceLayerUsed ? sliceGroups : false);

				// continue if there are no errors
				if(errorChecker == true) {

					// hide the user input layer & slice layer set
					var userInputLayerToHide = app.activeDocument.artLayers.getByName(userInputLayerName);
							userInputLayerToHide.visible = false;

					// export all the images
					updateProgressWindow('Exporting...', 'title');
					saveFilesAs(images, sliceLayerUsed ? sliceGroups : false);

					// THE END SUCCESSFULL
					closeProgressWindow();
					report('endScript');

				// if we did not continue and there are error add them to errorHanler.jsx and show them
				} else if (errorChecker.length > 0) {
					// THE END UN-SUCCESFULL
					for(var i in errorChecker) addError(errorChecker[i] + "");
					report('endScript');
				}

			// } // if slice groups exist
		} // if dialog canceled
	} // if we dont have a user input layer

}

//****************************************************************************************************************************************************
//****************************************************************************************************************************************************

function createUserInputLayers(userInputText, command, extraValues) {
// userInputText: text lines added at the botton of the text layer
// extraValues: other information I need to pass bv. bij resize geef de ik amount of resize mee en dat moet dan nog berekend worden hoeveel percent ik de default size moet geven
// this function is called from dice_exporter.jsx and the command can also be "//Syms-website-dice" or "//Syms-game-dice" or "//Syms-website-nodice" or "//Syms-game-nodice"

	// default values that may be adjust by scripts calling Slicer_Engine()
	var defaultSize = false;
	if(command == "createandresize") 	defaultSize = 100 / extraValues + "%";

	// default values that always stay the same
	var defaultSlice = ""; 											// slice name may not be a number or the script wil crash, default takes the whole canvas
	var defaultComp = "";  											// this only works when there are no layer comps, default takes the selected comp
	var defaultJpgQuality = 100;								// 0 - 100
	var defaultJpgBlur = 0;											// 0 - 2
	var defaultSharpen = 0;											// 0 - 10 the amount of times a sharpen filter is applied on the resized image
	var defaultMode = "rgb";										// 'rgb', 'cmyk' or 'greyscale', default takes the mode of the document
	var defaultPath = app.activeDocument.path;	// "D:/Svn/Art/Casino/Games/Videoslots/ArcticDice/Game/"; // change the \ to / and has to end with /
	var folderName = "Group 1";
	var defaultExports = "";										// if we want to put default image exports in the user input layer we put them there

	var returnString = "";

	// check if /Assets is in the path so I can change it to /Game
	var docPathOriginal =	app.activeDocument.path + "";
	var docPath = 	    	app.activeDocument.path + "";

	var regexAssets = docPathOriginal.match(/(\/Assets)/);
	if(regexAssets) {
		docPath = docPathOriginal.replace("Assets", "Game");
		docPath += "/Images";
	}

	// create the text layer
	var textProperties = [];
			textProperties['layerFX'] = true;
			textProperties['layerName'] = userInputLayerName;
			textProperties['panelcolor'] = "violet";
			textProperties['text'] = [
				"// title:Text \r",
				"// default prefix suffix slicegroup \r",
				"// image:name.ext comp slice size:512-false-50% sharpen:0-10 jpgQuality:0-100 jpgBlur:0-2 mode:rgb-cymk-greyscale info:text  \r",
				"// group:groupName image:name.ext-layer.ext-count.ext prefix:layer-count-text suffix:layer-count-text maxsize:512-false slice:myself comp:myself \r",
				"\r",
				"default path: ", docPath, "\r",
			].join("");

	// add slice group
	if(command == "createslicegroup") {
		createslicegroup();
		textProperties['text'] += "default slicegroup:" + sliceGroupName + "\r";
	}

	// add variable elements
	if(defaultSize && !userInputText) {
		textProperties['text'] += "default size:" + defaultSize + "\r";
	}

	// create the default export values
	if(command == "addText" || command == "//Syms-assets-dice" || command == "//Syms-website-dice" || command == "//Syms-assets-nodice" || command == "//Syms-website-nodice") {
		textProperties['text'] += userInputText;
	} else {
		// make the first image name the name of the document
		var imageNameOriginal = app.activeDocument.name;
		defaultExports = "image:" + imageNameOriginal.replace(".psd", ".png");
	}
	textProperties['text'] += defaultExports;

	// change the name of the layer if needed
	if(command == "//Syms-assets-dice" || command == "//Syms-website-dice" || command == "//Syms-assets-nodice" || command == "//Syms-website-nodice") textProperties['layerName'] = command;

	// create the text layer
	createTextLayer(textProperties);
}

//****************************************************************************************************************************************************

function createDialog(txt) {
// regex trough the user input layer
// and create dialog

	var newDialogContent = [];

	// loop through all the lines
	for(var i in txt) {

		var firstKeyValue = findFirstKeyAndValue(txt[i], ":");

		// line types
		switch(firstKeyValue[0].toLowerCase()) {
			case "title":
							var titleTxt = trim(findEverythingAfter(txt[i], ":"));
							newDialogContent.push(['title', titleTxt ]);
							break;
			case "group":
			case "image":
							// add checkbox
							var imageTxt = firstKeyValue[1];
							if(firstKeyValue[0].toLowerCase() == "group") imageTxt = "group " + imageTxt;
							newDialogContent.push(['checkbox', imageTxt]);

							// add info text
							var infoText = findWordStartingWith(txt[i], "info:");
							if(infoText != "null") newDialogContent.push(['aftertext', infoText]);
							break;
		}
	}

	// show dialog
	return createDialogPlus(newDialogContent, 'showDialog', 'id', 'slicer'); // slicer = json suffix
}

//****************************************************************************************************************************************************

function allValuesTrue(txt) {
// instead of showing a dialog and let the user choose what to export we want to export everything

	var imageExports = [];

	// loop through all the lines
	for(var i in txt) {

		var firstKeyValue = findFirstKeyAndValue(txt[i], ":");

		// line types
		if(firstKeyValue[0].toLowerCase() == "image") {
			var imageTxt = firstKeyValue[1];
			imageExports[imageTxt] = true;
		}
	}

	// the user did not press cancel
	dialogCanceled = false;

	// return
	return imageExports;
}

//****************************************************************************************************************************************************

function getValues(txt, userValues) {
// get all default & selected image values trough regex

	updateProgressWindow('getting values trough regex');

	var defaults = {}; // object
			defaults["slice"] = ""; // must be something of it will return the defenition of the .slice() function

	var imgs = []; // array of objects [{key: value}, {key: value}, {key: value}]

	var imageCounter = 0; // the imgs[i] is not correct because default and white lines may not be counted

	// loop through all the lines
	for(var i in txt) {
		updateProgressWindow('searching trough line: ' + txt[i]);

		var firstKey = findFirstKey(txt[i], ":");
			  firstKey = findFirstWord(firstKey);

		// line types
		switch(firstKey.toLowerCase()) {
			case "default":
										defaults = regexLine(txt[i], defaults, firstKey.toLowerCase());
										// alertImageArray(txt[i], defaults, "default");
										break;

			case "image":
										var imageName = findFirstValue(txt[i], ":");

										// only continue if the user wants to export this image
										if(userValues[imageName]) {

											imgs[imageCounter] = regexLine(txt[i], defaults, firstKey.toLowerCase());
											// alertImageArray(txt[i], imgs, "image");

											imageCounter++;
										}
										break;

			case "group":
										var groupName = findFirstValue(txt[i], ":");

										// only continue if the user wants to export this image
										var userValuesKey = "group " + groupName;
										if(userValues[userValuesKey]) {

											// remove the group from the txt line because from this point we see it as a normal line
											var txtLine = txt[i].replace( "group:"+groupName, "" );

											// loop through all the layers in the group
											var groupLayers = [];
											    groupLayers = gatherArtLayers(groupName);

											// break when layer set does not exists
											if(groupLayers == false) {
												addError("can't find layer group " + groupName);
												break
											}

											for(var j in groupLayers) {

												imgs[imageCounter] = regexLine(txtLine, defaults, firstKey.toLowerCase());

												// prefix and suffix
												if((typeof userValues["suffix"] !== "undefined") || (typeof userValues["prefix"] !== "undefined")) {
													imgs[imageCounter]["image"] = constructImageName(imgs[imageCounter]["image"], imgs[imageCounter]["prefix"], imgs[imageCounter]["suffix"]);
												}

												// prefix and suffix
												alert("suffix en prefix \n" + imgs["suffix"] + "\n" + imgs["prefix"]);
												if((typeof imgs["suffix"] !== "undefined") || (typeof imgs["prefix"] !== "undefined")) {
													imgs[imageCounter]["image"] = constructImageName(imgs[imageCounter]["image"], imgs[imageCounter]["prefix"], imgs[imageCounter]["suffix"]);
												}

												// comp myself
												if(imgs[imageCounter]["comp"] == "myself") {}

												imageCounter++;

												// alertImageArray(txt[i], imgs[imageCounter], "image");
											}
										}
										break;

			// no case: throw an error in the script log
			updateProgressWindow("this was a comment line and did not found image, default, title or group in the text");
		}
	}

	return imgs; // array of objects

	//**********************************************

	function constructImageName(image, prefix, suffix) {
	// combines in image name with its prefix and suffix

		alert("\nname: " + name + "\nprefix: " + prefix + "\nsuffix: " + suffix);

		if(typeof prefix === "undefined") var prefix = "";
		if(typeof suffix === "undefined") var suffix = "";

		// adjust the image name
		var extention = getExtention(imgs[imageCounter]["image"]);
		var name = removeExtention(image);
		if(typeof prefix === "undefined") var prefix = "";
		if(typeof prefix === "undefined") var prefix = "";

		if(name   == "layer") name =   groupLayers[j].name;
		if(prefix == "layer") prefix = groupLayers[j].name;
		if(suffix == "layer") suffix = groupLayers[j].name;

		if(name   == "count") name   = j;
		if(prefix == "count") prefix = j;
		if(suffix == "count") suffix = j;

		return (prefix + name + suffix + "." + extention);
	}

	//**********************************************

}

//****************************************************************************************************************************************************

function regexLine(line, values, type) {
	// we start values from our default values
	// so the default values are automatically added to the image
	// if we change or add defautl values they will only count for the images declared after that
	// this is so that we can declare several images then change a default value. The new defautl values will only apply for the images declared afterwards

		updateProgressWindow("start regexing line");

		if(typeof values === "undefined") var values = [];
		if(type != "image") line = line.replace(type, "");

		// regex all the keys and values
		var keyValueArr = findAllKeysAndValues(line, ":");
		// alert("keyValueArr: " + keyValueArr);

		// because we want to start from default values and add the new found values
		// we make a copy of our default values (values) and start from there
		var imgValues = [];
		for(var i in values) imgValues[i] = values[i]; // we can not normally copy an array or object because then we reference the object, and both the objects will point to the same stuff

		// copy our new values over the value new copied from our defualt values
		for(var i in keyValueArr) {

			if(keyValueArr[i][0] == "size" || keyValueArr[i][0] == "maxsize") 	imgValues[ keyValueArr[i][0] ] = separateByChar(keyValueArr[i][1], ",");   // with the size key we have to separate by komma
			else 																																imgValues[ keyValueArr[i][0] ] = keyValueArr[i][1];									 			 // all the other values can just be copied

			updateProgressWindow("image - " + keyValueArr[i][0] + ": " + imgValues[ keyValueArr[i][0] ]);
		}

		return imgValues;
}

//****************************************************************************************************************************************************

function getSliceGroups(imgs) {
// return on abject
// { "slicegroup folder name": [array of layers in the group],
//	 "slicegroup folder name": [array of layers in the group],
//   "slicegroup folder name": [array of layers in the group], }

		var sliceGroupObj = {};
}

//****************************************************************************************************************************************************

function getArtLayersFromAllSLiceGroups(imgs) {
	// returns an abject
  // { "slice group folder name": [array of layers in the group],
  //	 "slice group folder name": [array of layers in the group],
  //   "slice group folder name": [array of layers in the group], }
	// the same slicegroups will be filtered away in gatherArtLayers_multiple()

	var sliceGroupNames = [];
	for(var i in imgs) {
		if(imgs[i]["slicegroup"]) sliceGroupNames.push(imgs[i]["slicegroup"]);
	}

	// olny gather art layers if there are slicegroups found
	if(sliceGroupNames.length > 0) {
		var returnVar = false;
		try {
			returnVar = gatherArtLayers_multiple(sliceGroupNames);
		} catch (e) {
			returnVar = false;
			addError("Not all slicegroups exist");
		}
		return returnVar;
	} else {
		return false;
	}
}

// ***************************************************************************************************************************************

function createslicegroup(name) {

	if(typeof name === "undefined") var name = sliceGroupName;

	var newLayerSet = app.activeDocument.layerSets.add();
			newLayerSet.name = name;
			newLayerSet.opacity = 25;
			//newLayerSet.move(activeLayer, ElementPlacement.PLACEAFTER);
	changeActiveLayerColor("violet");
}

// ***************************************************************************************************************************************

function getLayerNameDice(inputLayerOrSliceGroup) {
	if(			inputLayerOrSliceGroup == "inputLayer-dice-website")  return "//Syms-website";
	else if(inputLayerOrSliceGroup == "inputLayer-dice-assets")   return "//Syms-assets";
	else 																										 			return "//Syms-slices";
}

function getLayerName(inputLayerOrSliceGroup) {

	if(inputLayerOrSliceGroup == "inputLayer")  var nameVariants = ["//Images", "#RanzScript user input"];
	else 																				var nameVariants = ["//Slices", "#RanzScript slices"];

	// global variable so I only need to look for the correct names once
	// nameNumber;
	// if(typeof nameNumber !== "undefined") return nameVariants[nameNumber];
	// else {

		// loop trough the names
		for(var i in nameVariants) {
			try {
				app.activeDocument.artLayers.getByName(nameVariants[i]);
				nameNumber = i;
				return nameVariants[i];
			} catch (e) {}
		}

	// } // undef

	// if al else fails return the current name
	return nameVariants[0];
}

// ***************************************************************************************************************************************

function addDefaultLine(lineType) {
// adds a default line in the user input layer
// lineType can be: "slicegroup"

	// make the default line text
	var defaultLine = "";
	if(lineType == "slicegroup") defaultLine = "default slicegroup: " + sliceGroupName;

	// insert the new default line before the default path line
	// because the default path line is alway there, because the slicer_engine always needs a path to export to
	var txt = getTextLayerContent();
	var newTxt = txt.replace(/default path/, (defaultLine + "\rdefault path") );
	setTextLayerContent(userInputLayerName, newTxt);

	return newTxt;
}

//****************************************************************************************************************************************************

function alertImageArray(line, obj, imageOrDefault) {

	// var keys = Object.keys(obj);
	// alert("Object.keys: " + keys);
	//
	// for(var i in keys) alertMsg += keys[i] + ": " + obj[ keys[i] ];

	if(typeof imageOrDefault === "undefined") imageOrDefault = "image";

	var alertMsg = line + "\n\n" + imageOrDefault + "\n\n";

	if(imageOrDefault == "image") 	alertMsg += "image: " + obj["image"] + "\n";
	alertMsg += "prefix: " 			+ obj["prefix"] + "\n";
	alertMsg += "suffix: " 			+ obj["suffix"] + "\n";
	alertMsg += "slicegroup: "  + obj["slicegroup"] + "\n";
	alertMsg += "slice: " 			+ obj["slice"] + "\n";
	alertMsg += "bounds: " 			+ obj["bounds"] + "\n";
	alertMsg += "path: " 				+ obj["path"] + "\n";
	alertMsg += "comp: " 				+ obj["comp"] + "\n";
	alertMsg += "size: " 				+ obj["size"] + "\n";
	alertMsg += "sharpen: " 		+ obj["sharpen"] + "\n";
	alertMsg += "mode: " 				+ obj["mode"] + "\n";
	alertMsg += "jpgQuality: " 	+ obj["jpgQuality"] + "\n";
	alertMsg += "jpgBlur: " 		+ obj["jpgBlur"] + "\n";
	alertMsg += "maxwsize: " 		+ obj["maxSize"] + "\n";

	alert(alertMsg);
}

//****************************************************************************************************************************************************
