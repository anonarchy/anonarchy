var ObjectID = require('mongodb').ObjectID;

Yavanna.provide('Odin', ({DB}) => {
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
    }

  }
})
