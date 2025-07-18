var express = require('express');
var app = express.createServer(express.logger());

// app.get('/', function(request, response) {
//  response.send('Hello World 2!');
// });

app.get('/', function(request,response) {
  response.sendfile('public/index.html');
});

var port = process.env.PORT || 8000;
app.listen(port, function() {
  console.log("Listening on " + port);
});