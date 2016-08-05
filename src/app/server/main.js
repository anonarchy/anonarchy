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

  app.post('/api/signup', async function(req, res){
    var token = await Odin.createUser(req.body.username, req.body.password)
    if(token){
      res.status(200).send({token: token})
    }else{
      res.status(400).send("User already exists")
    }
  })

  app.post('/api/login/', async function(req, res){
    console.log(req.body)
    var loginToken = await Odin.getLoginToken(req.body.username, req.body.password)
    if(loginToken){
      console.log(loginToken)
      res.status(200).send({token: loginToken})
    }else{
      res.status(403).send("Invalid username or password")
    }
  })

  app.get('/api/posts/', async function (req, res){
    try{
      if (req.query.long !== undefined){
        var long = Number(req.query.long)
        var lat = Number(req.query.lat)
        var posts = await Odin.getPostsByLocation(long, lat)
      }else{
        var posts = await Odin.getPosts()
      }
      console.log(posts)
      res.send(posts)
    }catch(error){
      res.status(500).send(error)
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
      res.status(500).send(error)
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
    try{
      // var token = await Odin.exchangeToken(req.body.token)
      //get user too?
      var token = true
      if (token){
        var new_post = await Odin.createPost(req.body.post)
        res.send(token)
        // return post id? some other UUID?
      }else{
        res.send(null)
      }
    }catch(error){
      console.log(error)
      res.status(500).send(null)
    }
  })

  app.post('/api/comment', async function (req, res){
    // var token = await Odin.exchangeToken(req.body.token)
    //get user too?
    try{
      var token = true
      if (token){
        var new_comment = await Odin.createComment(req.body.comment)
        console.log(new_comment)
        res.send(token)
        // return post id? some other UUID?
      }else{
        res.send(null)
      }
    }catch(error){
      console.log(error)
      res.status(500).send(null)
    }
  })

  app.post('/api/vote', async function (req, res){
    try{
      var voteKey = await Odin.getUserVoteKey(req.body.token)
      var result = await Odin.createVote(req.body.vote, voteKey)
      if (result){
        res.status(200).send()
      }else{
        res.status(403).send("Already voted")
      }

    }catch(error){
      console.log(error)
      res.status(500).send(null)
    }
  })
})

Yavanna.get('AppController')

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
