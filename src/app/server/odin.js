var ObjectID = require('mongodb').ObjectID;
var generateToken = require('secure-random-string')
var bcrypt = require('bcrypt')
let ONE_WEEK = 604800000
let SALTROUNDS = 10

Yavanna.provide('Odin', ({DB, tokenIsExpired}) => {
  return {
    getPosts: async function() {
      return await DB.exec('posts', 'find')
    },

    getPostsByLocation: async function(long, lat){
      return await DB.exec('posts', 'find', {
        loc: {
          $nearSphere: {
             $geometry: {
                type : "Point",
                coordinates : [ long, lat ]
             },
             $maxDistance: 3000
          }
        }
      })
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
      return await DB.execOne('posts', 'insertOne', post)
    },

    createComment: async function(comment) {
      return await DB.execOne('comments', 'insertOne', comment)
    },

    getCommments: async function(postID) {
      return await DB.exec('comments', 'find', {postID: postID})
    },

    createVote: async function(vote, userVoteKey){
      var voteKey = userVoteKey//merge userVoteKey, secretKey
      var vote = await DB.execOne('votes', 'findAndModify', {
        query: {postID: vote.postID, voteKey: voteKey},
        update: {value: vote.value}, //might need to do $setOnInsert and or $set
        upsert: true,
        new: true
      })
      return vote
    },

    deleteVote: async function(vote, userVoteKey){
      var voteKey = userVoteKey//merge userVoteKey, secretKey
      var vote = await DB.execOne('votes', 'findAndDelete', {postID: vote.postID, voteKey: voteKey})
      return vote
    },

    getVoteCount: async function(postID){
      var upVotes = await DB.exec('votes', 'count', {postID: postID, value: 1})
      var downVotes = await DB.exec('votes', 'count', {postID: postID, value: 0})
      var voteCount = upVotes - downVotes // replace with formula
      return voteCount

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
        await DB.execOne('users', 'insertOne', {username: username, password: hash, activeToken: token, timestamp: time})
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
    }


  }
})
