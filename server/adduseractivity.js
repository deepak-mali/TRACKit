/**
 * @param {string} title - Add User Activity.
 * @param {string} author - Deepak Mali.
 * @description Add User Activity - API to add user activity.
 */

// require db instance.
let db = require('../db/initDb.js')
let users = db.users;

module.exports.addUserActivity = addUserActivity;

/**
* @function addUserActivity
* @param {Object} req - payload data.
* @param {Object} res - return response 
* @description Inserts user activity to lokijs then fetches the result to check if insert was a success.
*/
function addUserActivity(req, res){
	users.insert(req.body)
	var results = users.find({ "userId":req.body.userId});
	console.log("result ===========", results);
	for(let i of results){
		if(req.body.id == i.id){
			res.send({
				code : 200,
				message : "Success"
			});	
			break;	
		} 		
	}
}