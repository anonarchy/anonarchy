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
      return {vote: 0, voteTotal:this.props.voteTotal}
    },

    componentDidMount: function(){
      let postID = this.props.ID
      this.serverRequest = request('/api/post/'+ postID + '/votes/', function (er, response, body) {
        body = JSON.parse(body)
        this.setState({
          vote: body.userVote,
          voteTotal: this.state.voteTotal - body.userVote
        });
        console.log("Stuff: ", this.state.voteTotal, this.state.vote )
      }.bind(this));
    },

    componentWillUnmount () {
      this.serverRequest.abort();
    },

    onResponse(err, res, body){
      if(err){
          console.log(body)
          console.log(res.body)
          console.log(res)
          return
          // throw err;
      }
    },

    castVote(value){
      console.log("casting a vote")
      if (this.state.vote === 0){
        this.setState({vote: value})
        request({method:'POST', url:'/api/vote', json:{vote: {ID: this.props.ID, value: value, type: this.props.type}}}, this.onResponse)
      }else if (this.state.vote !== value){
        this.setState({vote: value})
        request({method:'POST', url:'/api/vote', json:{vote: {ID: this.props.ID, value: value, type: this.props.type}}}, this.onResponse)
      }else{
        this.setState({vote: 0})
        request({method:'DELETE', url:'/api/vote', json:{vote: {ID: this.props.ID, value: value, type: this.props.type}}}, this.onResponse)
      }
    },

    render() {

      return (
        <div style={{width: 68, height: 68, flexShrink: 0, alignSelf: 'baseline'}}>
          <span className={"icon-upvote"} style={(this.state.vote === 1 ? upVoted : notUpVoted)}  onTouchTap={()=> this.castVote(1)} />
          <p style={{fontSize: 15, textAlign: 'center', marginTop: 0, marginBottom: 0}}> {this.state.voteTotal + this.state.vote} </p>
          <span className={"icon-downvote"} style={(this.state.vote === -1 ? downVoted : notDownVoted)} onTouchTap={()=> this.castVote(-1)} />
        </div>
      )
    }

  })
})
