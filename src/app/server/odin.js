Yavanna.provide('Odin', ({DB}) => {
  return {
    getPosts: async function() {
      return await DB.exec('posts', 'find')
    },

    getCommments: async function() {
      return await DB.exec('comments', 'find')
    }

  }
})
