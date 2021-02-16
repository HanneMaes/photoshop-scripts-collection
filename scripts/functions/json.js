// by RanzigenDanny
// json
// v4

// GUIDE
// the test code is at the bottom because the functions are variables that must be declared first

// TODO
// I cant write objects because the key is not stringified
// just find a way to stringify the incoming object
//    var file = {};
//        file.list = ["een", "twee", 3]  ->  will become this is the json file  ->   ({list:["een", "twee", 3]})   ->  list must be "list"
// writeJson() checken of de folder al bestaad en als dat niet zo is vargen om te creeeren
// in the path replace all the "\" with "/"
// replace "D:" or "C:" with "/d" or "/c"

// TEST
// /*var json = {};
//     json.list = ["wilde gij het aan?", "ja", "of nee?", "of ni ofwo?", "ik moet het nu weten"];*/
// var json = ["wilde gij het aan me mij?", "ja", "of nee?", "of ni ofwo?", "ik moet het nu weten"];
// writeJson(json);
//
// // var content = readJson().list; /* the list os to show we can just get a port of the whole json if we want to */
// var content = readJson(); /* the list os to show we can just get a port of the whole json if we want to */
// alert(content);

//@include "saveFunctions.jsx"

//*************************************************************************************************************************************************************************
//*************************************************************************************************************************************************************************
//*************************************************************************************************************************************************************************

// dont know what this does
var eachItem = function(myItemList,func){ for(var i=0; i<myItemList.length; i++){ func(myItemList[i]); } };

//*************************************************************************************************************************************************************************

var save = function(file, text){
    file.encoding = "UTF-8";
    var handle = file.open("w");
    if( handle ){
        file.write(text);
        file.close();
    }
};

//*************************************************************************************************************************************************************************

var read = function(file){
    file.encoding = "UTF-8";
    var handle = file.open("r");
    if( handle ){
        var text = file.read();
        file.close();
        return text;
    }
    return '';
};

//*************************************************************************************************************************************************************************

var toJsonObject = function( jsonString ){
    return eval('(' + jsonString + ');' );
};

//*************************************************************************************************************************************************************************
//*************************************************************************************************************************************************************************
//*************************************************************************************************************************************************************************

function writeJson(writeObj, fileName, path) {
// writeObj must be an object {} and not a key values array
// path: must be a string, when not specified I will user: '/d/CloudStation/RanzPanel/scripts/data/generated/', does not have to have "/" at the end, the function will add it
// fileName: does not have to contain ".json" the function will add it when it does not have it

  if((typeof path === "undefined")     || (path == ""))      var path = '/d/CloudStation/Photoshop scripting/scripts/data/generated/';
  if((typeof fileName === "undefined") || (fileName == ""))  var fileName = 'unnamed_' + app.activeDocument.name + '.json';

  // alert("writeObj: " + writeObj + "\nfileName: " + fileName + "\npath:" + path);

  // check if last character of path is "/"
  var last = path.substr(path.length - 1);
  if(last != "/") path += "/";

  // check is fileName has ".json"
  var lastFive = fileName.substr(fileName.length - 5).toLowerCase();
  if(lastFive != ".json") fileName += ".json";

  // create the file & write the json
  var file = new File(path + fileName);
  // alert("write json: " + file);
  var stringified = writeObj.toSource();
  save(file, stringified);
}

//*************************************************************************************************************************************************************************

function readJson(fileName, path) {
// fileName: does not have to contain ".json" the function will add it when it does not have it
// path: must be a string, when not specified I will user: '/d/CloudStation/RanzPanel/scripts/data/generated/', does not have to have "/" at the end, the function will add it
// if the json file does not exists I will return false

  if((typeof path === "undefined")     || (path == ""))       var path = '/d/CloudStation/Photoshop scripting/scripts/data/generated/';
  if((typeof fileName === "undefined") || (fileName == ""))   var fileName = 'unnamed_' + removeExtention(app.activeDocument.name) + '.json';

  // check if last character of path is "/"
  var last = path.substr(path.length - 1);
  if(last != "/") path += "/";

  // check is fileName has ".json"
  var lastFive = fileName.substr(fileName.length - 5).toLowerCase();
  if(lastFive != ".json") fileName += ".json";

  // create the file & read the json
  var file = new File(path + fileName);
  // alert("read json: " + file);
  try {
    var json2 = read(file);
    var jsonObject = toJsonObject(json2);
  } catch (e) {
    // alert("ERROR json.js: I cant read " + fileName);
    jsonObject = false;
  }

  return jsonObject;
}

//*************************************************************************************************************************************************************************
