const React = require('react')

Yavanna.provide('DistanceAndTime', function({getDistance, formatRelativeTime}) {
  return React.createClass({
    render: function() {
      let {post, currentLocation} = this.props

      let distance = getDistance(
        currentLocation,
        post.loc
      )

      return <div className="distance" style={{fontSize: 12, color: '#888', paddingRight: 10, paddingBottom: 4, flex: 1}}>
        {
          post.tweet_id ? 'Near by' : formatDistance(distance)
        } | {formatRelativeTime(post.timestamp)}
      </div>
    }
  })

  function formatDistance(n) {
    if (n < 10){
      return 'Right here'
    }else if (n < 50){
      return 'Near by'
    }else{
      return  `${n} meters away`
    }
  }
})
