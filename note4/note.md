## 多页打包

````js

'use strict'
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  mode: 'development',
  entry: {
    home: './note3/index.js',
    other: './note3/other.js',
  },
  output: {
    filename: '[name].[hash:8].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './note3/index.html',
      filename: 'home.html',
      chunks: ['home']
    }),
    new HtmlWebpackPlugin({
      template: './note3/index.html',
      filename: 'other.html',
      chunks: ['other']
    })
  ]
}

````

### souce-map

1、devtool: 'source-map',源码映射，会单独生成source-map，然后调试的时候， 出错了 会标识当前报错的列。 大而全

2、devtool: 'eval-source-map', 不会产生单独文件， 但是产生行和列

3、devtool: 'cheap-module-souce-map',不会产生列，但是是一个单独的文件，产生后可以保留起来可以用来调试

4、devtool: 'cheap-module-eval-source-map'不会产生文件，集成在打包代码文件中，也不会产生列

### watch的用法

```js

watch: true, // 监听代码变化 实时编译
watchOptions: {
  poll: 1000, // 每秒1000次
  aggreatementTimeout: 500, // 防抖作用
  ignored: /node_modules/, // 不需要监控那个文件
},

````

### webpack小插件

cleanWebpackPlugin // 清除打包文件

copyWbpackPlugin // 复制文件插件

bannerPlugin // 内置  版权声明


### 跨越的设置

利用proxy模块（nodt4）,利用代理的方式，把8080端口代理到3000端口上

````js

// 方式1
devServer: {
  port: 8080, // 端口号
  progress: true, // 打包进度
  contentBase: 'dist', // 指定那个运行目录
  proxy: {
    '/test': 'http://localhost:3000' // 如果是test开头一律转发到http://localhost:3000
  }
},

// 方式2
devServer: {
  port: 8081, // 端口号
  progress: true, // 打包进度
  contentBase: 'dist', // 指定那个运行目录
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      pathRewrite: {
        '/api': ''
      }
    }
  }
}, 

// 方式3
devServer: {
  bafore (app) {
    app.get('/test', (req, res) => {
      res.json({name: 'hewenlin})
    })
  }
}

// 方式4， 在服务端中启动webpack 端口用webpack，相当于前端跟服务端公用一个接口

let express = require('express')
let middle = require('webpack-dev-moddleware')
let config = require('./webpack.config.js')

let app = express()

let compilper = require('webpack')(config)

app.use(middle(compilper))

app.get('/test', (req, res) => {
  res.json({
    name: '何文林'
  }) 
})

app.listen(3000,() => {
  console.log('app listen port 3000')
})

````