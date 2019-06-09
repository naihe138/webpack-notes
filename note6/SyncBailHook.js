
// SyncBailHook 同步熔断，可以中断事件
// 随时停止我们监听的类型
const { SyncBailHook } = require('tapable')

class Lesson {
  constructor() {
    this.hook = {
      arch: new SyncBailHook(['name'])
    }
  }
  tap() { // 注册监听钩子
    this.hook.arch.tap('node', name=> {
      console.log('node---', name)
      // 返回一个非undefined的值
      // 所以事件到这里就会停止住了
      // 流程不会向下执行了
      return '停止'
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
