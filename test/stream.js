(function(){
  define(['palace'], function(streams){
    var Stream, onUi, o;
    Stream = streams.Stream;
    onUi = streams.on;
    o = it;
    return describe('Stream', function(){
      beforeEach(function(){
        var s;
        s = Stream();
        this['in'] = s['in'];
        this.stream = s.stream;
      });
      describe('each', function(){
        beforeEach(function(){
          var this$ = this;
          this.x = 0;
          this.stream.each(function(it){
            this$.x += it;
          });
        });
        o('executes its action every time the stream is pushed to', function(){
          this['in'].push(2);
          assert.equal(this.x, 2);
          this['in'].push(11);
          assert.equal(this.x, 13);
        });
        o('stops executing after end', function(){
          this['in'].push(2);
          assert.equal(this.x, 2);
          this['in'].end();
          this['in'].push(11);
          assert.equal(this.x, 2);
        });
        o('stops executing after an error', function(){
          this['in'].push(2);
          assert.equal(this.x, 2);
          this['in'].error('cut this shit out!');
          this['in'].push(11);
          assert.equal(this.x, 2);
        });
      });
      describe('filter', function(){
        o('is a method', function(){
          assert.isFunction(this.stream.filter);
        });
      });
    });
  });
}).call(this);
