const generateToken = require('secure-random-string')

Yavanna.provide('Post', ({CurrentTimeService}) => {
  return function(data) {
    var post = {}
    if (data.title && data.title.replace(/\n/g,'').replace(/ /g,'') === ""){
      complainAbout('title')
    }
    post.title = data.title || complainAbout('title')
    if (data.body && data.body.replace(/\n/g,'').replace(/ /g,'') === ""){
      post.body = ""
    }else{
      post.body = data.body
    }
    post.timestamp = data.timestamp || CurrentTimeService.millis()
    if (data.link && data.link.replace(/\n/g,'').replace(/ /g,'') === ""){
      console.log("Empty link!")
      post.link = ""
    }else{
      post.link = data.link
    }
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
