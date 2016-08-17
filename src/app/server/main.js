const express = require('express')
const path = require('path')
var bodyParser = require('body-parser');
// require('babel-polyfill')
var _ = require('underscore');
var cookieParser = require('cookie-parser')
var crypto = require('crypto')
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
app.use(cookieParser())

// var posts = [{id: 1, title: 'Oh baby', body: 'Food is nice', author: 'ILikeFood'}, {id: 2, title: 'Suck it', body: 'ILikeFood is a dumbdumb!', author: 'Trollolol'}]
// var comments = [{body: 'What the hell is this guy on?'}, {body: 'poop there it is!'}]
// var db = Yavanna.get('DB')
// db.exec('posts', 'insertOne', {title: 'Oh baby', body: 'Food is nice', author: 'ILikeFood'})

Yavanna.provide('AppController', ({Odin}) => {

  app.post('/api/signup', async function(req, res){
    var token = await Odin.createUser(req.body.username, req.body.password)
    if(token){
      setSessionCookie(token, res)
      res.status(201).send({any: 'data'})
    }else{
      res.status(400).send("User already exists")
    }
  })

  app.post('/api/login/', async function(req, res){
    var loginToken = await Odin.getLoginToken(req.body.username, req.body.password)
    if(loginToken){
      console.log(loginToken)
      setSessionCookie(loginToken, res)
      res.status(200).send({token: loginToken})
    }else{
      res.status(403).send("Invalid username or password")
    }
  })

  app.get('/api/posts/', async function (req, res){
    try{
      console.log("got the request")
      if (req.query.long !== undefined){
        var long = Number(req.query.long)
        var lat = Number(req.query.lat)
        console.log(req.query)
        var sort = req.query.sort
        var posts = await Odin.getPostsByLocation(long, lat, sort)
      }else{
        var posts = await Odin.getPosts()
      }
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
      console.log(ret)
      res.send(ret)
    }catch(error){
      console.log(error)
      res.status(500).send(error)
    }
  })

  app.get('/api/post/:id/votes', async function (req, res) {
    try{
      var userVoteKey = await Odin.getUserVoteKey(req.cookies.session)
      if (userVoteKey){
        var voteKey = hash([userVoteKey, req.params.id])
        var userVote = await Odin.getUserVoteValue(voteKey)
      }else{
        var userVote = 0
      }
      var voteCount = await Odin.getVoteCount(req.params.id)
      var ret = {voteCount: voteCount, userVote: userVote}
      console.log(ret)
      res.status(200).send(ret)
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
        <link href="assets/fonts/untitled-font-3/styles.css" rel="stylesheet">
        <link href="assets/css/markdown.css" rel="stylesheet">
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
      console.log(req.cookies.session)
      var token = await Odin.exchangeToken(req.cookies.session)
      //get user too
      setSessionCookie(token, res)
      if (token){
        var new_post = await Odin.createPost(req.body.post)
        res.status(200).send(new_post)
        // return post id? some other UUID?
      }else{
        res.status(403).send(null)
      }
    }catch(error){
      console.log(error)
      res.status(500).send(null)
    }
  })

  app.post('/api/comment', async function (req, res){
    var token = await Odin.exchangeToken(req.cookies.session)
    //get user too?
    try{
      setSessionCookie(token, res)
      if (token){
        var new_comment = await Odin.createComment(req.body.comment)
        console.log(new_comment)

        res.status(200).send(new_comment)
        // return post id? some other UUID?
      }else{
        res.status(403).send(null)
      }
    }catch(error){
      console.log(error)
      res.status(500).send(null)
    }
  })



  app.post('/api/vote', async function (req, res){
    try{
      var userVoteKey = await Odin.getUserVoteKey(req.cookies.session)
      if(userVoteKey){
        console.log(userVoteKey)
        var voteKey = hash([userVoteKey, req.body.vote.ID])
        var result = await Odin.createVote(req.body.vote, voteKey)
        if (result){
          // if (req.body.vote.type === "comment"){
          //     await Odin.updateCommentVoteTotal(vote)
          // }else{
          //     await Odin.updatePostVoteTotal(vote)
          // }
          res.status(200).send()
        }else{
          res.status(403).send("Already voted")
        }
      }else{
        res.status(403).send("No user found")
      }
    }catch(error){
      console.log(error)
      res.status(500).send(null)
    }
  })

  app.delete('/api/vote/', async function (req, res){
    try{
      var userVoteKey = await Odin.getUserVoteKey(req.cookies.session)
      if (userVoteKey){
        var voteKey = hash([userVoteKey, req.body.vote.ID])
        var result = await Odin.deleteVote(req.body.vote.ID, voteKey)
        if (result){
          // if (req.body.vote.type === "comment"){
          //     await Odin.unvote(vote, 'comments')
          // }else{
          //     await Odin.unvote(vote, 'posts')
          // }
          res.status(200).send()
        }else{
          res.status(403).send("Vote not there")
        }
      }else{
        res.status(403).send("No user found")
      }
    }catch(error){
      console.log(error)
      res.status(500).send(null)
    }
  })
})

function setSessionCookie(token, response) {
  try {
    let now = +(new Date())
    let aWeekFromNow = 7 * 24 * 3600 * 1000 + now
    response.cookie('session', token, {expires: new Date(aWeekFromNow)})
    console.log('set session cookie')
  } catch (e) {
    console.log('error when setting session ', e)
  }

}

function hash(keys){
  var h = crypto.createHmac('sha256', process.env.ANONYPOST_SECRET_KEY)
  var arrayLength = keys.length;
  for (var i = 0; i < arrayLength; i++) {
    h.update(keys[i]);
  }
  return h.digest('hex')
}

Yavanna.get('AppController')

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
