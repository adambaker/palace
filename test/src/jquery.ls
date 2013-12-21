mod = (palace) !->
  const o = it
  const on-ui = palace.$.on
  {on-always} = palace.$

  const cap = (str) -> str.charAt(0).toUpperCase! + str.slice 1

  describe 'palace.$.on' !->
    before-each !->
      @spy = sinon.spy!
      $('body').append $('<div class="c1" id="div1">')
      $('body').append $('<div class="c2" id="div2">')
      $('body').append $('<div class="c1" id="div3">')

    o "is a stream of appropriate ui events" !->
      on-ui(\click \.c1).each @spy
      $(\#div1).trigger \click
      $(\#div2).trigger \click
      $(\#div3).trigger \click
      assert @spy.called-twice, 'two events'
      assert.strictEqual @spy.args[0][0].target, $(\#div1)[0]
      assert.strictEqual @spy.args[1][0].target, $(\#div3)[0]

    o "allows delegate events for responding to late added elements" !->
      on-ui(\click \body \.c2).each @spy
      $(\#div1).trigger \click
      $(\#div2).trigger \click
      $('body').append $('<div class="c2" id="div4">')
      $(\#div3).trigger \click
      $(\#div4).trigger \click
      assert @spy.called-twice, 'two events'
      assert.strictEqual @spy.args[0][0].target, $(\#div2)[0]
      assert.strictEqual @spy.args[1][0].target, $(\#div4)[0]

  describe 'delegates' !->
    before-each !->
      @stub = sinon.stub palace.$, \on
      @spy = sinon.spy!
    after-each !-> palace.$.on.restore?!

    o "delegates to on" !->
      on-always \click \c1
      assert.deepEqual @stub.args, [[\click, document, \c1]]

    o "partially applies" !->
      assert.isFunction on-always \click

    <[resize blur change focus focusin focusout select submit keydown keyup
    keypress click dblclick mousedown mouseup mouseover mouseout
    mouseenter mouseleave]>.forEach (evType) !->
      method = "all#{cap evType}"

      o "#{method} delegates to onAlways" !->
        palace.$[method] \#div1
        assert.deepEqual @stub.args, [[evType, document, \#div1]]

      o "#{method} captures the event" !->
        palace.$.on.restore!
        $('body').append el = $('<input type="text">')
        palace.$[method](\input).each @spy
        el.trigger evType
        assert @spy.called-once

if typeof define == \function && jQuery
  define <[palace]> mod
