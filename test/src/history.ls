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

mod = (palace) !->
  const o = it
  state = palace.history.state

  describe 'palace.history' !->
    o 'loads the history' !->
      assert(window.History);

    o 'exports a history state property' !->
      assert palace.streams.is-property state

    o 'starts with a default state from url' !->
      assert.deep-equal state.value, History.normalize-state(states[0])

if typeof define == \function
  define <[palace]> (palace) !->
    mod palace
else
  mod(require '../../compiled/palace')
