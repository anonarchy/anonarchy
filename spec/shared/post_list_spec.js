var React = require('react')
var ReactDOM = require('react-dom')

var TestUtils = require('react-addons-test-utils')

var jsdom = require('jsdom')

global.document = jsdom.jsdom('<!doctype html><html><body></body></html>')
global.window = document.defaultView
// import App from '../../lib/app.js'

describe('post list', () => {
  it('renders something', () => {
    var App = Yavanna.get('App')

    var component = TestUtils.renderIntoDocument(
      <App />
    )

    var thing = TestUtils.findRenderedDOMComponentWithTag(
      component, 'ul'
    )

    expect(ReactDOM.findDOMNode(thing).textContent)
       .toEqual('Food is nice - ILikeFoodILikeFood is a dumbdumb! - Trollolol')
  })
})
