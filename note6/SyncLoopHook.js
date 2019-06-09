
// SyncHook 同步钩子，遇到不返回undefined的钩子 会多次执行
const { SyncLoopHook } = require('tapable')

class Lesson {
  constructor() {
    this.index = 0
    this.hook = {
      arch: new SyncLoopHook(['name'])
    }
  }
  tap() { // 注册监听钩子
    this.hook.arch.tap('node', name=> {
      console.log('node---', name);
      return ++this.index === 3 ? undefined : '继续'
    })
    this.hook.arch.tap('react', name => {
      console.log('react--', name);
    })
  }
  start () {
    this.hook.arch.call('he')
  }
}

let l = new Lesson()
l.tap() // 注册了这两个事件
l.start()  // 启动钩子
