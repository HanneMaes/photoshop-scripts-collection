// by RanzigenDanny
// DialogPlus
// v40

// GUIDE - to test write this in a new .jsx file
/*
//@include "functions/dialogPlus.jsx"
var newDialogContent = [];
		newDialogContent.push(['title', 'Title']);
		newDialogContent.push(['statictext', 'Your static text here']);
		newDialogContent.push(['aftertext', 'afterText']);
		newDialogContent.push(['edittext', 'Edit text:', 'Hanne']);
		newDialogContent.push(['number', 'Number:', '7']);
		newDialogContent.push(['numberpositive', 'Positive number:', '6']);
		newDialogContent.push(['aftertext', 'afterText']);
		newDialogContent.push(['title', 'Title Checkboxes']);
		newDialogContent.push(['checkbox', 'Option 1', true]);
		newDialogContent.push(['checkbox', 'Option 2', false]);
		newDialogContent.push(['checkbox', 'Option 3', true]);
		newDialogContent.push(['aftertext', 'afterText']);
		newDialogContent.push(['radiobutton', 'Radio 1', false]);
		newDialogContent.push(['aftertext', 'afterText']);
		newDialogContent.push(['radiobutton', 'Radio 2', true]);
		newDialogContent.push(['radiobutton', 'Radio 3', false]);
		newDialogContent.push(['dropdown', 'Image type:', ['.jpg', '.png', '.psd'], 2]);
		newDialogContent.push(['rgb', 'Rgb:', app.foregroundColor.rgb]);
		newDialogContent.push(['slider', 'Slider:', 25]);	// slider goinf from 0 to 100
		newDialogContent.push(['path', 'Choose Path:', 'C:/Users/Hanne/Desktop/x']);
		newDialogContent.push(['btnyes', 'over ride the YES button']);
		newDialogContent.push(['btnno', 'over ride the NO button']);
		//newDialogContent.push(['falsetype', 'false', 'false']);		// shows what happens when we give a false type
var dialogValues = createDialogPlus(newDialogContent, 'showDialog', 'id', 'noJsonSave');  // "index" or "id", "noJsonSave" = json save or not or the name of the json file

// check if did not press cancel in our dialog
if(dialogCanceled) var scriptCanceled = true; // we need dialogPlusCanceled for compatebility with errorHandler
else {
	alert("do code magic");
} // if(dialogCanceled)
*/

// TODO
// bij get path zowel een text field als een knop op te browsen voor op mac (zie getFilesInFolder in savefunction.jsx)
// het eerste element van de input array (het element dat het type van weergeeft (statictext, checkbox, ...)) onafhankelijk maken van grote of kleine letters
// radio buttons werken niet - ze vormen samen geen groep je kan we dus allemaal selecterer
// een title value mee kunnen geven dat dat mooi de naam van het scrpt weergeeft
// give titles a background color - try white
// all & none buttons after every group of checkboxes
// afterText gives more spacing to the next element (because we use a group)

//@include "json.js"
//@include "regexFunctions.js"

var dialogCanceled = false;

//*************************************************************************************************************************************************************************

