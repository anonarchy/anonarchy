import React from 'react'
import request from 'browser-request'
// var upvote = require('./upvote.png')

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
        <div style={{width: 68, height: 68}}>
          <img src='https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-arrow-up-b-128.png' style={{height: 20, paddingTop: 5, display: 'block', margin: 'auto'}} />
          <p style={{fontSize: 16, textAlign: 'center', marginTop: 1, marginBottom: 1}}> {this.state.voteTotal} </p>
          <img src='https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-arrow-down-b-128.png' style={{height: 20, paddingBottom: 5, display: 'block', margin: 'auto' }} />
        </div>
      )
    }

  })
})
