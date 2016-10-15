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
var ReactMarkdown = require('react-markdown');

// var marked = require('marked');
// marked.setOptions({
//   renderer: new marked.Renderer(),
//   gfm: true,
//   tables: true,
//   breaks: false,
//   pedantic: false,
//   sanitize: true,
//   smartLists: true,
//   smartypants: false
// });

var _ = require('underscore')


var ulStyle = {
  listStyle: 'none',
  margin: 'auto',
  width: 96.77 + '%',
  padding: 0
}

var expander = {
  fontSize: 18,
  paddingRight: 8,
  display: 'inline-block',
  position: 'relative',
  top: 4,
  cursor: 'pointer'
}

Yavanna.provide('Post', ({Vote}) => {

  return React.createClass({

    getInitialState(){
      return {expanded: false}
    },

    viewComments(id) {
      console.log("view comments " +id)
      browserHistory.push('comments/' + id)
    },

    expand(){
      this.setState({expanded: true})
    },

    collapse(){
      this.setState({expanded: false})
    },

    render () {
        var post = this.props.post
        var showExpandCollapse = () => {
          if (post.body !== ""){
            if (!this.state.expanded){
              return <span className={"icon-plus-square-o"} style={expander} onTouchTap={this.expand}/>
            }else{
              return <span className={"icon-minus-square-o"} style={expander} onTouchTap={this.collapse}/>
            }
          }
        }

        var linkOrText = () => {
          if (post.link === "" || post.link === undefined){
            return (<span style={{ display: 'flex', minHeight: 36, fontSize: 18, lineHeight: 22 + 'px', margin: 0, padding: 16, paddingLeft: 0, alignItems: 'center', wordBreak: 'break-all' }}>{post.title}</span>)
          }else{
            return (<a href={post.link} style={{display: 'flex', minHeight: 36, fontSize: 18, lineHeight: 22 + 'px', margin: 0, padding: 16, paddingLeft: 0, alignItems: 'center', outline: 'none', wordBreak: 'break-all'}}>{post.title}</a>)

          }
        }

        // <CardTitle
        //   style={{paddingLeft: 0}}
        //   title={post.title}
        //   titleStyle={{ display: 'flex', minHeight: 36, fontSize: 18, lineHeight: 22 + 'px', margin: 0, padding: 0, alignItems: 'center'}}
        // />
        return (
          <Card expanded={this.state.expanded} >
            <div style={{display: 'flex', alignItems: 'center'}}>
              <Vote voteTotal={this.props.post.netVotes} ID={this.props.post._id} loggedIn={this.props.loggedIn} type="post" />
              <div style={{padding: 0, paddingRight:16, flex: 1, minWidth: 0, fontSize: 18}}>
                {linkOrText()}
              </div>
            </div>
            <Divider style={{marginLeft: 68}}/>
              <div>
                <span style={{marginLeft: 68}}/>
                {showExpandCollapse()}
                <div style={{margin: 0, cursor: 'pointer', display: 'inline-block', fontSize: 12, textTransform: 'uppercase', padding:8, paddingLeft: 0}} onTouchTap={()=> this.viewComments(post._id)}>
                  Comments
                </div>
              </div>
            <Divider style={{marginLeft: 68}}/>
            <div expandable={true} style={{padding: 0, paddingRight:16, marginLeft: 68}}>
              <ReactMarkdown source={post.body} />
            </div>
            <Divider style={{marginLeft: 68}}/>
              <div  expandable={true}>
                <span style={{marginLeft: 68}}/>
                {showExpandCollapse()}
                <div style={{margin: 0, cursor: 'pointer', display: 'inline-block', fontSize: 12, textTransform: 'uppercase', padding:8, paddingLeft: 0}} onTouchTap={()=> this.viewComments(post._id)}>
                  Comments
                </div>
              </div>
          </Card>
        )
    }
  })
})
