const ObjectID = require('mongodb').ObjectID;
const generateToken = require('secure-random-string')
const _ = require('underscore')

Yavanna.provide('CommentCollection', ({DB}) => {
  return {
    recordVote: async function(votableId, value, delta) {
      if (Math.abs(delta) == 1){
        if (value !== 1) {value = 0}
        return await DB.updateOne('comments', {_id: new ObjectID(votableId)}, {$inc: {netVotes: delta, upvotes: value}})
      }else if (delta == 0){
        return
      }else{
        return await DB.updateOne('comments', {_id: new ObjectID(votableId)}, {$inc: {netVotes: delta, upvotes: value}})
      }
    },

    deleteVote: async function(votableId, value, delta) {
      if (value !== 1) {value = 0}
      return await DB.updateOne('comments', {_id: new ObjectID(votableId)}, {$inc: {netVotes: delta, upvotes: -value}})
    },

    create: async function(comment) {
      var newToken = generateToken()
      comment.ownerToken = newToken
      comment.upvotes = 0
      comment.netVotes = 0
      comment.timestamp = (new Date()).getTime()
      comment = await DB.execOne('comments', 'insertOne', comment)
      return {commentID: comment.insertedId, ownerToken: newToken}
    },

    findById: async function(postID){
      var o_id = new ObjectID(postID)
      return await DB.execOne('comments', 'findOne', {_id: o_id})
    }
  }
})
