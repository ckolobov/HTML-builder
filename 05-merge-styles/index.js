const fs = require('fs');
const path = require('path');

const stylesPath = `${__dirname}/styles`;
const destinationPath = `${__dirname}/project-dist`;
const allCSS = [];

fs.promises.readdir(stylesPath, {withFileTypes: true}).then(files => {
  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      allCSS.push(fs.promises.readFile(`${stylesPath}/${file.name}`, 'utf8'));
    }
  }
}).catch(err => {
  console.error(err);
}).then(() => {
  Promise.all(allCSS).then(values => {
    fs.writeFile(`${destinationPath}/bundle.css`, values.join('\n'), err => {
      if (err) {
        console.error('Cannot write file bundle.css!');
      }
    })
  })
})
