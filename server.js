//Require Module Dependencies
var hapi = require('hapi');
//Require Imports
var routes = require('./app/routes');
var server = hapi.createServer('localhost', 3000);
routes(server);
server.start(function() {
	console.log('Server started on port 3000');
});


