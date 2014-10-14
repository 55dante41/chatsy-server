var Groups = require('../app/models/Groups'),
	Crypter = require('../app/utils/crypting');

module.exports = function (server)
{
	//GET routes
	//general
	server.route({
		method: 'GET',
		path: '/',
		handler: function (request, reply)
		{
			if (request.state['alias'] == undefined)
			{
				//User not logged in
				reply.file('./views/index.html');
			} else
			{
				//User logged in
				var groups = {};
				Groups.find({ 'isVisible': true }, function (err, groups)
				{
					if (err)
					{
						reply("Server Error");
						return;
					}
					reply.view('home', groups);
				});
			}
		}
	});
	server.route({
		method: 'GET',
		path: '/home',
		handler: function (request, reply)
		{
			if (request.state['alias'] == undefined)
			{
				//User not logged in
				reply.file('./views/index.html');
			} else
			{
				//User logged in
				var groups = {};
				Groups.find({ 'isVisible': true }, function (err, groups)
				{
					if (err)
					{
						reply("Server Error");
						return;
					}
					reply.view('home', { 'groups': groups });
				});
			}
		}
	});
	server.route({
		method: 'GET',
		path: '/groups',
		handler: function (request, reply)
		{
			if (request.state['alias'] == undefined)
			{
				//User not logged in
				reply.file('./views/index.html');
			} else
			{
				//User logged in
				var groups = {};
				Groups.find({ 'isVisible': true }, function (err, groups)
				{
					reply(groups);
				});
			}
		}
	});
	server.route(
	{
		method: 'GET',
		path: '/groups/{id}',
		handler: function (request, reply)
		{
			if (request.state['alias'] == undefined)
			{
				//User not logged in
				reply.file('./views/index.html');
			} else
			{
				Groups.find({ _id: request.params.id }, function (err, result)
				{
					reply.view('chat', { name: result[0].name, groupId: result[0]._id });
				});
			}
		}
	});
	server.route({
		method: 'GET',
		path: '/home.js',
		handler: function (request, reply)
		{
			reply.file('./public/scripts/home.js');
		}
	});
	//resources
	server.route({
		method: 'GET',
		path: '/semantic.css',
		handler: function (request, reply)
		{
			reply.file('./bower_components/semantic/build/packaged/css/semantic.css');
		}
	});
	server.route({
		method: 'GET',
		path: '/semantic.min.css',
		handler: function (request, reply)
		{
			reply.file('./bower_components/semantic/build/packaged/css/semantic.min.css');
		}
	});
	server.route({
		method: 'GET',
		path: '/semantic.js',
		handler: function (request, reply)
		{
			reply.file('./bower_components/semantic/build/packaged/javascript/semantic.js');
		}
	});
	server.route({
		method: 'GET',
		path: '/semantic.min.js',
		handler: function (request, reply)
		{
			reply.file('./bower_components/semantic/build/packaged/javascript/semantic.min.js');
		}
	});
	server.route({
		method: 'GET',
		path: '/chatsy.css',
		handler: function (request, reply)
		{
			reply.file('./public/stylesheets/chatsy.css');
		}
	});
	server.route({
		method: 'GET',
		path: '/jquery.js',
		handler: function (request, reply)
		{
			reply.file('./bower_components/jquery/dist/jquery.js');
		}
	});
	server.route({
		method: 'GET',
		path: '/jquery.min.js',
		handler: function (request, reply)
		{
			reply.file('./bower_components/jquery/dist/jquery.min.js');
		}
	});
	server.route({
		method: 'GET',
		path: '/jquery.min.map',
		handler: function (request, reply)
		{
			reply.file('./bower_components/jquery/dist/jquery.min.map');
		}
	});

	//-----------------------------------------------------------------------
	//POST routes
	//general
	server.route({
		method: 'POST',
		path: '/',
		handler: function (request, reply)
		{
			if (request.payload.alias != undefined)
			{
				reply("Success").state('alias', Crypter.encrypt(request.payload.alias));
			} else
			{
				reply("Error");
			}
		}
	});
	server.route({
		method: 'POST',
		path: '/groups/create',
		handler: function (request, reply)
		{
			if (request.payload.alias != undefined)
			{
				var newGroup = new Groups();
				newGroup.name = request.payload.name;
				newGroup.description = request.payload.description;
				newGroup.passkey = newGroup.generateHash(request.payload.key);
				newGroup.createdBy = Crypter.decrypt(request.payload.alias);
				newGroup.isPrivate = request.payload.isPrivate;
				newGroup.isVisible = request.payload.isVisible;
				newGroup.save(function (err)
				{
					if (err)
					{
						reply(err.message);
					} else
					{
						reply("Success");
					}
				});
			} else
			{
				reply("Error");
			}
		}
	});
	server.route(
	{
		method: 'POST',
		path: '/joinauth',
		handler: function (request, reply)
		{
			if (request.state['alias'] == undefined)
			{
				//User not logged in
				reply.file('./views/index.html');
			} else
			{
				Groups.find({ _id: request.payload.groupId }, function (err, result)
				{
					if (err)
					{
						return;
					}
					if (result[0].validateKey(request.payload.passkey))
					{
						reply.redirect('chat', { name: result[0].name, groupId: result[0]._id });
					} else
					{
						reply.redirect('/home');
					}
				});
			}
		}
	})

};
