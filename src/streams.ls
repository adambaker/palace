const b = require('baconjs')
streamFromBacon = (baconStream) ->
  delegate = (method) ->
    -> streamFromBacon(baconStream[method].apply(baconStream, &))

  stream = {
    each: delegate('onValue')
    merge: (...others) ->
      bus = new b.Bus!
      others.forEach(!->it.each(!-> bus.push(it)))
      streamFromBacon(baconStream.merge(bus))
    zip: (...others) ->
      baconStreams = [baconStream]
      others.forEach((other) !->
        bus = new b.Bus!
        other.each((data) !-> bus.push(data))
        baconStreams.push bus
      )
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
