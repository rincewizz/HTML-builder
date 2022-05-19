const path = require('path');
const { readdir } = require('fs/promises');
const fs = require('fs');

async function bundle() {
  const stylesPath = path.join(__dirname, 'styles');
  const projctPath = path.join(__dirname, 'project-dist', 'bundle.css');

  //добавить содержимое в bundle

  const files = await readdir(stylesPath, { withFileTypes:true });
  const output = fs.createWriteStream(projctPath);

  for (const file of files) {
    const ext = path.extname(path.join(stylesPath, file.name));
    if (ext === '.css'){
      console.log(file);
      await new Promise( resolve =>{
        const readebleStream = fs.createReadStream(path.join(stylesPath,file.name), 'utf8');
        readebleStream.on('data', (chunk) => {
          output.write(chunk);
        });
        readebleStream.on('end', () =>{
          resolve(1);
        });
      });

    }
  }
  output.end();
}

bundle();