import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { Router, Route, Link, browserHistory } from 'react-router'
import AppBar from 'material-ui/AppBar'
import FlatButton from 'material-ui/FlatButton'
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

    render: function () {
      var getAppBar = function(loggedIn){
        if (!loggedIn){
          return (
            <AppBar
              title="AnonyPost"
              style={{backgroundColor: 'black'}}
              iconElementRight={
                <div>
                  <FlatButton label="Login" onTouchTap={this.handleLoginOpen} style={{color: 'white'}}/>
                  <FlatButton label="Sign up" onTouchTap={this.handleSignupOpen} style={{color: 'white'}}/>
                </div>
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
            </Router>
            <Login open={this.state.login} handleClose={this.handleLoginClose}/>
            <Signup open={this.state.signup} handleClose={this.handleSignupClose}/>
          </div>
        </MuiThemeProvider>

      )
    }
  })
})
