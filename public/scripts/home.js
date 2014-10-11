var socket = io();
$('#creategroup-button').click(function ()
{
	$('#creategroup-modal').modal('show');
});
$('document').ready(function ()
{
	//$('#options-sidebar').sidebar({ 'overlay': false }).sidebar('toggle');
	$("div[id^='joingroup-'][id$='-button'").each(function ()
	{
		$(this).click(function ()
		{
			if($('#joingroup-'+$(this).attr('id').split('-')[1]+'-passkey-input').length == 0) 
			{
				window.location.href = "/groups/" + $(this).attr('id').split('-')[1];
			} 
			{
			
			}
			
		});
	});
});
$('#creategroup-modal-submit').click(function ()
{
	var cookies = str_obj(document.cookie);
	if ($('#creategroup-key-input').val() != "" && $('#creategroup-key-input').val() != undefined)
	{
		if ($('#creategroup-visibility-checkbox').prop('checked'))
		{
			var postData = {
				'alias': cookies['alias'],
				'name': $('#creategroup-name-input').val(),
				'description': $('#creategroup-description-input').val(),
				'key': $('#creategroup-key-input').val(),
				'isPrivate': true,
				'isVisible': true
			}
		} else
		{
			var postData = {
				'alias': cookies['alias'],
				'name': $('#creategroup-name-input').val(),
				'description': $('#creategroup-description-input').val(),
				'key': $('#creategroup-key-input').val(),
				'isPrivate': true,
				'isVisible': false
			}
		}
	} else
	{
		if ($('#creategroup-visibility-checkbox').prop('checked'))
		{
			var postData = {
				'alias': cookies['alias'],
				'name': $('#creategroup-name-input').val(),
				'description': $('#creategroup-description-input').val(),
				'key': $('#creategroup-key-input').val(),
				'isPrivate': false,
				'isVisible': true
			}
		} else
		{
			var postData = {
				'alias': cookies['alias'],
				'name': $('#creategroup-name-input').val(),
				'description': $('#creategroup-description-input').val(),
				'key': $('#creategroup-key-input').val(),
				'isPrivate': false,
				'isVisible': false
			}
		}
	}
	$.ajax({
		type: 'POST',
		url: '/groups/create',
		data: postData,
		success: function (data, status, jqXHR)
		{
			if (status === "success")
			{
				$('#creategroup-modal').modal('hide');
			} else
			{
				//Error handling
			}
		}
	});
});

$('#browsegroups-button').click(function ()
{
	window.location.href = "/home";
});

function str_obj(str)
{
	str = str.split(', ');
	var result = {};
	for (var i = 0; i < str.length; i++)
	{
		var cur = str[i].split('=');
		result[cur[0]] = cur[1];
	}
	return result;
}