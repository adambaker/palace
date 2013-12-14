define(['bacon'], function(b) {
  var streamFromBacon = function(baconStream) {
    return {
      each: function(action) {
        baconStream.onValue(action);
      },
      fmap: function(fn){
        return streamFromBacon(baconStream.map(fn));
      },
      filter: function(pred) {
        return streamFromBacon(baconStream.filter(pred));
      }
    }
  };

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
      stream: streamFromBacon(bus)
    }
  };

  var on = function(){
  };

  return {Stream: Stream}
});
