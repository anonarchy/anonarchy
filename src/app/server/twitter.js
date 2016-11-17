const TwitterClient = require('twitter')
const generateToken = require('secure-random-string')

Yavanna.provide('Twitter', ({PostCollection}) => {
  let twitterClient = new TwitterClient({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: '',
    access_token_secret: ''
  });

  return {
    fetchTweetsAsPosts: async function(long, lat) {
      console.log("Fetching tweets")
      return new Promise((resolve, reject) => {
        twitterClient.get('search/tweets', {geocode: `${lat},${long},0.3km`, q: ''}, async function(error, body, response) {
          if (error) {
            reject(error)
            return
          }

          console.log('got tweets', body)

          var posts = body.statuses
            .map(log('all'))
            .filter(notADirectMessage)
            .map(log('not direct messages'))
            .map(getUsefulTweetInfo)
            .map(log('transformed'))
            .map(assignLocation(long, lat))
            .map(log('with location'))

          console.log("got x number of posts", posts.length)
          for (let post of posts) {
            console.log('tweet id = ', post.tweet_id)
            var alreadyExists = await PostCollection.findByTweetId(post.tweet_id)
            console.log('already exists = ', alreadyExists)
            if (!alreadyExists) {
              await PostCollection.create(post)
            }
          }

          resolve(posts)
        })
      })
    }
  }
})

function notADirectMessage(tweet) {
  return tweet.text.indexOf('@') === -1
}

function getUsefulTweetInfo(tweet) {
  tweet = extractLink(tweet)
  return {
    title: tweet.text,
    link: tweet.link,
    tweet_id: tweet.id,
    timestamp: +new Date(tweet.created_at)
  }
}

function extractLink(tweet){
  let text = tweet.text
  let arr = text.split(' ')
  if (arr[arr.length-1].indexOf('https://') == 0 || arr[arr.length-1].indexOf('http://') == 0){
      tweet.link = arr[arr.length-1]
      arr.splice(arr.length-1, 1)
      tweet.text = arr.join(" ")
  }
  return tweet
}

function assignLocation(long, lat) {
  return function(post) {
    post.loc = {long, lat}
    return post
  }
}

function log(title) {
  return function(thing) {
    console.log(title, thing)
    return thing
  }
}
