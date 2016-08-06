import React from 'react'
import request from 'browser-request'
import _ from 'underscore'
// var upvote = require('./upvote.png')

var upVoted = {
  height: 20,
  display: 'block',
  margin: 'auto',
  opacity: 1
}
var downVoted = _.clone(upVoted)
downVoted.paddingBottom = 5
upVoted.paddingTop = 5
var notUpVoted = _.clone(upVoted)
notUpVoted.opacity = 0.5
var notDownVoted = _.clone(downVoted)
notDownVoted.opacity = 0.5


Yavanna.provide('Vote', () => {

  return React.createClass({
//            floatingLabelFixed={true}
    getInitialState: function() {
      return {voteTotal: this.props.value, vote: null}
    },

    onResponse(err, res, body){
      if(err){
          console.log(body)
          console.log(res.body)
          console.log(res)
          return
          // throw err;
      }
      this.props.handleClose()
    },

    submit(){
      console.log(this.state.username)
      request({method:'POST', url:'/api/login', json:{username: this.state.username, password: this.state.password}}, this.onResponse)
    },

    updateVoteTotal(event, value){
      var voteTotal = this.state.voteTotal + value
      this.setState({voteTotal: voteTotal })
    },

    render() {

      return (
        <div style={{width: 68, height: 68, flexShrink: 0}}>
          <img src='https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-arrow-up-b-128.png' style={(this.state.vote === 1 ? upVoted : notUpVoted)} />
          <p style={{fontSize: 16, textAlign: 'center', marginTop: 1, marginBottom: 1}}> {this.state.voteTotal} </p>
          <img src='https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-arrow-down-b-128.png' style={(this.state.vote === 0 ? downVoted : notDownVoted)} />
        </div>
      )
    }

  })
})
