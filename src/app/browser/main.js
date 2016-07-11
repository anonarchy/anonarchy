var ReactDOM = require('react-dom')
var React = require('react')
var injectTapEventPlugin = require('react-tap-event-plugin')

document.body.style.margin = 0 + 'em';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
var App = Yavanna.get('App')


injectTapEventPlugin()

ReactDOM.render(
  <App />,
  document.getElementById('container')
)
