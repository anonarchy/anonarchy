import React from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import request from 'browser-request'
// import {browserHistory} from 'react-router'

Yavanna.provide('Login', ({messageBus, AnonyBar}) => {

  return React.createClass({
//            floatingLabelFixed={true}
    getInitialState: function() {
      console.log('login!!!!!!!')
      return {username: "", password: ""}
    },

    componentWillMount(){
      console.log("Trying to set new pathname for login")
      this.props.route.setPathname(window.location.pathname)
    },

    onResponse(err, res, body){
      console.log(err)
      console.log(body)
      console.log(res)
      if(res.status == 0){
        alert("Sorry. The server could not be reached")
        return null
      }
      if(body.err){
          alert(body.err);
          return null
          // throw err;
      }
      if (err){
        alert("Unknown Error. Something's not right. Our bad, maybe. We don't really have a clue.")
        return null
      }
      console.log('about to log in: history.length = ', this.props.history.length)
      messageBus.send('login')
      if (this.props.route.prev !== window.location.pathname){
        console.log("Previous location", this.props.route.prev)
        this.props.history.goBack()
      }else{
        this.props.history.push('/')
        // browserHistory.push('/') //Find some way to goBack unless navigated directly, the go to home page.
      }
    },

    submit(){
      console.log(this.state.username)
      request({method:'POST', url:'/api/login', json:{username: this.state.username, password: this.state.password}}, this.onResponse)
    },

    cancel(){
      if (this.props.route.prev !== window.location.pathname){
        console.log("Previous location", this.props.route.prev)
        this.props.history.goBack()
      }else{
        this.props.history.push('/')
        // browserHistory.push('/') //Find some way to goBack unless navigated directly, the go to home page.
      }
    },

    updateUsername(event, value){
      this.setState({username: value })
    },

    updatePassword(event, value){
      this.setState({password: value })
    },

    isValid(){
      if (this.state.username === "" || this.state.password === ""){
        return true
      }
      return false

    },

    signup(){
      this.props.history.push('/signup')
    },

    render() {
      return (

        <div style={{textAlign: 'center', width: 100+ '%',height: 100 + '%' }}>
          <div style={{marginTop: 100}}>
            <TextField
              hintText="Username"
              autoFocus={true}
              floatingLabelFixed={true}
              floatingLabelText="Username"
              // fullWidth={true}
              onChange={this.updateUsername}
             />
            <br />
            <TextField
              hintText="Password"
              floatingLabelFixed={true}
              floatingLabelText="Password"
              type="password"
              onChange={this.updatePassword}
            />
            <br />
            <p style={{fontSize: 12, fontFamily: 'roboto,sans-serif'}}>{"Don't have an account?"} <a style={{color: 'blue'}} onTouchTap={this.signup}> Sign up! </a></p>
            <FlatButton
              label="Cancel"
              primary={true}
              onTouchTap={this.cancel}
            />
            <FlatButton
              label="Submit"
              primary={true}
              disabled={this.isValid()}
              onTouchTap={this.submit}
            />
          </div>
        </div>

      )
    }

  })
})
