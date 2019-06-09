
// SyncHook 同步钩子
const { SyncHook } = require('tapable')

class Lesson {
  constructor() {
    this.hook = {
      arch: new SyncHook(['name'])
    }
  }
  tap() { // 注册监听钩子
    this.hook.arch.tap('node', name=> {
      console.log('node---', name);
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
