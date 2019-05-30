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

- 模式切换为，'production'，开启代码树摇，只有 import的才能使用

- scope hosting