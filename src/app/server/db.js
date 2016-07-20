require('babel-polyfill')
var MongoClient = require('mongodb').MongoClient

Yavanna.provide('DB', () => {
  return {
    exec: async function (collection, operation, args) {
      try{
        let conn = await getConnection()
        return await conn.collection(collection)[operation](args).toArray();
      }catch(error){
        console.log(error)
        return error
      }
    },

    execOne: async function (collection, operation, args) {
      // console.log("got here at all")
      // try{
      //   let conn = await getConnection()
      //   console.log("getting collection")
      //   let result = await conn.collection(collection)[operation](args);
      //   console.log(result)
      //   return result
      // }catch(error){
      //   console.log("error")
      //   return error
      // }
        let conn = await getConnection()
        let result = await conn.collection(collection)[operation](args);
        return result


    }
  }


  var existingConnection
  async function getConnection () {
    if (existingConnection) return (new Promise).resolve(existingConnection)
    return await MongoClient.connect('mongodb://localhost:27017/anonypost')
    // return existingConnection
  }
})
