var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/tmp', function(err, db) {
    if(err) throw err;

    var query = { 'name' : 'foo' };

    db.collection('foos').find(query).toArray(function(err, docs) {
        if(err) throw err;
        console.dir(docs);
        db.close();
    });
});