import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { Router, Route, Link, browserHistory } from 'react-router'
import AppBar from 'material-ui/AppBar'
import FlatButton from 'material-ui/FlatButton'
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
console.log('in app')

Yavanna.provide('App', ({PostList, CreatePost, Comments, Login, Signup}) => {
  return React.createClass({
    getInitialState: function(){
      return {login: false, loggedIn: false, signup: false}
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
    // menuStyle={{position: 'absolute', top: 30, right: 0}}
    // <Login open={this.state.login} handleClose={this.handleLoginClose}/>
    // <Signup open={this.state.signup} handleClose={this.handleSignupClose}/>
    render: function () {
      var getAppBar = function(loggedIn){
        if (!loggedIn){
          return (
            <AppBar
              title="AnonyPost"
              style={{backgroundColor: 'black'}}
              iconElementRight={
                <IconMenu
                  iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                  anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                  targetOrigin={{horizontal: 'right', vertical: 'top'}}
                >
                  <MenuItem primaryText="Login" href= '/login'/>
                  <MenuItem primaryText="Sign Up" href='/signup' />
                  <MenuItem primaryText="Contribute" href='https://github.com/AlexLerman/anonypost-js'/>
                  <MenuItem primaryText="Report Bug" href='https://github.com/AlexLerman/anonypost-js/issues' />
                </IconMenu>
                }
            />
          )
        }else{
          return (
            <AppBar
              title="AnonyPost"
              style={{backgroundColor: 'black'}}
            />
          )
        }

      }

      return (
        <MuiThemeProvider>
          <div>
            {getAppBar.bind(this)(this.state.loggedIn)}
            <Router history={browserHistory}>
              <Route path="/" component={PostList}/>
              <Route path="comments/:postID" component={Comments}/>
              <Route path="/new" component={CreatePost}/>
              <Route path="/login" component={Login}/>
              <Route path="/signup" component={Signup}/>
            </Router>
          </div>
        </MuiThemeProvider>

      )
    }
  })
})
