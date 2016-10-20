import React from 'react'
import { Router, Route, Link, browserHistory } from 'react-router'
import AppBar from 'material-ui/AppBar'
import FlatButton from 'material-ui/FlatButton'
import IconMenu from 'material-ui/IconMenu';
import Back from 'material-ui/svg-icons/navigation/chevron-left';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import request from 'browser-request'
import cookies from 'browser-cookies'


Yavanna.provide('AnonyBar', () => {

  return React.createClass({

    getInitialState(){
      return {}
    },

    displayBackButton(){

      if (window.location.pathname == "/"){
        return (<div style={{width: 10}}/>)
      }else{
        return (<IconButton onTouchTap={this.handleLeftButton}><Back /></IconButton>)
      }
    },

    handleLeftButton(){
      console.log("Previous path: ", this.props.prev)
      if (this.props.prev == window.location.pathname){
        browserHistory.push('/')
      }else{
        browserHistory.goBack()
      }
    },

    nav(path){
      browserHistory.push(path)
    },


    render: function() {
      var getAppBar = function(loggedIn){
        let backButton = this.displayBackButton()
        if (!loggedIn){
          return (
            <AppBar
              title="AnonyPost"
              onTitleTouchTap={this.nav.bind(this, '/')}
              style={{backgroundColor: 'black', position: 'fixed'}}
              iconElementLeft={backButton}
              iconElementRight={
                <IconMenu
                  iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                  anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                  targetOrigin={{horizontal: 'right', vertical: 'top'}}
                >
                  <MenuItem primaryText="Login" onTouchTap={this.nav.bind(this, '/login')} />
                  <MenuItem primaryText="Sign Up" onTouchTap={this.nav.bind(this, '/signup')} />
                  <MenuItem primaryText="Contribute" href='https://github.com/anonypost/anonypost'/>
                  <MenuItem primaryText="Report Bug" href='https://github.com/anonypost/anonypost/issues' />
                </IconMenu>
                }
            />
          )
        }else{
          return (
            <AppBar
              title="AnonyPost"
              style={{backgroundColor: 'black', position: 'fixed'}}
              onTitleTouchTap={this.nav.bind(this, '/')}
              iconElementLeft={backButton}
              iconElementRight={
                <IconMenu
                  iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                  anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                  targetOrigin={{horizontal: 'right', vertical: 'top'}}
                >
                  <MenuItem primaryText="Log Out" onTouchTap={this.props.logout} />
                  <MenuItem primaryText="Contribute" href='https://github.com/anonypost/anonypost'/>
                  <MenuItem primaryText="Report Bug" href='https://github.com/anonypost/anonypost/issues' />
                </IconMenu>
                }
            />
          )
        }

      }

      return (
        <div>
          {getAppBar.bind(this)(this.props.loggedIn)}
        </div>
      )



    }
  })

})
