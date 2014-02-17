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
  norm-expected = History.normalize-state states[expected]
  assert actual.normalized, \normalized
  console.log actual.state
  assert.deep-equal actual.state, norm-expected.state, \state
  console.log actual.title
  assert.equal actual.title, norm-expected.title, \title
  ## these fuck up testling
  #assert.equal actual.clean-url, norm-expected.clean-url, \cleanUrl
  #assert.equal actual.url, norm-expected.url, \url

mod = (palace) !->
  const o = it
  hist  = palace.history
  state = hist.state
  push  = hist.push-state
  replace = hist.replace-state

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
        state.changes!each @spy

      after ->
        History.back!
        History.back!

      o 'starts with a default state from url' !->
        test-state state.value, 0

      o 'gracefully upgrades HTML4 -> HTML5' !->
        History.setHash(History.getHashByState(states[1]));
        test-state state.value, 1

      o 'changes with pushState' !->
        push states.2.data, states.2.title, states.2.url
        test-state state.value, 2

      o 'does not change when you push or replace the same state' (done) !->
        replace states.2.data, states.2.title, states.2.url
        push states.2.data, states.2.title, states.2.url
        set-timeout (~> assert !@spy.called; done!), 10

      o 'replaces the state' !->
        replace states.3.data, states.3.title, states.3.url
        test-state state.value, 3
        push states.4.data, states.4.title, states.4.url
        test-state state.value, 4

      o 'can go back two' (done) !->
        called = false
        unsub = state.changes!.each ->
          if called
            test-state it, 1
            unsub!
            done!
          else
            test-state it, 3
            called := true
        History.go -2

      o 'back works' (done) !->
        unsub = state.changes!.each ->
          test-state it, 0
          unsub!
          done!
        History.back!

      o 'can go forward two' (done) !->
        called = false
        unsub = state.changes!.each ->
          if called
            test-state it, 3
            unsub!
            done!
          else
            test-state it, 1
            called := true
        History.go 2

      o 'forward works' (done) !->
        unsub = state.changes!.each ->
          test-state it, 4
          unsub!
          done!
        History.forward!

      o 'navigating with traditional anchors'  (done) !->
        History.set-hash \log
        History.back!
        set-timeout (~>
          assert !@spy.called
          unsub = state.changes!.each ->
            test-state it, 3
            unsub!
            done!
          History.back!
        ), 100

      o 'adding more states' !->
        push states.6.data, states.6.title, states.6.url
        test-state state.value, 6
        push states.7.data, states.7.title, states.7.url
        test-state state.value, 7
        push states.8.data, states.8.title, states.8.url
        test-state state.value, 8
        next-state = 7
        unsub = state.changes!.each ->
          test-state it, next-state
          next-state--;
          if next-state < 6
            unsub!
            done!
        History.back!


if typeof define == \function
  define <[palace]> (palace) !->
    mod palace
else
  mod(require '../../compiled/palace')
