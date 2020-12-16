const download = require('download');
const { modulesOSSUrl } = require('./config');
 
(async () => {
  Object.keys(modulesOSSUrl).forEach(item => {
    modulesOSSUrl[item].forEach(itm => {
      download(itm, `dist/static/models/${item}`);
    });
  });
})();
