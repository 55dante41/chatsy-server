var socketio = require('socket.io'),
	Crypter = require('./utils/crypting.js'),
	Chatlog = require('./models/Chatlog.js');

module.exports = function(server, groups) 
{
	var io = socketio.listen(server.listener);
	io.on('connection', function (socket)
	{
		socket.on('join group', function (data)
		{
			socket.join(data.groupId, function ()
			{
				if (data.alias != undefined)
				{
					if (groups[data.groupId] == undefined)
					{
						groups[data.groupId] = [];
					}
					if (groups[data.groupId].indexOf(Crypter.decrypt(data.alias)) == -1)
					{
						groups[data.groupId].push(Crypter.decrypt(data.alias));
					}
					io.sockets. in (data.groupId).emit('users update', { 'groups': groups });
				}
			});

		});
		socket.on('leave group', function (data)
		{
			groups[data.groupId].splice(groups[data.groupId].indexOf(Crypter.decrypt(data.alias)), 1);
			io.sockets. in (data.groupId).emit('users update', { 'groups': groups });
		});
		socket.on('send message', function (data)
		{
			io.sockets. in (data.groupId).emit('send message', { 'message': data.message, 'sender': Crypter.decrypt(data.sender), 'sentOn': Date() });
			var newChatlog = new Chatlog();
			newChatlog.groupId = data.groupId;
			newChatlog.chatMessage = data.message;
			newChatlog.imageMessage = false;
			newChatlog.textMessage = true;
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
			io.sockets. in (data.groupId).emit('send image message', { 'message': data.message, 'sender': Crypter.decrypt(data.sender) ,'sentOn': Date.Now });
			var newChatlog = new Chatlog();
			newChatlog.groupId = data.groupId;
			newChatlog.chatMessage = data.message;
			newChatlog.imageMessage = true;
			newChatlog.textMessage = false;
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
	console.log('Server started');	
}