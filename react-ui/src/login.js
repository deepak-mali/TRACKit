import React from 'react';
import FacebookLogin from 'react-facebook-login';

export default class Login extends React.Component {
  
  constructor(){
    super();
    console.log("inside construtor of login")
    
  }

  componentDidMount() {
    console.log("inside componentDidMount of login.js")
  }

  responseFacebook(response) {
    console.log("----------",response)
    // sessionStorage.setItem("status", response.status);
    // sessionStorage.setItem("userId",response.authResponse.userID);
    // console.log("status ", sessionStorage.getItem("status"))
    // console.log("userId ", sessionStorage.getItem("user"))
    // if(response.status == "connected"){
    //   console.log("inside success");
    //   window.location.href = 'https://fathomless-forest-12618.herokuapp.com/home';
    // } else {
    //   window.location.href = 'https://fathomless-forest-12618.herokuapp.com';
    // }
  }

  render() {
    return (
      <FacebookLogin
        appId="109913519652487"
        autoLoad={true}
        fields="name,email,picture"
        callback={this.responseFacebook}/>
    )
  }
}
