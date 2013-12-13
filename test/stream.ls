define <[palace]>, (streams) ->
  const Stream = streams.Stream
  const on-ui = streams.on

  const o = it

  describe 'Stream' !->
    before-each !->
      s = Stream!
      @in = s.in
      @stream = s.stream

    describe 'each' !->
      before-each !->
        @x = 0;
        @spy = sinon.spy()
        @stream.each @spy

      o 'executes its action every time the stream is pushed to' !->
        @in.push(2);
        @in.push(11)
        assert @spy.calledTwice
        assert.deepEqual @spy.args, [[2], [11]]

      o 'stops executing after end' !->
        @in.push(2);
        @in.end();
        @in.push(11)
        assert @spy.calledOnce
        assert @spy.calledWith(2)

      o 'stops executing after an error' !->
        @in.push(2);
        @in.error('cut this shit out!');
        @in.push(11)
        assert @spy.calledOnce
        assert @spy.calledWith(2)

    describe 'filter' !->

      o 'is a method' !->
        assert.isFunction @stream.filter

    #o 'streams can be fmapped over' !->
      #assert.isFunction Stream!.stream.fmap

    #o 'fmapping produces a new stream' !->
      #assert is-stream Stream!.stream.fmap (+ 1)
