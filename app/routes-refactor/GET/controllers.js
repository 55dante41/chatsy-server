var Groups = require('../../../app/models/Groups'),
	Crypter = require('../../../app/utils/crypting'),
	Users = require('../../../app/models/Users');

module.exports = function(server) 
{
	console.log("in controllers");
	//website landing
	server.route({
		method: 'GET',
		path: '/',
		handler: function (request, reply)
		{
			if (request.state['alias'] == undefined)
			{
				reply.redirect('/');
			} else
			{
				reply.redirect('/home');
			}
		}
	});

	//home
	server.route({
		method: 'GET',
		path: '/home',
		handler: function (request, reply)
		{
			if (request.state['alias'] == undefined)
			{
				reply.redirect('/');
			} else
			{
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

	//groups
	server.route({
		method: 'GET',
		path: '/groups',
		handler: function (request, reply)
		{
			if (request.state['alias'] == undefined)
			{
				reply.redirect('/');
			} else
			{
				var groups = {};
				Groups.find({ 'isVisible': true }, function (err, groups)
				{
					reply(groups);
				});
			}
		}
	});

	//chat
	server.route(
	{
		method: 'GET',
		path: '/groups/{id}',
		handler: function (request, reply)
		{
			if (request.state['alias'] == undefined)
			{
				//User not logged in
				reply.redirect('/');
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
}