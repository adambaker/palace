(function(){
  module.exports = {
    Stream: require('./streams'),
    $: require('./jquery'),
    history: require('./history'),
    updateHtml: curry$(function(selector, html){
      return $(selector).html(html);
    })
  };
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
