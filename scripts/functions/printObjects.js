// by RanzigenDanny
// printObject.js
// v3

// GUIDE
/*
//@include "functions/printObjects.js"
printObjects(printObjs);
*/

// TODO

//@include "json.js"

//****************************************************************************************************************************************************

function printObjects(printObjs) {
// printObjs van be an array or a single object

  // the object we are going to print
  // var writeObj = [];

  // add document name
  // writeObj.push(app.activeDocument.name);

  // add date
  /*var now = new Date();
  var nowTxt =  now.getFullYear();
      nowTxt += "/" + (now.getMonth() + 1);
      nowTxt += "/" + now.getDate();
      nowTxt += " " + now.getHours();
      nowTxt += ":" + now.getMinutes();
      nowTxt += ":" + now.getSeconds();
  writeObj.push(nowTxt);*/

  // add objects
  // writeObj.push( printObjs );

  // writeJson(writeObj, "printObject");
  writeJson(printObjs, "printObject", "/d/CloudStation/RanzPanel/scripts/data/");
}

//****************************************************************************************************************************************************
