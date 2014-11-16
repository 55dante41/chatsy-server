var mongoose = require('mongoose'),
	schema = mongoose.Schema,
	bcrypt = require('bcrypt-nodejs');
	
var groupsSchema = new schema({
	name : {type: String, required: true},
	description : {type: String, required: false},
	passkey : {type: String},
	isPrivate : {type: Boolean},
	isVisible : {type: Boolean},
	tags : [{type: String}],
	createdBy : {type: String},
	createdOn : {type: Date, 'default': Date.now},
	admins : [{type: String}],
	authorizedUsers : [{type: String}],
	unauthorizedUsers : [{type: String}]
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
