const ObjectID = require('mongodb').ObjectID;
const generateToken = require('secure-random-string')
const _ = require('underscore')

const MILLIS_PER_DAY = 1000 * 3600 * 24

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

    findRanked: async function(long, lat, quota=50) {
      let found = []
      let radii = [0, 50, 100, 200, 400, 1000]
      for (let i = 1; i < radii.length; i++) {
        let minDistanceMeters = radii[i-1]
        let maxDistanceMeters = radii[i]
        let postsWithinDistanceBand =
          await this.findNearLocation(
            long, lat,
            minDistanceMeters, maxDistanceMeters,
            {},
            quota - found.length
          )

        found = found.concat(_(postsWithinDistanceBand).sortBy(awesomeness).reverse())
        if (found.length >= quota) {
          break;
        }
      }

      return found
    },

    findTop: async function(long, lat, quota = 50) {
      let options = {"sort": [['netVotes','desc']]}
      return await findNearLocation(long, lat, 0, 1000, options, quota)
    },



    findNearLocation: async function(long, lat, minDistanceMeters, maxDistanceMeters, options, limit) {
      let doNotShowOwnerToken = {ownerToken: 0}

      return (await DB.exec('posts', 'find', {loc: {
        $nearSphere: {
           $geometry: {
              type : "Point",
              coordinates : [ long, lat ]
           },
           $minDistance: minDistanceMeters,
           $maxDistance: maxDistanceMeters
        }
      }}, doNotShowOwnerToken, options, limit))
    }
  }

  function awesomeness(post) {
    return voteScore(post) + post.timestamp / 45000000
  }

  function voteScore(post) {
    let sign = Math.sign(post.netVotes)
    let logMagnitude = log10(Math.abs(post.netVotes) || 1)
    return sign * logMagnitude
  }

  function log10(x) {
    return Math.log(x) / Math.LN10
  }
})
