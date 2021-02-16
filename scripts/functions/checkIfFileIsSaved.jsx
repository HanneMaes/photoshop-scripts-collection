// by RanzigenDanny
// checkIfFileIsSaved
// v3

// GUIDE

// TODO
// optie for save and optie for incremental save

// TEST
// checkIfFileIsSaved();

//@include "dialogPlus.jsx"

//*************************************************************************************************************************************************************************

function checkIfFileIsSaved() {

    var showDialog = false;
    var notSavedOnce = "";

	// check if the file has been saved at leat once, by finding out of the file has an extension
    var noExtension = app.activeDocument.name.indexOf('.') == -1;
    if (noExtension) {
		notSavedOnce = "Warning: You're file has never beer saved!";
        showDialog = true;
    }

    // create the dialogPlus
    if(showDialog) {
        var newDialogContent = [];
            if(notSavedOnce != "") newDialogContent.push(['title', notSavedOnce]);

            newDialogContent.push(['title', 'Save the document first?']);
            newDialogContent.push(['statictext', 'By continuing you agree to the fact that Hanne Maes is']);
            newDialogContent.push(['statictext', 'in no way responsible for any damage caused by this script.']);
            newDialogContent.push(['statictext', 'You should have saved the document like I told you!']);
            newDialogContent.push(['statictext', 'Thanks.']);

        var dialogValues = [];
        var newDialog = createDialogPlus(newDialogContent, 'showDialog', 'id', "noJsonSave");  // "index" or "id", "noJsonSave" = json save or not or the name of the json file
    }

	// Save the original file.
    //if(notSavedOnce != "") app.activeDocument.save();

    return !showDialog; // if we have to show the dialog it means we may not continue with the script
}

//*************************************************************************************************************************************************************************
