var geolib = require('geolib')

Yavanna.provide('getDistance', function() {
  return function getDistance(loc1, loc2) {
    return geolib.getDistance(format(loc1), format(loc2))
  }

  function format({lat, long}) {
    return {
      latitude: lat,
      longitude: long
    }
  }
})
