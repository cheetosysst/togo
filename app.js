// Librarys
const express 	= require('express');
const app 		= express();
const router 	= express.Router();
const login 	= require('./apps/login/app.js');
const favicon 	= require('serve-favicon');
const redirect 	= require('./apps/redirect/app.js');

// Default parameters
// Move to config file in future
global.debug 	= false;
const PORT		= 8080;

// Argument processing
process.argv.forEach(function (val, index, array) {
	switch (val) {

		// TODO: Add actual debug stuff that uses this
		case "debug":
			global.debug = true;
			break;

		default:
			break;

	}
});

// Show requests in console
// Marked with color so it looks NICE
router.use(function (req, res, next) {

	// Gather request datas
	// Probably should called them directly, but this way looks cleaner
	var method 	= req.method;
	var url 	= req.url;

	// Mark with color and console log
	switch (method) {

		// All traffic use GET at the time
		// Mark expected method with blue '\u001b[32m'
		// Mark unexpected method with red '\u001b[32m'
		case 'GET':
			console.log('\u001b[32m'+method+'\u001b[0m', url);
			break;

		// You shouldn't see anyone use method other than GET. If it happens, it'll mark them with color red in the console
		default:
			console.log('\u001b[32m'+method+'\u001b[0m', url);
	}
	next();
})

// Router config

// Index
// Preserve for homepage
app.use('/', router);

// Redirector
router.get('/r/:key', redirect);

// Login
router.get('/login', login);

// Favicon
// Sometimes works, somehow.. I'm not sure why
app.use(favicon("public/favicon.ico"))

// Public
// All css, js, image, security.txt, and random file goes here
app.use(express.static('public'));

// Listen to port
// Port uses varible PORT
var server = app.listen(PORT, function () {

	// Data
	var host = server.address().address
	var port = server.address().port
	var ver = require('./package.json').version

	// Unecessary but good looking welcome message
	console.log("\x1B[37mToGo Server v_%s\x1B[0m %s\n", ver, global.debug?"Debug mode":"Normal mode");
	if (ver[ver.length-1] == 'a') 
		console.log('[\x1B[33mWarning\x1B[0m] This is an alpha version, prepare for explosion');
	else if (ver[ver.length-1] == 'b')
		console.log('[\x1B[33mWarning\x1B[0m] This is an beta version, fasten your seatbelt');
	console.log("[\x1B[34mNormal\x1B[0m] Running on http://%s:%s", host, port);
})

