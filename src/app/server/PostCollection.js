var ObjectID = require('mongodb').ObjectID;

Yavanna.provide('PostCollection', ({DB}) => {
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

    findById: async function(postID){
      var o_id = new ObjectID(postID)
      return await DB.execOne('posts', 'findOne', {_id: o_id})
    }
  }
})
