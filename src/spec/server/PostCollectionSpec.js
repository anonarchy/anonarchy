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
    currentTimeMillis = 1000000
    await PostCollection.create({title: 'old', loc: {long: 0, lat: 0}})
    currentTimeMillis = 2000000
    await PostCollection.create({title: 'new', loc: {long: 0, lat: 0}})

    let ranked = await PostCollection.findRanked(0,0)
    expect(ranked[0].title).toEqual('new')
    expect(ranked[1].title).toEqual('old')
  })


  $it('ranks nearer posts higher than distant posts', async () => {
    currentTimeMillis = 1
    await PostCollection.create({title: 'near', loc: {long: -122.07905010000002, lat: 37.3931981}})
    await PostCollection.create({title: 'far', loc: {long: -122.089742, lat: 37.393316}})
    let ranked = await PostCollection.findRanked(-122.07905010000002, 37.3931981)
    expect(ranked[0].title).toEqual('near')
    expect(ranked[1].title).toEqual('far')
  })

  $it('ranks highly voted posts higher', async () => {
    let Odin = YavannaForTest.get('Odin')

    let high = await PostCollection.create({title: 'high', loc: {long: 0, lat: 0}})
    let low = await PostCollection.create({title: 'low', loc: {long: 0, lat: 0}})

    await Odin.createVote('a-userVoteKey', high.postID.toString(), 1, 'post')
    await Odin.createVote('a-userVoteKey2', high.postID.toString(), 1, 'post')
    await Odin.createVote('a-userVoteKey3', high.postID.toString(), 1, 'post')

    expect((await PostCollection.findById(high.postID.toString())).netVotes).toEqual(3)

    let ranked = await PostCollection.findRanked(0, 0)
    expect(ranked[0].title).toEqual('high')
    expect(ranked[1].title).toEqual('low')

    let lowest = await PostCollection.create({title: 'lowest', loc: {long: 0, lat: 0}})

    await Odin.createVote('a-userVoteKey', lowest.postID.toString(), -1, 'post')
    await Odin.createVote('a-userVoteKey2', lowest.postID.toString(), -1, 'post')
    await Odin.createVote('a-userVoteKey3', lowest.postID.toString(), -1, 'post')

    expect((await PostCollection.findById(lowest.postID.toString())).netVotes).toEqual(-3)

    ranked = await PostCollection.findRanked(0, 0)
    expect(ranked[0].title).toEqual('high')
    expect(ranked[1].title).toEqual('low')
    expect(ranked[2].title).toEqual('lowest')
  })

  $it('finds posts progressively searching outwards and back in time until it has enough, but does not search past 1000m', async function() {
    let zeroMetersAway = await PostCollection.create({title: 'near', loc: {long: -122.07905010000002, lat: 37.3931981}})
    let eighteenMetersAway = await PostCollection.create({title: 'far', loc: {long: -122.07897550000001, lat: 37.3934292}})
    let lessThanOneThousandMetersAway = await PostCollection.create({title: 'further', loc: {long: -122.089742, lat: 37.393316}})
    await PostCollection.create({title: 'further2', loc: {long: -122.089742, lat: 37.393316}})

    let veryFarAway = await PostCollection.create({title: 'away', loc: {long: 2, lat: 2}})

    let resultsWithQuotaOf2 = (await PostCollection.findRanked(-122.07905010000002, 37.3931981, 2)).map(post => post.title)

    expect(resultsWithQuotaOf2).toContain('near')
    expect(resultsWithQuotaOf2).toContain('far')
    expect(resultsWithQuotaOf2).not.toContain('further')
    expect(resultsWithQuotaOf2).not.toContain('away')

    let resultsWithQuotaOf50 = (await PostCollection.findRanked(-122.07905010000002, 37.3931981, 50)).map(post => post.title)

    expect(resultsWithQuotaOf50).toContain('near')
    expect(resultsWithQuotaOf50).toContain('far')
    expect(resultsWithQuotaOf50).toContain('further')
    expect(resultsWithQuotaOf50).not.toContain('away')
  })

  $it('does not find more posts than the quota', async function() {
    await PostCollection.create({title: 'here', loc: {long: -122.07905010000002, lat: 37.3931981}})
    await PostCollection.create({title: '850m away', loc: {long: -122.089742, lat: 37.393316}})
    await PostCollection.create({title: '850m away #2', loc: {long: -122.089742, lat: 37.393316}})
    await PostCollection.create({title: 'away', loc: {long: 2, lat: 2}})

    let resultsWithQuotaOf2 = (await PostCollection.findRanked(-122.07905010000002, 37.3931981, 2)).map(post => post.title)

    expect(resultsWithQuotaOf2).toContain('here')
    expect(resultsWithQuotaOf2).toContain('850m away')
    expect(resultsWithQuotaOf2).not.toContain('850m away #2')
    expect(resultsWithQuotaOf2.length).toEqual(2)
  })
})
