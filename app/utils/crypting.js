var crypto = require('crypto');

module.exports.encrypt = function (stringToEncrypt)
{
	var cipher = crypto.createCipher('aes-256-cbc', 'tsy381');
	var encryptedString = cipher.update(stringToEncrypt, 'utf8', 'hex');
	encryptedString += cipher.final('hex');
	return encryptedString;
}

module.exports.decrypt = function (stringToDecrypt)
{
	var decipher = crypto.createDecipher('aes-256-cbc', 'tsy381');
	var decryptedString = decipher.update(stringToDecrypt, 'hex', 'utf8');
	decryptedString += decipher.final('utf8');
	return decryptedString;
}