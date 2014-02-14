const b = require('baconjs')

delegate = (method) ->
  -> streamFromBacon(@__bacon-stream[method].apply(@__bacon-stream, &))

streamFromBacon = (baconStream) ->
  stream = {
    __bacon-stream: bacon-stream
    each: delegate('onValue')
    merge: (...others) ->
      bus = new b.Bus!
      bus.plug @__bacon-stream
      others.forEach -> bus.plug it.__bacon-stream
      streamFromBacon bus
    zip: (...others) ->
      baconStreams = [baconStream] ++ others.map -> it.__bacon-stream
      streamFromBacon(b.zipAsArray baconStreams)
    zipWith: (f, ...streams) ->
      @zip.apply(@, streams).map(-> f.apply(null, it))
  }
  <[onError onEnd take takeWhile filter map]>.forEach((method) ->
    stream[method] = delegate(method)
  )
  stream.fmap = stream.map
  stream

stream = ->
  bus = new b.Bus!

  {
    in: {
      push: -> bus.push it
      end: -> bus.end!
      error: -> bus.error it
    }
    stream: streamFromBacon bus
  }

module.exports = stream
