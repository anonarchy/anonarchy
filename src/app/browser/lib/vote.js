import React from 'react'
import request from 'browser-request'
import _ from 'underscore'
// var upvote = require('./upvote.png')
import {browserHistory} from 'react-router'

var upVoted = {
  fontSize: 20,
  height: 14,
  display: 'block',
  textAlign: 'center',
  cursor: 'pointer',
  opacity: 1
}
var downVoted = _.clone(upVoted)
downVoted.paddingBottom = 10.5
downVoted.marginTop= -2
upVoted.paddingTop = 7
upVoted.paddingBottom = 1
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
          voteTotal: this.props.voteTotal - body.userVote
        });
      }.bind(this));
    },

    componentWillReceiveProps(nextProps){
      if (this.props.voteTotal !== nextProps.voteTotal){
        let postID = this.props.ID
        this.serverRequest = request('/api/post/'+ postID + '/votes/', function (er, response, body) {
          body = JSON.parse(body)
          this.setState({
            vote: body.userVote,
            voteTotal: this.props.voteTotal - body.userVote
          });
        }.bind(this));
      }
    },

    onResponse(err, res, body){
      console.log(res)
      console.log(err)
      console.log(body)
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
    },

    castVote(value){
      if (this.props.loggedIn){
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
      }else{
        browserHistory.push("/login")
      }


    },

    render() {
      return (
        <div style={{width: 68, height: 52, flexShrink: 0, alignSelf: 'baseline'}}>
          <span className={"icon-upvote"} style={(this.state.vote === 1 ? upVoted : notUpVoted)}  onTouchTap={()=> this.castVote(1)} />
          <p style={{fontSize: 15, textAlign: 'center', marginTop: 0, marginBottom: 0}}> {this.state.voteTotal + this.state.vote} </p>
          <span className={"icon-downvote"} style={(this.state.vote === -1 ? downVoted : notDownVoted)} onTouchTap={()=> this.castVote(-1)} />
        </div>
      )
    }

  })
})
