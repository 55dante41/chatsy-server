var path = require('path');

module.exports = function(server) 
{
	console.log("in public");
	//global
	server.route({
		method: 'GET',
		path: '/chatsy.css',
		handler: function (request, reply)
		{
			reply.file(path.join(__dirname,'public/stylesheets/chatsy.css'));
		}
	});

	//home
	server.route({
		method: 'GET',
		path: '/home.js',
		handler: function (request, reply)
		{
			reply.file(path.join(__dirname,'public/scripts/home.js'));
		}
	});

	//chat
	server.route({
		method: 'GET',
		path: '/chat.js',
		handler: function (request, reply)
		{
			reply.file(path.join(__dirname,'public/scripts/chat.js'));
		}
	});		
}