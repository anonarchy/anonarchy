Yavanna.provide('formatRelativeTime', () => {
  return function formatRelativeTime(timestamp) {
    var sec = 1000; // millis
    var hour = 3600 * sec;
    var millisDifference = +(new Date()) - timestamp
    if (millisDifference < 60 * sec) {
      return 'Just now'
    } else if (millisDifference < 600 * sec) {
      return 'A few minutes ago'
    } else if (millisDifference < 1 * hour) {
      return 'Less than an hour ago'
    } else if (millisDifference < 2 * hour) {
      return 'An hour ago'
    } else if (millisDifference < 24 * hour) {
      return '' + Math.round(millisDifference / hour) + ' hours ago'
    } else {
      return '' + Math.round(millisDifference / (24 * hour)) + ' days ago'
    }
  }
})
