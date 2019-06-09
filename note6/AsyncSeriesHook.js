// 异步  分为两种  串行： 一个个来  并行： 一起来

const { AsyncSeriesHook } = require('tapable')

class Lesson {
  constructor() {
    this.hook = {
      arch: new AsyncSeriesHook(['name'])
    }
  }
  tap() { // 注册监听钩子
    this.hook.arch.tapAsync('node', (name, cb)=> {
      setTimeout(() => {
        console.log('node---', name)
        cb()
      }, 1000)
    })
    this.hook.arch.tapAsync('react', (name, cb) => {
      setTimeout(() => {
        console.log('react--', name);
        cb()
      }, 1000)
    })
  }
  start () {
    this.hook.arch.callAsync('he', () => {
      console.log('end')
    })
  }
}

let l = new Lesson()
l.tap() // 注册了这两个事件
l.start()  // 启动钩子
