const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';
const dbName = 'tstdb01';
const client = new MongoClient(url, {useUnifiedTopology: true});

const findDocuments = function (db, callback) {
  const collection = db.collection('foo');
  collection.find({
    'email': 'test@example.com'
  }).toArray(function (err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs);
    callback(docs);
  });
}

// connect to mongo
client.connect(function (err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  findDocuments(db, function () {
    client.close();
  });
});