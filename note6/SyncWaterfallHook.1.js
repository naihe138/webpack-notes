// 同步数据流动钩子

let { SyncWaterfallHook } = require('tapable')

class Lesson {
  constructor() {
    this.hook = {
      arch: new SyncWaterfallHook(['name'])
    }
  }
  tap() { // 注册监听钩子
    this.hook.arch.tap('node', name=> {
      console.log('node---', name);
      return '转向下一个'
    })
    // 第二个执行会接收到第一个执行后的结果作为参数
    this.hook.arch.tap('react', data => {
      console.log('react--', data);
    })
  }
  start () {
    this.hook.arch.call('he')
  }
}

let l = new Lesson()
l.tap() // 注册了这两个事件
l.start()  // 启动钩子
