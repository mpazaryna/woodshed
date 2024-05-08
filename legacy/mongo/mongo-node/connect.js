const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';
const dbName = 'tstdb01';
const client = new MongoClient(url, {useUnifiedTopology: true});

// connect to mongo
client.connect(function (err) {
  assert.equal(null, err);
  const db = client.db(dbName);
  client.close();
  console.log("Connected successfully to server");
});