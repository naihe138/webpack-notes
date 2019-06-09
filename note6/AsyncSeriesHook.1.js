
// AsyncSeriesHook 异步串行
class AsyncSeriesHook {
  constructor (args) {
    this.tasks = []
  }
  tapAsync (name, task) {
    this.tasks.push(task)
  }
  callAsync (...args) {
    let finnalCallback = args.pop()
    let index = 0
    let next = () => {
      if (index === this.tasks.length) {
        return finnalCallback()
      }
      this.tasks[index++](...args, next)
    }
    next()
  }
}
 
let hook = new AsyncSeriesHook(['name'])

hook.tapAsync('node', (name, cb) => {
  setTimeout(() => {
    console.log('node', name)
    cb()
  }, 1000)
})

hook.tapAsync('react', (name, cb) => {
  setTimeout(() => {
    console.log('react', name)
    cb()
  }, 1000)
})

hook.callAsync('he', () => {
  console.log('end')
})
 