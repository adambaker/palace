var renderCache = {};
var curry = require('./util').curry;

module.exports = {
  Stream: require('./streams'),
  $: require('./jquery'),
  history: require('./history'),

  //TODO: maybe we should generate streams of html update object
  //and have them implicitly happen instead.
  updateHtml: curry(function(selector, html) {
    return $(selector).html(html);
  })
};
