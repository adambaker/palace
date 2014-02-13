mod = (history) !->
  const o = it

  describe 'palace.history' !->
    o 'it loads the history' !->
      assert(window.History);

if typeof define == \function
  define <[palace]> (palace) !->
    mod palace.history
else
  mod(require '../../src/history')
