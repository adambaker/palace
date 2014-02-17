(function(){
  var stream, events, cap, ctors, i$, len$, evType;
  stream = require('./streams');
  events = ['resize', 'blur', 'change', 'focus', 'focusin', 'focusout', 'select', 'submit', 'keydown', 'keyup', 'keypress', 'click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave'];
  cap = function(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  ctors = {
    on: function(event, selector, delegateSelector){
      var s;
      s = stream();
      $(selector).on(event, delegateSelector, function(e){
        s['in'].push(e);
      });
      return s.stream;
    },
    onAlways: curry$(function(event, selector){
      return ctors.on(event, document, selector);
    })
  };
  for (i$ = 0, len$ = events.length; i$ < len$; ++i$) {
    evType = events[i$];
    ctors['all' + cap(evType)] = ctors.onAlways(evType);
  }
  module.exports = ctors;
  function curry$(f, bound){
    var context,
    _curry = function(args) {
      return f.length > 1 ? function(){
        var params = args ? args.concat() : [];
        context = bound ? context || this : this;
        return params.push.apply(params, arguments) <
            f.length && arguments.length ?
          _curry.call(context, params) : f.apply(context, params);
      } : f;
    };
    return _curry();
  }
}).call(this);
