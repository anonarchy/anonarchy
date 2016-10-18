import React from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import request from 'browser-request'
import {browserHistory} from 'react-router'

Yavanna.provide('Login', ({messageBus}) => {

  return React.createClass({
//            floatingLabelFixed={true}
    getInitialState: function() {
      console.log('login!!!!!!!')
      return {username: "", password: ""}
    },

    onResponse(err, res, body){
      console.log(err)
      console.log(body)
      console.log(res.body)
      console.log(res)
      if(body.err){
          console.log(body)
          console.log(res.body)
          console.log(res)
          alert(body.err);
          return
          // throw err;
      }
      console.log('about to log in: history.length = ', browserHistory.length)
      messageBus.send('login')
      if (this.props.route.prev !== window.location.pathname){
        console.log("Previous location", this.props.route.prev)
        browserHistory.goBack()
      }else{
        browserHistory.push('/') //Find some way to goBack unless navigated directly, the go to home page.
      }

      // browserHistory.goBack()
    },

    submit(){
      console.log(this.state.username)
      request({method:'POST', url:'/api/login', json:{username: this.state.username, password: this.state.password}}, this.onResponse)
    },

    cancel(){
      if (this.props.route.prev !== window.location.pathname){
        console.log("Previous location", this.props.route.prev)
        browserHistory.goBack()
      }else{
        browserHistory.push('/') //Find some way to goBack unless navigated directly, the go to home page.
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

    render() {
      const actions = [
        <FlatButton
          label="Cancel"
          primary={true}
          onTouchTap={this.props.handleClose}
        />,
        <FlatButton
          label="Submit"
          primary={true}
          disabled={this.isValid()}
          onTouchTap={this.submit}
        />,
      ];

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
            <br />
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
