const $ = require('jquery')

window.addEventListener('load', function () {
  $.get('/user')
    .then(user => {
      document.body.innerHTML = `Hello, ${user.name}`
    })
})
