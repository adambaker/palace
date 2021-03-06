(function(){
  var b, streamFromBacon, propFromBacon, delegate, streamProto, i$, ref$, len$, method, propProto, stream, slice$ = [].slice;
  b = require('baconjs');
  streamFromBacon = function(it){
    var ref$;
    return ref$ = clone$(streamProto), ref$.__bacon = it, ref$;
  };
  propFromBacon = function(it){
    var prop, ref$;
    prop = (ref$ = clone$(propProto), ref$.__bacon = it, ref$);
    it.onValue(function(val){
      return prop.value = val;
    });
    return prop;
  };
  delegate = function(method, ctor){
    ctor == null && (ctor = function(it){
      return it;
    });
    return function(){
      return ctor(this.__bacon[method].apply(this.__bacon, arguments));
    };
  };
  streamProto = {
    each: delegate('onValue'),
    onEnd: delegate('onEnd'),
    onError: delegate('onError'),
    join: function(){
      var bus;
      bus = new b.Bus;
      this.each(function(stream){
        return bus.plug(stream.__bacon);
      });
      return streamFromBacon(bus);
    },
    merge: function(){
      var others, bus, i$, len$, other;
      others = slice$.call(arguments);
      bus = new b.Bus();
      bus.plug(this.__bacon);
      for (i$ = 0, len$ = others.length; i$ < len$; ++i$) {
        other = others[i$];
        bus.plug(other.__bacon);
      }
      return streamFromBacon(bus);
    },
    zip: function(){
      var others, baconStreams;
      others = slice$.call(arguments);
      baconStreams = [this.__bacon].concat(others.map(function(it){
        return it.__bacon;
      }));
      return streamFromBacon(b.zipAsArray(baconStreams));
    },
    zipWith: function(f){
      var streams;
      streams = slice$.call(arguments, 1);
      return this.zip.apply(this, streams).map(function(it){
        return f.apply(null, it);
      });
    },
    flatMap: function(f){
      return this.map(f).join();
    },
    property: function(initial){
      return propFromBacon(this.__bacon.toProperty(initial));
    }
  };
  for (i$ = 0, len$ = (ref$ = ['take', 'takeWhile', 'filter', 'map']).length; i$ < len$; ++i$) {
    method = ref$[i$];
    streamProto[method] = delegate(method, streamFromBacon);
  }
  streamProto.fmap = streamProto.map;
  propProto = {
    each: delegate('onValue'),
    changes: delegate('changes', streamFromBacon),
    asStream: delegate('toEventStream', streamFromBacon),
    map: delegate('map', propFromBacon),
    valueOf: function(){
      return this.value;
    }
  };
  stream = function(){
    var bus;
    bus = new b.Bus();
    return {
      'in': {
        push: function(it){
          return bus.push(it);
        },
        end: function(){
          return bus.end();
        },
        error: function(it){
          return bus.error(it);
        }
      },
      stream: streamFromBacon(bus)
    };
  };
  stream.isStream = function(it){
    return Object.getPrototypeOf(it) === streamProto;
  };
  stream.isProperty = function(it){
    return Object.getPrototypeOf(it) === propProto;
  };
  module.exports = stream;
  function clone$(it){
    function fun(){} fun.prototype = it;
    return new fun;
  }
}).call(this);
