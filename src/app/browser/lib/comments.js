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
      return {post: {title: "", author: "", body: "", link: ""}, comments: []}
    },

    componentDidMount () {
      console.log("Console mounted")
      var postID = this.props.params.postID
      this.serverRequest = request('/api/post/'+ postID + '/comments/', function (er, response, body) {
        var body = JSON.parse(body)
        console.log(body.post)
        console.log(body.comments)

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

      var commentElement = function(comment){
        return (
          <li key= {comment._id}>
            <Paper style={{marginBottom: 10, display: 'flex', alignItems: 'center'}}>
              <Vote value={10} ID={comment._id} />
              <div style={{padding: 0, paddingRight:16, flex: 1, minWidth: 0}}>
                <ReactMarkdown source={comment.body}/>
              </div>
            </Paper>
          </li>
        )
      }
      var post = this.state.post
      var linkOrText = () => {
        console.log(post.link)
        if (post.link === "" || post.link === undefined){
          return (<span style={{ display: 'flex', minHeight: 36, fontSize: 18, lineHeight: 22 + 'px', margin: 0, padding: 16, paddingLeft: 0, alignItems: 'center'}}>{post.title}</span>)
        }else{
          return (<a href={post.link} style={{display: 'flex', minHeight: 36, fontSize: 18, lineHeight: 22 + 'px', margin: 0, padding: 16, paddingLeft: 0, alignItems: 'center', textDecoration: 'none'}}>{post.title}</a>)

        }
      }

      return (
        <div style={{margin: 1.66 + '%'}}>
          <Card >
            <div style={{display: 'flex', alignItems: 'center'}}>
              <Vote value={345} ID={this.props.params.postID} />
              <div style={{padding: 0, paddingRight:16, flex: 1, minWidth: 0, fontSize: 18}}>
                {linkOrText()}
              </div>
            </div>
            <Divider />
            <div style={{padding: 0, paddingRight:16, paddingBottom: 1, marginLeft: 68, minHeight: 16}}>
              <ReactMarkdown source={this.state.post.body} />
            </div>
          </Card>
          <CreateComment postID={this.props.params.postID}/>
          <ul style={ulStyle} >{this.state.comments.map(commentElement.bind(this))}</ul>
        </div>
      )
    }
  })

})
