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


var ulStyle = {
  listStyle: 'none',
  margin: 'auto',
  width: 96.77 + '%',
  padding: 0
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
// onExpandChange={this.handleExpandChange}
    render () {
        var post = this.props.post
        var showExpandCollapse = function(){
          if (post.body !== ""){
            if (this.state.expanded){
              return <span className={"icon-plus-square-o"} style={{fontSize: 18, marginLeft: 68}} onTouchTap={this.expand}/>
            }else{
              return <span className={"icon-minus-square-o"} style={{fontSize: 18, marginLeft: 68}} onTouchTap={this.collapse}/>
            }
          }
        }

        return (
          <li key= {post._id} style={{ marginTop: 10 }} >
            <Card expanded={this.state.expanded} >
              <div style={{display: 'flex'}}>
                <Vote value={1345} />
                <CardTitle
                  style={{display: 'table', height: 36, paddingLeft: 0}}
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
                  {showExpandCollapse()}
                  <div style={{margin: 0, cursor: 'pointer', display: 'inline-block', fontSize: 12, textTransform: 'uppercase', padding:8}} onTouchTap={()=> this.viewComments(post._id)}>
                    Comments
                  </div>
                </div>
            </Card>
          </li>
        )
    }
  })
})
