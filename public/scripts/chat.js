var socket = io();
var cookies = str_obj(document.cookie);
var url = document.URL.split('/');
var groupId = url[url.length - 1];
socket.on('connect', function ()
{
	var joinData =
	{
		'groupId' : groupId,
		'alias' : cookies['alias']
	};
	socket.emit('join group', joinData);
});

socket.on('send message', function (data)
{
	var messageContainer = $('#chat-message');
	messageContainer.append('<div style="margin-top: 5px; background-color: #efefef; box-shadow: 1px 1px 1px 1px gray;padding: 10px"><div style="font-weight:bold; display: inline-block">' + data.sender + ':</div><div style="display: inline-block; word-break: break-all">' + data.message.replace('\n', '<br/>') + '</div><div style="display: inline-block; color: gray; margin-top: 5px; text-align: right">'+data.sentOn+'</div></div>');
	messageContainer.scrollTop(messageContainer.prop("scrollHeight"));
});
socket.on('send image message', function (data)
{
	var messageContainer = $('#chat-message');
	messageContainer.append('<div style="margin-top: 5px; background-color: #efefef; box-shadow: 1px 1px 1px 1px gray;padding: 10px"><div style="font-weight:bold; display: inline-block">' + data.sender + ':</div><div style="display: inline-block; word-break: break-all"><img style="max-width: 100%" src=\"' + data.message + '"/></div><div style="display: inline-block; color: gray; margin-top: 5px; text-align: right">'+data.sentOn+'</div></div>');
	messageContainer.scrollTop(messageContainer.prop("scrollHeight"));
});
socket.on('users update', function (data)
{
	$('#chat-people').empty();
	for (var i = 0; i < data.groups[groupId].length; i++)
	{
		$('#chat-people').append('<div style="padding: 10px; background-color: #efefef; margin-top: 5px">' + data.groups[groupId][i] + '</div>');
	}	
});
$('#chat-input').keydown(function (e)
{
	if (e.keyCode == 13 && !e.shiftKey)
	{
		e.preventDefault();
		if ($('#chat-input').val() != '')
		{
			socket.emit('send message', { 'message': $('#chat-input').val(), 'groupId': groupId, 'sender': cookies['alias'] });
			$('#chat-input').val('');
		}
	}
});

$('#chat-image').on('change', function (e)
{
	var imageFile = e.originalEvent.target.files[0];
	var fileReader = new FileReader();
	fileReader.onload = function (event)
	{
		socket.emit('send image message', { 'message': event.target.result, 'groupId': groupId, 'sender': cookies['alias'] });
	}
	fileReader.readAsDataURL(imageFile);
});

window.onbeforeunload = function (e)
{
	socket.emit('leave group', { 'groupId': groupId, 'alias': cookies['alias'] });
};

$(document).ready(function(e)
{
	var messageContainer = $('#chat-message');
	messageContainer.scrollTop(messageContainer.prop("scrollHeight"));
});

function str_obj(str)
{
	var strA = str.split('; ');
	var result = {};
	for (var i = 0; i < strA.length; i++)
	{
		var cur = strA[i].split('=');
		result[cur[0]] = cur[1];
	}
	return result;
}