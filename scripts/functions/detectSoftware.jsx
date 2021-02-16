// by RanzigenDanny
// softwareDetection
// v2

// GUIDE

// TODO

// TEST
// alert(detectSoftware());

//*************************************************************************************************************************************************************************

function detectSoftware() {

    var software = "Not Illustrator or Photoshop";
	var appObject = app + '';

	if 		(appObject.match(/photoshop/i))     os = 'photoshop';
	else if (appObject.match(/illustrator/i))	os = 'illustrator';
	else alert('Software not found: ' + app);

	return os;
}

//*************************************************************************************************************************************************************************
