var mongoose = require('mongoose'),
	schema = mongoose.Schema,
	bcrypt = require('bcrypt-nodejs');
	
var groupsSchema = new schema({
	name : {type: String, required: true},
	description : {type: String, required: false},
	passkey : {type: String},
	createdBy : {type: String, required: false},
	isPrivate : {type: Boolean},
	isVisible : {type: Boolean}
});

//Generate a hash for the key
groupsSchema.methods.generateHash = function(key) {
	return bcrypt.hashSync(key, bcrypt.genSaltSync(8));
};

//Validate key
groupsSchema.methods.validateKey = function(key) {
	return bcrypt.compareSync(key, this.passkey);
};

module.exports = mongoose.model('Groups', groupsSchema);
