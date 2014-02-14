mod = (stream) !->
  const o = it

  describe 'stream' !->
    before-each !->
      {@in, @stream} = stream!
      @spy = sinon.spy!

    o 'isStream is true, isProperty is false' !->
      assert stream.is-stream @stream
      assert !stream.is-property @stream

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
        @in.push 2
        @in.end!
        @in.push 11
        @in.end!
        @in.error 'cut this shit out!'
        assert endSpy.calledOnce, 'called end'

      o 'calls onError handler, continues getting vals' !->
        errSpy = sinon.spy!
        @stream.onEnd -> assert false, 'end after error'
        @stream.onError errSpy
        @in.push 2
        @in.error 'cut this shit out!'
        @in.push 11
        @in.error 'something else really bad'
        assert.deepEqual @spy.args, [[2], [11]]
        assert.deepEqual errSpy.args,
          [['cut this shit out!'], ['something else really bad']],
          'calls onError handler correctly'

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

    o 'take n truncates the stream to the first n' !->
      s = @stream.take 2
      s.each @spy
      @in.push(2)
      @in.push(11)
      @in.push(22)
      assert.deepEqual @spy.args, [[2], [11]]

    o 'takeWhile truncates when the predicate fails' !->
      s = @stream.takeWhile (< 5)
      s.each @spy
      @in.push(2)
      @in.push(11)
      assert.deepEqual @spy.args, [[2]]

    o 'map === fmap' !->
      assert.strictEqual @stream.map, @stream.fmap

    describe 'multi-stream functions' !->
      before-each !->
        s = stream!
        @other_in = s.in
        @other = s.stream
        s = stream!
        @third_in = s.in
        @third = s.stream

      o 'merge mingles two or more streams' !->
        merged = @stream.merge @other, @third
        merged.each @spy
        @in.push(2)
        @other_in.push(14)
        @in.push(11)
        @third_in.push('hi')
        @in.push(6)
        @other_in.push(8)
        @other_in.push(null)
        assert.deepEqual @spy.args, [[2], [14], [11], ['hi'], [6], [8], [null]]

      o 'zip combines streams pairwise' !->
        zipped = @stream.zip @other, @third
        zipped.each @spy
        @in.push(2)
        @other_in.push(14)
        @in.push(11)
        @third_in.push('hi')
        @in.push(6)
        @other_in.push(8)
        @other_in.push(null)
        @third_in.push(22)
        assert.deep-equal @spy.args, [[[2, 14, 'hi']], [[11, 8, 22]]]

      o 'zipWith combines streams pairwise with a function' !->
        zip-fun = sinon.spy (...args) -> return args
        zipped = @stream.zip-with zip-fun, @other, @third
        zipped.each @spy
        @in.push(2)
        @other_in.push(14)
        @in.push(11)
        @third_in.push('hi')
        @in.push(6)
        @other_in.push(8)
        @other_in.push(null)
        @third_in.push(22)
        assert.deep-equal zip-fun.args, [[2, 14, 'hi'], [11, 8, 22]]
        assert.deep-equal @spy.args, [[[2, 14, 'hi']], [[11, 8, 22]]]

  describe 'Properties' !->
    before-each !->
      {@in, @stream} = stream!
      @prop = @stream.property 'starting value'
      @spy = sinon.spy!

    o 'isProperty is true, isStream is false' !->
      assert stream.is-property(@prop)
      assert !stream.is-stream(@prop)

    o "events on the stream change the prop's value" !->
      @prop.each @spy
      @in.push 12
      @in.push \fool
      assert.deep-equal @spy.args, [['starting value'], [12], [\fool]]

    o 'changes produces a stream of changes' !->
      changes = @prop.changes!
      changes.each @spy
      @in.push 12
      @in.push \fool
      assert.deep-equal @spy.args, [[12], [\fool]]

    o 'map derives a new property' !->
      mapped = @prop.map(-> it + 2)
      mapped.each @spy
      @in.push 1
      @in.push 10
      assert.deep-equal @spy.args, [['starting value2'], [3], [12]]

    o 'value, valueOf returns the current value' !->
      assert.equal @prop.value-of!, 'starting value'
      assert.equal @prop.value, 'starting value'
      @in.push 12
      assert.equal @prop.value-of!, 12
      assert.equal @prop.value, 12
      @in.push \fool
      assert.equal @prop.value-of!, \fool
      assert.equal @prop.value, \fool

if typeof define == \function
  define <[palace]> (palace) !->
    mod palace.streams
else
  mod(require '../../compiled/streams')
