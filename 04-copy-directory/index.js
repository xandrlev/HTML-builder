const fs = require("fs");
const fsPromise = require("fs/promises");
const path = require("path");
const currentDir = path.join(__dirname, "files");

(async function copyDirectory() {
  try {
    await fsPromise.access(`${currentDir}-copy`);
    // console.log("exist");

    await delFiles()
    await mkDir();
    await copyFiles();
  } catch {
    // console.log("does not exist");
    await mkDir();
    await copyFiles();
  }
})();

function mkDir() {
  fs.mkdir(`${currentDir}-copy`, { recursive: true }, (err) => {
    if (err) throw err;
  });
}

function copyFiles() {
  fs.readdir(currentDir, { withFileTypes: true }, (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      if (file.isFile) {
        fs.copyFile(
          path.join(currentDir, file.name),
          path.join(`${currentDir}-copy`, file.name),
          (err) => {
            if (err) throw err;
          }
        );
      }
    });
  });
}

async function delFiles() {
  try {
    const files = await fsPromise.readdir(`${currentDir}-copy`, {
      withFileTypes: true,
    });

    files.forEach((file) => {
      fsPromise.unlink(path.join(`${currentDir}-copy`, file.name));
      // console.log("delFiles");
    });

    await fsPromise.rmdir(`${currentDir}-copy`);
    // console.log("delFolder");
  } catch (err) {
    console.err(err);
  }
}
