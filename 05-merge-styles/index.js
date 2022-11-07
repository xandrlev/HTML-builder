const { log } = require("console");
const fs = require("fs");
const fsPromises = require("fs/promises");
const path = require("path");
const srcDir = path.join(__dirname, "styles");
const destDir = path.join(__dirname, "project-dist");

// createBundle()
(async function createBundle() {
  try {

    await fsPromises.access(path.join(destDir, 'bundle.css'));
    await deleteFile ()
    await bundle();
    await readFiles();
  } catch (err) {
    await bundle();
    await readFiles();
  }
})();

function bundle() {
  const bundle = fs.open(path.join(destDir, "bundle.css"), "a+", (err) => {
    if (err) throw err;
  });
}

async function readFiles() {
  try {
    const files = await fsPromises.readdir(srcDir, { withFileTypes: true });

    files.forEach((file) => {
      const extnameFile = path.extname(file.name);
      if (file.isFile() && extnameFile === ".css") {
        const dataFiles = new Promise((resolve) => {
          fs.readFile(path.join(srcDir, file.name), (err, data) => {
            if (err) throw err;
            resolve(data);
          });
        });
        dataFiles.then((data) => {
          const appendFile = new Promise((resolve) => {
            fs.appendFile(path.join(destDir, "bundle.css"), data, (err) => {
              if (err) throw err;
            });
          });
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
}


function deleteFile () {
  fs.unlink(path.join(destDir, 'bundle.css'), err => {
    if (err) throw err;
  })
}