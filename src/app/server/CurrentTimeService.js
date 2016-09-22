Yavanna.provide('CurrentTimeService', () => {
  return {
    millis: () => (new Date()).getTime()
  }
})
