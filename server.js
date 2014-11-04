//Require Module Dependencies
var hapi = require('hapi'),
	mongoose = require('mongoose'),
	Path =  require('path'),
	socketio = require('socket.io'),
	orchestrate = require('orchestrate')('2bfb3d34-cfd7-4649-b0dc-80c31b391ed9');
//Require Imports
var routes = require('./app/routes.js'),
	configDB = require('./config/database.js'),
	Crypter = require('./app/utils/crypting.js'),
	Chatlog = require('./app/models/Chatlog.js');

mongoose.connect(configDB.url);
mongoose.connection.on('disconnected', function() { console.log("disconnected from db...");});

orchestrate.ping()
.then(function() 
{
	console.log("Orchestrate ping successful");
})
.fail(function(err) 
{
	console.log("Orchestrate ping failed");
})

var serverOptions = 
{
	views : 
	{
		engines : 
		{
			html : require('handlebars')			
		},
		basePath : __dirname,
		path : './views'
	}
}
var host = 'localhost';
var port = Number(process.env.PORT || 5000);
var server = hapi.createServer(port, serverOptions);
routes(server);

var groups = {};
var sockets = require('./app/sockets.js')(server, groups);
server.start(sockets);