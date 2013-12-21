(function(){
  var mod;
  mod = function(palace){
    var o, onUi;
    o = it;
    onUi = palace.$.on;
    describe('palace.$.on', function(){
      beforeEach(function(){
        this.spy = sinon.spy();
        $('body').append($('<div class="c1" id="div1">'));
        $('body').append($('<div class="c2" id="div2">'));
        $('body').append($('<div class="c1" id="div3">'));
      });
      o("is a stream of appropriate ui events", function(){
        onUi('click', '.c1').each(this.spy);
        $('#div1').trigger('click');
        $('#div2').trigger('click');
        $('#div3').trigger('click');
        assert(this.spy.calledTwice, 'two events');
        assert.strictEqual(this.spy.args[0][0].target, $('#div1')[0]);
        assert.strictEqual(this.spy.args[1][0].target, $('#div3')[0]);
      });
      o("allows delegate events for responding to late added elements", function(){
        onUi('click', 'body', '.c2').each(this.spy);
        $('#div1').trigger('click');
        $('#div2').trigger('click');
        $('body').append($('<div class="c2" id="div4">'));
        $('#div3').trigger('click');
        $('#div4').trigger('click');
        assert(this.spy.calledTwice, 'two events');
        assert.strictEqual(this.spy.args[0][0].target, $('#div2')[0]);
        assert.strictEqual(this.spy.args[1][0].target, $('#div4')[0]);
      });
    });
  };
  if (typeof define === 'function' && jQuery) {
    define(['palace'], mod);
  }
}).call(this);
