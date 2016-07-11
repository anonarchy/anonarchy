import React from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import {browserHistory} from 'react-router'
import request from 'browser-request'

function on_response(er, response, body) {
  if(er){
    throw er
  }
  console.log(response)
}

Yavanna.provide('Post', () => {

  return React.createClass({

    getInitialState(){
      return {postTitle: "", author:"", body: ""}
    },

    submit(){
      console.log(this.state.postTitle)
      request({method:'POST', url:'/posts', json:{title: this.state.postTitle, author: this.state.author, body: this.state.body}}, on_response)
      browserHistory.push('/')
    },

    updateText(event, value){
      this.setState({postTitle: value})
    },

    render () {
      return (
        <div style={{margin: 24 }}>
          <TextField
             floatingLabelText="New Self Post"
             multiLine={true}
             floatingLabelFixed={true}
             rows={4}
             fullWidth={true}
             onChange={this.updateText}
           />
           <TextField
              floatingLabelText="Link"
              floatingLabelFixed={true}
              fullWidth={true}
            />
            <RaisedButton label="Submit" primary={true}
              onTouchTap={this.submit}
            />

          </div>


      )
    }
  })
})
