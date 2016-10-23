import React from 'react'
import {Card, CardTitle, CardText, CardActions} from 'material-ui/Card'
import Divider from 'material-ui/Divider'
import AppBar from 'material-ui/AppBar'
import FloatingActionButton from 'material-ui/FloatingActionButton'
// import { Router, Route, Link, browserHistory } from 'react-router'
import ContentAdd from 'material-ui/svg-icons/content/add';
import request from 'browser-request'
import FlatButton from 'material-ui/FlatButton'
import FontAwesome from 'react-fontawesome';
import {Tabs, Tab} from 'material-ui/Tabs';

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


Yavanna.provide('PostList', ({Login, Post, AnonyBar}) => {

  return React.createClass({

    getInitialState: function() {
      var tab = JSON.parse(localStorage.getItem('tab'));
      if (tab === null){
        tab = 'hot'
      }
      return {posts: [], open: true, tab: tab}
    },

    getLocation: function(func) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(func, this.noLocation, {maximumAge: 100, enableHighAccuracy: true, timeout: 10000})
        } else {
            console.log("Geolocation is not supported by this browser.")
            alert("Couldn't get location. Make sure your browser supports it and you've given the site permission")
            this.setState({long: null, lat: null})
        }
    },

    noLocation: function(err) {
      console.log(err.message)
      if (err.code == 2) {
        alert("Network location provider not responding")
      }else {
        console.log(err.message)
        alert(err.message)
      }
    },

    componentWillMount(){
      this.props.route.setPathname(window.location.pathname)
      this.getLocation(this.setPosition)
    },

    setPosition(position){
      var long = position.coords.longitude
      var lat = position.coords.latitude
      this.setState({long: long, lat: lat})
      this.getPosts(this.state.tab)
    },


    getPosts(tab){
      var long = this.state.long
      var lat = this.state.lat
      console.log(tab)
      console.log("Called getPosts")
      // this.setState({long: long, lat: lat})
      var query = '/api/posts/?long='+long+'&lat='+lat+'&sort='+tab
      console.log(query)
      this.serverRequest = request(query,  function (err, res, body) {
        if(res.status == 0){
          alert("Sorry. The server could not be reached")
        }else if(body.err){
          alert(body.err);
        }else if (err){
          alert("Unknown Error. Something's not right. Our bad, maybe. We don't really have a clue.")
        }else{
          var post_list = JSON.parse(body, dateReviver)
          console.log(post_list)
          if(!_.isEmpty(post_list)){
            this.setState({
              posts: post_list
            });
          }
        }
      }.bind(this));
    },

    componentWillUnmount: function() {
      this.serverRequest.abort();
    },

    viewComments(id) {
      console.log("view comments " +id)
      this.props.history.push('comments/' + id)
    },

    addPost () {
      console.log(this.props.route.loggedIn())
      if (this.props.route.loggedIn()) {
        console.log("Logged in!")
        this.props.history.push('/new')
      }else{
        console.log("Not logged in")
        this.props.history.push('/login')
      }
    },

    saveTab(value){
      localStorage.setItem('tab', JSON.stringify(value));
    },

    handleChange(value){
      console.log(value)
      this.setState({tab: value})
      this.getPosts(value)
      this.saveTab(value)
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
      console.log('re-rendering post list compoinent ===============', this.props.route.loggedIn())
      var createPost = function (post) {
        return (
          <li key= {post._id} style={{ marginTop: 10 }} >
            <Post post={post} loggedIn={this.props.route.loggedIn()}/>
          </li>
        )
      }
      let posts = this.state.posts
      if (posts.length === 0) {
        posts = [{title: "There are no posts in your area. Be the first to post here!", body: "No one has posted within 1km of you. Sorry if you feel lonely. We all do sometimes.", _id: 1, netVotes: 1000 }]
        // return <p>There are no posts here</p>
      }
      if (this.state.long === undefined){
        return <p> getting location....</p>
      }
      if (this.state.long === null){
        return <p> Could not find location</p>
      }
      return (
          <div>
            <Tabs value={this.state.tab} onChange={this.handleChange} tabItemContainerStyle={{backgroundColor: 'black'}} inkBarStyle={{backgroundColor: 'white'}} >
              <Tab label="Hot" value="hot" >
                <ul style={ulStyle} >{posts.map(createPost.bind(this))}</ul>
              </Tab>
              <Tab label="new" value="new" >
                <ul style={ulStyle} >{posts.map(createPost.bind(this))}</ul>
              </Tab>
              <Tab label="top" value="top" >
                <ul style={ulStyle} >{posts.map(createPost.bind(this))}</ul>
              </Tab>
              <Tab label="closest" value="closest" >
                <ul style={ulStyle} >{posts.map(createPost.bind(this))}</ul>
              </Tab>
            </Tabs>
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
