Yavanna.provide('messageBus', () => {
  var subscriptions = {}

  return {
    subscribe(eventName, callback) {
      subscriptions[eventName] = subscriptions[eventName] || []
      subscriptions[eventName].push(callback)
    },

    send(eventName) {
      if (subscriptions[eventName]) {
        let errors = []

        for (let callback of subscriptions[eventName]) {
          try {
            callback()
          } catch(e) {
            errors.push(e.toString())
          }
        }

        if (errors.length) {
          throw `sending event ${eventName} encountered errors: ${errors.join(', ')}`
        }
      }
    }
  }
})
