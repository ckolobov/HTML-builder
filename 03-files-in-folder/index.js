const fs = require('fs');
const path = require('path');

const dirPath = `${__dirname}/secret-folder`;

fs.promises.readdir(dirPath, {withFileTypes: true}).then(files => {
  for (const file of files) {
    if (file.isFile()) {
      const parsedPath = path.parse(file.name);
      const name = parsedPath.name;
      const ext = parsedPath.ext.slice(1);

      fs.stat(`${dirPath}/${file.name}`, (err, stats) => {
        if (err) {
          return console.error(err);
        }
        const size = stats.size;
        console.log(`${name} - ${ext} - ${size}`);
      });
    }
  }
}).catch(err => {
  console.log(err);
})
