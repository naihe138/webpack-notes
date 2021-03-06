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
## webpack优化

记录webpack优化的几个点

### noPath

- 忽略加载依赖关系。比如说我们项目引入一个jquery，但是我们明确知道jquery是不会有依赖关系的，所以就直接忽略掉，

- 在loader的处理文件的同事会扫描整个项目目录的文件，所以要加上exclude和include的限制优化配置

````js

module: {
  // 不去解析jquery的的依赖关系，因为我们知道jQuery不会有其他依赖
  noParse: /jquery/,
  rules: [
    {
      test: /\.js/,
      exclude: /node_modules/, //排除跟包含
      include: path.resolve(__dirname, 'note4'),
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
            '@babel/preset-react'
          ]
        }
      }
    }
  ]
},
````

### 去除某些包的无关依赖的加载

例如 当我们项目使用moment的时候，会主动加载全量的语言包，但是我们项目就只需要中文语言包而已，所以要借助webpack的插件处理。

````js
plugins: [
  // 当引用moment的时候，忽略掉引用locale相关的语言包
  // 这会就要自己去引入，避免全量引入语言包
  new webpack.IgnorePlugin(/\.\/locale/, /moment/)
]
````
但是这样子，我们就使用不到我们的中文语言了，所有要在项目中手动引用中文语言包。例如

````js
import moment from 'moment'
// 因为webpack忽略了，所以要手动引入中文包
// 设置语言
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
let r = moment().endOf('day').fromNow()
````

### 动态链接库(dll)

动态链接库的原理，是把模块先打包起来，然后在用的时候，直接引用打包好的变量，如果没有才打包需要的。

例子：

把`./note4/test.js`打包到变量ab上，然后用的时候直接用ab就好了

```js

let path = require('path')
module.exports = {
  mode: 'development',
  entry: './note4/test.js',
  output: {
    filename: 'test.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'ab',
    libraryTarget: 'umd' // commenjs umd var this ...
  }
}
```

打包react的例子：

````js

let path = require('path')
const webpack = require('webpack')
module.exports = {
  mode: 'development',
  entry: {
    react: ['react', 'react-dom']
  },
  output: {
    filename: '_dll_[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: '_dll_[name]',
    // libraryTarget: 'umd' // commenjs umd var this ...
  },
  plugins: [
    new webpack.DllPlugin({
      name: '_dll_[name]',
      path: path.resolve(__dirname, 'dist', 'manifest.json')
    })
  ]
}

````

然后在我们打包好了，在我们用的时候，这么用就好了。

````js
plugins: [
  new webpack.DllReferencePlugin({
    manifest: path.resolve(__dirname, 'dist', 'manifest.json')
  })
]

````

### happypack多线程打包

````js
'use strict'
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const Happypack = require('happypack')
module.exports = {
  mode: 'development',
  entry: './note4/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    // 不去解析jquery的的依赖关系，因为我们知道jQuery不会有其他依赖
    noParse: /jquery/,
    rules: [
      {
        test: /\.js/,
        exclude: /node_modules/, //排除跟包含
        include: path.resolve(__dirname, 'note4'),
        use: {
          loader: 'Happypack/loader?id=js'
        }
      },
      {
        test: /\.css$/,
        use: 'Happypack/loader?id=css'
      }
    ]
  },
  plugins: [
    new Happypack({
      id: 'js',
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ]
          }
        }
      ]
    }),
    new Happypack({
      id: 'css',
      use: ['style-loader', 'css-loader']
    })
  ]
} 
````

### webpack自带优化功能
