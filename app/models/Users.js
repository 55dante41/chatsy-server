var mongoose = require('mongoose'),
	schema = mongoose.Schema,
	bcrypt = require('bcrypt-nodejs');
	
var usersSchema = new schema({
	alias : {type: String, required: true},
	lastInteractedOn : {type: Date, 'default': Date.now, required: true},
	isPersistent: {type: Boolean, required: true},
	passkey : {type: String},
	authorizedInGroups : [{type: String, required: false}],
	unauthorizedInGroups: [{type: String, required: false}]
});

//Generate a hash for the key
usersSchema.methods.generateHash = function(key) {
	return bcrypt.hashSync(key, bcrypt.genSaltSync(8));
};

//Validate key
usersSchema.methods.validateKey = function(key) {
	return bcrypt.compareSync(key, this.passkey);
};

module.exports = mongoose.model('Users', usersSchema);
