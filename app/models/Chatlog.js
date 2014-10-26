var mongoose = require('mongoose'),
	schema = mongoose.Schema;
	
var chatlogsSchema = new schema({
	groupId : {type: String, required: true},
	chatMessage:{type: String},
	textMessage: {type: Boolean},
	imageMessage: {type: Boolean}, 
	postedBy: {type: String}, 
	postedOn: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Chatlog', chatlogsSchema);
