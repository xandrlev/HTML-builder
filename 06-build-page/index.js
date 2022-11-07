/*

Приветствую. Если есть такая возможность, проверь, пожалуйста,
6 таск в последний день кроссчека.

СПАСИБО!!!

*/

const fs = require('fs');
const fsPromise = require('fs/promises');
const path = require('path');
const destDir = path.join(__dirname, 'project-dist');

(async function buildPage () {
  await createFolder(destDir);
  await createFolder(path.join(destDir, 'assets'));

  await createFile(path.join(destDir, 'index.html'));
  await createFile(path.join(destDir, 'style.css'));

  copyFiles();

})()

function createFolder (path) {
  fs.mkdir(path, err => {
    if(err) throw err;
  });
}

function createFile (path) {
  fs.open((path),'a+', err => {
    if(err) throw err;
  });
}

async function copyFiles () {
  const files = await fsPromise.readdir(path.join(__dirname, 'assets'));

  files.forEach((file) => {
    console.log(file);
    
  })
}