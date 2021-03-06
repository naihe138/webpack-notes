## 安装webpack

`npm install webpack webpack-cli -D`

## 手动配置webpack

````js
  const path = require('path')
  module.exports = {
    mode: 'development', // 模式，默认两种 production development
    entry: './index.js', // 入口
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  }
````
然后在package.json配置，就可以直接快速打包了。

`"note1": "webpack --config ./note1/webpack.config.js"`

把打包出来的代码进行精简，就成了下面这个样子了

```js
(function (modules) { // webpackBootstrap
  // 定义一个缓存的模块
  var installedModules = {};
  // 实现一个自己的require的函数
  function __webpack_require__(moduleId) {
    // 检查是否有缓存
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    // 创建一个新的模块，并且放到缓存里面
    var module = installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    };
    // 执行模块函数
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    // 设置时候执行过的标志
    module.l = true;
    // 返回模块内容
    return module.exports;
  }
  // 加载入口模块并且返回出去
  return __webpack_require__(__webpack_require__.s = "./note1/index.js");
})
/************************************************************************/
({
  "./note1/a.js": (function (module, exports) {
    eval("module.exports = 'helle world'\n\n//# sourceURL=webpack:///./note1/a.js?");
  }),
  "./note1/index.js": (function (module, exports, __webpack_require__) {
    eval("\nlet str = __webpack_require__(\"./note1/a.js\")\nconsole.log(str)\n\n//# sourceURL=webpack:///./note1/index.js?");
  })
});
```

上边的代码流程就是，传一个对象进去，这个对象其中的key是文件地址，value是一个function，然后从入口开始执行`__webpack_require__(__webpack_require__.s = "./note1/index.js");`执行这个__webpack_require__之后会检查有没有缓存，如果有就直接返回缓存的的`installedModules[moduleId].exports`，否则穿创建一个模块进行缓存，然后执行key的函数，执行这个函数，如果函数里面还有 `__webpack_require__`，会继续递归执行，然后吧结果一层层返回出来赋值到`module.exports`上面，然后在返回`module.exports`

### webapck-dev-server 服务

安装模块

`npm install webpack-dev-server -D`

然后在命令行运行`npx webpack-dev-server --config webpack.note1.js`，然后就把文件打包到内存里面，这么运行是直接以当前目录作为一个服务。但是我们配置的话，需要指定的打包目录去作为文件服务，这就需要再webpack配置文件中配置如下。

````js
	// 开发服务器配置
  devServer: {
    port: 3000, // 端口号
    progress: true, // 打包进度
    contentBase: './note1/dist' // 指定那个运行目录
  }
````

然后在package.json里面配置 

````js
"scripts": {
  "note1": "webpack --config webpack.note1.js",
  "dev-note1": "webpack-dev-server --config webpack.note1.js"
}
````

命令行运行`npm run dev-note1`，就可以起一个以`./note1/dist`目录的服务器了。

## html插件

到目前为止，我们打包出来都是没有html模板的，下面我们用`html-webapck-plugin`的插件，配置一个html模板生产文件。在webpack配置文件中配置一个插件，就可以打包出html文件了。

````js
// ....
plugins: [
  new HtmlWebpackPlugin({
    template: './note1/index.html', // 模板
    filename: 'index.html', // 文件名
    minify: {
      removeAttributeQuotes: true, // 去掉html属性双引号
      collapseWhitespace: true, // 折叠成一行
    },
    hash: true // hash戳。缓存等的问题
  })
]
// ....
````
这么配置就可以生打包出来inde.html文件了。

## 打包css模块

打包css样式，需要css-loader和style-loader，css-loader复制解析我们css文件的代码，style-loader复制解析完代码插入到html模板文件里面，建议loader设计都需要建议只是单一职责。

安装css-loader 和style-loader

`npm install css-loader style-loader -D`

在我们webpack配置代码里面配置。

````js
// ....

module: { // 模块
  rules: [ // 规则
    {
      // css loader负责解析
      // style-loader 负责把css查到header中
      test: /\.css$/,
      use: [
        {
          loader: 'style-loader'
          // options: {} // 对象形式可以传参数
        },
        'css-loader'
      ]
    },
    {
      // 处理less 文件
      test: /\.less$/,
      use: [
        {
          loader: 'style-loader'
        },
        'css-loader', // @import 解析
        'less-loader' // less -->css
      ]
    }
  ]
},

// ....

````

最后打包出来，就把样式插入到页面中了。

### 抽离样式

````js
// 抽离样式
npm install mini-css-extract-plugin -D
 
// css添加前缀
npm install postcss-loader autoprefixer -D

// css压缩优化
npm install optimize-css-assets-webpack-plugin -D

// 压缩js

npm install uglifyjs-webpack-plugin -D
````

具体请看下面抽离样式的配置。

````js

'use strict'
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCss = require('optimize-css-assets-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin');
module.exports = {
  mode: 'development', // 模式，默认两种 production development
  // 开发服务器配置
  devServer: {
    port: 3000, // 端口号
    progress: true, // 打包进度
    contentBase: './note1/dist' // 指定那个运行目录
  },
  entry: './note1/index.js', // 入口
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.resolve(__dirname, 'note1/dist')
  },
  optimization: { // 优化项
    minimizer: [
      new TerserJSPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCss({})
    ]
  },
  module: { // 模块
    rules: [ // 规则
      {
        // css loader负责解析
        // style-loader 负责把css查到header中
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        // 处理less 文件
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader', // @import 解析
          'postcss-loader',
          'less-loader' // less -->css
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './note1/index.html', // 模板
      filename: 'index.html', // 文件名
      hash: true // hash戳。缓存等的问题
    }),
    new MiniCssExtractPlugin({
      filename: 'main.css'
    })
  ]
}

````