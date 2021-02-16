// by RanzigenDanny
// regexFunctions
// v1

// GUIDE

// TODO
// /g achte de regex zetten betekend returned all matches, er zal er ook zel een zijn van return first match zodat ik niet meer met die array firstWordArray[0] moet werken

//*************************************************************************************************************************************************************************

function trim(string) {
// delete all the whitespaces before and after the text

	string = string + "";

	if(string == '') return '';
	else {

		var stringTrimmed = '';
			stringTrimmed = string.replace(/^\s+|\s+$/g,'');

		return stringTrimmed;
	}
}

//*************************************************************************************************************************************************************************

function separateLines(string) {
// returns an array with an element per line

	string = string + "";

	var lines = [];
	lines = string.match(/[^\r\n]+/g);
			// \r    search for new line code
			// \n    the same i think?
			// ^		 matches the whore word for exemplate ^a will math the a in 'a ape' but not the a in ape
			// [...] find any of the ones included in the []
			// +     find it one or more times
			// g     global match

	return lines;
}

//*************************************************************************************************************************************************************************

function separateByChar(string, seperateChar) {
// returns an array with an element per line

	string = string + "";
	var findings = [];
	var leftOverString = string;

	// this does not work in photoshop
	// return string.split(seperateChar).map(function(v){ return v.trim() });

	// when the function was still separateByComma
	// var lines = [];
 	// 	lines = string.match(/[^,]+/g);
	// 		// ,	 ',' literaaly
	// 		// ^	 matches the whore word for exemplate ^a will math the a in 'a ape' but not the a in ape
	// 		// [...] find any of the ones included in the []
	// 		// +     find it one or more times
	// 		// g     global match

	var regexString = new RegExp("[^" + seperateChar + "]+");
			// ^	 matches the whore word for exemplate ^a will math the a in 'a ape' but not the a in ape
			// [...] find any of the ones included in the []
			// +     find it one or more times
			// g     global match

	do {
		findings.push( leftOverString.match( regexString) );
		leftOverString = leftOverString.replace( findings[findings.length-1 ]+seperateChar, "" );
		// alert("findings[ findings.length-1 ]: " +findings[ findings.length-1 ] + "\nleftOverString: " + leftOverString + "\n" + (findings[ findings.length-1 ] != leftOverString));
	} while (findings[ findings.length-1 ] != leftOverString)

	return findings;
}

//*************************************************************************************************************************************************************************
/* TEST CODE */
// alert( findLastWord('Hanne maez is de baas'));
// alert( find2LastWords('Hanne maez is de baas'));
// alert( find2LastWords('low 1 fx 1'));
// alert( findEverythingAfter('Meas Hanne: maez is de baas', ':'));

function findLastWord(string) {
// spiegel eerste de string en zoek dan het eerste woord

	string = string + "";

	var revstr = reverseString(string);
	var reverseFind = findEverythingAfter(string);
	return reverseFind;
}

//*********************************************************

function find2LastWords(string) {

	string = string + "";

	var twoLastWords = [];
	twoLastWords[0] = findLastWord(string);

	var deleteLastWordNotFirst = reverseString(string)
	var adjustedString = deleteLastWordNotFirst.replace(twoLastWords[0], "");
	adjustedString = reverseString(adjustedString);

	twoLastWords[1] = findLastWord(adjustedString);

	return (twoLastWords[1] + " " + twoLastWords[0] );
}

//*********************************************************

function findEverythingAfter(string, searchChar) {
// spiegel de string en zoek dan alles na het searchChar

	string = string + "";

	var regexString = new RegExp(searchChar + ".+");
			// .    any character
			// +	any amount of times
	firstWordArray = string.match(regexString);

	firstWordArray = firstWordArray + "";
	firstWordArray = firstWordArray.replace(searchChar, "");

	return firstWordArray;

	// legacy
	// var revstr = reverseString(string);
	// var reverseFind = findEverythingBefore(revstr, searchChar);
	// return reverseString(reverseFind);
}

//*********************************************************

function reverseString(s) {
  return s.split('').reverse().join('');
}

//*************************************************************************************************************************************************************************
/* TEST CODE */
// alert( findFirstWord('Hanne maez is de baas'));
// alert( findEverythingBefore('Meas Hanne: maez is de baas', ':'));
// alert( findEverythingBefore('Maes:Hanne is de baas', ':'));

