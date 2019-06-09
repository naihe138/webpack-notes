// 异步  分为两种  串行： 一个个来  并行： 一起来

// SyncHook 同步钩子
// 原理有点想promise.all
class AsyncParallelHook {
  constructor (args) {
    this.tasks = []
  }
  tapPromise (name, task) {
    this.tasks.push(task)
  }
  promise (...args) {
    let tasks = this.tasks.map(task => task(...args))
    return Promise.all(tasks)
  }
}
 
let hook = new AsyncParallelHook(['name'])

hook.tapPromise('node', (name) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('node', name)
      resolve()
    }, 1000)
  })
})

hook.tapPromise('react', (name) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('react', name)
      resolve()
    }, 1000)
  })
})

hook.promise('he').then(() => {
  console.log('end')
})
