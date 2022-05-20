const path = require('path');
const { mkdir } = require('node:fs/promises');
const { readdir } = require('fs/promises');
const { copyFile } = require('node:fs/promises');
const fs = require('fs');

async function copyFolder(src, dest){

  await new Promise( resolve => {
    fs.stat(dest, err => {
      if (!err) {
        fs.rm(dest, {recursive: true}, ()=>{ resolve(1); });        
      }else{
        resolve(1);
      }
    });
  });
    
  await mkdir(dest, {recursive: true});

  const files = await readdir(src, { withFileTypes:true });
  for (const file of files) {
    if (file.isFile()){
      copyFile(path.join(src, file.name), path.join(dest, file.name));
    }else {
      copyFolder( path.join(src, file.name), path.join(dest, file.name));
    }
  }
    
}

async function bundleCss(){
  const stylesPath = path.join(__dirname, 'styles');
  const projctPath = path.join(__dirname, 'project-dist', 'style.css');

  const files = await readdir(stylesPath, { withFileTypes:true });
  const output = fs.createWriteStream(projctPath);

  for (const file of files) {
    const ext = path.extname(path.join(stylesPath, file.name));
    if (ext === '.css'){
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

async function replaceAsync(str, regex, asyncFn) {
  const promises = [];
  str.replace(regex, (match, name) => {
    const promise = asyncFn(match, name);
    promises.push(promise);
  });
  const data = await Promise.all(promises);
  return str.replace(regex, () => data.shift());
}

async function compileHtml(tmpl, components, dest){
  let htmlStr ='';
  await new Promise( resolve => {
    const tmplReadebleStream = fs.createReadStream(tmpl, 'utf8');
    tmplReadebleStream.on('data', (chunk) => {
      htmlStr+=chunk.toString();
    });
    tmplReadebleStream.on('end', () => {
      resolve(1);
    });
  });

  const replacedString = await replaceAsync(htmlStr, /\{\{(.*?)\}\}/g, (m,name) => {
    let componentStr ='';
    return new Promise( resolve => {
      const componentReadebleStream = fs.createReadStream(path.join(components, name+'.html'), 'utf8');
      componentReadebleStream.on('data', (chunk) => {
        componentStr+=chunk.toString();
      });
      componentReadebleStream.on('end', () => {        
        resolve(componentStr);
      });
    });
  });

  const output = fs.createWriteStream(path.join(dest, 'index.html'));
  output.write(replacedString);
  
}

async function build(){
  const assetsPath = path.join(__dirname, 'assets');
  const projectPath = path.join(__dirname, 'project-dist');
  await copyFolder(assetsPath, path.join(projectPath, 'assets'));

  bundleCss();

  compileHtml(path.join(__dirname, 'template.html'), path.join(__dirname, 'components'), projectPath);
}

build();