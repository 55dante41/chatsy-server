module.exports = function (server)
{
	require('./GET')(server);
	require('./POST')(server);
}