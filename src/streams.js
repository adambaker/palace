define(['bacon'], function(b) {
  var streamFromBacon = function(baconStream) {
    var delegate = function(method) {
      return function(){
        return streamFromBacon(baconStream[method].apply(baconStream,arguments));
      };
    };
    var ended = false;
    var endAction = function(action) {
      return function(arg) {
        if(!ended) {
          ended = true;
          action(arg);
        }
      };
    };

    var stream = {
      onError: function(action) {
        baconStream.onError(endAction(action));
      },
      onEnd: function(action) {
        baconStream.onEnd(endAction(action));
      },
      each: delegate('onValue'),
      fmap: delegate('map'),
      merge: function(other) {
        bus = new b.Bus;
        other.each(function(data){bus.push(data)});
        return streamFromBacon(baconStream.merge(bus));
      }
    };
    'take takeWhile filter'.split(' ').forEach(function(method){
      stream[method] = delegate(method);
    });
    return stream;
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
