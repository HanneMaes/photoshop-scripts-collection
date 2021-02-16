// by RanzigenDanny
// ErrorHandler
// v17

// GUIDE
/*
addError('Message'); 			// use this to generate variables
addQuestion('Message'); 	// aks with a checkbox - all check boxes must be true to continue

report();								// returns false if there are errors else returns true
report('choice'); 			// gives the user the choice to return true or false, also clears the log
report('show');	 				// returns false and shows the errors and clears the error log if there are errors
report('endScript'); 	 	// also shows the script finised popup
*/

// TODO

//@include "functions/dialogPlus.jsx"

var errorLog = '';
var errorLogTitle = '';
var errorWindowTitle = '';
var scriptErrors;

initialize();

//****************************************************************************************************************************************************

function initialize(h1, title) {
// create the variables we need for the error hander
// I created this function to know the difference beween a successfull scrip and the user pressing cancel (scriptErrors is 0 on both occasions)
			// successfull script:  scriptErrors == 0
			// user pressed cancel: scriptErrors == 0, but the variables dont exist

	if(typeof h1 === 'undefined' || h1 == '') errorLogTitle = "I'm sorry, I was unsuccessfull \r \r Error log:";
	else									  									errorLogTitle = h1 + '\r';

	if(typeof title === 'undefined') 	errorWindowTitle = "RanzScript talks to you";
	else							 								errorWindowTitle = title;

	errorLog += errorLogTitle;

	scriptErrors = 0;
}

//****************************************************************************************************************************************************

function addError(Message, alert){
// alert: show an alert immediatly

	// add stuff to the error log
	errorLog += '\r - ' + Message;
	scriptErrors++;

	// show an alert message if needed
	if(typeof alert == undefined)	alert("Oeps... \r" + Message, errorWindowTitle);
}

//****************************************************************************************************************************************************

function report(type) {
// returns true or false
// type can be
// 		'choice': give the user the choice the continue or not
//		'show': dont give the user the choice
//	  nothing: dont even show a popup just return true or false

	if(type == 'choice') {
			var show = true;
			var choiceDialog = true;
			var afterText = "\n\nDo I continue or not?";
	} else if(type == 'show') {
			var show = true;
			var choiceDialog = false;
			var afterText = "";
	} else if(type == 'endScript'){
			var choiceDialog = false;
			var show = true;
			var afterText = "";
	} else { // just return true or false
			var choiceDialog = false;
			var show = false;
			var afterText = "";
	}

	errorLog += afterText;


	if(scriptErrors == 0) {

	// ------ NO ERRORS ------

		// if there are errors we always want to show them but when there are not errors we dont always want to show the finished popup
		if(type == 'endScript') alert("Succesfully completed!  \rThank you RanzScript!", errorWindowTitle);

		return true;


	} else {

	// ------ ERRORS ------

		if(choiceDialog) {

			if(confirm(errorLog))   var returnValue = true;
			else					var returnValue = false;

			initialize();

			return returnValue;

		} else {

			if(show) {
				alert(errorLog, errorWindowTitle);
				initialize();
			}

			return false;

		}
	}
}

//****************************************************************************************************************************************************
