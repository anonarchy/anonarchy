var React = require('react')

var posts = [{body: 'Food is nice', author: 'ILikeFood'}, {body: 'ILikeFood is a dumbdumb!', author: 'Trollolol'}]

console.log('in app')
var PostList = Yavanna.get('PostList')

Yavanna.provide('App', () => {
  return React.createClass({
    getInitialState: function () {
      return {posts: posts}
    },

    render: function () {
      return (
        <PostList posts={this.state.posts} />
      )
    }
  })
})


// Yavanna.provide('App', App)
