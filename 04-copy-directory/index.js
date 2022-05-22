const path = require('path');
const { mkdir } = require('node:fs/promises');
const { readdir } = require('fs/promises');
const { copyFile } = require('node:fs/promises');
const fs = require('fs');

async function copyDir(){
  const filePath = path.join(__dirname, 'files');
  const fileCopyPath = path.join(__dirname, 'files-copy');

  await new Promise( resolve => {
    fs.stat(fileCopyPath, err => {
      if (!err) {
        fs.rm(fileCopyPath, {recursive: true}, ()=>{ resolve(1); });        
      }else{
        resolve(1);
      }
    });
  });
 
  
  await mkdir(fileCopyPath, {recursive: true});

  const files = await readdir(filePath, { withFileTypes:true });
  for (const file of files) {
    copyFile(path.join(filePath, file.name), path.join(fileCopyPath, file.name));
  }
    
}

copyDir();