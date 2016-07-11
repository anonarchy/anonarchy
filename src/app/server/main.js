const express = require('express')
const path = require('path')
var bodyParser = require('body-parser');
// var bookshelf = require('./bookshelf');

const app = express()

console.log(path.join(__dirname, 'public'))


app.use('/assets', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())

var posts = [{title: 'Oh baby', body: 'Food is nice', author: 'ILikeFood'}, {title: 'Suck it', body: 'ILikeFood is a dumbdumb!', author: 'Trollolol'}]

app.get('/posts', function (req, res) {
  console.log(posts)
  res.send(posts)
})

app.get('/post/:id', function (req, res) {
  res.send({body: 'sdbc', author: 'julius', title: 'fd'})
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


app.post('/posts', function (req, res){
  console.log(req.body)
  posts.push(req.body)
  res.send(req.body)
})

app.post('/comment', function (req, res){
  console.log(req.body)
  res.send(req.body)
})


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
