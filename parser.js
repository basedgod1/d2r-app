const fs = require('fs');

let mode = 'SoftCore';
let version = 'V2';
let path = "C:\\Users\\Preston\\Saved Games\\Test";

fs.readdir(path, (err, files) => {
  for (var file of files) {
    if (/\.d2s$/i.test(file)) {
      parseCharacterFile(file);
    }
    else if (`SharedStash${mode}${version}.d2i` == file) {
      parseSharedStashFile(file);
    }
  }
});

let parseCharacterFile = (file) => {
  console.log('parsing character file...', file);
  // fs.readFile
};

let parseSharedStashFile = (file) => {
  // console.log('parsing shared stash file...', file);
};
