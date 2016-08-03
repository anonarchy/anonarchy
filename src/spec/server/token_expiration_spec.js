
tokenIsExpired = Yavanna.get('tokenIsExpired')

describe('token', () => {
  var dayInMillis = 24 * 60 * 60 * 1000;

  it('expires after one week', function(){
    var now = 123456789;

    var user = {
      timestamp: now - 7 * dayInMillis - 1
    }

    expect(tokenIsExpired(user, now)).toBe(true)
  })

  it('is not expired at some point', function(){
    var now = 123456789;

    var user = {
      timestamp: now - 1000
    }

    expect(tokenIsExpired(user, now)).toBe(false)
  })
})