function createDialogPlus(contentArray, showDialog, arrayWithIndexOrId, jsonNameSuffix) {
// contentArray ['type', 'text']
// contentArray types: 'statictext, 'edittext', 'number', 'numberpositive', 'rgb' 'checkbox', 'dropdown', 'slider', 'path', 'aftertext', 'title', 'btnyes', 'btnno';
// arrayWithIndexOrId: 'index' or 'id' = this function will return an array do we want the array to work with array[i] (index) or array['value'] (id)
// jsonNameSuffix = false: do not save a json file else it is a suffix to define what type of dialog the json is for (the same file can have a json for the slicer dialog, dice exporter dialog, comps exporter dialog and we dont want them to overwwrite eachother)

	if(arrayWithIndexOrId == "key")			 								arrayWithIndexOrId = "id";
	else if(typeof arrayWithIndexOrId === "undefined") 	arrayWithIndexOrId = "id";

	// JSON
	if(jsonNameSuffix == 'noJsonSave' || jsonNameSuffix == false || jsonNameSuffix == "false") {
		var jsonName = false;
	} else {

		// json name
		if(typeof jsonNameSuffix === "undefined") jsonNameSuffix = "_";
		else 																			jsonNameSuffix += "_";
		var jsonName = "dialogplus_" + jsonNameSuffix + app.activeDocument.name + replaceAllChars(app.activeDocument.path, "/", "-");

		// json object
		var userValuesJson = {}; // here we include the stuff we are going to save into the json files, because for some contenArray types we cant directly store in a json so we need a workaround for then (dropdown & path), I dont store rgb elements in the json because I want to always use the foregroundColor
	}

	var userValues = {};						// all the values the user chose
	var cancelOrContinue = true;
	var dialogObjects = [];					// all our dialog elements so we can easly get the values
	var dialogGroups = []; 					// all our groups. Needed to put text befor our edit text fields
	var dialogGroupsCounter = -1; 	// count how many group elements we create
	var allValuesCorrect;						// check to not close the window when there are values not correctly filled in
	var alertTitle = 'DialogPlus Error';
	var message = 'Oeps...';				// all our erros go here
	var esteticElement;							// all the elements we dont need to pass to the user, mostly static text. We overwrite the variable because we dont need to gets it's value later on
	var prevDialogObject;						// to see when we can add our checkbox buttons
	var dialogGroup;								// after text code
	var prevDialogGroup;						// after text code
	var columnGroups = [];					// array with a group for every column
	var maxColumnElements = 25;			// after this amount of elements he will create a new column
	var columnCounter = 0;					// I dont count 'aftertext' as an seperate element because it's more like a sub element
	var allCheckboxObjects = [];  	// here we store all our checkboxes for the select all and select none buttons
	var activeElement = false;    	// we want our fist editText or number or any textfield to be the active element (we one where you start typing)
	var subTextColor = [0.6, 0.6, 0.6];						// the color of the after text
	var titleColor = [25/255, 155/255, 170/255]; 	// the color of the title text
	var btnYesText = "Lets do this bro";	// text of the YES button of nor overridden by user
	var btnNoText = "Oh hell no";					// text of the NO button of nor overridden by user

	// load json - returns false is the json does not exist
	if(jsonName != false) var jsonData = readJson(jsonName);
	else 									var jsonData = false;

	// create our dialog
	// the window is the parent element of all our groups
	var customDialog = new Window ("dialog", "RanzScrip talks to you", undefined, {closeButton:false});
			customDialog.margins = 15;
			customDialog.orientation = 'column';
			customDialog.alignment = 'left';

	// then we create 2 group
	// the first for the user content with orientation row for the different columns
	// the second for our buttons at the bottom of the window (continue, cancel, all & none) with orientation column
	var contentGroup = customDialog.add ("group", undefined);
			contentGroup.orientation = 'row';
			contentGroup.alignment = 'left';
	var footerGroup = customDialog.add ("group", undefined);
			footerGroup.orientation = 'column';
			footerGroup.alignment = 'left';

	// we them have an array of groups for every column
	addColumn();

	// code to make different columns in case there are too many items in content array
	function addColumn() {
		var column = contentGroup.add ("group", undefined);
				column.orientation = 'column';
				column.alignment = 'top';
				// column.graphics.backgroundColor = column.graphics.newBrush(column.graphics.BrushType.SOLID_COLOR,[0.8,0.8,0.8],1);
				columnGroups.push(column);
	}

	// loop through the contentArray
	for(i in contentArray) {

		// check if we need to create a new column
		if(columnCounter == (maxColumnElements * columnGroups.length)) {
			addColumn();
		}
		columnCounter++;

		var caseKnown = false;	// to check if we know our case, I could use 'case default' but did not know it existed back then

		// then we have a group per single element, for the after text code
		// instead of adding our element directly to our customDialog object, we add it to a group
		// maybe this is heavy and slow? when it is delete this code with '// after text code' comments and replace dialogGroup.add with customDialog.add (but only in the switch case below)
		if(contentArray[i][0] != "btnyes" && contentArray[i][0] != "btnno") {
			// do not do this with the btn text overrdie because these elements do not take space

			dialogGroup = columnGroups[columnGroups.length-1].add ("group", undefined);
			dialogGroup.orientation = 'row';	// column fucks up the after text
			dialogGroup.alignment = 'left';
		}

		// choose what to add
		switch(contentArray[i][0]) {

			// add after text
			case 'aftertext':
			case 'afterText':
				caseKnown = true;
				columnCounter--;
				var afterText = prevDialogGroup.add('statictext', undefined);
					afterText.text = contentArray[i][1];
					afterText.graphics.foregroundColor = afterText.graphics.newPen (prevDialogGroup.graphics.PenType.SOLID_COLOR, subTextColor, 1);
				break;

			// add static text
			case 'statictext':
			case 'staticText':
				caseKnown = true;
				esteticElement = dialogGroup.add('statictext', undefined);
				esteticElement.text = contentArray[i][1];
				esteticElement.justify = 'left';
				break;

			// add title
			case 'title':
				caseKnown = true;
				esteticElement = dialogGroup.add('statictext', undefined);
				esteticElement.text = contentArray[i][1];
				esteticElement.justify = 'left';
				// esteticElement.graphics.font = ScriptUI.newFont("" /*"Arial"*/, "Bold", 16);
				esteticElement.graphics.foregroundColor = esteticElement.graphics.newPen (esteticElement.graphics.PenType.SOLID_COLOR, titleColor, 1);
				break;

			// add edit text
			case 'edittext':
			case 'editText':
				caseKnown = true;
				// group
				dialogGroupsCounter++;
				dialogGroups[dialogGroupsCounter] = dialogGroup.add ("group", undefined);
				dialogGroups[dialogGroupsCounter].orientation = "row";
				dialogGroups[dialogGroupsCounter].alignChildren = ["left", "left"];
				// static text
				esteticElement = dialogGroups[dialogGroupsCounter].add('statictext', undefined);
				esteticElement.text = contentArray[i][1];
				esteticElement.justify = 'left';
				// edit text
				dialogObjects[i] = dialogGroups[dialogGroupsCounter].add('edittext', undefined);
				dialogObjects[i].characters = 15;
				if(!activeElement) dialogObjects[i].active = true; activeElement = true;
				// get data from json
				if(jsonName != false && jsonData != false) {
					dialogObjects[i].text = jsonData[contentArray[i][1]];
				} else {
					if(typeof contentArray[i][2] !== 'undefined') dialogObjects[i].text = contentArray[i][2];	// value the user gave us for when there is no json
					else 																					dialogObjects[i].text = "Text...";					// default value
				}
				break;

			// add positive number edit text
			case 'number':
			case 'numberpositive':
			case 'numberPositive':
				caseKnown = true;
				// group
				dialogGroupsCounter++;
				dialogGroups[dialogGroupsCounter] = dialogGroup.add ("group", undefined);
				dialogGroups[dialogGroupsCounter].orientation = "row";
				dialogGroups[dialogGroupsCounter].alignChildren = ["left", "left"];
				// static text
				esteticElement = dialogGroups[dialogGroupsCounter].add('statictext', undefined);
				esteticElement.text = contentArray[i][1];
				esteticElement.justify = 'left';
				// edit text
				dialogObjects[i] = dialogGroups[dialogGroupsCounter].add('edittext', undefined);
				dialogObjects[i].characters = 4;
				if(!activeElement) dialogObjects[i].active = true; activeElement = true;
				// get data from json
				if(jsonName != false && jsonData != false) {
					dialogObjects[i].text = jsonData[contentArray[i][1]];
				} else {
					if(typeof contentArray[i][2] !== 'undefined') dialogObjects[i].text = contentArray[i][2];	// value the user gave us for when there is no json
					else 																					dialogObjects[i].text = "1";								// default value
				}
				break;

			case 'rgb':
			case 'RGB':
				caseKnown = true;
				dialogObjects[i] = []; // make our array 2 dimensional
				// this the color specify a color or do we choose our foreground color
				if(typeof contentArray[i][2]  === 'undefined') var rgbColor = app.foregroundColor.rgb;
				else																					 var rgbColor = contentArray[i][2];
				// group
				dialogGroupsCounter++;
				dialogGroups[dialogGroupsCounter] = dialogGroup.add ("group", undefined);
				dialogGroups[dialogGroupsCounter].orientation = "row";
				dialogGroups[dialogGroupsCounter].alignChildren = ["left", "left"];
				// static text
				esteticElement = dialogGroups[dialogGroupsCounter].add('statictext', undefined);
				esteticElement.text = contentArray[i][1];
				esteticElement.justify = 'left';
				// edit text
				dialogObjects[i][0] = dialogGroups[dialogGroupsCounter].add('edittext', undefined);
				dialogObjects[i][0].characters = 3;
				if(!activeElement) dialogObjects[i].active = true; activeElement = true;
				// edit text
				dialogObjects[i][1] = dialogGroups[dialogGroupsCounter].add('edittext', undefined);
				dialogObjects[i][1].characters = 3;
				// edit text
				dialogObjects[i][2] = dialogGroups[dialogGroupsCounter].add('edittext', undefined);
				dialogObjects[i][2].characters = 3;
				// I always want to foregroundColor and not the json data
				dialogObjects[i][0].text = Math.floor(rgbColor.red);
				dialogObjects[i][1].text = Math.floor(rgbColor.green);
				dialogObjects[i][2].text = Math.floor(rgbColor.blue);
				break;

			// add check box
			case 'checkbox':
			case 'checkBox':
				caseKnown = true;
				dialogObjects[i] = dialogGroup.add('checkbox', undefined);
				dialogObjects[i].text = contentArray[i][1];
				// push into array for the select all or select none buttons
				allCheckboxObjects.push(dialogObjects[i]);
				// get data from json
				if(jsonName != false && jsonData != false) {
					dialogObjects[i].value = jsonData[contentArray[i][1]];
				} else {
					if(contentArray[i][2] == false) dialogObjects[i].value = false;	// value the user gave us for when there is no json
					else 														dialogObjects[i].value = true;	// default value
				}
				break;

			// add radio box
			case 'radiobutton':
			case 'radioButton':
				caseKnown = true;
				dialogObjects[i] = dialogGroup.add('RadioButton', undefined);
				dialogObjects[i].text = contentArray[i][1];
				// get data from json
				if(jsonName != false && jsonData != false) {
					dialogObjects[i].value = jsonData[contentArray[i][1]];
				} else {
					if(contentArray[i][2] == false) dialogObjects[i].value = false;	// value the user gave us for when there is no json
					else 														dialogObjects[i].value = true;	// default value
				}
				break;

			// add edit text
			case 'dropdown':
			case 'dropDown':
				caseKnown = true;
				// group
				dialogGroupsCounter++;
				dialogGroups[dialogGroupsCounter] = dialogGroup.add ("group", undefined);
				dialogGroups[dialogGroupsCounter].orientation = "row";
				dialogGroups[dialogGroupsCounter].alignChildren = ["left", "left"];
				// static text
				esteticElement = dialogGroups[dialogGroupsCounter].add('statictext', undefined);
				esteticElement.text = contentArray[i][1];
				esteticElement.justify = 'left';
				// dropdown element
				dialogObjects[i] = dialogGroups[dialogGroupsCounter].add('dropdownlist', undefined, contentArray[i][2]);
				// get data from json
				if(jsonName != false && jsonData != false) {
					for( var j in contentArray[i][2] ) {
						if( contentArray[i][2][j] == jsonData[contentArray[i][1]]) {
							dialogObjects[i].selection = j;
							break;
						}
					}
				} else {
					if(typeof contentArray[i][3] !== 'undefined') dialogObjects[i].selection = contentArray[i][3]; // value the user gave us for when there is no json
					else 																					dialogObjects[i].selection = 0; // default values
				}
				break;

			// add slider
			case 'slider':
				caseKnown = true;
				// group
				dialogGroupsCounter++;
				dialogGroups[dialogGroupsCounter] = dialogGroup.add ("group", undefined);
				dialogGroups[dialogGroupsCounter].orientation = "row";
				dialogGroups[dialogGroupsCounter].alignChildren = ["left", "left"];
				// static text
				esteticElement = dialogGroups[dialogGroupsCounter].add('statictext', undefined);
				esteticElement.text = contentArray[i][1];
				esteticElement.justify = 'left';
				// slider
				dialogObjects[i] = dialogGroups[dialogGroupsCounter].add('slider', undefined);
				var sliderObject = dialogObjects[i];
				// slider value
				esteticElement = dialogGroups[dialogGroupsCounter].add('statictext', undefined);
				esteticElement.text = dialogObjects[i].value;
				esteticElement.justify = 'left';
				esteticElement.characters = 4;
				var sliderStaticText = esteticElement;
				// get data from json
				if(jsonName != false && jsonData != false) {
					dialogObjects[i].value = jsonData[contentArray[i][1]];
					esteticElement.text = jsonData[contentArray[i][1]];
				} else {
					if(typeof contentArray[i][2] !== 'undefined') {
						dialogObjects[i].value = contentArray[i][2]; // value the user gave us for when there is no json
						esteticElement.text = contentArray[i][2];
					} else {
						dialogObjects[i].value = "1";								 // default value
						esteticElement.text = "1";
					}
				}
				break;

			// add path
			case 'path':
				caseKnown = true;
				// group
				dialogGroupsCounter++;
				dialogGroups[dialogGroupsCounter] = dialogGroup.add ("group", undefined);
				dialogGroups[dialogGroupsCounter].orientation = "row";
				dialogGroups[dialogGroupsCounter].alignChildren = ["left", "left"];
				// static text
				esteticElement = dialogGroups[dialogGroupsCounter].add('statictext', undefined);
				esteticElement.text = contentArray[i][1];
				esteticElement.justify = 'left';
				// edit text
				dialogObjects[i] = dialogGroup.add('edittext', undefined);
				dialogObjects[i].characters = 30;
				if(!activeElement) dialogObjects[i].active = true; activeElement = true;
				// get data from json
				if(jsonName != false && jsonData != false) {
					dialogObjects[i].text = new Folder(jsonData[contentArray[i][1]]);
				} else {
					if(typeof contentArray[i][2] !== 'undefined') dialogObjects[i].text = contentArray[i][2];				// value the user gave us for when there is no json
					else 																					dialogObjects[i].text = app.activeDocument.path;	// default value
				}
				break;

			// YES btn
			case 'btnyes':
				caseKnown = true;
				btnYesText = contentArray[i][1];
				break;

			// NO btn
			case 'btnno':
				caseKnown = true;
				btnNoText = contentArray[i][1];
				break;
		}

		// after text code
		prevDialogGroup = dialogGroup;

		// buttons All & None checkboxes at the end of the dialog box
		if(i == (contentArray.length-1) && allCheckboxObjects.length > 1) { // this is the last object we create && the amount of checkboxes is bigger then 1
			var checkBoxButtons = true;
			var checkboxButtonGroup = footerGroup.add ("group", undefined);
					checkboxButtonGroup.orientation = "row";
					checkboxButtonGroup.alignment = 'left';
				// checkboxButtonGroup.alignChildren = ["left", "left"];

			var checkboxBtnAll = checkboxButtonGroup.add ("button", undefined, "All");
					checkboxBtnAll.preferredSize = [40,20];
			var checkboxBtnNone = checkboxButtonGroup.add ("button", undefined, "None");
					checkboxBtnNone.preferredSize = [40,20];
			var checkBoxBtnsAfterText = checkboxButtonGroup.add('statictext', undefined);
					checkBoxBtnsAfterText.text = 'Checkboxes';
					checkBoxBtnsAfterText.justify = 'left';
					checkBoxBtnsAfterText.graphics.foregroundColor = checkBoxBtnsAfterText.graphics.newPen (checkboxButtonGroup.graphics.PenType.SOLID_COLOR, subTextColor, 1);
		}

		// the user didnt give a correct dialog object type
		if(!caseKnown){
			alert("Oeps... \rCant build customDialog: type " + contentArray[i][0] + " not kown", "RanzScript talks to you");
			userValues = {}; // empty the array so we know we pressed cancel
			return;
		}
		else {
			prevDialogObject = contentArray[i][0];
		}
	}

	// add finishing touches (buttons)
	var buttonGroup = footerGroup.add ("group", undefined);
			buttonGroup.orientation = "row";
			buttonGroup.alignChildren = ["right", "right"];

	var btnContinue = buttonGroup.add ("button", undefined, btnYesText);
	var bntCancel = buttonGroup.add ("button", undefined, btnNoText);

	// if there is no active element make the continue button the active element
	if(activeElement == false) btnContinue.active = true;

	// button cancel
	bntCancel.onClick = function() {
		userValues = {}; // empty the array so we know we pressed cancel
		dialogCanceled = true;
		customDialog.close();
	}

	// button continue
	btnContinue.onClick = function() {
		fillInUserValues(); // get all out user imput
		if(allValuesCorrect) {

			// store the user values in a json
			// we must do it before the close else the json is not written
			if(jsonName != false) writeJson(userValuesJson, jsonName);

			// close the dialog
			return customDialog.close();

		} else {
			return alert(message, alertTitle);
		}
	}

	// slider value update
	if(sliderObject) {
		sliderObject.onChanging = function() {
			sliderStaticText.text = sliderObject.value;
		}
	}

	if(checkBoxButtons) {
		// button select All checkboxes
		checkboxBtnAll.onClick = function() {
			for(i in allCheckboxObjects) allCheckboxObjects[i].value = true;
		}

		// button select None checkboxes
		checkboxBtnNone.onClick = function() {
			for(i in allCheckboxObjects) allCheckboxObjects[i].value = false;
		}
	}

	// show the dialog
	if(showDialog) customDialog.show();

	// *****************************************************************************
	// the function to get all our user values
	function fillInUserValues(){
		allValuesCorrect = true;
		var id = 0;

		for(i in contentArray) {

				var typefound = true;

				if(arrayWithIndexOrId == "id") {
					// create our array["identifier"] = value
					var idText = contentArray[i][1];
							idText = idText.replace(":", "");
					id = idText;
				} else {
					// in case we dont find a type
					// if we dont create an element in the array we mess up the positions of all the next elements
					userValues[id] = contentArray[i][0] + ' ' + contentArray[i][1];
				}

				// check for type
				switch(contentArray[i][0]) {
					case 'edittext':
					case 'editText': 	userValues[id] = dialogObjects[i].text;
														if(jsonName != false) userValuesJson[id] = dialogObjects[i].text;
									 					break;

					case 'number':  userValues[id] = dialogObjects[i].text;
					case 'number':  if(jsonName != false) userValuesJson[id] = dialogObjects[i].text;
													if(userValues[id] == '0') {
														userValues[id] = 0; // apperently Number('0') is not a number
														if(jsonName != false) userValuesJson[id] = 0; // apperently Number('0') is not a number
													} else {
														if(!Number(userValues[id])) {
															allValuesCorrect = false;
															message += '\r' + contentArray[i][1] + ' ' + userValues[id] + '\r   You did not enter a number!';
														} else {
															userValues[id] = Number(userValues[id]);
															if(jsonName != false) userValuesJson[id] = Number(userValues[id]);
														}
													}
													break;

					case 'numberpositive':
					case 'numberPositive':  userValues[id] = Number(dialogObjects[i].text);
																	if(jsonName != false) userValuesJson[id] = Number(dialogObjects[i].text);
																	if(Number(userValues[id]) < 0) {
																		allValuesCorrect = false;
																		message += '\r' + contentArray[i][1] + ' ' + userValues[id] + '\r   You did not enter a positive number!';
																	}
																	break;

					case 'rgb':
					case 'RGB': var rgbValuesCorrect = true;
											if(Number(dialogObjects[i][0].text) < 0 || Number(dialogObjects[i][0].text) > 255) {
												rgbValuesCorrect = false;
												message += '\r' + contentArray[i][1] + ' ' + dialogObjects[i][0].text + '\r   You did not enter an correct RED value.';
											}
											if(Number(dialogObjects[i][1].text) < 0 || Number(dialogObjects[i][1].text) > 255) {
												rgbValuesCorrect = false;
												message += '\r' + contentArray[i][1] + ' ' + dialogObjects[i][1].text + '\r   You did not enter an correct GREEN value.';
											}
											if(Number(dialogObjects[i][2].text) < 0 || Number(dialogObjects[i][2].text) > 255) {
												rgbValuesCorrect = false;
												message += '\r' + contentArray[i][1] + ' ' + dialogObjects[i][2].text + '\r   You did not enter an correct BLUE value.';
											}

											if(rgbValuesCorrect) {
												// values are correct lets proceed
												var userColor = new SolidColor();
														userColor.rgb.red = dialogObjects[i][0].text;
														userColor.rgb.green = dialogObjects[i][1].text;
														userColor.rgb.blue = dialogObjects[i][2].text;
												userValues[id] = userColor;
												if(jsonName != false) userValuesJson[id] = [userColor.rgb.red, userColor.rgb.green, userColor.rgb.blue];
											} else {
												allValuesCorrect = false;
											}
											break;

					case 'checkbox':
					case 'checkBox': 	userValues[id] = dialogObjects[i].value;
														if(jsonName != false) userValuesJson[id] = dialogObjects[i].value;
														break;

					case 'radiobutton':
					case 'radioButton': userValues[id] = dialogObjects[i].value;
															if(jsonName != false) userValuesJson[id] = dialogObjects[i].value;
															break;

					case 'dropdown':
					case 'dropDown':  userValues[id] = dialogObjects[i].selection;
														if(jsonName != false) userValuesJson[id] = dialogObjects[i].selection.text;
														break;

					case 'slider': 	userValues[id] = dialogObjects[i].value;
													if(jsonName != false) userValuesJson[id] = dialogObjects[i].value;
													break;

					case 'path':  	var folder = new Folder(dialogObjects[i].text);
													// does the folder exists? if not create it
													if(!folder.exists) {
														if(confirm(folder + '\r\rThe folder does not exist yet.\rDo I create it and continue?')) {
															folder.create();
														} else {
															allValuesCorrect = false;
															message += '\r' + contentArray[i][1] + ' ' + dialogObjects[i][2].text + '\r   Path does not exist.';
														}
													}
													userValues[id] = folder;

													if(jsonName != false) {
														// to write the json we want a string of the path and not the folder object
														// new Folder ("~/Desktop") "~/Desktop"
														folderString = "" + folder;
														folderString.replace("new Folder (", "");
														folderString.replace(")", "");
														userValuesJson[id] = folderString;
													}
													break;

					default: typefound = false;
					break;
				}

				if(arrayWithIndexOrId == "index") {
					// we use id instead of i
					// because we dont return statictext or aftertext to the user
					// and when static text userValues.lenght is smaller then contentArray.lenght
					// but contentArray[i] may not skip elements
					if(typefound) id++;
				}
		}
	}
	// *****************************************************************************

	return userValues;
}

//*************************************************************************************************************************************************************************
