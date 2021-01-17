const express = require('express');
const http = require('http');

const { modulesOSSUrl } = require('./config');

const PORT = process.env.PORT || 3000;

const app = express();

app.get('/static/models/*', function(req, res) {
  const { originalUrl } = req;
  const urlParam = originalUrl.split('/');
  let targetPath = '';
  Object.keys(modulesOSSUrl).forEach(item => {
    if (originalUrl.includes(item)) {
      targetPath = modulesOSSUrl[item].find(itm => itm.includes(urlParam[urlParam.length -1]));
    }
  })
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (targetPath) {
    http.get(targetPath, function(response) {
      var body = [];
      response.on('data', function(chunk){
        body.push(chunk);
      });
      response.on('end', function(){
        body = Buffer.concat(body);
        const isBinary = targetPath.includes('.bin');
        if (isBinary) {
          res.set('Content-Type', 'application/octet-stream')
          res.send(body);
        } else {
          res.send(body.toString());
        }
      });
    });
  }
});

app.listen(Number(PORT), () => {
  console.log(`🤘 server is listeing on ${PORT}`);
});
