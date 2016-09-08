describe('Odin', () => {
  describe('createVote', () => {
    it ('upvotes a post', () => {
      let PostCollection = {
        recordVote: jasmine.createSpy('recordVote')
      }

      let VoteCollection = {
        recordVote: jasmine.createSpy('recordVote')
      }
      let Odin = Yavanna.withOverrides({PostCollection: PostCollection}).get('Odin')

      Odin.createVote('a-userVoteKey', 'a-post-id', 1, 'post')

      expect(VoteCollection.create('a-userVoteKey', 'a-post-id', 1))
      expect(PostCollection.recordVote).toHaveBeenCalledWith('a-post-id', 1)
    })

    it ('upvotes a comment', () => {
      let CommentCollection = {
        recordVote: jasmine.createSpy('recordVote')
      }
      let VoteCollection = {
        recordVote: jasmine.createSpy('recordVote')
      }
      let Odin = Yavanna.withOverrides({CommentCollection: CommentCollection, VoteCollection: VoteCollection}).get('Odin')

      Odin.recordVote('a-userVoteKey', 'a-post-id', 1, 'post')

      expect(VoteCollection.recordVote('a-userVoteKey', 'a-post-id', 1))
      expect(CommentCollection.recordVote).toHaveBeenCalledWith('a-post-id', 1)
    })
  })
})
