import React from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import {browserHistory} from 'react-router'
import request from 'browser-request'

function on_response(er, response, body) {
  if(er){
    throw er
  }
  console.log(response)
  var posts = JSON.parse(localStorage.getItem('posts'));
  posts = posts === null ? {} : posts
  console.log(response)
  var ID = response.body.postID
  console.log(ID)
  posts[ID] = response.body.ownerToken
  console.log(posts)
  localStorage.setItem('posts', JSON.stringify(posts));
}

var watchID

function watchLocation(func) {
    console.log('watchLocation')
    if (navigator.geolocation) {
        watchID = navigator.geolocation.watchPosition(func, function(){}, {maximumAge: 0, enableHighAccuracy: true})
    } else {
        console.log("Geolocation is not supported by this browser.")
    }
}


function getLocation(func) {
    console.log("getting location")
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(func, function(){}, {enableHighAccuracy: true, maximumAge: 100})
    } else {
        console.log("Geolocation is not supported by this browser.")
    }
}

Yavanna.provide('CreatePost', () => {

  return React.createClass({

    getInitialState(){
      return {postTitle: "", author:"", body: "", link:"", long: null, lat: null}
    },

    componentDidMount(){
      // getLocation(this.setCoordinates)
      watchLocation(this.setCoordinates)
    },

    componentWillUnmount(){
      navigator.geolocation.clearWatch(watchID)
      getLocation(function(){})
    },

    setCoordinates(position){
      console.log("setting coordinates")
      this.setState({long: position.coords.longitude, lat: position.coords.latitude})
    },

    submit(){
      console.log(this.state.postTitle)
      request({method:'POST', url:'/api/posts', json: {post: {title: this.state.postTitle, author: this.state.author, body: this.state.body, link: this.state.link, loc: {long: this.state.long, lat: this.state.lat}}}}, on_response)
      browserHistory.push('/')
    },

    updateTitle(event, value){
      this.setState({postTitle: value})
    },

    updateText(event, value){
      this.setState({body: value})
    },

    updateLink(event, value){
      this.setState({link: value})
    },

    render () {
      return (
        <div style={{margin: 24 }}>
          <TextField
             floatingLabelText="Title"
             multiLine={true}
             floatingLabelFixed={true}
             fullWidth={true}
             onChange={this.updateTitle}
          />
          <TextField
            floatingLabelText="Link"
            floatingLabelFixed={true}
            fullWidth={true}
            onChange={this.updateLink}
          />
          <TextField
             floatingLabelText="Text"
             multiLine={true}
             floatingLabelFixed={true}
             rows={4}
             fullWidth={true}
             onChange={this.updateText}
          />
            <RaisedButton label="Submit" primary={true}
              disabled={this.state.postTitle === ""}
              onTouchTap={this.submit}
            />
          </div>


      )
    }
  })
})
