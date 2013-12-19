(function(){
  var Stream, o, sinon, assert;
  Stream = require('../src/streams');
  o = it;
  sinon = require('sinon');
  assert = require('chai').assert;
  describe('Stream', function(){
    beforeEach(function(){
      var ref$;
      ref$ = Stream(), this['in'] = ref$['in'], this.stream = ref$.stream;
      this.spy = sinon.spy();
    });
    describe('each', function(){
      beforeEach(function(){
        this.stream.each(this.spy);
      });
      o('executes its action every time the stream is pushed to', function(){
        this['in'].push(2);
        this['in'].push(11);
        assert(this.spy.calledTwice);
        assert.deepEqual(this.spy.args, [[2], [11]]);
      });
      o('stops executing after end, calls onEnd handler', function(){
        var endSpy, this$ = this;
        endSpy = sinon.spy(function(){
          assert(this$.spy.calledOnce, 'only got one value');
          return assert(this$.spy.calledWith(2), 'value passed through');
        });
        this.stream.onError(function(){
          return assert(false, 'error after end');
        });
        this.stream.onEnd(endSpy);
        this['in'].push(2);
        this['in'].end();
        this['in'].push(11);
        this['in'].end();
        this['in'].error('cut this shit out!');
        assert(endSpy.calledOnce, 'called end');
      });
      o('stops executing after error, calles onError handler', function(){
        var errSpy, this$ = this;
        errSpy = sinon.spy(function(){
          assert(this$.spy.calledOnce, 'only got one value');
          return assert(this$.spy.calledWith(2), 'value passed through');
        });
        this.stream.onEnd(function(){
          return assert(false, 'end after error');
        });
        this.stream.onError(errSpy);
        this['in'].push(2);
        this['in'].error('cut this shit out!');
        this['in'].push(11);
        this['in'].end();
        this['in'].error('something else really bad');
        assert.deepEqual(errSpy.args, [['cut this shit out!']], 'calls onError handler correctly');
      });
    });
    o('filter only passes through values that pass the predicate', function(){
      var filtered;
      filtered = this.stream.filter(function(it){
        return it < 5;
      });
      filtered.each(this.spy);
      this['in'].push(2);
      this['in'].push(11);
      assert(this.spy.calledOnce);
      assert(this.spy.calledWith(2));
    });
    o('fmap maps a function over a stream', function(){
      var mapped;
      mapped = this.stream.fmap((function(it){
        return it + 1;
      }));
      mapped.each(this.spy);
      this['in'].push(2);
      this['in'].push(11);
      assert.deepEqual(this.spy.args, [[3], [12]]);
    });
    o('merge mingles two streams', function(){
      var s, other_in, other, third_in, third, merged;
      s = Stream();
      other_in = s['in'];
      other = s.stream;
      s = Stream();
      third_in = s['in'];
      third = s.stream;
      merged = this.stream.merge(other, third);
      merged.each(this.spy);
      this['in'].push(2);
      other_in.push(14);
      this['in'].push(11);
      third_in.push('hi');
      this['in'].push(6);
      other_in.push(8);
      other_in.push(null);
      assert.deepEqual(this.spy.args, [[2], [14], [11], ['hi'], [6], [8], [null]]);
    });
    o('take n truncates the stream to the first n', function(){
      var s;
      s = this.stream.take(2);
      s.each(this.spy);
      this['in'].push(2);
      this['in'].push(11);
      this['in'].push(22);
      assert.deepEqual(this.spy.args, [[2], [11]]);
    });
    o('takeWhile truncates when the predicate fails', function(){
      var s;
      s = this.stream.takeWhile((function(it){
        return it < 5;
      }));
      s.each(this.spy);
      this['in'].push(2);
      this['in'].push(11);
      assert.deepEqual(this.spy.args, [[2]]);
    });
  });
}).call(this);
