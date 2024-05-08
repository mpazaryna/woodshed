const {MongoClient} = require('mongodb');
const url = 'mongodb://localhost:27017';
const dbName = 'tstdb01';
const client = new MongoClient(url, {useUnifiedTopology: true});

// insert
const insertDocuments = function(db, callback) {
  const collection = db.collection('foo');
  const documents = [{a : 1}, {a : 2}, {a : 3}]
  collection.insertMany(documents, function(err, result) {
    console.log("Inserted document into the collection");
    callback(result);
  });
}

// connect to mongo
client.connect(function (err) {
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  insertDocuments(db, function () {
    client.close();
  });
});