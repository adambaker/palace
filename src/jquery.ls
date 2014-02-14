const stream = require('./streams')

const events = <[resize blur change focus focusin focusout select submit
  keydown keyup keypress click dblclick mousedown mouseup
  mouseover mouseout mouseenter mouseleave]>

cap = (str) -> str.charAt(0).toUpperCase() + str.slice(1)

ctors = {
  on: (event, selector, delegateSelector) ->
    s = stream!
    $(selector).on(event, delegateSelector, (e) !-> s.in.push(e))
    s.stream
  onAlways: (event, selector) --> ctors.on(event, document, selector)
}

events.forEach((evType) -> ctors['all'+cap(evType)] = ctors.onAlways(evType))

module.exports = ctors
