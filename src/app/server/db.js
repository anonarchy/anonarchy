require('babel-polyfill')
var MongoClient = require('mongodb').MongoClient

Yavanna.provide('DB', () => {
  return {
    exec: async function (collection, operation, args) {
      let conn = await getConnection()
      return await conn.collection(collection)[operation](args).toArray();
    },

    execOne: async function (collection, operation, args) {
      let conn = await getConnection()
      return await conn.collection(collection)[operation](args);
    }
  }


  var existingConnection
  async function getConnection () {
    if (existingConnection) return (new Promise).resolve(existingConnection)
    return await MongoClient.connect('mongodb://localhost:27017/anonypost')
    // return existingConnection
  }
})
