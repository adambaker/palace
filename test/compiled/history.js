(function(){
  var mod;
  mod = function(history){
    var o;
    o = it;
    describe('palace.history', function(){
      o('it loads the history', function(){
        assert(window.History);
      });
    });
  };
  if (typeof define === 'function') {
    define(['palace'], function(palace){
      mod(palace.history);
    });
  } else {
    mod(require('../../src/history'));
  }
}).call(this);
