import {Bus} from 'baconjs'

export var Stream = function(){
  var bus = new Bus;
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
      }
    }
  }
};

export var on = function(){
};

