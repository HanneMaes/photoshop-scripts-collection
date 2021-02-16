// by RanzigenDanny
// progressWindow
// v16

// GUIDE
/*
	// show the progress window
	showProgressWindow("jsonNameSuffix"); // when we have multiple progressWindows in one script we want to have dirrerent json names for our files so you must specify a suffix

	// then update the window
	updateProgressWindow('Get dialog properties');
	updateProgressWindow('Get dialog properties', 'title');

	// The End
	closeProgressWindow();
*/

// TODO

//@include "functions/json.js"
//@include "functions/regexFunctions.js"

// global variables
var enableLogging = false   // true to write a log of the script for debugging - might slow down the script
var progressTextObj = [];		// array containing all the text object in our window
var progressText = [];   		// the array containing all our progress text
var steps = 0;							// counts the steps we have already done to calculate the percentage for the progress bar
var totalSteps;							// the amount of steps it took the last time we ran the scipt
var jsonName;								// jsonName.json
var amountOfTextLines = 10;	// the default amount of text lines

//****************************************************************************************************************************************************

function showProgressWindow(jsonNameSuffix) {
// textLineNumbers: how many text lines do we want for our progress text

	// make the name of the json file
	jsonName = "progressWindow_" + app.activeDocument.name;
	if(typeof jsonNameSuffix !== "undefined") jsonName += "_" + jsonNameSuffix;
	jsonName +=  replaceAllChars(app.activeDocument.path, "/", "-");

	// load json - returns false is the json does not exist
	totalSteps = readJson(jsonName);
	if(!totalSteps) totalSteps = 100;

	// our initial progress text
	for(var i = 0; i <= amountOfTextLines; i++) progressText.push('');

	// create our progress window
	// global so that function updateProgressWindow() can access it
	progressWindow = new Window ("window", "RanzScript is wokring for you", undefined, {closeButton:false});
	progressWindow.orientation = 'column';
	progressWindow.alignChildren = 'fill';
	progressWindow.margins = 10;
	progressWindow.spacing = 5;

	// create our title static text title line
	titleTextObj = progressWindow.add('statictext', undefined);
	titleTextObj.text = 'Preparing...';
	titleTextObj.justify = 'left';
	titleTextObj.characters = 30;
	//titleTextObj.graphics.font = ScriptUI.newFont ("", "bold", 13);
	titleTextObj.graphics.foregroundColor = titleTextObj.graphics.newPen(progressWindow.graphics.PenType.SOLID_COLOR, [0.3,0.3,0.3], 1);

	// create our static text lines
	for(var i = 0; i <= amountOfTextLines; i++) {
		progressTextObj[i] = progressWindow.add('statictext', undefined);
		progressTextObj[i].text = progressText[i];
		progressTextObj[i].justify = 'left';
		progressTextObj[i].characters = 30;
		//progressTextObj[i].graphics.font = ScriptUI.newFont ("", "regular", 10);
		progressTextObj[i].graphics.foregroundColor = progressTextObj[i].graphics.newPen(progressWindow.graphics.PenType.SOLID_COLOR, [0.5, 0.5, 0.5], 1);
	}

	// create our bar
	progressBar = progressWindow.add('Progressbar', undefined);
	progressBar.value = 100;

	progressWindow.show();
}

//****************************************************************************************************************************************************

function updateProgressWindow(string, title) {

	progressText[steps] = string;

	// check if we are dealing with a title or just un update
	if(typeof title  === 'undefined') {

		// write our static text lines
		for(var i = 0; i <= amountOfTextLines; i++) {

			var stepsIndex = steps - (amountOfTextLines - (i - 1));

			if(stepsIndex < 0) 	progressTextObj[i].text = '';
			else 								progressTextObj[i].text = progressText[stepsIndex];
		}

	} else {

		// write our title text lines
		titleTextObj.text = string;
	}

	// update our progress bar
	progressBar.value = steps/totalSteps*100;
	steps++;

	// write the json log
	// we do this every time because when the script crashed we want to see what happend last
	// I hope this does not slow down the script too much
	writeLog();
}

//****************************************************************************************************************************************************

function closeProgressWindow() {

	progressWindow.close();					// close the window
	writeJson(steps, jsonName);			// save amount of steps in json

	writeLog();
}

//****************************************************************************************************************************************************

function writeLog() {

	if(enableLogging) {
		var now = new Date();
		var nowTxt =  now.getFullYear();
	  		nowTxt += "/" + (now.getMonth() + 1);
	  		nowTxt += "/" + now.getDate();
	  		nowTxt += " " + now.getHours();
	  		nowTxt += ":" + now.getMinutes();
	  		nowTxt += ":" + now.getSeconds();

		var logObj = [];
				logObj.push(app.activeDocument.name);
				logObj.push(nowTxt);
				logObj.push(progressText);

		writeJson(logObj, "logOfLastScript", "/d/CloudStation/RanzPanel/scripts/data/");
	}
}

//****************************************************************************************************************************************************
