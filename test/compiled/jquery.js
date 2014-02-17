(function(){
  var mod;
  mod = function(palace){
    var o, onUi, onAlways, cap;
    o = it;
    onUi = palace.$.on;
    onAlways = palace.$.onAlways;
    cap = function(str){
      return str.charAt(0).toUpperCase() + str.slice(1);
    };
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
    describe('delegates', function(){
      var i$, ref$, len$, evType, method;
      beforeEach(function(){
        this.stub = sinon.stub(palace.$, 'on');
        this.spy = sinon.spy();
      });
      afterEach(function(){
        var ref$;
        if (typeof (ref$ = palace.$.on).restore === 'function') {
          ref$.restore();
        }
      });
      o("delegates to on", function(){
        onAlways('click', 'c1');
        assert.deepEqual(this.stub.args, [['click', document, 'c1']]);
      });
      o("partially applies", function(){
        assert.isFunction(onAlways('click'));
      });
      for (i$ = 0, len$ = (ref$ = ['resize', 'blur', 'change', 'focus', 'focusin', 'focusout', 'select', 'submit', 'keydown', 'keyup', 'keypress', 'click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave']).length; i$ < len$; ++i$) {
        evType = ref$[i$];
        method = "all" + cap(evType);
        o(method + " delegates to onAlways", fn$);
        o(method + " captures the event", fn1$);
      }
      function fn$(){
        palace.$[method]('#div1');
        assert.deepEqual(this.stub.args, [[evType, document, '#div1']]);
      }
      function fn1$(){
        var el;
        palace.$.on.restore();
        $('body').append(el = $('<input type="text">'));
        palace.$[method]('input').each(this.spy);
        el.trigger(evType);
        assert(this.spy.calledOnce);
      }
    });
  };
  if (typeof define === 'function' && jQuery) {
    define(['palace'], mod);
  }
}).call(this);
