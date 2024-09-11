var path = require('path');
var express = require('express');
var request = require('request-promise');
var cors = require('cors');
var app = express();

app.use(cors());

app.get('/api/devices',function(req,res){
  res.sendFile(path.join(__dirname + '/about.html'));
});

app.listen(3001, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('server started at http://localhost:3001');
});
