define(['bacon'], function(b) {
  var Stream = function(){
    var bus = new b.Bus;
    return {
      in: {
        push: function(data) {
          bus.push(data)
        },
        end: function(){bus.end()},
        error: function(err) {bus.error(err); bus.end();}
      },
      stream: {
        each: function(fn) {
          bus.onValue(fn);
        },
        filter: function(pred) {
        }
      }
    }
  };

  var on = function(){
  };

  return {Stream: Stream}
});
