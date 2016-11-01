Yavanna.provide('PostRequestBody', () => {
  return function(object) {
    var postData = {}

    postData.title = object.title
    postData.body = object.body
    postData.link = object.link
    postData.loc = object.loc

    return postData
  }
})
