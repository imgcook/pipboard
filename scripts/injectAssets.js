const fs = require('fs');
const path = require('path');
const download = require('download');
const { modulesOSSUrl } = require('./config');

const pullModels = () => {
  Object.keys(modulesOSSUrl).forEach(item => {
    modulesOSSUrl[item].forEach(itm => {
      download(itm, `dist/static/models/${item}`);
    });
  });
}

const copyFile = () => {
  fs.copyFile(
    path.resolve(process.cwd(), './scripts/CNAME'),
    path.resolve(process.cwd(), './dist/CNAME'),
    (err) => { if (err) { throw err } }
  );
}

(() => {
  pullModels();
  copyFile();
})();
