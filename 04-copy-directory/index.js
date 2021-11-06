const fs = require('fs');
const sourcePath = `${__dirname}/files`;
const destinationPath = `${__dirname}/files-copy`;

const copyAllFiles = (src, dest) => {
  return fs.promises.readdir(src, {withFileTypes: true}).then(files => {
    for (const file of files) {
      if (file.isFile()) {
        fs.promises.copyFile(`${src}/${file.name}`, `${dest}/${file.name}`).then(() => {
          console.log(`File ${file.name} copied successfully`);
        }).catch((err) => {
          console.error(err);
          console.error(`File ${file.name} could not be copied`);
        });
      }
    }
  }).catch(err => {
    console.log(err);
  })
}

fs.promises.rm(destinationPath, {recursive: true}).then(() => {
  return fs.promises.mkdir(destinationPath, {recursive: true});
}).then(() => {
  return copyAllFiles(sourcePath, destinationPath);
})
