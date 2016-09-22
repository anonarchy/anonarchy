const ObjectID = require('mongodb').ObjectID;
const generateToken = require('secure-random-string')

Yavanna.provide('PostCollection', ({DB, CurrentTimeService}) => {
  return {
    recordVote: async function(votableId, value, delta) {
      if (Math.abs(delta) == 1){
        if (value !== 1) {value = 0}
        return await DB.updateOne('posts', {_id: new ObjectID(votableId)}, {$inc: {netVotes: delta, upvotes: value}})
      }else if (delta == 0){
        return
      }else{
        return await DB.updateOne('posts', {_id: new ObjectID(votableId)}, {$inc: {netVotes: delta, upvotes: value}})
      }
    },

    deleteVote: async function(votableId, value, delta) {
      if (value !== 1) {value = 0}
      return await DB.updateOne('posts', {_id: new ObjectID(votableId)}, {$inc: {netVotes: delta, upvotes: -value}})
    },

    findById: async function(postID){
      var o_id = new ObjectID(postID)
      return await DB.execOne('posts', 'findOne', {_id: o_id})
    },

    create: async function(post) {
      var newToken = generateToken()
      post.ownerToken = newToken
      post.upvotes = 0
      post.netVotes = 0
      post.timestamp = CurrentTimeService.millis()
      post = await DB.execOne('posts', 'insertOne', post)
      return {postID: post.insertedId, ownerToken: newToken}
    },

    findRanked: async function() {
      return await this.findNearLocation(0, 0, 10000, {"sort": [['timestamp','desc']]})
    },

    findNearLocation: async function(long, lat, maxDistanceMeters, options) {
      let doNotShowOwnerToken = {ownerToken: 0}

      return await DB.exec('posts', 'find', {loc: {
        $nearSphere: {
           $geometry: {
              type : "Point",
              coordinates : [ long, lat ]
           },
           $maxDistance: maxDistanceMeters
        }
      }}, doNotShowOwnerToken, options)
    }
  }
})
