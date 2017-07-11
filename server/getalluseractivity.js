/**
 * @param {string} title - Get All Users Activities.
 * @param {string} author - Deepak Mali.
 * @description Update User Activity - API to get all users activity.
 */

// require db instance.
let db = require('../db/initDb.js')
let users = db.users;

module.exports.getAllUserActivity = getAllUserActivity;

/**
* @function getAllUserActivity
* @param {Object} req - payload data.
* @param {Object} res - return response 
* @description Fetches data of all the users. Invoked when user is administrator.
*/
function getAllUserActivity(req, res){
	var results = users.find({"createdAt": {'$gte': 0}});
	console.log("result ===========",results);
	res.send({
				code : 200,
				message : "Success",
				data : results
			});
}