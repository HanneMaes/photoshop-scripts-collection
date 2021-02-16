// by RanzigenDanny
// promptPlus
// v2

// GUIDE

// TODO

// TEST
/*
var number = promptPlus('number', 'Nummer: ', 10, 'promptPlus');
var positiveNumber = promptPlus('numberPositive', 'Positief nummer: ', 10, 'promptPlus');
var rgb = promptPlus('RGB', 'Red, green or blue : ', 255, 'promptPlus');
var string = promptPlus('string', 'String : ', 'Jou string', 'promptPlus');
alert('promptPlus double check: ' + positiveNumber);
*/

//*************************************************************************************************************************************************************************

function promptPlus(type, message, defaultValue, title) {
// returns the content the user gave
// type can be: 'number', 'numberPositive', 'rgb', 'string'

	// check for variables
	if(!type)	{
		alert('promptPlus Error: \r\rYou did not specify a prompt type', 'promptPlus Error');
		return;
	}
	if(!message) 			var message = 'promptPlus Error: You did not specify a message';
	if(!defaultValue) var defaultValue = 'promptPlus Error: You did not specify a defaultValue';
	if(!title) 				var title = 'promptPlus';

	// do the prompt a first time
	var userReturn = prompt(message, defaultValue, title);

	// keep doing the prompt is the values are false
	switch(type){
		case 'number':
					while(!Number(userReturn)) {
						message += '\rERROR: You did not enter a number!';
						userReturn = prompt(message, defaultValue, title);
					}
					break;

		case 'numberPositive':
					while(Number(userReturn)<1 ) {
						message += '\rERROR: You did not enter a positive number! Zero not included.';
						userReturn = prompt(message, defaultValue, title);
					}
					break;

		case 'RGB':
		case 'rgb':
					while( !(Number(userReturn)>=0 && Number(userReturn)<=255)) {
						message += '\rERROR: You did not enter a single RGB number (0 - 255)!';
						userReturn = prompt(message, defaultValue, title);
					}
					break;

		case 'string':
					// everything you enter is defined as a string in javascript
					// this is a good thing otherswise I can't fontify '015'
	}

	return userReturn;
}

//*************************************************************************************************************************************************************************
