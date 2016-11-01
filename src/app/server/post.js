const generateToken = require('secure-random-string')

Yavanna.provide('Post', ({CurrentTimeService}) => {
  return function(data) {
    var post = {}

    post.title = data.title || complainAbout('title')
    post.body = data.body
    post.timestamp = data.timestamp || CurrentTimeService.millis()
    post.link = data.link
    post.ownerToken = generateToken()
    post.upvotes = 0
    post.netVotes = 0
    post.commentCount = 0
    post.loc = data.loc || complainAbout('loc')
    post.tweet_id = data.tweet_id

    return post
  }
})

function complainAbout(field) {
  throw 'a post must have a ' + field
}
