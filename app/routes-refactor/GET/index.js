module.exports = function (server)
{
	console.log("in GET");
	require('./controllers')(server);
	require('./public')(server);
	require('./libs')(server);
}