describe('Odin', () => {
  describe('createVote', () => {
    it ('upvotes a post', async (done) => {
      let PostCollection = {
        recordVote: jasmine.createSpy('recordVote').and.returnValue('asdf')
      }

      let VoteCollection = {
        create: jasmine.createSpy('create').and.returnValue('asdf')
      }
      let Odin = Yavanna.withOverrides({PostCollection, VoteCollection}).get('Odin')

      var foo = await Odin.newCreateVote('a-userVoteKey', 'a-post-id', 1, 'post')

      expect(VoteCollection.create).toHaveBeenCalledWith('a-userVoteKey', 'a-post-id', 1)
      expect(PostCollection.recordVote).toHaveBeenCalledWith('a-post-id', 1)

      done()
    })

    it ('upvotes a comment', async (done) => {
      let CommentCollection = {
        recordVote: jasmine.createSpy('recordVote').and.returnValue('asdf')
      }
      let VoteCollection = {
        create: jasmine.createSpy('create').and.returnValue('asdf')
      }
      let Odin = Yavanna.withOverrides({CommentCollection, VoteCollection}).get('Odin')

      var foo = await Odin.newCreateVote('a-userVoteKey', 'a-post-id', 1, 'comment')
      expect(VoteCollection.create).toHaveBeenCalledWith('a-userVoteKey', 'a-post-id', 1)
      expect(CommentCollection.recordVote).toHaveBeenCalledWith('a-post-id', 1)

      done()
    })
  })
})
