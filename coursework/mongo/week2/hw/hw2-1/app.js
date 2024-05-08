var MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://localhost:27017/mydb', function(err, db) {
    if(err) throw err;
	var query = { 'Wind Direction' : { '$gt' : 180, '$lt' : 360 } } ;
    db.collection('things').find(query).sort({ Temperature: 0}).limit(1).toArray(function(err, docs) {
        if(err) throw err;
        console.dir(docs);
        db.close();
    });
});

// var client = require('mongodb').MongoClient;

// client.connect('mongodb://localhost:27017/mydb', function(err, db) {
// 	if (err) throw err;

// 	var query = { 'Wind Direction' : { '$gt' : 180, '$lt' : 360 } } ;
// 	var projection = {'State':1, 'Temperature':1};
// 	var cursor = db.collection('things').find(query, projection);
	
// 	cursor.sort([['Temperature',-1]]);

// 	cursor.each(function(err, doc) {
// 		if (err) throw err;
// 		console.dir(doc);
//         db.close();
// 	});
// });