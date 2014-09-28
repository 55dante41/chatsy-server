var mongoose = require('mongoose'),
	schema = mongoose.Schema,
	bcrypt = require('bcrypt');
	
var groupsSchema = new Schema({
	name : {type: String, required: true},
	description : {type: String, required: false},
	startedBy : {type: String, required: false},
	visibility : {type: String},
	members : {type: Array, default: []},
	key : {type: String, default: null}
});

//Generate a hash for the key
groupsSchema.methods.generateHash = function(key) {
	return bcrypt.hashSync(key, bcrypt.genSaltSync(8), null);
};

//Validate key
groupsSchema.methods.validateKey = function(key) {
	return bcrypt.compareSync(key, this.key);
};

module.exports = mongoose.model('Groups', groupsSchema);
