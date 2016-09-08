Yavanna.provide('VoteCollection', () => {
  return 'placeholder'
  // return {
  //   recordVote: function(vote, voteKey){
  //     var vote = await DB.findAndModify('votes',
  //       {postID: vote.ID, voteKey: voteKey, type: vote.type},
  //       [],
  //       {$set: {value: vote.value}},
  //       {upsert: true, new: true}
  //     )
  //     return vote
  //   }
  // }
})
