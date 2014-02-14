(function(){
  var streams, hist;
  streams = require('./streams');
  hist = require('../bower_components/history/scripts/bundled-uncompressed/html4+html5/native.history');
  hist = streams();
  History.Adapter.bind(window, 'statechange', function(){
    return hist.push(History.getState());
  });
  module.exports = {
    state: hist.stream.property(History.getState())
  };
}).call(this);
