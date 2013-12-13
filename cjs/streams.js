"use strict";
var Bus = require("baconjs").Bus;var Stream = function(){
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
exports.Stream = Stream;
var on = function(){
};
exports.on = on;