const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'tstdb01';
const client = new MongoClient(url, {useUnifiedTopology: true});

const insertDocuments = function(db, callback) {
  const collection = db.collection('foo');
  var document = {name:"David", email: "test@example.com", title:"About MongoDB", asset_list:["a","b","c"]};
  collection.insertOne(document, function(err, result){
    console.log("Inserted 1 document into the collection");
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