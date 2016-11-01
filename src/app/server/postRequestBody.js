Yavanna.provide('PostRequestBody', () => {
  return function(object) {
    var postData = {}
    console.log("PostRequestBody: ", object)
    postData.title = object.title
    postData.body = object.body
    postData.link = object.link
    postData.loc = object.loc
    console.log("PostRequestBody result: ", postData)

    return postData
  }
})
