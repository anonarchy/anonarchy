import React from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import Paper from 'material-ui/Paper'
import {browserHistory} from 'react-router'
import request from 'browser-request'
import Recaptcha from 'react-gcaptcha'


Yavanna.provide('CreateComment', () => {

  return React.createClass({

    getInitialState(){
      return {
        body: "",
        human: false,
        recaptcha: null
      }
    },

    submit(){
      var date = new Date()
      request({
        method:'POST',
        url:'/api/comment',
        json: {
          comment: {
            postID: this.props.postID,
            body: this.state.body
          },
          recaptcha: this.state.recaptcha
        }
      }, this.onResponse)
    },

    onResponse(err, response, body) {
      if(response.status == 0){
        alert("Sorry. The server could not be reached")
        return null
      }
      if(body.err){
          alert(body.err);
          return null
      }
      if (err){
        alert("Unknown Error. Something's not right. Our bad, maybe. We don't really have a clue.")
        return null
      }
      var comments = JSON.parse(localStorage.getItem('comments'));
      comments = comments === null ? {} : comments
      var ID = response.body.commentID
      comments[ID] = response.body.ownerToken
      localStorage.setItem('comments', JSON.stringify(comments));
      this.props.reload()
      this.setState({body: ""})
    },

    updateText(event, value){
      this.setState({body: value})
    },

    recaptchaVerified(res){
      this.setState({human: true, recaptcha: res})
    },

    recaptchaExpired(){
      this.setState({human: false})
    },

    render () {
      return (
        <Paper style={{marginTop: 10}}>
          <div style={{margin: 10}}>
            <TextField
              floatingLabelText="New Comment"
              multiLine={true}
              floatingLabelFixed={true}
              rows={4}
              value={this.state.body}
              fullWidth={true}
              onChange={this.updateText}
            />
            <div style={{display: 'block'}}>
              <Recaptcha
                sitekey="6LcZQAkUAAAAABnDYk8-sl2T-mU4ycGHg1LIBd4j"
                verifyCallback={this.recaptchaVerified}
                expiredCallback={this.recaptchaExpired}
              />
            </div>
            <RaisedButton label="Submit"
              disabled={this.state.body.replace(/\n/g,'').replace(/ /g,'') === '' || !this.state.human}
              primary={true}
              style={{marginTop: 10, marginBottom: 10}}
              onTouchTap={this.submit}
            />
          </div>
        </Paper>
      )
    }
  })
})
