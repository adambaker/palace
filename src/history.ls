const streams = require('./streams')
hist = require('../bower_components/history/scripts/bundled-uncompressed/html4+html5/native.history')

hist = streams!
History.Adapter.bind window, \statechange, ->
  hist.push History.get-state!

module.exports = {
  state: hist.stream.property(History.get-state!)
}
