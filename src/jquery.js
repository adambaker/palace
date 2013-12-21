var Stream = require('./streams');

//stealing livescript's curry$
function curry(f, bound){
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

var ctors = {
  on: function(event, selector, delegateSelector){
    var s = Stream();
    $(selector).on(event, delegateSelector, function(e) {
      s.in.push(e);
    });
    return s.stream;
  },
  onAlways: function(event, selector) {
    return ctors.on(event, document, selector);
  }
}

module.exports = ctors
