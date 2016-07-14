const express = require('express')
const path = require('path')
var bodyParser = require('body-parser');
// require('babel-polyfill')
var _ = require('underscore');

const app = express()

console.log(path.join(__dirname, 'public'))

app.use('/assets', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())

// var posts = [{id: 1, title: 'Oh baby', body: 'Food is nice', author: 'ILikeFood'}, {id: 2, title: 'Suck it', body: 'ILikeFood is a dumbdumb!', author: 'Trollolol'}]
// var comments = [{body: 'What the hell is this guy on?'}, {body: 'poop there it is!'}]
// var db = Yavanna.get('DB')
// db.exec('posts', 'insertOne', {title: 'Oh baby', body: 'Food is nice', author: 'ILikeFood'})

Yavanna.provide('AppController', ({Odin}) => {
  // app.get('/api/posts', async function (req, res) {
  //   var posts = await Odin.getPosts(req.query)
  //   console.log("RHINF")
  //   console.log(posts)
  //   res.send(posts)
  // })

  app.get('/api/posts', async function (req, res){
    var long =-122.08072139999999
    var lat = 37.3942957
    var posts = await Odin.getPostsByLocation(long, lat)
    console.log("RHINF")
    console.log(posts)
    res.send(posts)
  })

  app.get('/api/post/:id/comments', async function (req, res) {
    console.log(req.params.id)
    var post = await Odin.getPost(req.params.id)
    console.log(post)
    var comments = await Odin.getCommments(req.params.id)
    var ret = {post: post, comments: comments}
    // console.log(ret)
    res.send(ret)
  })

  app.get('*', function (req, res) {
    const html = `<!DOCTYPE html>
    <html>
      <head>
        <title>AnonyPost</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body>
        <div id="container"/>
        <script src="/assets/js/browser.js"></script>
      </body>
    </html>
    `

    res.send(html)
  })

  app.post('/api/posts', async function (req, res){
    var new_post = await Odin.createPost(req.body)
    res.send(new_post)
  })

  app.post('/comment', function (req, res){
    console.log(req.body)
    res.send(req.body)
  })
})

Yavanna.get('AppController')

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
