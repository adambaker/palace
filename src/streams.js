var b = require('baconjs');
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
    merge: function() {
      var bus = new b.Bus;
      [].forEach.call(arguments, function(other) {
        other.each(function(data){bus.push(data)});
      });
      return streamFromBacon(baconStream.merge(bus));
    },
    zip: function() {
      var baconStreams = [baconStream];
      [].forEach.call(arguments, function(other) {
        var bus = new b.Bus;
        other.each(function(data){bus.push(data)});
        baconStreams.push(bus);
      });
      return streamFromBacon(b.zipAsArray(baconStreams));
    },
    zipWith: function() {
      var f = arguments[0], streams = [].slice.call(arguments, 1);
      return this.zip.apply(this, streams) .map(function(args){return f.apply(null, args)});
    }
  };
  'take takeWhile filter'.split(' ').forEach(function(method){
    stream[method] = delegate(method);
  });
  stream.map = stream.fmap;
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

module.exports = Stream
