describe('Odin', () => {
  describe('createVote', () => {
    it ('upvotes a post', () => {
      let PostCollection = {
        recordVote: jasmine.createSpy('recordVote')
      }

      let Odin = Yavanna.withOverrides({PostCollection: PostCollection}).get('Odin')

      Odin.createVote('a-session-token', 'a-post-id', 1, 'post')

      // expect(VoteCollection.create(''))
      expect(PostCollection.recordVote).toHaveBeenCalledWith('a-post-id', 1)
    })
  })
})