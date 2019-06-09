// AsyncSeriesHook 异步串行
class AsyncSeriesHook {
  constructor (args) {
    this.tasks = []
  }
  tapAsync (name, task) {
    this.tasks.push(task)
  }
  callAsync (...args) {
    let [first, ...others] = this.tasks
    let p = first(...args)
    return others.reduce((p, n) => {
      return p.then(()=> n(...args))
    }, p)
  }
}
 
let hook = new AsyncSeriesHook(['name'])

hook.tapAsync('node', (name) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('node', name)
      resolve()
    }, 1000)
  })
})

hook.tapAsync('react', (name) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('react', name)
      resolve()
    }, 1000)
  })
})

hook.callAsync('he').then(() => {
  console.log('end')
})
