const ObjectID = require('mongodb').ObjectID;
const generateToken = require('secure-random-string')
const _ = require('underscore')
const geolib = require('geolib')

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
      let postsWithinRadius = []
      let radii = [50, 100, 200, 400, 1000]
      let intervals = [1, 3, 9, 27, 150] //days
      for (let i = 0; i < radii.length; i++) {
        let maxDistanceMeters = radii[i]
        let maxDay = intervals[i]
        let oldestTime = CurrentTimeService.millis() - maxDay * 24 * 60 * 60 * 1000
        postsWithinRadius =
          await this.findNearLocation(
            long, lat,
            maxDistanceMeters,
            oldestTime,
            {},
            quota
          )

        if (postsWithinRadius.length >= quota) {
          break;
        }
      }
      let userLocation = {
        longitude: long,
        latitude: lat
      }
      return _(postsWithinRadius).sortBy(awesomeness(userLocation)).reverse()
    },

    findTop: async function(long, lat, quota = 50) {
      let options = {"sort": [['netVotes','desc']]}
      return await this.findNearLocation(long, lat, 1000, 0, options, quota)
    },

    findNearLocation: async function(long, lat, maxDistanceMeters, oldestTime, options, limit) {
      let doNotShowOwnerToken = {ownerToken: 0}

      return (await DB.exec('posts', 'find', {loc: {
        $nearSphere: {
           $geometry: {
              type : "Point",
              coordinates : [ long, lat ]
           },
           $minDistance: 0,
           $maxDistance: maxDistanceMeters
        },
      }, timestamp: {
        $gte: oldestTime
      }}, doNotShowOwnerToken, options, limit))
    }
  }

  function awesomeness(userLocation) {
    return function(post) {
      let postLocation = {longitude: post.loc.long, latitude: post.loc.lat}
      let distance = geolib.getDistance(postLocation, userLocation)
      return voteScore(post) + post.timestamp / 45000000 - distance / 20
    }
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
