var Groups = require('../../../app/models/Groups'),
	Crypter = require('../../../app/utils/crypting'),
	Users = require('../../../app/models/Users');
	
module.exports = function (server)
{
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
						console.log(err);
						reply("Error - Database Operation Failed");
						return;
					} else
					{
						reply("Success");
					}
				});
			} else
			{
				reply("Failure - Invalid User");
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
				Groups.find({ 'createdBy': Crypter.decrypt(request.payload.alias) }, function (err, result)
				{
					if (err)
					{
						console.log(err);
						reply("Error - Database Operation failed");
						return;
					}
					reply(result);
				});
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
				reply("Failure - Invalid User");
			} else
			{
				Groups.find({ _id: request.payload.groupId }, function (err, result)
				{
					if (err)
					{
						console.log(err);
						reply("Error - Database Operation Failed");
						return;
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
						reply("Failure - Invalid Passkey");
					}
				});
			}
		}
	});
}