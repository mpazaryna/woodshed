var client = require('mongodb').MongoClient;

client.connect('mongodb://localhost:27017/sgmc_dev', function(err, db) {
	if (err) throw err;

	var query = {'email' : 'matt.pazaryna@sungard.com'};
	var projection = {};
	var cursor = db.collection('users').find(query, projection);

	cursor.explain(function(err,explain_output) {
		if (err) throw err;

		console.log(explain_output);

		db.close();
	});
});