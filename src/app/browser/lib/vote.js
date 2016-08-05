import React from 'react'
import request from 'browser-request'

Yavanna.provide('Vote', () => {

  return React.createClass({
//            floatingLabelFixed={true}
    getInitialState: function() {
      return {voteTotal: this.props.value}
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
        <div style={{width: 80}}>
          <img src={require('../assets/upvote.png')} style={{width: 80}} />
          {this.state.voteTotal}
          <img src={require('../assets/downvote.png')} style={{width: 80}} />
        </div>
      )
    }

  })
})
