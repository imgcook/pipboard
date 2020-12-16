const fs = require('fs');
const path = require('path');
const download = require('download');
const { modulesOSSUrl } = require('./config');

(async () => {
  Object.keys(modulesOSSUrl).forEach(item => {
    modulesOSSUrl[item].forEach(itm => {
      download(itm, `dist/static/models/${item}`);
    });
  });
  fs.writeFile(path.resolve(process.cwd(), './dist/CNAME'), 'pipboard.imgcook.com', (err) => {
    if (err) throw err;
  });
})();
