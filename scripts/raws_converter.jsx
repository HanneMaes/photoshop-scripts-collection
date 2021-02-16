// by RanzigenDanny
// RawExporter
// v8

// GUIDE
// raw bestanden auto bewerken en exporten naar jpg of png
// het auto bewerken werkt nog niet

// TODO
// option or jpg or png
// create a folder for the raw images and move them to that folder of een folder name meegeven en een folder maken naast de bestaande folder
// auto adjustments doen
// saveAndClose() maken en dat overal beginnen gebruiken
// als ik geen custom folders gebruiken kent hij var jpgFolder & var rawFolder niet
// de siwe doet hij nog niet

//@include "functions/dialogPlus.jsx"
//@include "functions/errorHandler.jsx"

//****************************************************************************************************************************************************
//****************************************************************************************************************************************************

var dialogValues = createAndShowDialog();

// check if did not press cancel in our dialog
if(typeof dialogValues === "undefined") var scriptCanceled = true; // we need dialogPlusCanceled for compatebility with errorHandler
else {

    var maxWidth = dialogValues[0];
    var maxHeight = dialogValues[1];
    var folderPath = dialogValues[1];
    var seperateFolders = dialogValues[0];

    // get all the files in the folder
    var folderPath = Folder.selectDialog("Select a folder to tag");
    var fileList = []
        fileList = folderPath.getFiles();

    // create a folder for images
    if(seperateFolders) {
        var jpgFolder;
        var rawFolder;
        createFolders();
    }

    // loop through all the files
    for(var i = 0; i < fileList.length; i++) {

        // open the file
        newDoc = app.open(fileList[i]);

        // adjust & export
        autoAdjustImage();
        exportImage(app.activeDocument.name);
    }

    // the end
    report('endScript');
}

//****************************************************************************************************************************************************
//****************************************************************************************************************************************************

function createAndShowDialog() {

    var newDialogContent = [];
				newDialogContent.push(['numberpositive', 'Max width:', '1600']);
				newDialogContent.push(['numberpositive', 'Max height:', '800']);
        newDialogContent.push(['path', 'Choose Path:', 'C:/Users/Hanne/Desktop/']);
        newDialogContent.push(['checkbox', 'Create seperate folders', true]);

    return createDialogPlus(newDialogContent, 'showDialog', 'index', 'rawExporter');	// newDialog.show(); if 'showDialog' is empty to show later
}

//****************************************************************************************************************************************************

function createFolders() {

    jpgFolder = new Folder(folderPath + '_JPG');
    // rawFolder = new Folder(folderPath + 'RAW');

	if(!jpgFolder.exists) jpgFolder.create();
	// if(!rawFolder.exists) rawFolder.create();
}

//****************************************************************************************************************************************************

function autoAdjustImage() {

}

//****************************************************************************************************************************************************

function exportImage(fileName) {

    // set the save path
	var saveFile = new File(jpgFolder + '/' + fileName);

	// save for web & devices settings
	var saveOptions = new ExportOptionsSaveForWeb();
      saveOptions.format = SaveDocumentType.JPEG;
      newDoc.exportDocument(saveFile, ExportType.SAVEFORWEB, saveOptions);

	// close the new document without saving
	newDoc.close (SaveOptions.DONOTSAVECHANGES);
}

//****************************************************************************************************************************************************
