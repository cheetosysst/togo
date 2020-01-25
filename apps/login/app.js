const router = require('express').Router();
const fs = require('fs');

var html;

fs.readFile('./html/login.html', function(err, data) {

	if (err) {
		throw err;
	}

	// console.log(data.toString());
	html = data.toString();

});

router.get('/login', async (req, res) => {
	res.write(html);
	res.end();
})


module.exports = router;