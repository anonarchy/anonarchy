const { $it } = require('async-await-jasmine')

describe('Odin', () => {
  describe('createVote', () => {
    let env = {
      ANONYPOST_DATABASE: 'fake database',
      ANONYPOST_SECRET_KEY: 'secret'
    }

    $it ('upvotes a post', async () => {
      let PostCollection = {
        recordVote: jasmine.createSpy('recordVote').and.returnValue('asdf')
      }

      let VoteCollection = {
        create: jasmine.createSpy('create').and.returnValue('asdf')
      }

      let Odin = Yavanna.withOverrides({PostCollection, VoteCollection, env}).get('Odin')

      var foo = await Odin.newCreateVote('a-userVoteKey', 'a-post-id', 1, 'post')
      expect(VoteCollection.create).toHaveBeenCalledWith('a-userVoteKey', 'a-post-id', 1)
      expect(PostCollection.recordVote).toHaveBeenCalledWith('a-post-id', 1)
    })

    $it ('upvotes a comment', async () => {
      let CommentCollection = {
        recordVote: jasmine.createSpy('recordVote').and.returnValue('asdf')
      }
      let VoteCollection = {
        create: jasmine.createSpy('create').and.returnValue('asdf')
      }

      let Odin = Yavanna.withOverrides({CommentCollection, VoteCollection, env}).get('Odin')

      var foo = await Odin.newCreateVote('a-userVoteKey', 'a-post-id', 1, 'comment')
      expect(VoteCollection.create).toHaveBeenCalledWith('a-userVoteKey', 'a-post-id', 1)
      expect(CommentCollection.recordVote).toHaveBeenCalledWith('a-post-id', 1)
    })
  })
})
