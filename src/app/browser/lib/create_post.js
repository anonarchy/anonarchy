import React from 'react'
import ReactDOM from 'react-dom'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
// import {browserHistory} from 'react-router'
import request from 'browser-request'
import Recaptcha from 'react-gcaptcha'



var watchID

function watchLocation(func) {
    console.log('watchLocation')
    if (navigator.geolocation) {
        watchID = navigator.geolocation.watchPosition(func, noLocation, {maximumAge: 0, enableHighAccuracy: true})
    } else {
        console.log("Geolocation is not supported by this browser.")
        alert("Couldn't get location. Make sure your browser supports it and you've given the site permission")
    }
}

function noLocation(err) {
  console.log(err.message)
  if (err.code == 2) {
    alert("Network location provider not responding")
  }else {
    console.log(err.message)
    alert(err.message)
  }
}


function getLocation(func) {
    console.log("getting location")
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(func, noLocation, {enableHighAccuracy: true, maximumAge: 100})
    } else {
        console.log("Geolocation is not supported by this browser.")
        alert("Couldn't get location. Make sure your browser supports it and you've given the site permission")
    }
}

Yavanna.provide('CreatePost', ({AnonyBar}) => {

  return React.createClass({

    getInitialState(){

      return {postTitle: "", author:"", body: "", link:"", long: null, lat: null}
    },

    componentWillMount(){
      this.props.route.setPathname(window.location.pathname)
    },

    componentDidMount(){
      // getLocation(this.setCoordinates)

      watchLocation(this.setCoordinates)
    },

    componentWillUnmount(){
      navigator.geolocation.clearWatch(watchID)
      getLocation(function(){})
    },

    checkLogin(){
      if (!this.props.route.loggedIn()){
        let con = confirm("You need to be logged in to create a post!")
        if (con == true){
          this.props.history.push('/login')
        }else{
          this.props.history.push('/')
        }
      }
    },

    setCoordinates(position){
      console.log("setting coordinates")
      this.setState({long: position.coords.longitude, lat: position.coords.latitude})
    },

    submit(){
      console.log(this.state.postTitle)
      request({method:'POST', url:'/api/posts', json: {recaptcha: this.state.recaptcha, post: {title: this.state.postTitle, author: this.state.author, body: this.state.body, link: this.state.link, loc: {long: this.state.long, lat: this.state.lat}}}}, this.onResponse)
    },

    onResponse(err, response, body) {
      if(response.status == 0){
        alert("Sorry. The server could not be reached")
        return null
      }
      if(body.err){
          alert(body.err);
          return null
      }
      if (err){
        alert("Unknown Error. Something's not right. Our bad, maybe. We don't really have a clue.")
        return null
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
      this.props.history.push('/')
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

    recaptchaVerified(res){
      this.setState({human: true, recaptcha: res})
    },

    recaptchaExpired(){
      this.setState({human: false})
    },

    render () {
      this.checkLogin()
      return (
        <div style={{margin: 24 }}>
          <TextField
            autoFocus={true}
            ref="titleInput"
            floatingLabelText="Title"
            hintText="Required"
            multiLine={true}
            floatingLabelFixed={true}
            fullWidth={true}
            onChange={this.updateTitle}
          />
          <TextField
            floatingLabelText="Link"
            floatingLabelFixed={true}
            hintText="Optional"
            fullWidth={true}
            onChange={this.updateLink}
          />
          <TextField
             floatingLabelText="Text"
             multiLine={true}
             hintText="Optional"
             floatingLabelFixed={true}
             rows={4}
             fullWidth={true}
             onChange={this.updateText}
          />
          <Recaptcha
            sitekey="6LcZQAkUAAAAABnDYk8-sl2T-mU4ycGHg1LIBd4j"
            verifyCallback={this.recaptchaVerified}
            expiredCallback={this.recaptchaExpired}
          />
          <br/>
          <RaisedButton label="Submit" primary={true}
            disabled={this.state.postTitle === "" || !this.state.human}
            onTouchTap={this.submit}
          />
        </div>

      )
    }
  })
})
