const b = require('baconjs')

stream-from-bacon = -> stream-proto with __bacon: it
prop-from-bacon = ->
  prop = prop-proto with __bacon: it
  it.onValue (val) -> prop.value = val
  prop

delegate = (method, ctor = (->it) ) ->
  -> ctor(@__bacon[method].apply(@__bacon, &))

stream-proto = {
  each: delegate \onValue
  onEnd: delegate \onEnd
  onError: delegate \onError
  join: ->
    bus = new b.Bus
    @each (stream) ->
      bus.plug(stream.__bacon)
    stream-from-bacon bus
  merge: (...others) ->
    bus = new b.Bus!
    bus.plug @__bacon
    for other in others
      bus.plug other.__bacon
    stream-from-bacon bus
  zip: (...others) ->
    baconStreams = [@__bacon] ++ others.map -> it.__bacon
    stream-from-bacon(b.zipAsArray baconStreams)
  zipWith: (f, ...streams) ->
    @zip.apply(@, streams).map(-> f.apply(null, it))
  flat-map: (f) -> @map(f).join!
  property: (initial) ->
    propFromBacon @__bacon.toProperty(initial)
}
for method in <[take takeWhile filter map]>
  stream-proto[method] = delegate(method, stream-from-bacon)

stream-proto.fmap = stream-proto.map

prop-proto = {
  each: delegate \onValue
  changes: delegate \changes, stream-from-bacon
  as-stream: delegate \toEventStream, stream-from-bacon
  map: delegate \map, prop-from-bacon
  value-of: -> @value
}

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

stream.is-stream = -> Object.get-prototype-of(it) == stream-proto
stream.is-property = -> Object.get-prototype-of(it) == prop-proto

module.exports = stream
