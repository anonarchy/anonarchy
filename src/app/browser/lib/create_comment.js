import React from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import Paper from 'material-ui/Paper'
import {browserHistory} from 'react-router'
import request from 'browser-request'

function on_response(er, response, body) {
  if(er){
    throw er
  }
  console.log(response)
  location.reload()
}

Yavanna.provide('CreateComment', () => {

  return React.createClass({

    getInitialState(){
      return {body: ""}
    },

    submit(){
      var date = new Date()
      request({method:'POST', url:'/api/comment', json: {comment: {postID: this.props.postID, body: this.state.body}}}, on_response)
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
