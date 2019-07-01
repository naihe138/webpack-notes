## plugin

插件是 webpack 生态系统的重要组成部分，为社区用户提供了一种强大方式来直接触及 webpack 的编译过程(compilation process)。插件能够 钩入(hook) 到在每个编译(compilation)中触发的所有关键事件。在编译的每一步，插件都具备完全访问 compiler 对象的能力，如果情况合适，还可以访问当前 compilation 对象。

我们首先回顾 tapable 工具，它提供了 webpack 插件接口的支柱。

### Tapable

tapable 这个小型 library 是 webpack 的一个核心工具，但也可用于其他地方，以提供类似的插件接口。webpack 中许多对象扩展自 Tapable 类。这个类暴露 tap, tapAsync 和 tapPromise 方法，可以使用这些方法，注入自定义的构建步骤，这些步骤将在整个编译过程中不同时机触发。

[note6](.../note6/note.md)，我们详细介绍了tapable 的使用方法和原理实现。


### 创建插件

webpack 插件由以下组成：

- 一个 JavaScript 命名函数。
- 在插件函数的 prototype 上定义一个 apply 方法。
- 指定一个绑定到 webpack 自身的事件钩子。
- 处理 webpack 内部实例的特定数据。
- 功能完成后调用 webpack 提供的回调。

### Compiler 和 Compilation

在插件开发中最重要的两个资源就是compiler和compilation对象。理解它们的角色是扩展webpack引擎重要的第一步。

[compiler](https://www.webpackjs.com/api/compiler-hooks/) 对象代表了完整的 webpack 环境配置。这个对象在启动 webpack 时被一次性建立，并配置好所有可操作的设置，包括 options，loader 和 plugin。当在 webpack 环境中应用一个插件时，插件将收到此 compiler 对象的引用。可以使用它来访问 webpack 的主环境。

[compilation](https://www.webpackjs.com/api/compilation-hooks/) 对象代表了一次资源版本构建。当运行 webpack 开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 compilation，从而生成一组新的编译资源。一个 compilation 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。compilation 对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。

### 插件类型

根据所使用的 钩子(hook) 和 tap 方法，插件可以以多种不同的方式运行。这个工作方式与 Tapable 提供的 hooks 密切相关。compiler hooks 分别记录了 Tapable 内在的钩子，指出哪些 tap 方法可用。

因此，根据你触发到 tap 事件，插件可能会以不同的方式运行。例如，当钩入 compile 阶段时，只能使用同步的 tap 方法：

````js
compiler.hooks.compile.tap('MyPlugin', params => {
  console.log('以同步方式触及 compile 钩子。')
})

````

### 基本插件架构

例子：

````js
// 插件js
class DonePlugin{
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.done.tap('DonePlugin', () => {
      console.log('Hello ',this.options.name);
    });
  }
}
module.exports=DonePlugin;


// 使用

const DonePlugin=require('./plugins/DonePlugin');
module.exports={
  entry: './src/index.js',
  output: {
    path: path.resolve('build'),
    filename:'bundle.js'
  },
  plugins: [
    new DonePlugin({name: 'hello world'})
  ]
}

````

### 访问 compilation 对象

使用 compiler 对象时，你可以绑定提供了编译 compilation 引用的回调函数，然后拿到每次新的 compilation 对象。这些 compilation 对象提供了一些钩子函数，来钩入到构建流程的很多步骤中。

````js

class CompilationPlugin{
  constructor(options) {
    this.options = options
  }
  apply(compiler) {
    compiler.hooks.compilation.tap('CompilationPlugin',function (compilation) {
      compilation.hooks.optimize.tap('optimize',function () {
        console.log('资源正在被优化')
      })
    })
  }
}
module.exports=CompilationPlugin

````

### 异步编译插件

有一些编译插件中的步骤是异步的，这样就需要额外传入一个 callback 回调函数，并且在插件运行结束时，必须调用这个回调函数。

````js

class CompilationAsyncPlugin{
  constructor(options) {
    this.options = options
  }
  apply(compiler) {
    compiler.hooks.emit.tapAsync('EmitPlugin',function (compilation,callback) {
      setTimeout(function () {
        console.log('异步任务完成')
        callback()
      }, 500)
    })
  }
}
module.exports=CompilationAsyncPlugin

````


### 编写一输入文件列表的插件

````js

// file-list-plugin
class FileListPlugin {
  constructor (options = {}) {
    this.options = options
  }
  apply (compiler) {
    compiler.hooks.emit.tap('FileListPlugin', (compilation) =>{
      let filelist='## 文件列表'
      filelist = Object.keys(compilation.assets).reduce((filelist, filename) => filelist+'\r\n- '+ filename, filelist)
      console.log(this.options.name)
      compilation.assets[this.options.name ? this.options.name : 'filelist.md'] = {
        source() {
          return filelist
        },
        size() {
          return filelist.length
        }
      }
  });
  }
}

module.exports = FileListPlugin


````

````js 
// webpack config

'use strict'
const path = require('path')
const FileListPlugin = require('./note8/file-list-plugin.js')
module.exports = {
  mode: 'development',
  entry: './note8/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {},
  plugins: [
    new FileListPlugin()
  ]
} 

````