import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { Router, Route, Link, browserHistory } from 'react-router'
import AppBar from 'material-ui/AppBar'
import FlatButton from 'material-ui/FlatButton'
import IconMenu from 'material-ui/IconMenu';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import request from 'browser-request'
import cookies from 'browser-cookies'

var getCookies = function(){
  var pairs = document.cookie.split(";");
  var cookies = {};
  for (var i=0; i<pairs.length; i++){
    var pair = pairs[i].split("=");
    cookies[pair[0]] = unescape(pair[1]);
  }
  return cookies;
}

Yavanna.provide('App', ({PostList, CreatePost, Comments, Login, Signup, messageBus}) => {
  return React.createClass({
    getInitialState: function(){
      console.log("Cookie: ", cookies.get('session'))
      let loggedIn = !!cookies.get('session') //Call server, log in, return true if valid session token
      if (loggedIn){
        console.log("logged in!")
        request({method:'POST', url:'/api/verify', json: {}}, this.onResponse)
      }
      return {login: false, loggedIn: loggedIn, signup: false, open: false}
    },

    onResponse(err, res, body){
      if(err){
        console.log("Error: ", err)
        console.log(res)
        console.log(body)
        console.log("Not actually logged in")
        this.setState({loggedIn: false});
      }
    },

    componentWillMount() {
      console.log('app is booting; history.length = ', browserHistory)
      messageBus.subscribe('login', () => {
        console.log("Logged IN")
        this.setState({loggedIn: true})
      })

      messageBus.subscribe('logout', () => {
        this.setState({loggedIn: false})
      })
    },

    logout(){
      this.setState({loggedIn: false})
      cookies.erase('session')
      browserHistory.push('/login')
    },

    isLoggedIn(){
      return this.state.loggedIn
    },

    handleLoginOpen(){
      this.setState({login: true});
    },

    handleLoginClose(){
      this.setState({login: false});
    },

    handleSignupOpen(){
      this.setState({signup: true});
    },

    handleSignupClose(){
      this.setState({signup: false});
    },

    handleLeftButton(){
      this.setState({open: !this.state.open})
    },
    // menuStyle={{position: 'absolute', top: 30, right: 0}}
    // <Login open={this.state.login} handleClose={this.handleLoginClose}/>
    // <Signup open={this.state.signup} handleClose={this.handleSignupClose}/>
    render: function () {
      console.log('re-rendering app compoinent ===============', this.state.loggedIn)
      var getAppBar = function(loggedIn){
        if (!loggedIn){
          return (
            <AppBar
              title="AnonyPost"
              style={{backgroundColor: 'black', position: 'fixed'}}
              iconElementLeft={<div style={{width: 10}}/>}
              onLeftIconButtonTouchTap={this.handleLeftButton}
              iconElementRight={
                <IconMenu
                  iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                  anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                  targetOrigin={{horizontal: 'right', vertical: 'top'}}
                >
                  <MenuItem primaryText="Login" href= '/login'/>
                  <MenuItem primaryText="Sign Up" href = 'signup' />
                  <MenuItem primaryText="Contribute" href='https://github.com/anonypost/anonypost'/>
                  <MenuItem primaryText="Report Bug" href='https://github.com/anonypost/anonypost/issues' />
                </IconMenu>
                }
            />
          )
        }else{
          return (
            <AppBar
              title="AnonyPost"
              style={{backgroundColor: 'black', position: 'fixed'}}
              iconElementLeft={<div style={{width: 10}}/>}
              onLeftIconButtonTouchTap={this.handleLeftButton}
              iconElementRight={
                <IconMenu
                  iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                  anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                  targetOrigin={{horizontal: 'right', vertical: 'top'}}
                >
                  <MenuItem primaryText="Log Out" onTouchTap={this.logout} />
                  <MenuItem primaryText="Contribute" href='https://github.com/anonypost/anonypost'/>
                  <MenuItem primaryText="Report Bug" href='https://github.com/anonypost/anonypost/issues' />
                </IconMenu>
                }
            />
          )
        }

      }

      return (
        <MuiThemeProvider>
          <div>
            {getAppBar.bind(this)(this.state.loggedIn)}
            <div style={{height: 64}}/>
            <Router history={browserHistory}>
              <Route path="/" component={PostList} loggedIn={this.isLoggedIn}/>
              <Route path="comments/:postID" component={Comments} loggedIn={this.isLoggedIn}/>
              <Route path="/new" component={CreatePost} loggedIn={this.isLoggedIn}/>
              <Route path="/login" component={Login} prev={window.location.pathname}/>
              <Route path="/signup" component={Signup} prev={window.location.pathname}/>
            </Router>
          </div>
        </MuiThemeProvider>

      )
    }
  })
})
