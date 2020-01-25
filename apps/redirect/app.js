// Library
const router		= require('express').Router();
const MongoClient	= require('mongodb').MongoClient;

// Varibles and data
// This is the url to the mongo database. Format is <username>:<password>
// TODO Make sure the RW rule is safe
var uri				= 'mongodb+srv://togoAppAccess:545JpJjT6UfCKpX@cluster0-vcfwv.gcp.mongodb.net/test?retryWrites=true&w=majority';
const client 		= new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
var db;
var collection;

// Database connection
(async function () {
		
	client.connect( async err => {

		// Error
		if (err) throw err;
		console.log("[\x1B[34mNormal\x1B[0m] Connected to database");

		// Set database
		// Wait for database to respond
		db = await client.db("url_key")

		collection = await db.collection('url');
		collection.find({}).toArray(function(err, docs) {
			if (err) throw err;
			console.log("[\x1B[34mNormal\x1B[0m] Found following");
			console.log(docs);
		})

	});

})();


router.get('/r/:key', async (req, res, next) => {

	var key = req.params.key;

	collection.find({'key': key}).toArray(function(err, docs) {
		if (err) throw err;
		console.log(docs);
		url = docs[0].url;
		console.log(url);;
		res.redirect(url);
	})

	// res.end();
})

process.on('SIGINT', function () {
	console.log("Closing database");
	client.close();
	console.log("Database closed");
	process.exit(1);
});

module.exports = router;