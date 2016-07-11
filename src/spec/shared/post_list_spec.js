// var React = require('react')
// var ReactDOM = require('react-dom')
// // var $ = require('jquery')
//
// var TestUtils = require('react-addons-test-utils')
//
// var jsdom = require('jsdom')
//
// // import App from '../../lib/app.js'
//
// describe('post list', () => {
//   it('renders something', () => {
//     global.document = jsdom.jsdom('<!doctype html><html><body></body></html>')
//     global.window = document.defaultView
//
//     // var root = document.createElement('div')
//     var PostList = Yavanna.get('PostList')
//     var posts = [{body: 'Food is nice', author: 'ILikeFood'}, {body: 'ILikeFood is a dumbdumb!', author: 'Trollolol'}]
//
//     var component = TestUtils.renderIntoDocument(
//       <PostList posts={posts} />
//     )
//     // console.log($(root).find('ul'))
//
//     var thing = TestUtils.findRenderedDOMComponentWithTag(
//       component, 'ul'
//     )
//     // console.log("Text content: "+ReactDOM.findDOMNode(thing).textContent)
//     expect(ReactDOM.findDOMNode(thing).textContent).toEqual('Food is nice - ILikeFoodILikeFood is a dumbdumb! - Trollolol')
//
//     // ReactDOM.render(<PostList posts={posts} />, root)
//     // expect($(root).find('ul').text()).toEqual('Food is nice - ILikeFoodILikeFood is a dumbdumb! - Trollolol')
//     // expect($(root).find('ul').length).toEqual(0)
//   })
//
//   it('shows a message when there are no posts', () => {
//     global.document = jsdom.jsdom('<!doctype html><html><body></body></html>')
//     global.window = document.defaultView
//
//     // var root = document.createElement('div')
//     var PostList = Yavanna.get('PostList')
//     var posts = []
//
//     var component = TestUtils.renderIntoDocument(
//       <PostList posts={posts} />
//     )
//     // console.log($(root).find('ul'))
//
//     var thing = TestUtils.scryRenderedDOMComponentsWithTag(
//       component, 'ul'
//     )
//     // console.log("Text content: "+ReactDOM.findDOMNode(thing).textContent)
//     expect(thing).toEqual([])
//
//     var noPosts = TestUtils.findRenderedDOMComponentWithTag(
//       component, 'p'
//     )
//
//     expect(ReactDOM.findDOMNode(noPosts).textContent).toEqual('There are no posts here')
//   })
// })
