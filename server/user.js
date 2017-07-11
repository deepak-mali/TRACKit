/**
 * @param {string} title - Get User Activity.
 * @param {string} author - Deepak Mali.
 * @description Update User Activity - API to get a user's activity.
 */

// require db instance.
let db = require('../db/initDb.js')
let users = db.users;

module.exports.getUserActivity = getUserActivity;

/**
* @function getUserActivity
* @param {Object} req - payload data.
* @param {Object} res - return response 
* @description Fetches the user data based on userId.
*/
function getUserActivity(req, res){
	console.log('req ', req.params.userId);
	let userId = req.params.userId;
	var results = users.find({ userId: userId});
	res.send({
				code : 200,
				message : "Success",
				data : results
			});
}
