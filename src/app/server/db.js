require('babel-polyfill')
var MongoClient = require('mongodb').MongoClient

Yavanna.provide('DB', ({env}) => {
  if (!env.ANONYPOST_DATABASE) {
    throw new Error('ANONYPOST_DATABASE env var must be set.')
  }

  return {
    exec: async function (collection, operation, query, projection, options) {
      try{
        let conn = await getConnection()
        if (projection === undefined){
          console.log("projection undefined")
          projection = {}
        }
        if (options === undefined){
          console.log("optionss undefined")
          options = {}
        }
        return await conn.collection(collection)[operation](query, projection, options).toArray();
      }catch(error){
        console.log(error)
        return error
      }
    },

    execOne: async function (collection, operation, query) {
        let conn = await getConnection()
        let result = await conn.collection(collection)[operation](query);
        console.log("successfully executed once!")
        return result
    },

    updateOne: async function (collection, args, set) {
        var operation = 'updateOne'
        let conn = await getConnection()
        console.log(args)
        let result = await conn.collection(collection)[operation](args, set);
        console.log("successfully updated!")
        return result
    },

    findAndModify: async function (collection, query, sort, update, options) {
      var operation = 'findAndModify'
      let conn = await getConnection()
      let result = await conn.collection(collection)[operation](query, sort, update, options);
      console.log("successfully found and Modified!")

      return result

    },

    armageddon: async function () {
      let conn = await getConnection()
      let collectionsToClear = ['votes', 'users']
      for (let coll of collectionsToClear) {
        await conn.collection(coll).deleteMany({})
      }
      return Promise.resolve(null)
    }
  }


  var existingConnection
  async function getConnection () {
    if (existingConnection) return existingConnection
    existingConnection = await MongoClient.connect(env.ANONYPOST_DATABASE)
    return existingConnection
  }
})
