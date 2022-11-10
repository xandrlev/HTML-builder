const fs = require("fs");
const fsPromises = require("fs/promises");
const path = require("path");
const destDir = path.join(__dirname, "project-dist");

(async function buildPage() {
  try {
    // await fsPromises.access(destDir);
    // await rmDir(destDir);

    await createFolder(destDir);
    await createFolder(path.join(destDir, "assets"));

    await createFile(path.join(destDir, "index.html"));
    await createFile(path.join(destDir, "style.css"));

    await copyFiles(
      path.join(__dirname, "assets"),
      path.join(destDir, "assets")
    );
    await createCss(
      path.join(__dirname, "styles"),
      path.join(destDir, "style.css")
    );
    // await createHtml(
    //   path.join(__dirname, "template.html"),
    //   path.join(destDir, "index.html")
    // );
    // await bundleHtml ()
  } catch (err) {
    console.log(err);
  }
})();

function createFolder(path) {
  fs.mkdir(path, { recursive: true }, (err) => {
    if (err) throw err;
  });
}

function createFile(path) {
  fs.open(path, "a+", (err) => {
    if (err) throw err;
  });
}

async function copyFiles(src, dest) {
  try {
    await fs.mkdir(dest, { recursive: true }, (err) => {
      if (err) throw err;
    });

    const files = await fsPromises.readdir(src, {
      withFileTypes: true,
    });
    for (let file of files) {
      let srcPath = path.join(src, file.name);
      let destPath = path.join(dest, file.name);

      file.isDirectory()
        ? await copyFiles(srcPath, destPath)
        : await fs.copyFile(srcPath, destPath, (err) => {
            if (err) throw err;
          });
    }
  } catch (err) {
    console.log(err);
  }
}

async function createCss(src, dest) {
  try {
    const files = await fsPromises.readdir(src, { withFileTypes: true });

    files.forEach((file) => {
      const extnameFile = path.extname(file.name);
      if (file.isFile() && extnameFile === ".css") {
        const dataFiles = new Promise((resolve) => {
          fs.readFile(path.join(src, file.name), (err, data) => {
            if (err) throw err;
            resolve(data);
          });
        });
        dataFiles.then((data) => {
          const appendFile = new Promise((resolve) => {
            fs.appendFile(dest, data, (err) => {
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

async function createHtml(src, dest) {
  fs.copyFile(src, dest, (err) => {
    if (err) throw err;
  });
}

async function bundleHtml() {
  // let count = 1;
  try {
    let templateFile = await fsPromises.readFile(
      path.join(__dirname, "template.html")
    );
    const files = await fsPromises.readdir(path.join(__dirname, "components"), {
      withFileTypes: true,
    });
    for (let file of files) {
      const extnameFile = path.extname(file.name);
      if (file.isFile() && extnameFile == ".html") {
        let dataFile = await fsPromises.readFile (path.join(__dirname, "components", file.name));
        if (templateFile.includes(file.name.replace(/\.[^/.]+$/, ""))){
          let outIndex = await fsPromises.readFile(path.join(destDir, 'index.html'));
          
          fs.writeFile(path.join(destDir, "index.html"), templateFile, err =>{
            if(err) throw err;
            outIndex = outIndex.toString().replaceAll(`{{file.name.replace(/\.[^/.]+$/, "")}}`, dataFile);
          })

          // outIndex = outIndex.toString().replace(`{{file.name.replace(/\.[^/.]+$/, "")}}`, dataFile);
          console.log(dataFile.toString());
          // console.log(templateFile);
          // console.log(count);
          // console.log(dataFile.toString());
          // count++;
          // if(count == files.length) {
          //   fs.writeFile(path.join(destDir, "index.html"), templateFile, err => {
          //     if (err) throw err;
          //     outIndex.toString().replace(`{{file.name.replace(/\.[^/.]+$/, "")}}`, dataFile);


          //   })
          // }
        }
        
      }
    }
  } catch (err) {
    console.log(err);
  }
}

bundleHtml();

function rmDir(dest) {
  fs.rm(dest, { recursive: true, force: true }, (err) => {
    if (err) throw err;
  });
}
