
// 同步数据流动钩子
class SyncLoopHook {
  constructor (args) {
    this.tasks = []
  }
  tap (name, task) {
    this.tasks.push(task)
  }
  call (...args) {
    this.tasks.forEach(task => {
      let ret
      do{
        ret = task(...args)
      }while(ret !== undefined);
    })
  }
}

let hook = new SyncLoopHook(['name'])
let total = 0
hook.tap('node', name => {
  console.log(name, total)
  return ++total === 3 ? undefined : '继续学'
})

hook.tap('react', name => {
  console.log(name);
})


hook.call('he')