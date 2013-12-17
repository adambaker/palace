define <[palace]>, (streams) ->
  const Stream = streams.Stream

  const o = it

  describe 'Stream' !->
    before-each !->
      {@in, @stream} = Stream!
      @spy = sinon.spy!

    describe 'each' !->
      before-each !->
        @stream.each @spy

      o 'executes its action every time the stream is pushed to' !->
        @in.push(2)
        @in.push(11)
        assert @spy.calledTwice
        assert.deepEqual @spy.args, [[2], [11]]

      o 'stops executing after end, calls onEnd handler' !->
        endSpy = sinon.spy ~>
          assert @spy.calledOnce, 'only got one value'
          assert @spy.calledWith(2), 'value passed through'
        @stream.onError -> assert false, 'error after end'
        @stream.onEnd endSpy
        @in.push(2)
        @in.end!
        @in.push(11)
        @in.end!
        @in.error('cut this shit out!')
        assert endSpy.calledOnce, 'called end'

      o 'stops executing after error, calles onError handler' !->
        errSpy = sinon.spy ~>
          assert @spy.calledOnce, 'only got one value'
          assert @spy.calledWith(2), 'value passed through'
        @stream.onEnd -> assert false, 'end after error'
        @stream.onError errSpy
        @in.push 2
        @in.error 'cut this shit out!'
        @in.push 11
        @in.end!
        @in.error 'something else really bad'
        assert.deepEqual errSpy.args, [['cut this shit out!']], 'calls onError handler correctly'

    o 'filter only passes through values that pass the predicate' !->
      filtered = @stream.filter -> it < 5
      filtered.each @spy
      @in.push(2)
      @in.push(11)
      assert @spy.calledOnce
      assert @spy.calledWith(2)

    o 'fmap maps a function over a stream' !->
      mapped = @stream.fmap (+ 1)
      mapped.each @spy
      @in.push(2)
      @in.push(11)
      assert.deepEqual @spy.args, [[3], [12]]

    o 'merge mingles two streams' !->
      s = Stream!
      other_in = s.in
      other = s.stream
      merged = @stream.merge other
      merged.each @spy
      @in.push(2)
      other_in.push(14)
      @in.push(11)
      @in.push(6)
      other_in.push(8)
      other_in.push(null)
      assert.deepEqual @spy.args, [[2], [14], [11], [6], [8], [null]]

    o 'take n truncates the stream to the first n' !->
      s = @stream.take 2 @stream
      s.each @spy
      @in.push(2)
      @in.push(11)
      @in.push(22)
      assert.deepEqual @spy.args, [[2], [11]]
