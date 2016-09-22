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

    $afterEach(async () => {
      await DB.armageddon()
    })

  $it('ranks more recent posts higher than older posts', async () => {
    currentTimeMillis = 1
    await PostCollection.create({title: 'old', loc: {long: 0, lat: 0}})
    currentTimeMillis = 2
    await PostCollection.create({title: 'new', loc: {long: 0, lat: 0}})

    let ranked = await PostCollection.findRanked(0,0)
    expect(ranked[0].title).toEqual('new')
    expect(ranked[1].title).toEqual('old')
  })


  $it('ranks nearer posts higher than distant posts', async () => {
    currentTimeMillis = 1
    await PostCollection.create({title: 'near', loc: {long: -122.07905010000002, lat: 37.3931981}})
    currentTimeMillis = 1
    await PostCollection.create({title: 'far', loc: {long: -122.07897550000001, lat: 37.3934292}})
    let ranked = await PostCollection.findRanked(-122.07905010000002, 37.3931981)
    expect(ranked[0].title).toEqual('near')
    expect(ranked[1].title).toEqual('far')
  })

  $it('ranks highly voted posts higher', async () => {
    currentTimeMillis = 1
    let post = await PostCollection.create({title: 'high', loc: {long: 0, lat: 0}})
    let Odin = YavannaForTest.get('Odin')
    await Odin.createVote('a-userVoteKey', post.postID.toString(), 1, 'post')
    expect((await PostCollection.findById(post.postID.toString())).netVotes).toEqual(1)
    currentTimeMillis = 1
    await PostCollection.create({title: 'low', loc: {long: 0, lat: 0}})
    let ranked = await PostCollection.findRanked(0, 0)
    expect(ranked[0].title).toEqual('high')
    expect(ranked[1].title).toEqual('low')
    currentTimeMillis = 1

    post = await PostCollection.create({title: 'high', loc: {long: 0, lat: 0}})
    await Odin.createVote('a-userVoteKey', post.postID.toString(), -1, 'post')
    expect((await PostCollection.findById(post.postID.toString())).netVotes).toEqual(-1)
    currentTimeMillis = 1
    await PostCollection.create({title: 'lowest', loc: {long: 0, lat: 0}})
    ranked = await PostCollection.findRanked(0, 0)
    expect(ranked[0].title).toEqual('high')
    expect(ranked[1].title).toEqual('low')
    expect(ranked[2].title).toEqual('lowest')

  })
})
