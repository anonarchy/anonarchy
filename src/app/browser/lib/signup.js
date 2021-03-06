import React from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import request from 'browser-request'
// import {browserHistory} from 'react-router'
import Recaptcha from 'react-gcaptcha'

Yavanna.provide('Signup', ({messageBus}) => {

  return React.createClass({
//            floatingLabelFixed={true}
    getInitialState: function() {
      return {username: "", password: "", confirmedPassword: ""}
    },

    componentWillMount(){
      this.props.route.setPathname(window.location.pathname)
    },

    onResponse(err, res, body){
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
      messageBus.send('login')
      if (this.props.route.prev !== window.location.pathname){
        console.log("Previous location", this.props.route.prev)
        this.props.history.goBack()
      }else{
        this.props.history.push('/') //Find some way to goBack unless navigated directly, the go to home page.
      }
      // this.props.history.goBack()
    },

    submit(){
      request({method:'POST', url:'/api/signup', json:{username: this.state.username, password: this.state.password, recaptcha: this.state.recaptcha}}, this.onResponse)
    },

    cancel(){
      if (this.props.route.prev !== window.location.pathname){
        console.log("Previous location", this.props.route.prev)
        this.props.history.goBack()
      }else{
        this.props.history.push('/') //Find some way to goBack unless navigated directly, the go to home page.
      }
    },

    updateUsername(event, value){
      this.setState({username: value})
    },

    updatePassword(event, value){
      this.setState({password: value})
    },


    updateConfirmedPassword(event, value){
      this.setState({confirmedPassword: value})
    },


    isNotValid(){
      if (this.state.username === "" || this.state.password === "" || this.state.password !== this.state.confirmedPassword || ! this.state.human){
        return true
      }
      return false

    },

    recaptchaVerified(res){
      this.setState({human: true, recaptcha: res})
    },

    recaptchaExpired(){
      this.setState({human: false})
    },

    render() {
      return (
        <div style={{textAlign: 'center', width: 100+ '%',height: 100 + '%' }}>
          <div style={{marginTop: 100}}>
            <TextField
              autoFocus={true}
              hintText="Username"
              floatingLabelText="Username"
              // fullWidth={true}
              onChange={this.updateUsername}
             />
            <br />
            <TextField
              hintText="Password"
              floatingLabelText="Password"
              type="password"
              onChange={this.updatePassword}
            />
            <br />
            <TextField
              hintText="Confirm Password"
              floatingLabelText="Confirm Password"
              type="password"
              onChange={this.updateConfirmedPassword}
            />
            <br />
            <Recaptcha
              sitekey="6LcZQAkUAAAAABnDYk8-sl2T-mU4ycGHg1LIBd4j"
              verifyCallback={this.recaptchaVerified}
              expiredCallback={this.recaptchaExpired}
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
              disabled={this.isNotValid()}
              onTouchTap={this.submit}
            />
          </div>
        </div>

      )
    }

  })
})
