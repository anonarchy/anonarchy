const { $afterEach, $it } = require('async-await-jasmine')

describe('VoteCollection', () => {
  const YavannaForTest = Yavanna.withOverrides({
    env: {
      ANONYPOST_DATABASE: 'mongodb://localhost:27017/anonypost_test',
      ANONYPOST_SECRET_KEY: 'secret'
    }
  })

  const VoteCollection = YavannaForTest.get('VoteCollection')
  const DB = YavannaForTest.get('DB')

  $afterEach(async () => {
    await DB.armageddon()
  })

  $it('creates a new vote record when the user has not yet voted on this post', async () => {
    expect(await VoteCollection.count()).toEqual(0)

    await VoteCollection.create('user-vote-key', 'votable-id', 1)

    expect(await VoteCollection.count()).toEqual(1)
  })

  $it('updates the vote record when the user changes their mind', async () => {
    await VoteCollection.create('user-vote-key', 'votable-id', 1)
    let vote = await VoteCollection.find('user-vote-key', 'votable-id')
    expect(vote.value).toEqual(1)

    await VoteCollection.create('user-vote-key', 'votable-id', -1)
    vote = await VoteCollection.find('user-vote-key', 'votable-id')
    expect(vote.value).toEqual(-1)
  })

  $it('does not allow duplicate votes', async () => {
    await VoteCollection.create('user-vote-key', 'votable-id', 1)
    await VoteCollection.create('user-vote-key', 'votable-id', 1)
    expect(await VoteCollection.count()).toEqual(1)
  })

  $it('deletes votes', async () => {
    await VoteCollection.create('user-vote-key', 'votable-id', 1)
    await VoteCollection.delete('user-vote-key', 'votable-id')
    expect(await VoteCollection.count()).toEqual(0)
  })

  $it('returns the vote record', async () => {
    expect(await VoteCollection.create('user-vote-key', 'votable-id', 1)).toEqual(jasmine.objectContaining({
      voteKey: 'da92269082e3b577300b85c5ba0c9d93425169bed6280f9cdbed28bfb43bae66',
      votableId: 'votable-id',
      value: 1
    }))
  })
})
