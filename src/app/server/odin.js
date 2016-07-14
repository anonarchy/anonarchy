Yavanna.provide('Odin', ({DB}) => {
  return {
    getPosts: async function() {
      return await DB.exec('posts', 'find').toArray()
    }
  }
})
