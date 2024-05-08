var path = require('path');
var express = require('express');
var request = require('request-promise');
var cors = require('cors');
var API_SERVER = "https://ktkp0jn1aj.execute-api.us-east-1.amazonaws.com/production";
var app = express();

app.use(cors());

app.get('/help/devices',function(req,res){
  res.sendFile(path.join(__dirname + '/about.html'));
});

app.get('/cr-commands', function(req, res) {
  endpoint = API_SERVER + "/command-runner/commands";
  request(endpoint)
  .then(function (data) {
    res.json(JSON.parse(data))
  });
});

app.get('/cr-initiate', function(req, res) {
  endpoint = API_SERVER + "/command-runner/initiate";
  request(endpoint)
  .then(function (data) {
    res.json(JSON.parse(data))
  });
});

app.get('/cr-initiate/firewalls', function(req, res) {
  endpoint = API_SERVER + "/command-runner/firewalls/initiate";
  request(endpoint)
  .then(function (data) {
    res.json(JSON.parse(data))
  });
});

app.get('/cr-response/:command_id', function(req, res) {
  endpoint = API_SERVER + "/command-runner/response";
  request(endpoint)
  .then(function (data) {
    res.json(JSON.parse(data))
  });
});

app.get('/api/cr-rollback/:command_id', function(req, res) {
  endpoint = API_SERVER + "/command-runner/rollback";
  request(endpoint)
  .then(function (data) {
    res.json(JSON.parse(data))
  });
});

app.get('/api/cr-operation/:command_id', function(req, res) {
  endpoint = API_SERVER + "/devices/cr-operation";
  request(endpoint)
  .then(function (data) {
    res.json(JSON.parse(data))
  });
});

// new api commands starting here.

app.get('/api/devices', function(req, res) {
  endpoint = API_SERVER + "/devices";
  request(endpoint)
  .then(function (data) {
    res.json(JSON.parse(data))
  });
});

app.get('/api/devices/:guid/cr-commands', function(req, res) {
  endpoint = API_SERVER + "/command-runner/commands";
  request(endpoint)
  .then(function (data) {
    res.json(JSON.parse(data))
  });
});

app.get('/api/devices/:guid/cr-objects', function(req, res) {
  endpoint = API_SERVER + "/devices/cr-objects";
  request(endpoint)
  .then(function (data) {
    res.json(JSON.parse(data))
  });
});

app.get('/api/devices/:guid/cr-services', function(req, res) {
  endpoint = API_SERVER + "/devices/cr-services";
  request(endpoint)
  .then(function (data) {
    res.json(JSON.parse(data))
  });
});

app.get('/api/devices/:guid/cr-groups', function(req, res) {
  endpoint = API_SERVER + "/devices/cr-groups";
  request(endpoint)
  .then(function (data) {
    res.json(JSON.parse(data))
  });
});

app.get('/api/devices/:guid/cr-operations', function(req, res) {
  endpoint = API_SERVER + "/command-runner/operations";
  request(endpoint)
  .then(function (data) {
    res.json(JSON.parse(data))
  });
});

app.get('/api/devices/:guid/cr-operations/pending', function(req, res) {
  endpoint = API_SERVER + "/devices/cr-operations-pending";
  request(endpoint)
  .then(function (data) {
    res.json(JSON.parse(data))
  });
});

app.get('/api/devices/:guid/cr-operations/history', function(req, res) {
  endpoint = API_SERVER + "/devices/cr-operations-history";
  request(endpoint)
  .then(function (data) {
    res.json(JSON.parse(data))
  });
});

app.get('/api/user', function(req, res) {
  endpoint = API_SERVER + "/user";
  request(endpoint)
  .then(function (data) {
    res.json(JSON.parse(data))
  });
});

// new commands end here

app.listen(3001, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('API server pointed to AWS started at http://localhost:3001');
});
