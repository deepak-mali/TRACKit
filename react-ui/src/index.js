/**
 * @param {string} title - index.js.
 * @param {string} author - Deepak Mali.
 * @description Landing page - React Component, renders as landing page and all the routes are defined in it.
 */


import React from 'react';
import {render} from 'react-dom';
import Home from './home.js';
// import Login from './login.js';
import { Router, Route, Link, browserHistory, hashHistory, IndexRoute  } from 'react-router';
export default class Index extends React.Component {

	constructor(){
		super();
		console.log("inside construtor")
		this.state={
			navBarContent : []
		}
	}

	/**
	* @function componentDidMount
	* @description It is invoked immediately after a component is mounted.
	*/
	componentDidMount() {
		console.log("inside componentDidMount of index.js")
	}

	render(){
		return(
			<div>
				<div id="name">
              		<br />
              		<br />	
              		<div>
						<center><h1 style={{fontSize:"700%", fontStyle: 'bold', fontFamily : 'cursive', fontWeight : 10000, marginTop : '15%', color : "#FFFFFF"}}>TRACKit</h1></center>
						<center><h6 style={{fontSize:"150%", fontStyle: 'normal', fontFamily : 'sarif', fontWeight : 10, color: "#FFFFFF"}}>Time tracking that WORKS</h6></center>
						<center><h4 style={{fontSize:"150%", fontStyle: 'normal', fontFamily : 'sarif', fontWeight : 10, color: "#FFFFFF"}}>keep track of what you are doing</h4></center>
					</div>
				</div>
				
				{this.props.children}
			</div>
		)
	}
}

render((
	<Router history = {browserHistory}>
		<div>
			<Route path = "/" component = {Index} />
			<Route path = "/home" component = {Home} />
		</div>
	</Router>
), document.getElementById('root'));