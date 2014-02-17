const streams = require('./streams')
hist = require('../bower_components/history/scripts/bundled-uncompressed/html4+html5/native.history')

hist = streams!
History.Adapter.bind window, \statechange, ->
  hist.in.push History.get-state!

module.exports = {
  state: hist.stream.property(History.get-state!)
  push-state: History.push-state
  replace-state: History.replace-state
}
