describe('VoteCollection', () => {
  const VoteCollection = Yavanna.withOverrides({
    env: {
      ANONYPOST_DATABASE: 'mongodb://localhost:27017/anonypost_test',
      ANONYPOST_SECRET_KEY: 'secret'
    }
  }).get('VoteCollection')

  // afterEach(async done => {
  //   await Yavanna.get('DB').armageddon()
  //   done()
  // })

  it('creates a new vote record when the user has not yet voted on this post', () => {

  })

  it('returns the vote record', async done => {
    expect(await VoteCollection.create('user-vote-key', 'votable-id', 1)).toEqual(jasmine.objectContaining({
      voteKey: 'da92269082e3b577300b85c5ba0c9d93425169bed6280f9cdbed28bfb43bae66',
      votableId: 'votable-id',
      value: 1
    }))

    done()
  })
})
