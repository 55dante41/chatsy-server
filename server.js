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
			var newChatlog = new Chatlog();
			newChatlog.groupId = data.groupId;
			newChatlog.chatMessage = data.message;
			newChatlog.postedBy = Crypter.decrypt(data.sender);
			newChatlog.save(function (err)
			{
				if (err)
				{
					console.log(err);
				} 
			});
		});
		socket.on('send image message', function (data)
		{
			io.sockets. in (data.groupId).emit('send image message', { 'message': data.message, 'sender': Crypter.decrypt(data.sender) });
			var newChatlog = new Chatlog();
			newChatlog.groupId = data.groupId;
			newChatlog.chatMessage = data.message;
			newChatlog.postedBy = Crypter.decrypt(data.sender);
			newChatlog.save(function (err)
			{
				if (err)
				{
					console.log(err);
				} 
			});
		});
	});

	console.log('Server started on port: ' + port);
});


