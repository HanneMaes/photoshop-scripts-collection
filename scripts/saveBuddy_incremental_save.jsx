// by RanzigenDanny
// saveBuddy_IncrementalSave
// v7

// GUIDE

// TODO
// als de nummers niet op elkaar volgen gaat het fout

//@include "functions/errorHandler.jsx"
//@include "functions/saveFunctions.jsx"
//@include "functions/promptPlus.jsx"

//****************************************************************************************************************************************************

// check if the file has been saved at leat once, by finding out of the file has an extension
var noExtension = app.activeDocument.name.indexOf('.') == -1;
if (noExtension) addError = ("Save your file first.");

// only continue when the file has been saved once
if(report()) {

    // create the folder if needed
    var incrementFolder = createFolderIfNeeded("_increments");

    // get all the files in a folder
    // var fileList = getFilesInFolder("psd", incrementFolder);

    // ask for suffix
    var userString = promptPlus('string', 'Suffix: ', ' ', 'Incremental save');
    if(userString == '' || userString == ' ') var suffix = '';
    else                                      var suffix = '_' + userString;

    // create the name
    var docName = removeExtention(app.activeDocument.name);
    // var index = fileList.length + 1;
    var dateExtention = new Date().getMonth() + "_" + new Date().getDate() + "_" + new Date().getHours() + "h" + new Date().getMinutes();
    var saveFiles = {};
        saveFiles["image"] = docName + /*index +*/ "_" + dateExtention + suffix + ".psd";
        saveFiles["path"] = incrementFolder;

    // save the file
    saveFilesAs_SingleImage(saveFiles);

    // close the file
    app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);

    // the end
    report('endScript');
}

//****************************************************************************************************************************************************
