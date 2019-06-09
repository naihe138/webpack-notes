
// 同步数据流动钩子
class SyncWaterfallHook {
  constructor (args) {
    this.tasks = []
  }
  tap (name, task) {
    this.tasks.push(task)
  }
  call (...args) {
    let [fitst, ...others] = this.tasks
    let ret = fitst(...args)
    others.reduce((a, b) => {
      return b(a)
    }, ret)
  }
}

let hook = new SyncWaterfallHook(['name'])

hook.tap('node', name => {
  console.log(name)
  return 'node ok'
})

hook.tap('react', data => {
  console.log(data);
  return 'react ok'
})

hook.tap('vue', data => {
  console.log(data)
})

hook.call('he')