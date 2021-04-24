const fs = require('fs');
const readline = require('readline');
const stream = require('stream');
const read_input = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const outstream = new stream();
var clean = false;
var lineCount = 0;
var filePath = false;
var searchFor = false;
var saveResult = false;
var defaultSavePath = "result.txt";
var response = [];

function startAction() {
  read_input.question("What is the file path?\n", function(path) {
      filePath = path.trim();
      if(filePath.charAt(filePath.length - 1) == '"'){
        filePath = filePath.substring(0, filePath.length - 1);
      }
      if(filePath.charAt(0) == '"'){
        filePath = filePath.substring(1, filePath.length);
      }
      if(filePath == "" || filePath == false) {
        console.log('\x1b[31m%s\x1b[0m',"File path can't be empty!\nTry again!");
        startAction();
      }else if (fs.existsSync(filePath)) {
        resultSave();
      } else {
        console.log('\x1b[36m%s\x1b[0m',"File is not around\nTry again!");
        startAction();
      }
  });
}

function resultSave() {
  read_input.question("Do you want to save results?(Y\\N)\n", function(save) {
    saveResult = save.trim();
    saveResult = (saveResult === 'y' || saveResult === 'Y') ? true : (saveResult === 'n' || saveResult === 'N') ? false : false;
    setSearch();
  });
}


function setSearch() {
  read_input.question("What do you searching for?\n", function(search) {
    try {
      searchFor = JSON.parse(search);
    } catch (e) {
      searchFor = [search.trim()];
    }
    if (searchFor) {
      printResponse();
    } else {
      console.log('\x1b[36m%s\x1b[0m',"Search can't be empty!\nTry again!");
      setSearch();
    }
  });
}

function printResponse() {
  const instream = fs.createReadStream(filePath);
  const rl = readline.createInterface(instream, outstream);
  rl.on('line', function(line) {
    console.clear()
    process.stdout.moveCursor(0, -1)
    process.stdout.clearLine(1)
    lineCount++;
    console.log("Searced line count:" + lineCount);
    for (var value in searchFor) if (line.includes(searchFor[value])) {console.log({index: lineCount, exp: line}); response.push({index: lineCount, exp: line});}
  });
  rl.on('close', function() {
    process.stdout.moveCursor(0, -1)
    process.stdout.clearLine(1)
    console.log("Searced Line Sum:" + lineCount);
    if(saveResult){
      if (fs.existsSync(defaultSavePath)) fs.unlinkSync(defaultSavePath);
      for (const property of response) {
        fs.appendFileSync(defaultSavePath, "Line: " + property.index + "\nContent:" + property.exp);
      }
      console.log("Results saved to " + defaultSavePath);
    }else {
      console.log(response);
    }
    process.exit()
  });
}

startAction();
