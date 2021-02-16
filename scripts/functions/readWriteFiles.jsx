// by RanzigenDanny
// read write files
// v2

// GUIDE
// file.open("w");          // open file with write access
// file.writeln("blah");    // adds newline chracter at the end of the line
// file.write("blah");      // does not add newline character to the line
// file.print("blah");      // replaces the current line with the print line
// while (!file.eof)        // loop throught the file
// file.close();            // closes and saves the file

// TODO

//****************************************************************************************************************************************************

function clearScriptListener() {

    // open & write the file
    var file = new File(Folder.desktop + "/ScriptingListenerJS.log");
    file.open("w", undefined, undefined); // open file with write access
    file.write("");

    // close and save
    file.close();
}

//****************************************************************************************************************************************************

function readScriptListener() {

    var file = new File(Folder.desktop + "/ScriptingListenerJS.log");
        file.open('r', undefined, undefined);

    if(file !== '') {
    // the file exists

        var fileText = "";
        while (!file.eof){
            fileText += file.readln() + "\r";
        }

        // close file & return
        file.close();
        return fileText;

    } else {
    // file does not exists

        alert("Error readWriteFiles: Cannot read file")
    }
}

//****************************************************************************************************************************************************
