import React from 'react'
import request from 'browser-request'

Yavanna.provide('Comments', () => {

  return React.createClass({

// export default class Comments extends React.Component {
    getInitialState () {
      return {post: null, comments: null}
    },

    componentDidMount () {
      console.log("Console mounted")
      var postID = this.props.params.postID
      this.serverRequest = request('/post/'+ postID, function (er, response, body) {
        var body = JSON.parse(body)
        console.log(body.post)
        this.setState({
          post: body.post,
          comments: body.comments
        });
      }.bind(this));
    },

    componentWillUnmount () {
      this.serverRequest.abort();
    },

    render () {
      console.log(this.props.params.postID)

      return (
        <div>
          <p>postID: {this.props.params.postID}!</p>
          <p>{JSON.stringify(this.state.post)}</p>
          <p>{JSON.stringify(this.state.comments)}</p>
        </div>
      )
    }
  })

})
