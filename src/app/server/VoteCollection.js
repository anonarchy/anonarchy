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
    }
  }
})
