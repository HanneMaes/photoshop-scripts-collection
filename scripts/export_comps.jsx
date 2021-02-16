// by RanzigenDanny
// CompsExporter
// v9

// GUIDE
// exports the selected comps as .jpg or .png to your chosen location, image name is the same as the comp name
// if the comp name contains a file path (folder/imageName) then the folder will be created

//@include "functions/dialogPlus.jsx"
//@include "functions/saveFunctions.jsx"

//****************************************************************************************************************************************************
//****************************************************************************************************************************************************

var layerComps = app.activeDocument.layerComps;
var imageSize = [];
var extention = '';
var savePath = app.activeDocument.path + "/" + app.activeDocument.name.replace('.psd', '').replace('.PSD', '') + "-exportedComps";

// show our dialog
var dialogValues = createDialogPlus(dialogContent(), 'showDialog', 'key', 'compsExporter'); // compsExporter = json suffix

getDialogValues();

// check if did not press cancel in our dialog
if(dialogCanceled) var scriptCanceled = true; // we need dialogPlusCanceled for compatebility with errorHandler
else {

	var saveImages = [];

	// loop through all the layer comps
	for(var i = 0; i < layerComps.length; i++){

		// check for selected comps
		if(dialogValues[ layerComps[i].name ] == true) { // we can just use the i value because the comp checkboxes are the first in the dialog (and static test does not give us a return value)

			// create saveOptions object;
			var saveOptions = {};
					saveOptions["comp"] =  layerComps[i].name;
					saveOptions["image"] = layerComps[i].name + extention;
					saveOptions["path"] = savePath;
					saveOptions["size"] = imageSize;

			saveImages.push(saveOptions);

		} // loop through all the layer comps
	} // check for selected comps

	// check and export
	if(saveFilesAsCheck(saveImages)) {
		saveFilesAs(saveImages);
	}

	// the end
	alert("Exports finished");
}

//****************************************************************************************************************************************************
//****************************************************************************************************************************************************

function dialogContent() {

	var newDialogContent = [];

	// add image settings
	newDialogContent.push(['title', 'Image Settings']);
	var w = app.activeDocument.width + "";
	var h = app.activeDocument.height + "";
	w = w.replace(" px", "");
	h = h.replace(" px", "");
	newDialogContent.push(['numberpositive', 'Width', w]);
	newDialogContent.push(['numberpositive', 'Height', h]);
	newDialogContent.push(['dropdown', 'Image type:', ['.jpg', '.png']]);
	newDialogContent.push(['path', 'Save path:', savePath]);

	// add checkbox per comps
	newDialogContent.push(['title', 'Layer comps']);
	for(var i = 0; i < layerComps.length; i++) newDialogContent.push(['checkbox', layerComps[i].name, layerComps[i].selected]);

	return newDialogContent;
}

//****************************************************************************************************************************************************

function getDialogValues() {

	imageSize = [ dialogValues['Width'], dialogValues['Height'] ];
	savePath = dialogValues['Save path'];
	extention = dialogValues['Image type'];

	// dialogvalues of the dropbox is 0 or 1 ( but I think must be '.jpg' or '.png' )
	// anyway this will fix it but wong hurt is it works the other way
	if 			(extention == 0) extention = '.jpg';
	else if (extention == 1) extention = '.png';
}

//****************************************************************************************************************************************************
