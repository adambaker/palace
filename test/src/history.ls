states = {
  0: {
    'url': document.location.href.replace(/#.*$/,''),
    'title': ''
  },
  1: {
    'data': {
      'state': 1,
      'rand': Math.random()
    },
    'title': 'State 1',
    'url': '?state=1'
  },
  2: {
    'data': {
      'state': 2,
      'rand': Math.random()
    },
    'title': 'State 2',
    'url': '?state=2&asd=%20asd%2520asd'
  },
  3: {
    'url': '?state=3'
  },
  4: {
    'data': {
      'state': 4,
      'trick': true,
      'rand': Math.random()
    },
    'title': 'State 4',
    'url': '?state=3'
  },
  5: {
    'url': '?state=1#log'
  },
  6: {
    'data': {
      'state': 6,
      'rand': Math.random()
    },
    'url': 'six.html'
  },
  7: {
    'url': 'seven'
  },
  8: {
    'url': '/eight'
  }
}

test-state = (actual, expected) ->
  norm-expected = History.normalize-state expected
  assert actual.normalized, \normalized
  assert.equal actual.title, norm-expected.title, \title
  assert.equal actual.url, norm-expected.url, \url
  assert.deep-equal actual.state, norm-expected.state, \state
  assert.equal actual.clean-url, norm-expected.clean-url, \cleanUrl

mod = (palace) !->
  const o = it
  state = palace.history.state

  describe 'palace.history' !->
    o 'loads the history' !->
      assert(window.History);

    o 'exports a history state property' !->
      assert palace.streams.is-property state

    /*The tests recapitulate the history.js test suite, but check
     * the evolving value of the palace property.
     */
    describe 'history.js tests, on our property' !->
      before-each !->
        @spy = sinon.spy!
        state.each @spy

      o 'starts with a default state from url' !->
        assert.deep-equal state.value, History.normalize-state(states[0])

      o 'gracefully upgrades HTML4 -> HTML5' !->
        History.setHash(History.getHashByState(states[1]));
        test-state state.value, states.1

      o 'changes with pushState' !->
        palace.history.push-state states.2.data, states.2.title, states.2.url
        test-state state.value, states.2



if typeof define == \function
  define <[palace]> (palace) !->
    mod palace
else
  mod(require '../../compiled/palace')
