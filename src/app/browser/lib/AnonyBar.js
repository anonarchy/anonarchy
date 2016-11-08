import React from 'react'
import { Router, Route, Link, browserHistory } from 'react-router'
import AppBar from 'material-ui/AppBar'
import FlatButton from 'material-ui/FlatButton'
import IconMenu from 'material-ui/IconMenu';
import Back from 'material-ui/svg-icons/navigation/chevron-left';
import Reload from 'material-ui/svg-icons/navigation/refresh';

import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import request from 'browser-request'
import cookies from 'browser-cookies'


Yavanna.provide('AnonyBar', () => {

  return React.createClass({

    getInitialState(){
      return {pathname: window.location.pathname}
    },

    displayBackButton(){

      if (window.location.pathname == "/"){
        return (<div style={{width: 10}}/>)
      }else{
        return (<IconButton onTouchTap={this.handleLeftButton}><Back /></IconButton>)
      }
    },

    displayRefreshButton(){
      if (window.location.pathname == "/"){
        return  <IconButton color={'white'} onTouchTap={this.refresh}><Reload color={'white'}/></IconButton>

      }else{
        return null
      }
    },

    handleLeftButton(){
      console.log("Previous path: ", this.state.pathname)
      if (this.state.pathname == window.location.pathname){
        browserHistory.push('/')
      }else{
        browserHistory.goBack()
      }
    },

    nav(path){
      browserHistory.push(path)
    },

    refresh(){
      location.reload()
    },

    render: function() {
      var buttonStyle = {
        backgroundColor: 'transparent',
      };
      var getAppBar = function(loggedIn){
        let backButton = this.displayBackButton()
        if (!loggedIn){
          return (
            <AppBar
              title="Anonarchy"
              onTitleTouchTap={this.nav.bind(this, '/')}
              style={{backgroundColor: 'black', position: 'fixed'}}
              iconElementLeft={backButton}
              iconElementRight={
                <div style={buttonStyle}>
                {this.displayRefreshButton()}
                <IconMenu
                  iconButtonElement={<IconButton color={'white'}><MoreVertIcon  color={'white'}/></IconButton>}
                  anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                  targetOrigin={{horizontal: 'right', vertical: 'top'}}
                >
                  <MenuItem primaryText="Login" onTouchTap={this.nav.bind(this, '/login')} />
                  <MenuItem primaryText="Sign Up" onTouchTap={this.nav.bind(this, '/signup')} />
                  <MenuItem primaryText="Contribute" href='https://github.com/anonypost/anonypost'/>
                  <MenuItem primaryText="Report Bug" href='https://github.com/anonypost/anonypost/issues' />
                  <MenuItem primaryText="FAQ" href='https://github.com/anonypost/anonypost/blob/master/faq.md' />
                </IconMenu>
                </div>
                }
            />
          )
        }else{
          return (
            <AppBar
              title="Anonarchy"
              style={{backgroundColor: 'black', position: 'fixed'}}
              onTitleTouchTap={this.nav.bind(this, '/')}
              iconElementLeft={backButton}
              iconElementRight={
                <div>
                {this.displayRefreshButton()}
                <IconMenu
                  iconButtonElement={<IconButton><MoreVertIcon color={'white'}/></IconButton>}
                  anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                  targetOrigin={{horizontal: 'right', vertical: 'top'}}
                >
                  <MenuItem primaryText="Log Out" onTouchTap={this.props.logout} />
                  <MenuItem primaryText="Contribute" href='https://github.com/anonypost/anonypost'/>
                  <MenuItem primaryText="Report Bug" href='https://github.com/anonypost/anonypost/issues' />
                  <MenuItem primaryText="FAQ" href='https://github.com/anonypost/anonypost/blob/master/faq.md' />
                </IconMenu>
                </div>
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
