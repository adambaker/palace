var Stream = require('./streams');
var curry = require('./util').curry;

var events = ('resize blur change focus focusin focusout select submit ' +
  'keydown keyup keypress click dblclick mousedown mouseup ' +
  'mouseover mouseout mouseenter mouseleave').split(' ');

var cap = function(str) {return str.charAt(0).toUpperCase() + str.slice(1)}

var ctors = {
  on: function(event, selector, delegateSelector){
    var s = Stream();
    $(selector).on(event, delegateSelector, function(e) {
      s.in.push(e);
    });
    return s.stream;
  },
  onAlways: curry(function(event, selector) {
    return ctors.on(event, document, selector);
  })
}

events.forEach(function(evType) {
  ctors['all'+cap(evType)] = ctors.onAlways(evType);
});

module.exports = ctors
