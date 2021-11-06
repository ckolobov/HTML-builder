const fs = require('fs');
const path = require('path');

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
      } else if (file.isDirectory()) {
        const newSource = `${src}/${file.name}`;
        const newDestination = `${dest}/${file.name}`;
        fs.promises.mkdir(newDestination, {recursive: true}).then(() => {
          copyAllFiles(newSource, newDestination);
        })
      }
    }
  }).catch(err => {
    console.error(err);
  })
};

const copyAssets = () => {
  const sourcePath = `${__dirname}/assets`;
  const destinationPath =`${__dirname}/project-dist/assets`;
  fs.promises.mkdir(destinationPath, {recursive: true}).then(() => {
    copyAllFiles(sourcePath, destinationPath);
  })
};

const mergeStyles = () => {
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
      fs.writeFile(`${destinationPath}/style.css`, values.join('\n'), err => {
        if (err) {
          console.error('Cannot write file style.css!');
        }
      })
    })
  })
}

const getHTML = (name, obj) => {
  const htmlFolderPath = `${__dirname}/components`;
  const promise = new Promise((resolve, reject) => {
    fs.promises.readFile(`${htmlFolderPath}/${name}.html`, 'utf8').then(data => {
      obj[name] = data;
      resolve();
    }).catch(reject);
  });
  return promise;
}

const prepareHTML = () => {
  const templatePath = `${__dirname}/template.html`;
  const destinationFile = `${__dirname}/project-dist/index.html`;
  const regexp = /\{\{(.+)\}\}/g;
  const AllHTML = {};
  const promises = [];
  let template;

  fs.promises.readFile(templatePath, 'utf8').then(data => {
    template = data;
    const fileNames = data.matchAll(regexp);
    for (let fileName of fileNames) {
      promises.push(getHTML(fileName[1], AllHTML));
    }
  }).catch(err => console.error(err)).then(() => {
    Promise.all(promises).then(() => {
      template = template.replace(regexp, (match, p1) => AllHTML[p1]);
      fs.writeFile(destinationFile, template, err => {
        if (err) {
          console.error('Cannot write file index.html!');
        }
      })
    });
  });
};

const projectDist = `${__dirname}/project-dist`;

fs.promises.rm(projectDist, {recursive: true, force: true}).then(() => {
  return fs.promises.mkdir(projectDist, {recursive: true});
}).then(() => {
  copyAssets();
  mergeStyles();
  prepareHTML();
})
