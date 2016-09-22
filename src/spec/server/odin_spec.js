const { $afterEach, $it } = require('async-await-jasmine')

describe('Odin', () => {
  let env = {
    ANONYPOST_DATABASE: 'fake database',
    ANONYPOST_SECRET_KEY: 'secret'
  }

  const YavannaForTest = Yavanna.withOverrides({
    env: {
      ANONYPOST_DATABASE: 'mongodb://localhost:27017/anonypost_test',
      ANONYPOST_SECRET_KEY: 'secret'
    }
  })

  const VoteCollection = YavannaForTest.get('VoteCollection')
  const DB = YavannaForTest.get('DB')

  describe('createVote', () => {

    $afterEach(async () => {
      await DB.armageddon()
    })

    $it ('upvotes a post that the user has not voted on yet', async () => {
      let PostCollection = {
        recordVote: jasmine.createSpy('recordVote').and.returnValue('asdf')
      }

      let VoteCollection = {
        create: jasmine.createSpy('create').and.returnValue('asdf'),
        find: jasmine.createSpy('find').and.returnValue(null)
      }

      let Odin = Yavanna.withOverrides({PostCollection, VoteCollection, env}).get('Odin')

      var foo = await Odin.createVote('a-userVoteKey', 'a-post-id', 1, 'post')
      expect(VoteCollection.create).toHaveBeenCalledWith('a-userVoteKey', 'a-post-id', 1)
      expect(PostCollection.recordVote).toHaveBeenCalledWith('a-post-id', 1, 1)
    })

    $it ('updates a post that the user has voted on already', async () => {

      let Odin = YavannaForTest.get('Odin')
      let PostCollection = YavannaForTest.get('PostCollection')

      var post = await Odin.createPost({title: "Some post", text: "body"})
      var foo = await Odin.createVote('a-userVoteKey', post.postID.toString(), 1, 'post')
      expect((await PostCollection.findById(post.postID.toString())).netVotes).toEqual(1)
      expect((await PostCollection.findById(post.postID.toString())).upvotes).toEqual(1)
      var foo = await Odin.createVote('a-userVoteKey', post.postID.toString(), -1, 'post')
      expect((await PostCollection.findById(post.postID.toString())).netVotes).toEqual(-1)
      expect((await PostCollection.findById(post.postID.toString())).upvotes).toEqual(0)
      var foo = await Odin.createVote('a-userVoteKey', post.postID.toString(), 1, 'post')
      expect((await PostCollection.findById(post.postID.toString())).netVotes).toEqual(1)
      expect((await PostCollection.findById(post.postID.toString())).upvotes).toEqual(1)
    })

    $it ('downvotes post', async () => {

      let Odin = YavannaForTest.get('Odin')
      let PostCollection = YavannaForTest.get('PostCollection')

      var post = await Odin.createPost({title: "Some post", text: "body"})
      var foo = await Odin.createVote('a-userVoteKey', post.postID.toString(), -1, 'post')
      expect((await PostCollection.findById(post.postID.toString())).netVotes).toEqual(-1)
      expect((await PostCollection.findById(post.postID.toString())).upvotes).toEqual(0)
      var foo = await Odin.createVote('a-userVoteKey', post.postID.toString(), 1, 'post')
      expect((await PostCollection.findById(post.postID.toString())).netVotes).toEqual(1)
      expect((await PostCollection.findById(post.postID.toString())).upvotes).toEqual(1)
    })

    $it ('double downvotes post', async () => {

      let Odin = YavannaForTest.get('Odin')
      let PostCollection = YavannaForTest.get('PostCollection')

      var post = await Odin.createPost({title: "Some post", text: "body"})
      var foo = await Odin.createVote('a-userVoteKey', post.postID.toString(), -1, 'post')
      expect((await PostCollection.findById(post.postID.toString())).netVotes).toEqual(-1)
      expect((await PostCollection.findById(post.postID.toString())).upvotes).toEqual(0)
      var foo = await Odin.createVote('a-userVoteKey', post.postID.toString(), -1, 'post')
      expect((await PostCollection.findById(post.postID.toString())).netVotes).toEqual(-1)
      expect((await PostCollection.findById(post.postID.toString())).upvotes).toEqual(0)
    })

    $it ('double upvotes post', async () => {

      let Odin = YavannaForTest.get('Odin')
      let PostCollection = YavannaForTest.get('PostCollection')

      var post = await Odin.createPost({title: "Some post", text: "body"})
      var foo = await Odin.createVote('a-userVoteKey', post.postID.toString(), 1, 'post')
      expect((await PostCollection.findById(post.postID.toString())).netVotes).toEqual(1)
      expect((await PostCollection.findById(post.postID.toString())).upvotes).toEqual(1)
      var foo = await Odin.createVote('a-userVoteKey', post.postID.toString(), 1, 'post')
      expect((await PostCollection.findById(post.postID.toString())).netVotes).toEqual(1)
      expect((await PostCollection.findById(post.postID.toString())).upvotes).toEqual(1)
    })

    $it ('two users upvote post', async () => {

      let Odin = YavannaForTest.get('Odin')
      let PostCollection = YavannaForTest.get('PostCollection')

      var post = await Odin.createPost({title: "Some post", text: "body"})
      var foo = await Odin.createVote('a-userVoteKey', post.postID.toString(), 1, 'post')
      expect((await PostCollection.findById(post.postID.toString())).netVotes).toEqual(1)
      expect((await PostCollection.findById(post.postID.toString())).upvotes).toEqual(1)
      var foo = await Odin.createVote('a-userVoteKey2', post.postID.toString(), 1, 'post')
      expect((await PostCollection.findById(post.postID.toString())).netVotes).toEqual(2)
      expect((await PostCollection.findById(post.postID.toString())).upvotes).toEqual(2)
    })

    $it ('two users one upvote, one downvote', async () => {

      let Odin = YavannaForTest.get('Odin')
      let PostCollection = YavannaForTest.get('PostCollection')

      var post = await Odin.createPost({title: "Some post", text: "body"})
      var foo = await Odin.createVote('a-userVoteKey', post.postID.toString(), 1, 'post')
      expect((await PostCollection.findById(post.postID.toString())).netVotes).toEqual(1)
      expect((await PostCollection.findById(post.postID.toString())).upvotes).toEqual(1)
      var foo = await Odin.createVote('a-userVoteKey2', post.postID.toString(), -1, 'post')
      expect((await PostCollection.findById(post.postID.toString())).netVotes).toEqual(0)
      expect((await PostCollection.findById(post.postID.toString())).upvotes).toEqual(1)
    })


    $it ('upvotes a comment', async () => {
      let CommentCollection = {
        recordVote: jasmine.createSpy('recordVote').and.returnValue('asdf')
      }
      let VoteCollection = {
        create: jasmine.createSpy('create').and.returnValue('asdf'),
        find: jasmine.createSpy('find').and.returnValue(null)
      }

      let Odin = Yavanna.withOverrides({CommentCollection, VoteCollection, env}).get('Odin')

      var foo = await Odin.createVote('a-userVoteKey', 'a-post-id', 1, 'comment')
      expect(VoteCollection.create).toHaveBeenCalledWith('a-userVoteKey', 'a-post-id', 1)
      expect(CommentCollection.recordVote).toHaveBeenCalledWith('a-post-id', 1, 1)
    })
  })

  describe('deleteVote', () => {

    $afterEach(async () => {
      await DB.armageddon()
    })

    $it ('deletes votes', async () => {

      let Odin = YavannaForTest.get('Odin')
      let PostCollection = YavannaForTest.get('PostCollection')

      var post = await Odin.createPost({title: "Some post", text: "body"})
      var foo = await Odin.createVote('a-userVoteKey', post.postID.toString(), 1, 'post')
      expect((await PostCollection.findById(post.postID.toString())).netVotes).toEqual(1)
      expect((await PostCollection.findById(post.postID.toString())).upvotes).toEqual(1)
      var foo = await Odin.deleteVote('a-userVoteKey', post.postID.toString(), 'post')
      expect((await PostCollection.findById(post.postID.toString())).netVotes).toEqual(0)
      expect((await PostCollection.findById(post.postID.toString())).upvotes).toEqual(0)
      var foo = await Odin.createVote('a-userVoteKey', post.postID.toString(), -1, 'post')
      expect((await PostCollection.findById(post.postID.toString())).netVotes).toEqual(-1)
      expect((await PostCollection.findById(post.postID.toString())).upvotes).toEqual(0)
      var foo = await Odin.deleteVote('a-userVoteKey', post.postID.toString(), 'post')
      expect((await PostCollection.findById(post.postID.toString())).netVotes).toEqual(0)
      expect((await PostCollection.findById(post.postID.toString())).upvotes).toEqual(0)
    })

    $it ("does not change count if there's no vote to be deleted", async () => {

      let Odin = YavannaForTest.get('Odin')
      let PostCollection = YavannaForTest.get('PostCollection')

      var post = await Odin.createPost({title: "Some post", text: "body"})
      var foo = await Odin.createVote('a-userVoteKey', post.postID.toString(), 1, 'post')
      expect((await PostCollection.findById(post.postID.toString())).netVotes).toEqual(1)
      expect((await PostCollection.findById(post.postID.toString())).upvotes).toEqual(1)
      var foo = await Odin.createVote('a-userVoteKey2', post.postID.toString(), 1, 'post')
      expect((await PostCollection.findById(post.postID.toString())).netVotes).toEqual(2)
      expect((await PostCollection.findById(post.postID.toString())).upvotes).toEqual(2)
      var foo = await Odin.deleteVote('a-userVoteKey3', post.postID.toString(), 'post')
      expect((await PostCollection.findById(post.postID.toString())).netVotes).toEqual(2)
      expect((await PostCollection.findById(post.postID.toString())).upvotes).toEqual(2)
    })


  })
})