function findFirstWord(string) { return findEverythingBefore(string); }

//*********************************************************

function findEverythingBefore(string, searchChar) {
// if searchChar is an array it will return everything until one of the elements is found
// returns everything before the searchChar
// if there is no searchChar, we will return the first word

	string = string + "";

	if(typeof searchChar === 'undefined') searchChar = ' ';

	var firstWordArray = [];

	var regexString = new RegExp("[^" + searchChar + "]+");
			// [...] find any of the ones included in the []
			// ^	 matches the whole word for exemplate ^a will math the a in 'a ape' but not the a in ape
			// +     find it one or more times

	firstWordArray = string.match(regexString);

	return firstWordArray + ''; // return firstWordArray[0];
}

//*************************************************************************************************************************************************************************

function findWordStartingWith(string, starting) {
// when you look for findWordStartingWith("layername #tag", "#")
// he will return "#tag"

	string = string + "";

	string = findEverythingAfter(string, starting);
	string = findEverythingBefore(string, " ");

	return string + "";
}

//*************************************************************************************************************************************************************************

function findSymbol(string, searchChar) {

	string = string + "";

	var regexString = new RegExp(searchChar);
	firstWordArray = string.match(regexString);

	if(firstWordArray)  return true;
	else								return false;

	// legacy
	// var revstr = reverseString(string);
	// var reverseFind = findEverythingBefore(revstr, searchChar);
	// return reverseString(reverseFind);
}

//*************************************************************************************************************************************************************************

function findFirstKey(txt, splitChar) {
// when txt is: "image:sym_1.png comp:wild"
// returns: "image"
// splitChar can be an array

	var line = trim(txt);
	var key = findEverythingBefore(line, splitChar); // find everything before the first ':'
	return key;
}

//*********************************************************

function findFirstValue(txt, splitChar) {
// when txt is: "image:sym_1.png comp:wild"
// returns: "sym_1.png"
// splitChar can be an array

	var line = trim(txt);
													  													// line  = "image:sym_1.png comp:wild"	line = "title: game"
	var value = findEverythingAfter(line, splitChar); 	// value = "sym_1.png comp:wild"				value = " title"
			value = trim(value);						  							// value = "sym_1.png comp:wild"				value = "title"
			value = findEverythingBefore(value, ' ');	  		// value = "sym_1.png"									value = "title"

	return value;
}

//*********************************************************

function findFirstKeyAndValue(txt, splitChar) {
// when txt is: "image:sym_1.png comp:wild"
// returns: ["image", "sym_1.png"]
// splitChar can be an array

	return [findFirstKey(txt, splitChar), findFirstValue(txt, splitChar)];
}

//*********************************************************

function findAllKeysAndValues(txt, splitChar) {
// when txt is: "image:sym_1.png comp:wild slice:sliceName"
// returns: ["image","comp:wild"] , ["comp","wild"] , ["slice","sliceName"]
// splitChar can be an array

	var returnArray = [];

	while(txt != "") {

		var firstKeyAndValue = findFirstKeyAndValue(txt, splitChar);

		returnArray.push(firstKeyAndValue);

		txt = txt.replace(firstKeyAndValue[0], "");
		txt = txt.replace(firstKeyAndValue[1], "");
		txt = txt.replace(splitChar, "");
		txt = trim(txt);
	}

	return returnArray;
}

//****************************************************************************************************************************************************

function getMatches(string, array) {

  var allMatches = [];
  var regexString = new RegExp(string);

  for(var i in array) {
    var matchString = array[i].match(regexString);
    if(matchString) allMatches.push(array[i]);
  }

  return allMatches;
}

//****************************************************************************************************************************************************

function replaceAllChars(str, character, replace) {

	var str = str + "";
	var newString = "";
	var newStringArr = [];

	// loop trough each letter and replace
	for(var i = 0, len = str.length; i < len; i++) {
		if(str[i] == character) newStringArr.push(replace);
		else 										newStringArr.push(str[i]);
	}

	// make the array into a string
	for(var i in newStringArr) newString += newStringArr[i];

	// return
	return newString;
}

//****************************************************************************************************************************************************
