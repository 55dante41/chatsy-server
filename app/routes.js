var Groups = require('../app/models/Groups'),
	Crypter = require('../app/utils/crypting'),
	Users = require('../app/models/Users');

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
		method: 'POST',
		path: '/groups/created',
		handler: function (request, reply)
		{
			if (request.payload.alias != undefined)
			{
				console.log(request.payload);
				Groups.find({ 'createdBy': Crypter.decrypt(request.payload.alias) }, function (err, result)
				{
					if (err)
					{
						console.log(err);
						reply("Query failed");
						return;
					}
					reply(result);
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
					console.log(result[0]);
					if (result[0].isPrivate)
					{
						var cookieB = JSON.parse(Crypter.decrypt(request.state['_b']));
						if (cookieB[result[0]._id])
						{
							reply.view('chat', { name: result[0].name, groupId: result[0]._id });
						} else
						{
							reply.redirect('/home');
						}
					} else
					{
						reply.view('chat', { name: result[0].name, groupId: result[0]._id });
					}
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
	server.route({
		method: 'GET',
		path: '/chat.js',
		handler: function (request, reply)
		{
			reply.file('./public/scripts/chat.js');
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
		path: '/fonts/icons.woff',
		handler: function (request, reply)
		{
			reply.file('./bower_components/semantic/build/packaged/fonts/icons.woff');
		}
	});
	server.route({
		method: 'GET',
		path: '/fonts/icons.ttf',
		handler: function (request, reply)
		{
			reply.file('./bower_components/semantic/build/packaged/fonts/icons.ttf');
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
				console.log(request.payload.alias);
				Users.find({ alias: request.payload.alias }, function (err, result)
				{
					console.log(result.length);
					if (result.length > 0)
					{
						reply("Failed - Alias already exists");
					} else
					{
						var newUser = new Users();
						newUser.alias = request.payload.alias;
						newUser.isPersistent = false;
						newUser.save(function (err)
						{
							if (err)
							{
								console.log(err);
								reply("Failed - Server error");
							} else
							{

								reply("Success").state('alias', Crypter.encrypt(request.payload.alias));
							}
						});
					}
				});

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
						console.log(err);
						reply("Error");
					}
					if (result[0].validateKey(request.payload.passkey))
					{
						var cookieB = {};
						cookieB[result[0]._id] = true;
						console.log(cookieB);
						console.log(Crypter.encrypt(JSON.stringify(cookieB)));
						reply("Success").state('_b', Crypter.encrypt(JSON.stringify(cookieB)));
					} else
					{
						console.log("Validation Failed");
						reply("Failure");
					}
				});
			}
		}
	})

};
