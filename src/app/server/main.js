const express = require('express')
const path = require('path')
var bodyParser = require('body-parser');
// require('babel-polyfill')
var _ = require('underscore');

const app = express()

console.log(path.join(__dirname, 'public'))

function dateReviver(key, value) {
  if (typeof value === 'string') {
    var a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
    if (a) {
      return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
    }
  }
  return value;
};

app.use('/assets', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json({reviver: dateReviver}))

// var posts = [{id: 1, title: 'Oh baby', body: 'Food is nice', author: 'ILikeFood'}, {id: 2, title: 'Suck it', body: 'ILikeFood is a dumbdumb!', author: 'Trollolol'}]
// var comments = [{body: 'What the hell is this guy on?'}, {body: 'poop there it is!'}]
// var db = Yavanna.get('DB')
// db.exec('posts', 'insertOne', {title: 'Oh baby', body: 'Food is nice', author: 'ILikeFood'})

Yavanna.provide('AppController', ({Odin}) => {

  app.get('/api/posts/', async function (req, res){
    try{
      if (req.query.long !== undefined){
        var long = Number(req.query.long)
        var lat = Number(req.query.lat)
        var posts = await Odin.getPostsByLocation(long, lat)
      }else{
        var posts = await Odin.getPosts(long, lat)
      }
      console.log(posts)
      res.send(posts)
    }catch(error){
      res.send(error)
    }
  })

  app.get('/api/post/:id/comments', async function (req, res) {
    console.log(req.params.id)
    try{
      var post = await Odin.getPost(req.params.id)
      console.log(post)
      var comments = await Odin.getCommments(req.params.id)
      var ret = {post: post, comments: comments}
      // console.log(ret)
      res.send(ret)
    }catch(error){
      console.log(error)
      res.send(error)
    }
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

  app.post('/api/comment', async function (req, res){
    var new_comment = await Odin.createComment(req.body)
    res.send(req.body)
  })
})

Yavanna.get('AppController')

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
