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

Yavanna.provide('CreatePost', () => {

  return React.createClass({

    getInitialState(){
      return {postTitle: "", author:"", body: ""}
    },

    submit(){
      console.log(this.state.postTitle)
      var date = new Date()
      request({method:'POST', url:'/api/posts', json:{title: this.state.postTitle, author: this.state.author, body: this.state.body, loc: {long: long, lat: lat}}}, on_response)
      browserHistory.push('/')
    },

    updateTitle(event, value){
      this.setState({postTitle: value})
    },

    updateText(event, value){
      this.setState({body: value})
    },

    render () {
      return (
        <div style={{margin: 24 }}>
          <TextField
             floatingLabelText="Title"
             multiLine={true}
             floatingLabelFixed={true}
             fullWidth={true}
             onChange={this.updateTitle}
           />
          <TextField
             floatingLabelText="Text"
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
