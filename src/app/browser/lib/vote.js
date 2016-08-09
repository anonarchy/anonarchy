import React from 'react'
import request from 'browser-request'
import _ from 'underscore'
// var upvote = require('./upvote.png')

var upVoted = {
  fontSize: 18,
  height: 14,
  display: 'block',
  textAlign: 'center',
  cursor: 'pointer',
  opacity: 1
}
var downVoted = _.clone(upVoted)
downVoted.paddingBottom = 10.5
downVoted.marginTop= -2
upVoted.paddingTop = 10.5
var notUpVoted = _.clone(upVoted)
notUpVoted.opacity = 0.4
var notDownVoted = _.clone(downVoted)
notDownVoted.opacity = 0.4


Yavanna.provide('Vote', () => {

  return React.createClass({
//            floatingLabelFixed={true}
    getInitialState: function() {
      return {voteTotal: this.props.value, vote: 0}
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


    castVote(value){
      if (this.state.vote === 0){
        this.setState({vote: value, voteTotal: this.state.voteTotal + value})
      }else if (this.state.vote !== value){
        this.setState({vote: value, voteTotal: this.state.voteTotal + value*2})
      }else{
        this.setState({vote: 0, voteTotal: this.state.voteTotal - value})
      }
      // request({method:'POST', url:'/api/vote', json:{username: this.state.username, password: this.state.password}}, this.onResponse)
    },

    updateVoteTotal(event, value){
      var voteTotal = this.state.voteTotal + value
      this.setState({voteTotal: voteTotal })
    },

    render() {

      return (
        <div style={{width: 68, height: 68, flexShrink: 0, alignSelf: 'baseline'}}> //alignSelf: baseline causes votes to stick to the top of the parent element
          <span className={"icon-upvote"} style={(this.state.vote === 1 ? upVoted : notUpVoted)}  onTouchTap={()=> this.castVote(1)} />
          <p style={{fontSize: 15, textAlign: 'center', marginTop: 0, marginBottom: 0}}> {this.state.voteTotal} </p>
          <span className={"icon-downvote"} style={(this.state.vote === -1 ? downVoted : notDownVoted)} onTouchTap={()=> this.castVote(-1)} />
        </div>
      )
    }

  })
})
