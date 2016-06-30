const express = require('express')
const path = require('path')

const app = express()

console.log(path.join(__dirname, 'public'))

app.use('/assets', express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
  const html = `<!DOCTYPE html>
  <html>
    <head>
      <title>Best Website Ever!</title>
    </head>
    <body>
      <script src="/assets/js/browser.js"></script>
    </body>
  </html>
  `

  res.send(html)
})

app.get('/user', function (req, res) {
  res.header('Content-Type', 'application/json')
  res.end('{"name":"Bob"}')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
