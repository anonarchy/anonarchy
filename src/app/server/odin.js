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
      var o_id = new ObjectID(id)
      console.log(o_id)
      // var posts = await DB.exec('posts', 'find', {author: 'ILikeFood'})
      // console.log(posts[0]._id.equals(id))
      return await DB.execOne('posts', 'findOne', {_id: o_id})
    },

    createPost: async function(post) {
      return await DB.execOne('posts', 'insertOne', post)
    },

    getCommments: async function() {
      return await DB.exec('comments', 'find')
    }

  }
})
