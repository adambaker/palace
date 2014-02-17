(function(){
  var states, testState, mod;
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
  testState = function(actual, expected){
    var normExpected;
    normExpected = History.normalizeState(states[expected]);
    assert(actual.normalized, 'normalized');
    assert.equal(actual.title, normExpected.title, 'title');
    assert.equal(actual.cleanUrl, normExpected.cleanUrl, 'cleanUrl');
    assert.deepEqual(actual.state, normExpected.state, 'state');
    return assert.equal(actual.url, normExpected.url, 'url');
  };
  mod = function(palace){
    var o, hist, state, push, replace;
    o = it;
    hist = palace.history;
    state = hist.state;
    push = hist.pushState;
    replace = hist.replaceState;
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
        beforeEach(function(){
          this.spy = sinon.spy();
          state.changes().each(this.spy);
        });
        o('starts with a default state from url', function(){
          testState(state.value, 0);
        });
        o('gracefully upgrades HTML4 -> HTML5', function(){
          History.setHash(History.getHashByState(states[1]));
          testState(state.value, 1);
        });
        o('changes with pushState', function(){
          push(states[2].data, states[2].title, states[2].url);
          testState(state.value, 2);
        });
        o('does not change when you push or replace the same state', function(){
          replace(states[2].data, states[2].title, states[2].url);
          push(states[2].data, states[2].title, states[2].url);
          assert(!this.spy.called);
        });
        o('replaces the state', function(){
          replace(states[3].data, states[3].title, states[3].url);
          testState(state.value, 3);
          push(states[4].data, states[4].title, states[4].url);
          testState(state.value, 4);
        });
        o('can go back two', function(done){
          var called;
          called = false;
          state.changes().each(function(){
            if (called) {
              testState(state.value, 1);
              return done();
            } else {
              testState(state.value, 3);
              return called = true;
            }
          });
          hist.go(-2);
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
