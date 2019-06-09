// 异步  分为两种  串行： 一个个来  并行： 一起来

const { AsyncParallelHook } = require('tapable')

class Lesson {
  constructor() {
    this.hook = {
      arch: new AsyncParallelHook(['name'])
    }
  }
  tap() { // 注册监听钩子
    this.hook.arch.tapPromise('node', (name)=> {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('node---', name)
          resolve()
        }, 1000)
      })
    })
    this.hook.arch.tapPromise('react', (name) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('react--', name);
          resolve()
        }, 1000)
      })
    })
  }
  start () {
    this.hook.arch.promise('he').then(() => {
      console.log('end')
    })
  }
}

let l = new Lesson()
l.tap() // 注册了这两个事件
l.start()  // 启动钩子
