
// AsyncSeriesHook 异步串行
class AsyncSeriesWaterfallHook {
  constructor (args) {
    this.tasks = []
  }
  tapAsync (name, task) {
    this.tasks.push(task)
  }
  callAsync (...args) {
    let finnalCallback = args.pop()
    let index = 0
    let next = (err, data) => {
      let task = this.tasks[index]
      if (!task) {
        return finnalCallback()
      }
      if (index === 0) {
        task(...args, next)
      } else {
        task(data, next)
      }
      index++
    }
    next()
  }
}
 
let hook = new AsyncSeriesWaterfallHook(['name'])

hook.tapAsync('node', (name, cb) => {
  setTimeout(() => {
    console.log('node', name)
    cb(null, '结果1')
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
 