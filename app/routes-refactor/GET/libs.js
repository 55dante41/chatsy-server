var path = require('path');

module.exports = function (server)
{
	console.log("in libs");
	//Semantic-UI
	server.route({
		method: 'GET',
		path: '/semantic.css',
		handler: function (request, reply)
		{
			reply.file('../../../bower_components/semantic/build/packaged/css/semantic.css');
		}
	});
	server.route({
		method: 'GET',
		path: '/semantic.min.css',
		handler: function (request, reply)
		{
			reply.file('../../../bower_components/semantic/build/packaged/css/semantic.min.css');
		}
	});
	server.route({
		method: 'GET',
		path: '/fonts/icons.woff',
		handler: function (request, reply)
		{
			reply.file('../../../bower_components/semantic/build/packaged/fonts/icons.woff');
		}
	});
	server.route({
		method: 'GET',
		path: '/fonts/icons.ttf',
		handler: function (request, reply)
		{
			reply.file('../../../bower_components/semantic/build/packaged/fonts/icons.ttf');
		}
	});
	server.route({
		method: 'GET',
		path: '/semantic.js',
		handler: function (request, reply)
		{
			reply.file('../../../bower_components/semantic/build/packaged/javascript/semantic.js');
		}
	});
	server.route({
		method: 'GET',
		path: '/semantic.min.js',
		handler: function (request, reply)
		{
			reply.file('../../../bower_components/semantic/build/packaged/javascript/semantic.min.js');
		}
	});

	//JQuery
	server.route({
		method: 'GET',
		path: '/jquery.js',
		handler: function (request, reply)
		{
			reply.file('../../../bower_components/jquery/dist/jquery.js');
		}
	});
	server.route({
		method: 'GET',
		path: '/jquery.min.js',
		handler: function (request, reply)
		{
			reply.file('../../../bower_components/jquery/dist/jquery.min.js');
		}
	});
	server.route({
		method: 'GET',
		path: '/jquery.min.map',
		handler: function (request, reply)
		{
			reply.file('../../../bower_components/jquery/dist/jquery.min.map');
		}
	});
}