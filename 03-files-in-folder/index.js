const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "secret-folder");

fs.readdir(dir, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    if (file.isFile()) {
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      const fileExtension = path.extname(file.name).slice(1);

      const fileSize = new Promise((resolve) => {
        fs.stat(path.join(dir, file.name), (err, stat) => {
          if (err) throw err;
          resolve((stat.size / 1024).toFixed(2));
        });
      });

      fileSize.then((fileSize) => console.log(`${fileName} - ${fileExtension} - ${fileSize}kb`));
    }
  });
});
