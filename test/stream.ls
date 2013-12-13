require! '../cjs/streams'
const stream = streams.stream
const on-ui = streams.on
require! chai.assert

const o = it

describe 'stream' !->
  o 'returns in and out' !->
    s = stream!
    console.log s
    assert s.in
    assert s.out
