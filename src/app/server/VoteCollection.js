Yavanna.provide('VoteCollection', ({cryptoHash, DB}) => {
  return {
    create: async function(userVoteKey, votableId, value){
      let voteKey = cryptoHash([userVoteKey, votableId])

      var vote = await DB.findAndModify('votes',
        {votableId: votableId, voteKey: voteKey},
        [],
        {$set: {value: value}},
        {upsert: true, new: true}
      )
      return vote.value
    },

    delete: async function(userVoteKey, votableId) {
      let voteKey = cryptoHash([userVoteKey, votableId])
      return await DB.execOne('votes', 'findAndRemove', {votableId: votableId, voteKey: voteKey})
    },


    count: async function() {
      return await DB.count('votes')
    },




    find: async function(userVoteKey, votableId) {
      let voteKey = cryptoHash([userVoteKey, votableId])
      return await DB.execOne('votes', 'findOne', {voteKey: voteKey})
    }
  }
})
