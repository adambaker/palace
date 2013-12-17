define(['bacon'], function(b) {
  var streamFromBacon = function(baconStream) {
    var ended = false;
    var endAction = function(action) {
      return function(arg) {
        if(!ended) {
          ended = true;
          action(arg);
        }
      };
    };

    return {
      onError: function(action) {
        baconStream.onError(endAction(action));
      },
      onEnd: function(action) {
        baconStream.onEnd(endAction(action));
      },
      each: function(action) {
        baconStream.onValue(action);
      },
      fmap: function(fn){
        return streamFromBacon(baconStream.map(fn));
      },
      filter: function(pred) {
        return streamFromBacon(baconStream.filter(pred));
      },
      merge: function(other) {
        bus = new b.Bus;
        other.each(function(data){bus.push(data)});
        return streamFromBacon(baconStream.merge(bus));
      }
    }
  };

  var Stream = function(){
    var bus = new b.Bus;
    bus.endOnError();
    return {
      in: {
        push: function(data) {
          bus.push(data)
        },
        end: function(){bus.end()},
        error: function(err) {bus.error(err)}
      },
      stream: streamFromBacon(bus)
    }
  };

  var on = function(){
  };

  return {Stream: Stream}
});
