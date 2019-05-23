
let str = require('./a.js')
console.log(str)

require('./index.css')

require('./b.less')

let fn = () => {
  console.log('hello ')
}

@log
class A {
  a = 1
}

function log(target) {
  console.log(target)
}