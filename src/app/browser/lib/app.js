import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { Router, Route, Link, browserHistory } from 'react-router'
import AppBar from 'material-ui/AppBar'

console.log('in app')

Yavanna.provide('App', ({PostList, CreatePost, Comments}) => {
  return React.createClass({
    render: function () {
      return (
        <MuiThemeProvider>
          <div>
            <AppBar
              title="AnonyPost"
              style={{backgroundColor: 'black'}}
            />
            <Router history={browserHistory}>
              <Route path="/" component={PostList}/>
              <Route path="comments/:postID" component={Comments}/>
              <Route path="/new" component={CreatePost}/>
            </Router>
          </div>
        </MuiThemeProvider>

      )
    }
  })
})
