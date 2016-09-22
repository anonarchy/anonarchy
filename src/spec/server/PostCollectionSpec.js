const {$it, $afterEach} = require('async-await-jasmine')

describe('PostCollection', () => {
  let currentTimeMillis = 0
  const stubCurrentTimeService = {
    millis: () => currentTimeMillis
  }

  const YavannaForTest = Yavanna.withOverrides({
    env: {
      ANONYPOST_DATABASE: 'mongodb://localhost:27017/anonypost_test',
      ANONYPOST_SECRET_KEY: 'secret'
    },
    CurrentTimeService: stubCurrentTimeService
  })

  const PostCollection = YavannaForTest.get('PostCollection')
  const DB = YavannaForTest.get('DB')

    // $afterEach(async () => {
    //   await DB.armageddon()
    // })

  $it('ranks more recent posts higher than older posts', async () => {
    currentTimeMillis = 1
    await PostCollection.create({title: 'old', loc: {long: 0, lat: 0}})
    currentTimeMillis = 2
    await PostCollection.create({title: 'new', loc: {long: 0, lat: 0}})

    let ranked = await PostCollection.findRanked()
    expect(ranked[0].title).toEqual('new')
    expect(ranked[1].title).toEqual('old')
  })

  $it('ranks nearer posts higher than distant posts', async () => {

  })

  $it('ranks highly voted posts higher', async () => {

  })
})
