define <[palace]>, (streams) ->
  const Stream = streams.Stream
  const on-ui = streams.on

  const o = it

  describe 'Stream' !->
    before-each !->
      s = Stream!
      @spy = sinon.spy!
      @in = s.in
      @stream = s.stream

    describe 'each' !->
      before-each !->
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

    o 'filter only passes through values that pass the predicate' !->
      filtered = @stream.filter -> it < 5
      filtered.each @spy
      @in.push(2);
      @in.push(11)
      assert @spy.calledOnce
      assert @spy.calledWith(2)

    o 'fmap maps a function over a stream' !->
      mapped = @stream.fmap (+ 1)
      mapped.each @spy
      @in.push(2);
      @in.push(11)
      assert @spy.calledTwice
      assert.deepEqual @spy.args, [[3], [12]]

    #o 'fmapping produces a new stream' !->
      #assert is-stream Stream!.stream.fmap (+ 1)
