const express = require('express');
const path = require('path');
let user = require('./user.js');
let add = require('./adduseractivity.js');
let update = require('./updateuseractivity.js');
let getall = require('./getalluseractivity.js');

let bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));



// Answer API requests. All the API route definition.

// API route to get user specific data.
app.get('/apis/v1.1/getuseractivity/:userId', function(request, response){
	user.getUserActivity(request, response)
})

// API route to add user activity.
app.post('/apis/v1.1/adduseractivity', function(request, response){
	add.addUserActivity(request, response);
})

// API route to update any user activity.
app.post('/apis/v1.1/updateuseractivity', function(request, response){
	update.updateUserActivity(request, response);
})

// API route to get activities of all the users.
app.get('/apis/v1.1/getalluseractivity', function(request, response){
	getall.getAllUserActivity(request, response);
})

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});


app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});
