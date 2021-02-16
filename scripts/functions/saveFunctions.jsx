// by RanzigenDanny
// saveFunctions
// v18

// GUIDE

// TODO

// ***************************************************************************************************************************************
// TEST CODE
//alert(removeExtention("test.jpeg"));

function removeExtention(line) {

	var line = line + "";

	// find everything after the '.'
	var valueArr = line.match(/\.(.+)/);
		// \.  finds the dot character
		// .  find any character
		// +  finds it an unlimeted amount of times
		// () normally he could find everything after the ':' including the ':', but now he find the array [everything after the ':' including the ':' , everything after the ':' NOT including the ':']

	line = line.replace(valueArr[0], "");

	if(valueArr) 	return line;
	else 			return false;
}

//****************************************************************************************************************************************************
// TEST CODE
//alert(getExtention("test.jpeg"));

function getExtention(line) {

	var line = line + "";

	// find everything after the '.'
	var valueArr = line.match(/\.(.+)/);
		// \.  finds the dot character
		// .  find any character
		// +  finds it an unlimeted amount of times
		// () normally he could find everything after the ':' including the ':', but now he find the array [everything after the ':' including the ':' , everything after the ':' NOT including the ':']

	if(valueArr) 	return valueArr[1];
	else 					return false;
}

//****************************************************************************************************************************************************

function removePath(pathAndImage) {

	pathAndImage = pathAndImage + "";
	var lastSlashPos = 0;

	for(var i = 0; i < pathAndImage.length; i++) {
		if(pathAndImage.charAt(i) == "/") lastSlashPos = i;
	}

	return pathAndImage.substring(lastSlashPos + 1, pathAndImage.length);
}

//****************************************************************************************************************************************************

function createFolderIfNeeded(folderNameAddition, folderName, myPath) {
// creates a new folder but only if it does not yet exists
// if there is no path or folderName he will take the path of the open file and the folderName is the name of the open doc

	// check the given variables
	if(typeof folderNameAddition === 'undefined')	folderNameAddition = "";
	if(typeof folderName === 'undefined')			    folderName = app.activeDocument.name;
	if(typeof myPath === 'undefined')					    myPath = app.activeDocument.path;

	// remove the .psd from the file
	folderName = removeExtention(folderName);

	// create the folder if needed
	var newFolder = new Folder(myPath + '/' + folderName + folderNameAddition);
	if(!newFolder.exists) newFolder.create();

	return newFolder;
}

//****************************************************************************************************************************************************

function getFilesInFolder(filetype, inputFolder) {
// you must feed us a filetype like: "jpg" or ".jpg" or false
// if inputFolder is empty we will ask for the folder

	if(typeof inputFolder === 'undefined')	var inputFolder = Folder.selectDialog("Select a folder to tag");

	var fileList = []

	if(!filetype) {
		// get the files
		fileList = inputFolder.getFiles(fileTypeFull);
	} else {
		// create a full file type
		var firstLetter = filetype.substring(0, 1);
		if(firstLetter == ".")  var pointOrNot = "";
		else 										var pointOrNot = ".";
		var fileTypeFull = "*" + pointOrNot + filetype;

		// get the files
		fileList = inputFolder.getFiles(fileTypeFull);
	}

	return fileList;
}

//****************************************************************************************************************************************************

