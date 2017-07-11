/**
 * @param {string} title - Update User Activity.
 * @param {string} author - Deepak Mali.
 * @description Update User Activity - API to Update user activity.
 */

// require db instance.
let db = require('../db/initDb.js')
let users = db.users;

module.exports.updateUserActivity = updateUserActivity;


/**
* @function updateUserActivity
* @param {Object} req - payload data.
* @param {Object} res - return response 
* @description Fetches the user data based on userId and modifies the fields with updated values .
*/
function updateUserActivity(req, res){
	let results = users.find({ "userId": req.body.userId});
	for(let i of results){
		if(req.body.id == i.id){
			i.activity = req.body.activity;
			i.startTime = req.body.startTime;
			i.endTime = req.body.endTime;			
			users.update(i);
			break;
		}
	}
	let results1 = users.find({ userId: req.body.userId});
	res.send({
				code : 200,
				message : "Success",
				data : results1
			});	
}