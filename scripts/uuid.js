var randomstring = require('randomstring');

module.exports.uuid = uuid;
function uuid(){
	var uuid = randomstring.generate({
				  length: 8,
				  charset: 'numeric'
				});
	return uuid;
}