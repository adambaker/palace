module.exports = {
  Stream: require('./streams')
  $: require('./jquery')
  history: require('./history')

  #TODO: maybe we should generate streams of html update object
  #and have them implicitly happen instead.
  updateHtml: (selector, html) --> $(selector).html(html)
}
