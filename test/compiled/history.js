(function(){
  var states, mod;
  states = {
    0: {
      'url': document.location.href.replace(/#.*$/, ''),
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
  };
  mod = function(palace){
    var o, state;
    o = it;
    state = palace.history.state;
    describe('palace.history', function(){
      o('loads the history', function(){
        assert(window.History);
      });
      o('exports a history state property', function(){
        assert(palace.streams.isProperty(state));
      });
      /*The tests recapitulate the history.js test suite, but check
       * the evolving value of the palace property.
       */
      describe('history.js tests, on our property', function(){
        o('starts with a default state from url', function(){
          assert.deepEqual(state.value, History.normalizeState(states[0]));
        });
      });
    });
  };
  if (typeof define === 'function') {
    define(['palace'], function(palace){
      mod(palace);
    });
  } else {
    mod(require('../../compiled/palace'));
  }
}).call(this);