function saveFilesAsCheck(images, sliceGroups) {
// images must be an array and not on object

	// global so it can be used in saveFileAsCheck_SingleImage()
	errorMessage = []; 	// an array of error messages that we can add to ErrorHandler.jsx if we want
	upScaleImages = [];
	missingFolders = [];

	// check every image seperatly
	for(var i in images) imageExportChecks(images[i], sliceGroups);

	// --- THERE ARE NO ERRORS ---
	if(errorMessage.length == 0) {

		// ask to upscale images
		if(upScaleImages.length > 0) {

			// create the message
			var upScaleMessage = "The size of these images is bigger than the document\n"
			for(i in upScaleImages) upScaleMessage += "\n- " + upScaleImages[0] + ": " + upScaleImages[1];
			savePathMessage += '\r\rDo I continue or not?\nContinuing can result in qulaity loss.';

			// ask
			errorMessage = confirm(upScaleMessage + '\r\rDo I scale the image up and continue?'); // true or false
		}

		// ask to create folders
		if(missingFolders.length > 0) {

			// create the message
			var savePathMessage = "These folders do not yet exist\n";
			for(i in missingFolders) savePathMessage += "\n- " + missingFolders[i];
			savePathMessage += '\r\rDo I create the missing folder(s) and continue?';

			// ask & create
			if(confirm(savePathMessage)) {
				for(i in missingFolders) missingFolders[i].create();
				return true;
			} else {
				// do not continue I we dont create the folders
				return false;
			}
		} // create folders

		// return true if there are no error messages on the scale and folders are correct
		return true
	}

	// return true if everything is correct
	// returns false if there are no errors but the user did not want to upscale the image or create the unexisting folders
	// or returns an array of errors
	return errorMessage;

	//**********************************************

	function imageExportChecks(options, sliceGroups) {
	// options["slice"] = the name of the slice layer
	// sliceGroups is an object = { "slice group folder name": [array of layers in the group], "slice group folder name": [array of layers in the group] }
	// sliceGroups is not necesarry
	// if I have both a slice and bounds I will first slice the image and then crop with bounds so I have double control and I can do all kinds of fancy stuff

			// updateProgressWindow('Checking: ' + options["image"]);

			if(sliceGroups == "false" || typeof sliceGroups === "undefined") 													sliceGroups = false; // so we dont have to give a slicegroup
			if(options["slice"] == "false" || typeof options["slice"] === "undefined") 								options["slice"] = false;
			if(options["comp"] == "false" || typeof options["comp"] === "undefined") 									options["comp"] = false;
			if(options["size"] == "false" || typeof options["size"] === "undefined") 									options["size"] = false; 									// we dont do Number(options["size"]) because if can alse be false
			else if (options["size"].length == 1)																											options["size"].push(options["size"][0]); // so we can give 1 value as size
			if(options["max"] == "false" || typeof options["max"] === "undefined") 										options["max"] = false; 									// we dont do Number(options["size"]) because if can alse be false
			else if (options["max"].length == 1)																											options["max"].push(options["max"][0]); 	// so we can give 1 value as size
			if(options["sharpen"] == "false" || typeof options["sharpen"] === "undefined") 						options["sharpen"] = false;
			else 																																											options["sharpen"] = Number(options["sharpen"]);
			if(options["mode"] == "false" || typeof options["mode"] === "undefined") 									options["mode"] = false;
			else 																																											options["mode"] = (options["mode"] + "").toLowerCase();
			if(options["jpgQuality"] == "false" || typeof options["jpgQuality"] === "undefined") 			options["jpgQuality"] = false;
			else 																																											options["jpgQuality"] = Number(options["jpgQuality"]);
			if(options["jpgBlur"] == "false" || typeof options["jpgBlur"] === "undefined") 						options["jpgBlur"] = false;
			else 																																											options["jpgBlur"] = Number(options["jpgBlur"]);
			if(options["slicegroup"] == "" || options["slicegroup"] == "false" || typeof options["slicegroup"] === "undefined")  		options["slicegroup"] = false;

		/********************/
		/* check image path */
		/********************/
		// updateProgressWindow('checking patch');

		if(options['path'] == "" || typeof options["path"] == "undefined") errorMessage.push(options["image"] + " has no save path");

		// updateProgressWindow('checking if folder exists');

		var folder = new Folder(options["path"]);
		if(folder.exists) {}
		else {
			missingFolders.push(folder);
		}

		/********************************/
		/* check image extention & name */
		/********************************/
		// updateProgressWindow('checking extention');

		var extention = getExtention(options["image"]);
		if(!extention) extention = "no extention found";
		extention = extention.toLowerCase(); // must be after the if(!extention), because when there is no extention it will crash trying the lowercase nothing

		var supportedExtentions = ["jpg", "jpeg", "png", "psd"];

		var extentionFound = false;
		for(var i in supportedExtentions) {
			if(extention == supportedExtentions[i]) {
				extentionFound = true;
				break;
			}
		}

		if(extentionFound == false) errorMessage.push(options["image"] + " has an invalid extention: " + extention);

		/******************/
		/* check the comp */
		/******************/
		// updateProgressWindow('checking comp');
		// alert(options["image"] + ": " + options["comp"]);

		if(options["comp"] != false) {
			try {
				app.activeDocument.layerComps[options["comp"]]/*.apply()*/;
			} catch(e) {
				errorMessage.push("can't find layer comp: " + options["comp"]);
			}
		}

		/**********/
		/* bounds */
		/**********/
		// I dont yet chec on bounds because mostly they are generated and I dont want errors on thins I generate i thinks?

		/*************************/
		/* check the layer slice */
		/*************************/
		// updateProgressWindow('checking slice');

		if(sliceGroups != false) {				// we dont have to use slicegroups
			if(options["slice"] != false) {	// when we dont specify a slice

				// check is the slicegroup is not empty
				if(sliceGroups[options["slicegroup"]].length == 0) errorMessage.push("slicegroup '" + options["slicegroup"] + "' is empty");
				else {

					// check if we find our slice
					var sliceFound = false;
					for(var i in sliceGroups[options["slicegroup"]]) {

						if( options["slice"] == sliceGroups[options["slicegroup"]][i].name ) sliceFound = true;
						if(sliceFound) break;

					}
					if(!sliceFound) errorMessage.push("slice layer '" + options["slice"] + "' not found");
				}
			}
		}

		// I alse commented the chize checking because I need to have the slie size to check the size

		/**************/
		/* check size */
		/**************/
		// // updateProgressWindow('checking size');
		// alert(options["image"] + ": " + options["size"]);
		//
		// // check if the size of the exported image is smaller then the document size
		// if(options["size"] != false) {
		//
		// 	var sizeCorrect = true;
		// 	if(options["size"][0] != false) if(options["size"][0] > app.activeDocument.width) 	sizeCorrect = false;
		// 	if(options["size"][1] != false) if(options["size"][1] > app.activeDocument.height) 	sizeCorrect = false;
		//
		// 	if(!sizeCorrect) upScaleImages.push( [options["image"], options["size"]] );
		// }

		/******************/
		/* check MAX size */
		/******************/

		/*****************/
		/* check sharpen */
		/*****************/
		// updateProgressWindow('checking sharpen');

		if(options["shapren"] != false) {
			if( 0 <= options["sharpen"] && options["sharpen"] <= 10) {}
			else errorMessage.push("sharpen must be between 0 and 10: " + options["sharpen"]);
		}

		/**************/
		/* check mode */
		/**************/
		// updateProgressWindow('checking mode');

		if(options["mode"] != false) {
			if( options["mode"] == "rgb" || options["mode"] == "cmyk" || options["mode"] == "greyscale" ) {}
			else errorMessage.push("mode must be rgb, cmyk or greyscale: " + options["mode"]);
		}

		/********************/
		/* check jpgQuality */
		/********************/
		// updateProgressWindow('checking jpgQuality');

		if(options["jpgQuality"] != false) {
			if(0 <= options["jpgQuality"] && options["jpgQuality"] <= 100) {}
			else errorMessage.push("jpgQuality must be between 0 and 100: " + options["jpgQuality"]);
		}

		/*****************/
		/* check jpgBlur */
		/*****************/
		// updateProgressWindow('checking jpgBlur');

		if(options["jpgBlur"] != false) {
			if(0 <= options["jpgBlur"] && options["jpgBlur"] <= 2) {}
			else errorMessage.push("jpgBlur must be between 0 and 2: " + options["jpgBlur"]);
		}

		/*********************/
		/* check slice group */
		/*********************/
		if(options["slicegroup"] != false) {

		}

	} // function imageExportChecks()

	//**********************************************

} // function saveFilesAsCheck

