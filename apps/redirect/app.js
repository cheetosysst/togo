// Library
const router		= require('express').Router();
const MongoClient	= require('mongodb').MongoClient;
require('dotenv').config();

// Varibles and data
// This is the url to the mongo database. Format is <username>:<password>
// TODO Make sure the RW rule is safe

const client 		= new MongoClient(process.env["DB_URI"], { useNewUrlParser: true, useUnifiedTopology: true});
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
		db = await client.db(process.env['DB_REDIRECTOR_NAME']);

		collection = await db.collection(process.env['DB_REDIRECTOR_COLLECTION']);
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
		res.redirect(docs[0].url);
	})
})

process.on('SIGINT', function () {
	console.log("\n[\x1B[33mWarning\x1B[0m] Closing database");
	client.close();
	console.log("[\x1B[33mWarning\x1B[0m] Database closed");
	process.exit(1);
});

module.exports = router;