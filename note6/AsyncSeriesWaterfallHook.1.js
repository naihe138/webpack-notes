// 异步  分为两种  串行： 一个个来  并行： 一起来

const { AsyncSeriesWaterfallHook } = require('tapable')

class Lesson {
  constructor() {
    this.hook = {
      arch: new AsyncSeriesWaterfallHook(['name'])
    }
  }
  tap() { // 注册监听钩子
    this.hook.arch.tapAsync('node', (name, cb)=> {
      setTimeout(() => {
        console.log('node---', name)
        cb(null, '结果1')
      }, 1000)
    })
    this.hook.arch.tapAsync('react', (data, cb) => {
      setTimeout(() => {
        console.log('react--', data);
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
