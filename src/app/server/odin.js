var ObjectID = require('mongodb').ObjectID;
var generateToken = require('secure-random-string')
var bcrypt = require('bcrypt')
let ONE_WEEK = 604800000
let SALTROUNDS = 10
var crypto = require('crypto')

Yavanna.provide('Odin', ({
  DB,
  tokenIsExpired,
  PostCollection,
  CommentCollection,
  VoteCollection,
  cryptoHash
}) => {
  return {
    getPosts: async function() {
      return await DB.exec('posts', 'find')
    },

    getPostsByLocation: async function(long, lat, sort){
      var options = {}
      console.log(sort)
      if (sort === 'new'){
        console.log("new!!")
        options = {"sort": [['timestamp','desc']]}
      }
      return await PostCollection.findNearLocation(long, lat, 50, options)
      // return await DB.exec('posts', 'find', {
      //   loc: {
      //     $nearSphere: {
      //        $geometry: {
      //           type : "Point",
      //           coordinates : [ long, lat ]
      //        },
      //        $maxDistance: 3000
      //     }
      //   }
      // },
      // {
      //   ownerToken: 0
      // },
      // options
      // )
    },

    getPost: async function(id) {
      // try{
      //   var o_id = new ObjectID(id)
      // }catch(error){
      //   return error
      // }
      var o_id = new ObjectID(id)

      return await DB.execOne('posts', 'findOne', {_id: o_id})
    },

    createPost: async function(post) {
      return await PostCollection.create(post)
    },

    createComment: async function(comment) {
      var newToken = generateToken()
      comment.ownerToken = newToken
      comment.upvotes = 0
      comment.downvotes = 0
      comment.netVotes = 0
      comment.timestamp = (new Date()).getTime()
      comment = await DB.execOne('comments', 'insertOne', comment)
      return {commentID: comment.insertedId, ownerToken: newToken}

    },

    getCommments: async function(postID) {
      return await DB.exec('comments', 'find', {postID: postID})
    },

    createVote: async function(userVoteKey, votableId, value, type){
      let existingVote = await VoteCollection.find(userVoteKey, votableId)
      await VoteCollection.create(userVoteKey, votableId, value)

      let delta = value - (existingVote ? existingVote.value : 0)

      if(type === 'comment'){
        return await CommentCollection.recordVote(votableId, value, delta)
      }else{
        return await PostCollection.recordVote(votableId, value, delta)
      }
    },

    deleteVote: async function(postID, voteKey){
      var vote = await DB.execOne('votes', 'findAndRemove', {postID: postID, voteKey: voteKey})
      return vote
    },

    unvote: async function(vote, collection){
      var o_id = new ObjectID(vote.ID)
      var adjustment = -vote.value
      var upvote = 0
      var downvotes = 0
      if (vote.value === 1){
        upvote = -1
      }else{
        downvote = -1
      }
      return await DB.updateOne(collection, {id: o_id}, {$inc : { netVotes: adjustment, upvotes: upvote, downvotes: downvote}})
    },

    getVoteCount: async function(postID){
      var upVotes = await DB.execOne('votes', 'count', {votableId: postID, value: 1})
      var downVotes = await DB.execOne('votes', 'count', {votableId: postID, value: -1})
      var voteCount = upVotes - downVotes // replace with formula
      return voteCount

    },

    getUserVoteValue: async function(voteKey){
      var vote = await DB.execOne('votes', 'findOne', {voteKey: voteKey})
      if(vote){
        return vote.value
      }else{
        return 0
      }
    },

    createUser: async function(username, password) {
      var user = await DB.execOne('users', 'findOne', {username: username})
      console.log(user)
      console.log('got user')
      if (user !== null){
        console.log(user)
        return null
      }else{
        var token = generateToken()
        var hash = bcrypt.hashSync(password, SALTROUNDS)
        var time = new Date().getTime()
        var voteKey = generateToken()
        await DB.execOne('users', 'insertOne', {username: username, password: hash, activeToken: token, timestamp: time, voteKey: voteKey})
        console.log('created User')
        return token
      }
    },

    getLoginToken: async function(username, password){
      var user = await DB.execOne('users', 'findOne', {username: username})
      console.log(user)
      if (user !== null){
        console.log(password)
        // console.log(bcrypt.compareSync(password, user.password))
        if (bcrypt.compareSync(password, user.password)){
          console.log("new thing now")
          var newToken = generateToken()
          var time = new Date().getTime()
          await DB.updateOne('users', {username: username}, {$set: {activeToken: newToken, timestamp: time}})
          console.log("updated user")
          return newToken
        }else{
          console.log("wrong password")
          return null //wrong password
        }
      }else{
        console.log("Couldn't find user")
        return null //could not find user
      }
    },

    exchangeToken: async function(token){
      var user = await DB.execOne('users', 'findOne', {activeToken: token})
      if (user === null){
        return false
      }else{
        var time = new Date().getTime()
        if (!tokenIsExpired(user.timestamp, time)){
          var newToken = generateToken()
          await DB.updateOne('users', {activeToken: token}, {$set: {activeToken: newToken, timestamp: time}})
          return newToken
        }else{
          return false
        }
      }
    },

    getUserVoteKey: async function(token){
      var user = await DB.execOne('users', 'findOne', {activeToken: token})
      if (user === null){
        return false
      }else{
        return user.voteKey
      }
    }


  }
})
