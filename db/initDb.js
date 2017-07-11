/**
* @param {string} title - Initialize database.
* @param {string} author - Deepak Mali.
* @description Initializing Lokijs database.
*/
let loki = require('lokijs');

let db = new loki('user.db');
let users = db.addCollection('users');	

module.exports.users = users;
