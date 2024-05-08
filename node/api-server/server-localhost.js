var path = require('path');
var express = require('express');
var request = require('request-promise');
var cors = require('cors');
var app = express();
var API_SERVER = "http://localhost:1337";

app.use(cors());

app.get('/cr-commands', function(req, res) {
  endpoint = API_SERVER + "/cr-commands";
  request(endpoint)
  .then(function (data) {
    res.json(JSON.parse(data))
  });
});

app.get('/cr-initiate', function(req, res) {
  endpoint = API_SERVER + "/cr-initiate";
  request(endpoint)
  .then(function (data) {
    res.json(JSON.parse(data))
  });
});

app.get('/cr-response/:command_id', function(req, res) {
  endpoint = API_SERVER + "/cr-response";
  request(endpoint)
  .then(function (data) {
    res.json(JSON.parse(data))
  });
});

app.get('/devices', function(req, res) {
  endpoint = API_SERVER + "/devices";
  request(endpoint)
  .then(function (data) {
    res.json(JSON.parse(data))
  });
});

app.listen(3000, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('API server pointed to localhost json-server started at http://localhost:3000');
});
