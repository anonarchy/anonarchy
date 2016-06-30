var React = require('react')

console.log('in post_list')

Yavanna.provide('PostList', () => {
  return React.createClass({
    render: function () {
      var createPost = function (post) {
        return <li>{post.body} - {post.author}</li>
      }
      return <ul>{this.props.posts.map(createPost)}</ul>
    }
  })
})

// Yavanna.provide('PostList', PostList)
