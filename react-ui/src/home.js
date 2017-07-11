/**
 * @param {string} title - home.js.
 * @param {string} author - Deepak Mali.
 * @description Homepage - React Component, renders as homepage.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import axios from 'axios';
import SkyLight from 'react-skylight';
import u from '../../scripts/uuid.js'
import moment from 'moment';

var newThis;
export default class Home extends React.Component {

	constructor(){
		super();
		this.state={
			products : [],
			oldActivity : "",
			oldStartTime : 0,
			oldEndTime : 0,
			role : "",
			recentActivity : [],
			previousActivity : []
		}
		this.getDataFronFB();
		newThis = this;
	}


	/**
	* @function componentDidMount
	* @description It is invoked immediately after a component is mounted.
	*/
	componentDidMount(){
		console.log("Inside Home")
	}


	/** 
	* @function getDataFronFB 
	* @description It is invoked to findout whether logged in user is administrator or not. If user is administrator then @function getAllDatawill be called
	* else @function getUserDetails will be called.
	*/
	getDataFronFB(){
		axios.get('https://graph.facebook.com/109913519652487?fields=id,name,roles&access_token=109913519652487|HqVfj4rqdVEX7hMMdvEwkbhnSW0')
			.then(function (response) {
		    	for( let i of response.data.roles.data){
		    		if(i.role == "administrators" && i.user == sessionStorage.getItem("userId")){
		    			newThis.setState({role : "administrators"})
		    			newThis.getAllData();
		    		} else{
						newThis.getUserDetails(sessionStorage.getItem('userId'));
		    		}
		    	}
		  	})
		  	.catch(function (error) {
		    	newThis.getUserDetails(sessionStorage.getItem('userId'));
		  	});		
	}


	/** 
	* @function getAllData 
	* @description It fetches all the data from lokijs. Invoked if user is administrator.
	*/
	getAllData(){
		axios.get("https://fathomless-forest-12618.herokuapp.com/apis/v1.1/getalluseractivity")
		.then(function (response) {
			newThis.setState({ products : response.data.data})
			let currentEpoch = new Date().getTime();
			let recentActivity = [], previousActivity = [];
	    	for(let i of response.data.data){
	    		let epochDiff = currentEpoch - i.createdAt;
	    		if(epochDiff < 86400000){
	    			recentActivity.push(i);
	    		} else{
	    			previousActivity.push(i)
	    		}
	    	}
    		newThis.setState({ recentActivity : recentActivity, previousActivity : previousActivity})
		})
		.catch(function (error) {
			console.log(error);
			alert("Sorry! Something went wrong. Please try Again.");
		});
	}


	/**
	* @function getUserDetails
	* @param {String} userId
	* @description It fetches all user specific data from lokijs based on lokijs. Invoked if user is not an administrator.
	*/
	getUserDetails(userId){
		axios.get("https://fathomless-forest-12618.herokuapp.com/apis/v1.1/getuseractivity/"+ userId)
		.then(function (response) {
			newThis.setState({ products : response.data.data})
			let currentEpoch=new Date().getTime();
			let recentActivity=[], previousActivity=[];
	    	for(let i of response.data.data){
	    		let epochDiff=(currentEpoch - i.createdAt);
	    		if(epochDiff <= 86400000){
	    			recentActivity.push(i);
	    		} else{
	    			previousActivity.push(i)
	    		}
	    	}
    		newThis.setState({ recentActivity : recentActivity, previousActivity : previousActivity})
		})
		.catch(function (error) {
			console.log(error);
			alert("Sorry! Something went wrong. Please try Again.");
		});
	}


	/**
	* @function updateUserDetails
	* @param {Object} data - JSON object containing old data and updated data.
	* @description Invoked when user updates any activity.
	*/
	updateUserDetails(data){
		data.oldActivity=this.state.oldActivity;
		data.oldStartTime=Number(this.state.oldStartTime);
		data.oldEndTime=Number(this.state.oldEndTime);
		data.startTime= moment(data.startTime).valueOf();
		data.endTime=moment(data.endTime).valueOf();
		axios.post('https://fathomless-forest-12618.herokuapp.com/apis/v1.1/updateuseractivity', data)
		.then(function (response) {
	    	newThis.setState({ products : response.data.data });
	    	let currentEpoch=new Date().getTime();
	    	let recentActivity=[], previousActivity=[];
	    	for(let i of response.data.data){
	    		let epochDiff=(currentEpoch - i.createdAt);
	    		if(epochDiff <= 86400000){
	    			recentActivity.push(i);
	    		} else{
	    			previousActivity.push(i)
	    		}
	    	}
    		newThis.setState({ recentActivity : recentActivity, previousActivity : previousActivity})
	  	})
	  	.catch(function (error) {
	    	console.log(error);
	    	alert("Sorry! Something went wrong. Please try Again.");
	  	});
	}


	/**
	* @function addUserActivity
	* @description Invoked when user adds an activity.
	*/
	addUserActivity(){
		let activity=document.getElementById('activity').value;
		let startTime=document.getElementById('startTime').value;
		let endTime=document.getElementById('endTime').value;
		startTime = moment(startTime).valueOf();
		endTime = moment(endTime).valueOf();
		if( Number(startTime) > Number(endTime)){
			alert("End time should be greater than start time")
			return
		}

		if(moment(startTime).isValid() && moment(endTime).isValid() && activity.length !== 0){
			let payload={
				userId : sessionStorage.getItem("userId"),
				id : u.uuid(),
				startTime : startTime,
				endTime : endTime,
				activity : activity,
				createdAt : new Date().getTime()
			}

			axios.post('https://fathomless-forest-12618.herokuapp.com/apis/v1.1/adduseractivity', payload)
			.then(function (response) {
		    	if(response.data.code===200){
					newThis.refs.addData.hide();
					alert("New Activity added")
					if(newThis.state.role.toLowerCase()==="administrators"){
						newThis.getAllData();
					} else{
						newThis.getUserDetails(sessionStorage.getItem('userId'));
					}
		    	}
		  	})
		  	.catch(function (error) {
		    	console.log(error);
		    	alert("Sorry! Something went wrong. Please try Again.");
		  	});		
		} else if(activity.length === 0){
			alert("Activity cannot be empty.");
		}else{
			alert("Date or Time is not selected");
		}
	}


	render(){
		function onAfterSaveCell(row, cellName, cellValue) {
		  	let rowStr={};
		  	for (const prop in row) {		  		
		    	rowStr[prop]=row[prop];
		  	}
		  	newThis.updateUserDetails(rowStr);		  
		}

		function onBeforeSaveCell(row, cellName, cellValue) {
			let rowStr={};
		  	for (const prop in row) {
		    	rowStr[prop]=row[prop];
		  	}
		  	newThis.setState({oldActivity : row.activity, oldStartTime : row.startTime, oldEndTime : row.endTime})
		  	newThis.setState({previousData : rowStr});
		}

		const cellEditProp = {
			mode: 'click',
			blurToSave: true,
			beforeSaveCell: onBeforeSaveCell, // a hook for before saving cell
			afterSaveCell: onAfterSaveCell  // a hook for after saving cell
		};



		// converts epoch value to date.
		function epochToDate(cell, row){
			cell = Number(cell);
			return moment(cell).format('MMMM Do YYYY, h:mm:ss a');
		}

		return(
			<div>
					<br />
					<br />
				  	<center><h4 style={{fontSize:"250%", fontStyle: 'oblique', fontFamily : 'cursive', fontWeight : 1000, color : "#FFFFFF"}}>Recent Activities</h4></center>
				  	<div id="addButton" style={{float : 'right', marginBottom : "2%"}}>
				  		<button onClick={() => this.refs.addData.show()} style={{ backgroundColor : "#3B5998" , fontSize : 16, padding : 2, height: 40, width : 100, borderRadius: 4, color : "#FFFFFF", border: '#000000 0px solid', float : 'right'}}>Add</button>
				  		<br />
				  	</div>
					<BootstrapTable data={this.state.recentActivity} hover cellEdit={ cellEditProp } pagination={true}
					tableStyle={ { border: '#000000 0px solid' } }
			        headerStyle={ { border: '#000000 1px solid', backgroundColor : "#CAC1C1" } }
					bodyStyle={ { border: '#000000 1px solid', backgroundColor : '#E8E6E6' } }>
					    <TableHeaderColumn dataField='userId' dataAlign="center" width="180" filter={{ type: 'TextFilter', placeholder: "Search..." }}>user ID</TableHeaderColumn>
					    <TableHeaderColumn dataField='startTime' dataAlign="center" dataFormat={ epochToDate } editable={{ type : 'datetime' }}>Start Time</TableHeaderColumn>
					    <TableHeaderColumn dataField='endTime' dataAlign="center" dataFormat={ epochToDate } editable={{ type : 'datetime' }}>End Time</TableHeaderColumn>
					    <TableHeaderColumn dataField='activity' dataAlign="center" filter={{ type: 'TextFilter', placeholder: "Search..."}}>Activity</TableHeaderColumn>
				      	<TableHeaderColumn dataField='createdAt' dataAlign="center" isKey={true} dataFormat={ epochToDate } editable={false}>Created At</TableHeaderColumn>
					</BootstrapTable>
					<br/>
					<br/>
					<center><h4 style={{fontSize:"250%", fontStyle: 'oblique', fontFamily : 'cursive', fontWeight : 1000, color : "#FFFFFF"}}>Previous Activities</h4></center>
					<br/>
					<BootstrapTable data={this.state.previousActivity} striped hover pagination={true}
					tableStyle={ { border: '#000000 0px solid' } }
			        headerStyle={ { border: '#000000 1px solid', backgroundColor : "#CAC1C1" } }
					bodyStyle={ { border: '#000000 1px solid', backgroundColor : '#E8E6E6' } }>
					   <TableHeaderColumn dataField='userId' dataAlign="center" width="180" filter={{ type: 'TextFilter', placeholder: "Search..." }}>user ID</TableHeaderColumn>
					    <TableHeaderColumn dataField='startTime' dataAlign="center" dataFormat={ epochToDate } editable={{ type : 'datetime' }}>Start Time</TableHeaderColumn>
					    <TableHeaderColumn dataField='endTime' dataAlign="center" dataFormat={ epochToDate } editable={{ type : 'datetime' }}>End Time</TableHeaderColumn>
					    <TableHeaderColumn dataField='activity' dataAlign="center" filter={{ type: 'TextFilter', placeholder: "Search..."}}>Activity</TableHeaderColumn>
				      	<TableHeaderColumn dataField='createdAt' dataAlign="center" isKey={true} dataFormat={ epochToDate }>Created At</TableHeaderColumn>
					</BootstrapTable>

			        <SkyLight hideOnOverlayClicked ref="addData">
			        	<div>
				        	<center>
				        		<h4 style={{fontStyle: 'oblique', fontFamily : 'cursive', fontWeight : 100, color : "#FF6347"}}>Add New Activity</h4>
				        	</center>
				        	<br/>
				        	<br/>
			        	</div>
			            <center>
			            <div>
			            	<label style={{padding : '4%'}}>startTime</label>
			            	<input id="startTime" type="datetime-local" required></input>
			            	<br/>
			            	<label style={{padding : '4%'}}>endTime</label>
			            	<input id="endTime" type="datetime-local" required></input>
			            	<br/>
			            	<label style={{padding : '4%'}}>Activity</label>
			            	<input id="activity" type="text" required></input>
			            	<br/>
			            </div>
			            <div>
			            	<button id="addactivity" type="submit"  style={{ backgroundColor : "#3B5998" , fontSize : 16, padding : 2, height: 40, width : 100, borderRadius: 4, color : "#FFFFFF", border: '#000000 0px solid'}}onClick={ () => this.addUserActivity() }>Submit</button>
			            </div>
			            </center>
			        </SkyLight>
			</div>	
		)
	}
}