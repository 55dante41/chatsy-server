//Require Module Dependencies
var hapi = require('hapi'),
	mongoose = require('mongoose'),
	Path =  require('path'),
	socketio = require('socket.io');
//Require Imports
var routes = require('./app/routes'),
	configDB = require('./config/database.js'),
	Crypter = require('./app/utils/crypting.js');

mongoose.connect(configDB.url);
mongoose.connection.on('disconnected', function() { console.log("disconnected from db...");});

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
var port = 1000;
var server = hapi.createServer('localhost', port, serverOptions);
routes(server);

var groups = {};
server.start(function ()
{
	var io = socketio.listen(server.listener);
	io.on('connection', function (socket)
	{
		socket.on('join', function (groupId)
		{
			if (groups[groupId] == undefined)
			{
				groups[groupId] = groupId;
			}
			socket.join(groupId, function ()
			{

			});
		});
		socket.on('send message', function (data)
		{
			io.sockets. in (data.groupId).emit('send message', { 'message': data.message, 'sender': Crypter.decrypt(data.sender) });
		})
	});

	console.log('Server started on port: ' + port);
});


