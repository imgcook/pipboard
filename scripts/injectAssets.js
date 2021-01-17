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

(() => {
  pullModels();
})();
