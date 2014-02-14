(function(){
  var b, streamFromBacon, propFromBacon, delegate, streamProto, propProto, stream, slice$ = [].slice;
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
    merge: function(){
      var others, bus;
      others = slice$.call(arguments);
      bus = new b.Bus();
      bus.plug(this.__bacon);
      others.forEach(function(it){
        return bus.plug(it.__bacon);
      });
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
    property: function(initial){
      return propFromBacon(this.__bacon.toProperty(initial));
    }
  };
  ['take', 'takeWhile', 'filter', 'map'].forEach(function(method){
    return streamProto[method] = delegate(method, streamFromBacon);
  });
  streamProto.fmap = streamProto.map;
  propProto = {
    onChange: delegate('onValue'),
    changes: delegate('changes', streamFromBacon),
    valueOf: function(){
      return this.value;
    }
  };
  ['map'].forEach(function(method){
    return propProto[method] = delegate(method, propFromBacon);
  });
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
