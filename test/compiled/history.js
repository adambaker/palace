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
    console.log(JSON.stringify(actual.state), JSON.stringify(normExpected.state));
    assert.deepEqual(actual.state, normExpected.state, 'state');
    console.log(actual.title, normExpected.title);
    return assert.equal(actual.title, normExpected.title, 'title');
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
        after(function(){
          History.back();
          return History.back();
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
        o('does not change when you push or replace the same state', function(done){
          var this$ = this;
          replace(states[2].data, states[2].title, states[2].url);
          push(states[2].data, states[2].title, states[2].url);
          setTimeout(function(){
            assert(!this$.spy.called);
            return done();
          }, 10);
        });
        o('replaces the state', function(){
          replace(states[3].data, states[3].title, states[3].url);
          testState(state.value, 3);
          push(states[4].data, states[4].title, states[4].url);
          testState(state.value, 4);
        });
        o('can go back two', function(done){
          var called, unsub;
          called = false;
          unsub = state.changes().each(function(it){
            if (called) {
              testState(it, 1);
              unsub();
              return done();
            } else {
              testState(it, 3);
              return called = true;
            }
          });
          History.go(-2);
        });
        o('back works', function(done){
          var unsub;
          unsub = state.changes().each(function(it){
            testState(it, 0);
            unsub();
            return done();
          });
          History.back();
        });
        o('can go forward two', function(done){
          var called, unsub;
          called = false;
          unsub = state.changes().each(function(it){
            if (called) {
              testState(it, 3);
              unsub();
              return done();
            } else {
              testState(it, 1);
              return called = true;
            }
          });
          History.go(2);
        });
        o('forward works', function(done){
          var unsub;
          unsub = state.changes().each(function(it){
            testState(it, 4);
            unsub();
            return done();
          });
          History.forward();
        });
        o('navigating with traditional anchors', function(done){
          var this$ = this;
          History.setHash('log');
          History.back();
          setTimeout(function(){
            var unsub;
            assert(!this$.spy.called);
            unsub = state.changes().each(function(it){
              testState(it, 3);
              unsub();
              return done();
            });
            return History.back();
          }, 100);
        });
        o('adding more states', function(){
          var nextState, unsub;
          push(states[6].data, states[6].title, states[6].url);
          testState(state.value, 6);
          push(states[7].data, states[7].title, states[7].url);
          testState(state.value, 7);
          push(states[8].data, states[8].title, states[8].url);
          testState(state.value, 8);
          nextState = 7;
          unsub = state.changes().each(function(it){
            testState(it, nextState);
            nextState--;
            if (nextState < 6) {
              unsub();
              return done();
            }
          });
          History.back();
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
