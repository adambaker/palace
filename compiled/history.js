(function(){
  var streams, hist;
  streams = require('./streams');
  hist = require('../bower_components/history/scripts/bundled-uncompressed/html4+html5/native.history');
  hist = streams();
  History.Adapter.bind(window, 'statechange', function(){
    return hist['in'].push(History.getState());
  });
  module.exports = {
    state: hist.stream.property(History.getState()),
    pushState: History.pushState,
    replaceState: History.replaceState,
    go: History.go
  };
}).call(this);
