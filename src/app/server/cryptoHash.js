const crypto = require('crypto')

Yavanna.provide('env', function() {
  return process.env
})

Yavanna.provide('cryptoHash', function({env}) {
  if (!env.ANONYPOST_SECRET_KEY) {
    throw new Error('no secret key; set the ANONYPOST_SECRET_KEY env variable')
  }

  return function(strings) {
    if (strings.length === 0) {
      throw new Error('No strings passed to cryptoHash')
    }
    if (strings.every(s => s.length === 0)) {
      throw new Error('Only empty strings passed to cryptoHash')
    }

    var h = crypto.createHmac('sha256', env.ANONYPOST_SECRET_KEY)
    var arrayLength = strings.length;
    for (var i = 0; i < arrayLength; i++) {
      h.update(strings[i]);
    }
    return h.digest('hex')
  }
})
