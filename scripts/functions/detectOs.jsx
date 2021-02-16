// by RanzigenDanny
// osDetection
// v4

// GUIDE

// TODO

// TEST
// alert(detectOs());

//*************************************************************************************************************************************************************************

function detectOs() {

	var os = "OS not found";
	var systemInfo = app.systemInformation;

	if 		(systemInfo.match(/windows/i))  os = 'windows';
	else if (systemInfo.match(/mac/i))		os = 'mac';
	else alert('OS not found: ' + systemInfo);

	return os;
}

//*************************************************************************************************************************************************************************
