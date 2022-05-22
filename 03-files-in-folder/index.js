const path = require('path');
const { readdir } = require('fs/promises');
const { stat } = require('fs');

const secretPath = path.join(__dirname,'secret-folder');
async function getFileList(list){
  for (const item of list) {
    if(item.isFile()) {

      const filePath = path.join(secretPath, item.name);

      const output = [];
      output.push(path.parse(filePath).name);
      output.push(path.parse(filePath).ext.slice(1));
      output.push(await getSize(filePath));

      console.log(output.join(' - '));

    }
    
  }
  
}

function getSize(filePath){
  return new Promise( (resolve) => {
    stat(filePath, (err, stats) => {
      resolve(stats.size+'b');
    });
  }); 
}

readdir(secretPath, { withFileTypes:true }).then(getFileList);
