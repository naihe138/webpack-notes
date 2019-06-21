## webpack工作流程介绍

webpack的工作流程是一个串行的过程，其工作流程如下

- 初始化参数： 从配置文件和shell命令中得到参数，并合并参数，得到最终的初始化参数；

- 开始编译：用上一不得到的参数初始化compiler对象，加载所有的配置插件，执行对象的run方法开始执行编译；

- 确定入口：从配置参数中的entry配置找出所有的入口文件；

- 编译模块：从入口文件出发，调用所有的配置的loader对模块进行编译，在编译的过程中找出所有的依赖模块，在递归本步骤直到所有的依赖文件都经过loader处理

- 完成编译：经过上一步所有模块都经过loader编译之后，得到每个模块最终的编译结果和依赖关系

- 输出资源：根据入口模块的依赖关系，组成一个个包含模块多个模块的chunk，再把chunk转换成一个单独文件的输出列表，这步骤是改变输出内容的最后机会

- 输出完成：在确定好内容之后，根据配置文件确定好输入的文件名和文件目录，把文件写到系统中

- 在以上所有的过程，webpack都会在特定的时间点广播出特定的事件，插件在监听感兴趣的事件会执行特定的逻辑，就可以改变webpack的运行结果了。

## tapable的介绍和实现

在具体介绍webpack内置插件与钩子可视化工具之前，我们先来了解一下webpack中的插件机制。 webpack实现插件机制的大体方式是：

创建 - webpack在其内部对象上创建各种钩子；
注册 - 插件将自己的方法注册到对应钩子上，交给webpack；
调用 - webpack编译过程中，会适时地触发相应钩子，因此也就触发了插件的方法。

### tapable用法

````js

const {
  SyncHook, // 串行同步执行,不关心返回值
  SyncBailHook, // 串行同步执行，有一个返回值不为null则跳过剩下的逻辑
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook
} = require("tapable");

// 所有实现的代码以及原理 都在都在本目录文件夹下面

````
