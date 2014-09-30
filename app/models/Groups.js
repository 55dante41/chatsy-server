var mongoose = require('mongoose'),
	schema = mongoose.Schema,
	bcrypt = require('bcrypt-nodejs');
	
var groupsSchema = new schema({
	name : {type: String, required: true},
	description : {type: String, required: false},
	createdBy : {type: String, required: false},
	visibility : {type: String}
});

//Generate a hash for the key
groupsSchema.methods.generateHash = function(key) {
	return bcrypt.hashSync(key, bcrypt.genSaltSync(8));
};

//Validate key
groupsSchema.methods.validateKey = function(key) {
	return bcrypt.compareSync(key, this.key);
};

module.exports = mongoose.model('Groups', groupsSchema);
