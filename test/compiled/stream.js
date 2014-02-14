(function(){
  var mod, slice$ = [].slice;
  mod = function(stream){
    var o;
    o = it;
    describe('stream', function(){
      beforeEach(function(){
        var ref$;
        ref$ = stream(), this['in'] = ref$['in'], this.stream = ref$.stream;
        this.spy = sinon.spy();
      });
      o('isStream is true, isProperty is false', function(){
        assert(stream.isStream(this.stream));
        assert(!stream.isProperty(this.stream));
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
        o('calls onError handler, continues getting vals', function(){
          var errSpy;
          errSpy = sinon.spy();
          this.stream.onEnd(function(){
            return assert(false, 'end after error');
          });
          this.stream.onError(errSpy);
          this['in'].push(2);
          this['in'].error('cut this shit out!');
          this['in'].push(11);
          this['in'].error('something else really bad');
          assert.deepEqual(this.spy.args, [[2], [11]]);
          assert.deepEqual(errSpy.args, [['cut this shit out!'], ['something else really bad']], 'calls onError handler correctly');
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
      o('map === fmap', function(){
        assert.strictEqual(this.stream.map, this.stream.fmap);
      });
      describe('multi-stream functions', function(){
        beforeEach(function(){
          var s;
          s = stream();
          this.other_in = s['in'];
          this.other = s.stream;
          s = stream();
          this.third_in = s['in'];
          this.third = s.stream;
        });
        o('merge mingles two or more streams', function(){
          var merged;
          merged = this.stream.merge(this.other, this.third);
          merged.each(this.spy);
          this['in'].push(2);
          this.other_in.push(14);
          this['in'].push(11);
          this.third_in.push('hi');
          this['in'].push(6);
          this.other_in.push(8);
          this.other_in.push(null);
          assert.deepEqual(this.spy.args, [[2], [14], [11], ['hi'], [6], [8], [null]]);
        });
        o('zip combines streams pairwise', function(){
          var zipped;
          zipped = this.stream.zip(this.other, this.third);
          zipped.each(this.spy);
          this['in'].push(2);
          this.other_in.push(14);
          this['in'].push(11);
          this.third_in.push('hi');
          this['in'].push(6);
          this.other_in.push(8);
          this.other_in.push(null);
          this.third_in.push(22);
          assert.deepEqual(this.spy.args, [[[2, 14, 'hi']], [[11, 8, 22]]]);
        });
        o('zipWith combines streams pairwise with a function', function(){
          var zipFun, zipped;
          zipFun = sinon.spy(function(){
            var args;
            args = slice$.call(arguments);
            return args;
          });
          zipped = this.stream.zipWith(zipFun, this.other, this.third);
          zipped.each(this.spy);
          this['in'].push(2);
          this.other_in.push(14);
          this['in'].push(11);
          this.third_in.push('hi');
          this['in'].push(6);
          this.other_in.push(8);
          this.other_in.push(null);
          this.third_in.push(22);
          assert.deepEqual(zipFun.args, [[2, 14, 'hi'], [11, 8, 22]]);
          assert.deepEqual(this.spy.args, [[[2, 14, 'hi']], [[11, 8, 22]]]);
        });
      });
    });
    describe('Properties', function(){
      beforeEach(function(){
        var ref$;
        ref$ = stream(), this['in'] = ref$['in'], this.stream = ref$.stream;
        this.prop = this.stream.property('starting value');
        this.spy = sinon.spy();
      });
      o('isProperty is true, isStream is false', function(){
        assert(stream.isProperty(this.prop));
        assert(!stream.isStream(this.prop));
      });
      o("events on the stream change the prop's value", function(){
        this.prop.each(this.spy);
        this['in'].push(12);
        this['in'].push('fool');
        assert.deepEqual(this.spy.args, [['starting value'], [12], ['fool']]);
      });
      o('changes produces a stream of changes', function(){
        var changes;
        changes = this.prop.changes();
        changes.each(this.spy);
        this['in'].push(12);
        this['in'].push('fool');
        assert.deepEqual(this.spy.args, [[12], ['fool']]);
      });
      o('map derives a new property', function(){
        var mapped;
        mapped = this.prop.map(function(it){
          return it + 2;
        });
        mapped.each(this.spy);
        this['in'].push(1);
        this['in'].push(10);
        assert.deepEqual(this.spy.args, [['starting value2'], [3], [12]]);
      });
      o('value, valueOf returns the current value', function(){
        assert.equal(this.prop.valueOf(), 'starting value');
        assert.equal(this.prop.value, 'starting value');
        this['in'].push(12);
        assert.equal(this.prop.valueOf(), 12);
        assert.equal(this.prop.value, 12);
        this['in'].push('fool');
        assert.equal(this.prop.valueOf(), 'fool');
        assert.equal(this.prop.value, 'fool');
      });
    });
  };
  if (typeof define === 'function') {
    define(['palace'], function(palace){
      mod(palace.streams);
    });
  } else {
    mod(require('../../compiled/streams'));
  }
}).call(this);
