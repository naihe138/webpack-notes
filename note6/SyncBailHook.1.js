
// SyncBaillHook 同步钩子
class SyncBaillHook {
  constructor (args) {
    this.tasks = []
  }
  tap (name, task) {
    this.tasks.push(task)
  }
  call (...args) {
    let ret, index = 0
    do{
      ret = this.tasks[index++](...args)
    }while(ret === undefined && index < this.tasks.length)
  }
}

let hook = new SyncBaillHook(['name'])

hook.tap('node', name => {
  console.log(name)
  return '停止'
})

hook.tap('react', name => {
  console.log(name)
})

hook.call('he')