const b = require('baconjs')

delegate = (method) ->
  -> streamFromBacon(@__bacon[method].apply(@__bacon, &))

stream-proto = {
  each: delegate('onValue')
  merge: (...others) ->
    bus = new b.Bus!
    bus.plug @__bacon
    others.forEach -> bus.plug it.__bacon
    streamFromBacon bus
  zip: (...others) ->
    baconStreams = [@__bacon] ++ others.map -> it.__bacon
    streamFromBacon(b.zipAsArray baconStreams)
  zipWith: (f, ...streams) ->
    @zip.apply(@, streams).map(-> f.apply(null, it))
  property: (initial) ->
    propFromBacon @__bacon.toProperty(initial)
}
<[onError onEnd take takeWhile filter map]>.forEach((method) ->
  stream-proto[method] = delegate(method)
)
stream-proto.fmap = stream-proto.map

prop-proto = {
  on-change: delegate('onValue')
}
<[changes]>.forEach((method) ->
  prop-proto[method] = delegate(method)
)

streamFromBacon = -> stream-proto with __bacon: it
propFromBacon = -> prop-proto with __bacon: it

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
