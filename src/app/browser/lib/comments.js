import React from 'react'
import request from 'browser-request'
import {Card, CardTitle, CardText} from 'material-ui/Card'
import Divider from 'material-ui/Divider'
import Paper from 'material-ui/Paper'
var ReactMarkdown = require('react-markdown');

var ulStyle = {
  listStyle: 'none',
  marginTop: 10,
  padding: 0
}


Yavanna.provide('Comments', ({CreateComment, Vote}) => {

  return React.createClass({

// export default class Comments extends React.Component {
    getInitialState () {
      return {post: {title: "", author: "", body: "", link: "", netVotes: null}, comments: []}
    },

    componentWillMount () {
      var postID = this.props.params.postID
      this.serverRequest = request('/api/post/'+ postID + '/comments/', function (err, res, body) {
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
      var commentElement = function(comment){
        return (
          <li key= {comment._id}>
            <Paper style={{marginBottom: 10, display: 'flex', alignItems: 'center'}}>
              <Vote voteTotal={comment.netVotes} ID={comment._id} loggedIn={this.props.route.loggedIn()} type="comment" />
              <div style={{padding: 0, paddingRight:16, flex: 1, minWidth: 0}}>
                <ReactMarkdown source={comment.body}/>
              </div>
            </Paper>
          </li>
        )
      }
      var post = this.state.post
      var linkOrText = () => {
        if (post.link === "" || post.link === undefined){
          return (<span style={{ display: 'flex', minHeight: 36, fontSize: 18, lineHeight: 22 + 'px', margin: 0, padding: 16, paddingLeft: 0, alignItems: 'center'}}>{post.title}</span>)
        }else{
          return (<a href={post.link} style={{display: 'flex', minHeight: 36, fontSize: 18, lineHeight: 22 + 'px', margin: 0, padding: 16, paddingLeft: 0, alignItems: 'center', textDecoration: 'none'}}>{post.title}</a>)

        }
      }
      if (this.state.post.netVotes === null){
        return null
      }else{
        return (
          <div style={{margin: 1.66 + '%'}}>
            <Card >
              <div style={{display: 'flex', alignItems: 'center'}}>
                <Vote voteTotal={this.state.post.netVotes} ID={this.props.params.postID} loggedIn={this.props.route.loggedIn()} type="post" />
                <div style={{padding: 0, paddingRight:16, flex: 1, minWidth: 0, fontSize: 18}}>
                  {linkOrText()}
                </div>
              </div>
              <Divider />
              <div style={{padding: 0, paddingRight:16, paddingBottom: 1, marginLeft: 68, minHeight: 16}}>
                <ReactMarkdown source={this.state.post.body} />
              </div>
            </Card>
            <CreateComment postID={this.props.params.postID} loggedIn={this.props.route.loggedIn()}/>
            <ul style={ulStyle} >{this.state.comments.map(commentElement.bind(this))}</ul>
          </div>
        )
      }
    }
  })

})
