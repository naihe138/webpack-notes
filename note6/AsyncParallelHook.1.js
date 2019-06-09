
// SyncHook 同步钩子
// 原理有点想promise.all
class AsyncParallelHook {
  constructor (args) {
    this.tasks = []
  }
  tapAsync (name, task) {
    this.tasks.push(task)
  }
  callAsync (...args) {
    let finnalCallback = args.pop()
    let index = 0
    let done = () => {
      index++
      if (index === this.tasks.length) {
        finnalCallback()
      }
    }
    this.tasks.forEach(task => {
      task(...args, done)
    })
  }
}
 
let hook = new AsyncParallelHook(['name'])

hook.tapAsync('node', (name, cb) => {
  setTimeout(() => {
    console.log(name)
    cb()
  }, 1000)
})

hook.tapAsync('react', (name, cb) => {
  setTimeout(() => {
    console.log(name)
    cb()
  }, 1000)
})

hook.callAsync('he', () => {
  console.log('end')
})