//****************************************************************************************************************************************************

// EXTRA INFO
/*
ALL TYPES OF SAVE options
Some of these formats are available only when explicitly installed. The save options for a given format are not identical to the open options for that format. For complete details, see the API Reference documentation.
	BMPSaveOptions
	DCS1_SaveOptions
	DCS2_SaveOptions
	EPSSaveOptions
	GIFSaveOptions
	JPEGSaveOptions
	PDFSaveOptions
	PhotoshopSaveOptions
	PICTFileSaveOptions
	PICTResourceSaveOptions
	PixarSaveOptions
	PNGSaveOptions
	RawSaveOptions
	SGIRGBSaveOptions
	TargaSaveOptions
	TiffSaveOptions

You can also use document.exportDocument() to write the document to an Illustrator format, or to a web-optimized Photoshop format. In this case, use the appropriate export-options object:
	ExportOptionsIllustrator
	ExportOptionsSaveForWeb
*/

function saveFilesAs(options, doc) {
	for(var i in options) saveFilesAs_SingleImage(options[i], doc);
}

//*********************************************************

function saveFilesAs_SingleImage(options, sliceGroups) {
// options["slice"] = the name of the slice layer
// sliceGroups is an object = { "slice group folder name": [array of layers in the group], "slice group folder name": [array of layers in the group] }
// sliceGroups is not necesarry
// if I have both a slice and bounds I will first slice the image and then crop with bounds so I have double control and I can do all kinds of fancy stuff

	if(options["path"] == false || options["path"] == "false" || typeof options["path"] === "undefined") 										options["path"] = app.activeDocument.path;
	if(options["image"] == false || options["image"] == "false" || typeof options["image"] === "undefined") 								options["image"] = "slicer.jpg";
	if(options["slice"] == "false" || typeof options["slice"] === "undefined") 																							options["slice"] = false;
	if(options["comp"] == "false" || typeof options["comp"] === "undefined") 																								options["comp"] = false;
	if(options["size"] == false || options["size"] == "false" || typeof options["size"] === "undefined") 										options["size"] = false;
	else if (options["size"].length == 1)																																										options["size"].push(options["size"][0]); // so we can give 1 value as size
	if(options["maxsize"] == false || options["maxsize"] == "false" || typeof options["maxsize"] === "undefined")						options["maxsize"] = false;
	else if (options["maxsize"].length == 1)																																								options["maxsize"].push(options["maxsize"][0]); // so we can give 1 value as size
	if(options["maxsize"] == false || options["maxsize"] == "false" || typeof options["maxsize"] === "undefined") 					options["maxsize"] = false;
	if(options["sharpen"] == false || options["sharpen"] == "false" || typeof options["sharpen"] === "undefined") 					options["sharpen"] = 0;
	else 																																																										options["sharpen"] = Number(options["sharpen"]);
	if(options["mode"] == false || options["mode"] == "false" || typeof options["mode"] === "undefined") 										options["mode"] = "rgb";
	else 																																																										options["mode"] = (options["mode"] + "").toLowerCase();
	if(options["jpgQuality"] == false || options["jpgQuality"] == "false" || typeof options["jpgQuality"] === "undefined") 	options["jpgQuality"] = 100;
	else 																																																										options["jpgQuality"] = Number(options["jpgQuality"]);
	if(options["jpgBlur"] == false || options["jpgBlur"] == "false" || typeof options["jpgBlur"] === "undefined") 					options["jpgBlur"] = 0;
	else 																																																										options["jpgBlur"] = Number(options["jpgBlur"]);
	if( options["slicegroup"] == "false" || typeof options["slicegroup"] === "undefined")  																	options["slicegroup"] = false;

	// if the user did not specify any slice group or groups we must look trough every layer to find the right one
	// !!! gatherArtLayers() on every images when we export multiple images at the same time is very bad pratice
	var lookTroughLayers = [];
	if(options["slice"] != false) {
		if(options["slicegroup"] == false) lookTroughLayers = gatherArtLayers();
		else 															 lookTroughLayers = sliceGroups[ options["slicegroup"] ];
	}

	//**********************************************

	// apply layer comp
	// we have to do this before creating our new doc because a new doc does not have layer comps
	try { // we use a try for the cases where we dont have any custom layer comps
		app.activeDocument.layerComps[options["comp"]].apply();
	} catch(e) {
		// alert("comp catch: " + e);
	}

	//**********************************************

	// get the extention
	var extention = (options["image"].match(/\..+/g));
			// \. the dot character
			// . any chracter after that
			// + any amount of characters

	// if we want to export a layerd image duplicate the active document
	// else collapse all layers and copy that layer to a new document
	if(extention == ".psd" || extention == ".PSD") {
		app.activeDocument.duplicate();
	} else {
		// we will duplicate the document into a new one
		// so if there are any crashes
		// or it destroys stuff
		// the original documennt remains untempered
		// and nothing will be broken there

		var top_X = 0;
		var top_Y = 0;
		var documentWidth = app.activeDocument.width;
		var documentHeight = app.activeDocument.height;
		var workspace_W = app.activeDocument.width;
		var workspace_H = app.activeDocument.height;

		// CS4 workaround: select/fill corner pixels for aligned copy paste
		// updateProgressWindow('CS4 workaround: select/fill cornet pixels for aligned copy past');
		var selectionTopLeft =  [ [top_X, top_Y], [top_X,top_Y+1], [top_X+1, top_Y+1], [top_X+1, top_Y] ];
		var selectionBottomRight =  [ [workspace_W-1, workspace_H-1], [workspace_W-1, workspace_H], [workspace_W, workspace_H], [workspace_W, workspace_H-1] ] ;

		var newLayer = app.activeDocument.artLayers.add();
		app.activeDocument.activeLayer = newLayer;
		newLayer.name = "ranzscript: paste in place workaround";

		var fillColor = new SolidColor();
		 		fillColor.rgb.red = 255; fillColor.rgb.green = 0; fillColor.rgb.blue = 255;

		app.activeDocument.selection.select(selectionTopLeft);
		app.activeDocument.selection.fill(fillColor);
		app.activeDocument.selection.select(selectionBottomRight);
		app.activeDocument.selection.fill(fillColor);

		// select the whole canvas & copy
		// updateProgressWindow('CS4 workaround: select the whole canvas & copy');
		var selectionWorkspaceShape = [ [top_X, top_Y], [top_X, documentHeight], [documentWidth, documentHeight], [documentWidth, top_Y] ];
		app.activeDocument.selection.select(selectionWorkspaceShape);
		app.activeDocument.selection.copy(true);

		// CS4 workaround: delete our new layer
		// updateProgressWindow('CS4 workaround: delete our new layer');
		app.activeDocument.activeLayer.remove();

		// make a new document
		// updateProgressWindow('CS4 workaround: make a new document');
		var resolution = 72;
		var name = 'ranzScript temp file for ' + options["image"].replace('/', '_');
		var docMode = NewDocumentMode.RGB;
		if 		 ((options["mode"] == 'cmyk')) 				docMode = NewDocumentMode.CMYK;
		else if (options["mode"] == 'greyscale') 		docMode = NewDocumentMode.GRAYSCALE;
		var newDoc = app.documents.add(workspace_W, workspace_H, resolution, name, docMode, DocumentFill.TRANSPARENT);
		app.activeDocument = newDoc;
		app.activeDocument.paste();

		// CS4 workaround: clear pixels
		// updateProgressWindow('CS4 workaround: clear pixels');
		app.activeDocument.selection.select(selectionTopLeft);
		app.activeDocument.selection.clear();
		app.activeDocument.selection.select(selectionBottomRight);
		app.activeDocument.selection.clear();
	}

	//**********************************************

	// crop by slice
	if(options["slice"] != '' && options["slice"] != false) {

		// loop through all the layers and find the right one
		for(var i in lookTroughLayers) {
			// alert(sliceGroups[ options["slicegroup"] ][i].name);
			if(options["slice"] == lookTroughLayers[i].name) {
				app.activeDocument.crop( lookTroughLayers[i].bounds );
				// alert("bounds: " + slookTroughLayers[i].bounds );
				break; // break out the loop we we dont crop a second time is there are 2 layers with the slice name
			}
		}
	}
	// alert("view the cropped image");

	//**********************************************

	// crop by bounds
	// if I have both a slice and bounds I will first slice the image and then crop with bounds so I have double control and I can do all kinds of fancy stuff


	//**********************************************

	// stuff i need for the resize, maxsize and avtual resize
	var docSize = [Number(app.activeDocument.width), Number(app.activeDocument.height)];		 // number to remove the px from the size
	var newSize = [docSize[0], docSize[1]]; // we cant wrtie newSize=docSize of they will be both the same object

	// resize the document
	if(options["size"] != false) {

		if(options["size"][0] == "false") options["size"][0] = false;
		if(options["size"][1] == "false") options["size"][1] = false;

		// resize percent of pixels
		for(var i = 0; i <= 2; i++) {

			if(options["size"][i] != docSize[i] && options["size"][i] != false) {
				var sizeString = options["size"][i] + "";
				if(sizeString[sizeString.length-1] == '%') {
					// percentage
					var percentSize = Number(sizeString.replace('%', ''));
					var sizeMulti = (percentSize / 100);
					newSize[i] = docSize[i] * sizeMulti;
				} else {
					// pixels
					newSize[i] = Number(options["size"][i]);
				}
			}
		}

		// if one of the values is false, but when both are false we do nothing
		if( options["size"][0] == false || options["size"][1] == false && !(options["size"][0] == false && options["size"][1] == false) ) {
			if(options["size"][0] == false) {
				var adjust = 0;
				var dontAdjust = 1;
			} else {
				var adjust = 1;
				var dontAdjust = 0;
			}

			var multiplier = newSize[dontAdjust] / docSize[dontAdjust];
			newSize[adjust] = docSize[adjust] * multiplier;
		}

	}

	// max size
	if(options["maxsize"] != false) {
		for(var i = 0; i <= 2; i++) {
			if(newSize[i] > options["maxsize"][i]) {

				// adjust the values that is bigger then the max
				var prevNewSize = newSize[i];
				newSize[i] = options["maxsize"][i];

				// also adjust the other values
				var dontAdjust
				if(i == 0) adjust = 1;
				else 			 adjust = 0;

				var multiplier = newSize[i] / prevNewSize;
				newSize[adjust] = newSize[adjust] * multiplier;

				// alert(i + "\nprev size :" + prevNewSize + "\nnewSize: " + newSize + "\nmultiplier: " + multiplier)
			}
		}
	}

	// the actual resize
	if(docSize[0] != newSize[0] || docSize[1] != newSize[1]) {
		newDoc.resizeImage(Math.round(newSize[0]), Math.round(newSize[1]), null, ResampleMethod.BICUBIC);
	}

	//**********************************************

	// sharpen
	for(var i = 0; i < options["sharpen"]; i++) sharpenActiveLayer();

	//**********************************************

  // create the save file
  var savePath = options["path"] + '/' + options["image"]
  var saveFile = new File(savePath);

  // check if the save location exists and make the folder if needed
  // this way we can put '/' in the filename and the image will be saved in the correct folder
  removeEverythingAfterLastSlash = savePath.substr(0, savePath.lastIndexOf("\/")) // remove everythignb after the last slash. if filname is 'folder1/folder2/image.jpg' we need to check for the folder 'folder1/folder2'
  var newSaveFolder = new Folder(removeEverythingAfterLastSlash);
	if(!newSaveFolder.exists) newSaveFolder.create();


	// choose what type of save we wont
	if(extention == ".psd" || extention == ".PSD") {

		//-------------//
		// save to PSD //
		//-------------//

    var saveOptions = new PhotoshopSaveOptions();
    		saveOptions.alphaChannels = true;
    		saveOptions.annotations = false;
    		saveOptions.embedColorProfile = false;
    		saveOptions.layers = true;
    		saveOptions.spotColors = false;
		var saveCopy = true;

		// save the doc
		app.activeDocument.saveAs(saveFile, saveOptions, saveCopy);
		return;

	} else {

		//--------------//
		// save for WEB //
		//--------------//

		var saveOptions = new ExportOptionsSaveForWeb();
		var exportType = ExportType.SAVEFORWEB;

		// choose file type
		extention = extention + "";
		switch( extention.toLowerCase() ){
			case ".png":
							// fixed values
							saveOptions.format = SaveDocumentType.PNG;
							saveOptions.PNG8 = false;	// ! BE CAREFULL WITH THIS ONE ! this is the thing that fiucked up my png's

							// pro settings I might want to add later
							// saveOptions.interlaced = 0;					// interlaced for png, progressive for jpg

							// alert("PNG\rsaveFile: " + saveFile + "\rsaveOptions.format: " + saveOptions.format + "\rsaveOptions.PNG8: " + saveOptions.PNG8 + "\rsaveOptions.colors: " + saveOptions.colors);
							break;

			case ".jpg":
							// fixed values
							saveOptions.format = SaveDocumentType.JPEG;
							saveOptions.optimized = true;   // default: true

							// variable values
							saveOptions.quality = options["jpgQuality"];
							saveOptions.blur = options["jpgBlur"];

							// pro settings I might want to add later
							// saveOptions.formatOptions = FormatOptions.STANDARDBASELINE;
							// saveOptions.formatOptions = FormatOptions.PROGRESSIVE;
							// saveOptions.matte = MatteType.NONE;
							// saveOptions.includeProfile = false;

							// alert("JPG:\rsaveFile: " + saveFile + "\rsaveOptions.format: " + saveOptions.format + "\rsaveOptions.optimized: " + saveOptions.optimized + "\rsaveOptions.quality: " + saveOptions.quality + "\rsaveOptions.blur: " + saveOptions.blur);
							break;
		}

		// save the doc
		// alert("saveFile: " + saveFile + "\nexportType: " + exportType + "\nsaveOptions: " + saveOptions);
		app.activeDocument.exportDocument(saveFile, exportType, saveOptions);

		// close the new document without saving
		// updateProgressWindow('Closing document');
		newDoc.close(SaveOptions.DONOTSAVECHANGES);

		// deselect in the original doc
		app.activeDocument.selection.deselect();

		return;
	}
}

//****************************************************************************************************************************************************

function sharpenActiveLayer() {
    var idShrp = charIDToTypeID( "Shrp" );
    executeAction( idShrp, undefined, DialogModes.NO );
}

//****************************************************************************************************************************************************
