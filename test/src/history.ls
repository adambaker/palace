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

mod = (history) !->
  const o = it

  describe 'palace.history' !->
    o 'it loads the history' !->
      assert(window.History);

if typeof define == \function
  define <[palace]> (palace) !->
    mod palace.history
else
  mod(require '../../compiled/history')
