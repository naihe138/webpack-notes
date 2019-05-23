module.exports = 'helle world'
require('@babel/polyfill')
class B{
  b = 2
}

function *gen (parems) {
  yield 1
}

let b = gen()
console.log(b.next())

'aaa'.includes('a')