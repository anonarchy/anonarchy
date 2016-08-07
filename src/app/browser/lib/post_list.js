import React from 'react'
import {Card, CardTitle, CardText, CardActions} from 'material-ui/Card'
import Divider from 'material-ui/Divider'
import AppBar from 'material-ui/AppBar'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import { Router, Route, Link, browserHistory } from 'react-router'
import ContentAdd from 'material-ui/svg-icons/content/add';
import request from 'browser-request'
import FlatButton from 'material-ui/FlatButton'
import FontAwesome from 'react-fontawesome';

var _ = require('underscore')

var posts = [{title: 'Oh baby', body: 'Food is nice', author: 'ILikeFood'}, {title: 'Suck it', body: 'ILikeFood is a dumbdumb!', author: 'Trollolol'}]

var ulStyle = {
  listStyle: 'none',
  margin: 'auto',
  width: 96.77 + '%',
  padding: 0
}

function dateReviver(key, value) {
  if (typeof value === 'string') {
    var a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
    if (a) {
      return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
    }
  }
  return value;
};

function getLocation(func) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(func, function(){}, {maximumAge: 100, enableHighAccuracy: true})
    } else {
        console.log("Geolocation is not supported by this browser.")
    }
}

Yavanna.provide('PostList', ({Login, Vote}) => {

  return React.createClass({

    getInitialState: function() {

      return {posts: [], open: true}
    },

    componentDidMount: function() {
      getLocation(this.getPosts)
    },


    getPosts(position){
      var long = position.coords.longitude
      var lat = position.coords.latitude
      this.setState({long: long, lat: lat})
      this.serverRequest = request('/api/posts/?long='+long+'&lat='+lat,  function (er, response, body) {
        var post_list = JSON.parse(body, dateReviver)
        console.log(post_list)
        if(!_.isEmpty(post_list)){
          this.setState({
            posts: post_list
          });
        }
      }.bind(this));
    },

    componentWillUnmount: function() {
      this.serverRequest.abort();
    },

    viewComments(id) {
      console.log("view comments " +id)
      browserHistory.push('comments/' + id)
    },

    addPost () {
      browserHistory.push('/new')
    },
    // <FontAwesome name='rocket' style={{margin: 0, marginRight: 6, cursor: 'pointer', display: 'inline-block'}} onTouchTap={()=> this.viewComments(post._id)}/>

//            <Card onTouchTap={() => this.viewComments(post._id)}>
// <CardActions>
//   <button label="Comments" style={{float: 'right', position: 'relative'}}/>
// </CardActions>
    // propTypes: {posts: React.PropTypes.array.isRequired},
    //                   style={{paddingLeft: 0, marginLeft: 0}}
//                   actAsExpander={post.body !== ""}

    render () {
      var createPost = function (post) {
        return (
          <li key= {post._id} style={{ marginTop: 10 }} >
            <Card>
              <div style={{display: 'flex'}}>
                <Vote value={1345} />
                <CardTitle
                  style={{display: 'table', height: 36, paddingLeft: 0}}
                  actAsExpander={post.body !== ""}
                  title={post.title}
                  titleStyle={{fontSize: 18, lineHeight: 22 + 'px', margin: 0, padding: 0, display: 'table-cell', verticalAlign: 'middle'}}
                />
              </div>
              <Divider />
              <CardText expandable={true}>
                {post.body}
              </CardText>
              <Divider />
                <div>
                  <span className={"icon-plus-square-o"} style={{fontSize: 18, marginLeft: 68, fontFamily: 'Times New Roman', lineHeight: 1, height: 18}}/>
                  <div style={{margin: 0, cursor: 'pointer', display: 'inline-block', fontSize: 12, textTransform: 'uppercase', padding:8}} onTouchTap={()=> this.viewComments(post._id)}>
                    Comments
                  </div>
                </div>
            </Card>
          </li>
        )
      }
      if (posts.length === 0) {
        return <p>There are no posts here</p>
      }
      if (this.state.long === undefined){
        return <p> getting location....</p>
      }
      return (
          <div>
            <ul style={ulStyle} >{this.state.posts.map(createPost.bind(this))}</ul>
            <FloatingActionButton style={{position: 'fixed', right: 24, bottom: 24}}
              onTouchTap={this.addPost}
            >
              <ContentAdd />
            </FloatingActionButton>
          </div>

      )
    }
  })
})
