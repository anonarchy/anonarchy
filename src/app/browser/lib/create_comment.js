import React from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import Paper from 'material-ui/Paper'
import {browserHistory} from 'react-router'
import request from 'browser-request'


Yavanna.provide('CreateComment', () => {

  return React.createClass({

    getInitialState(){
      return {body: ""}
    },

    submit(){
      var date = new Date()
      request({method:'POST', url:'/api/comment', json: {comment: {postID: this.props.postID, body: this.state.body}}}, this.onResponse)
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
          <RaisedButton label="Submit" primary={true} style={{marginTop: 10, marginBottom: 10}}
            onTouchTap={this.submit}
          />
          </div>
        </Paper>
      )
    }
  })
})
