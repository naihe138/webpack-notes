## loader

webpack 可以使用 loader 来预处理文件。这允许你打包除 JavaScript 之外的任何静态资源。你可以使用 Node.js 来很简单地编写自己的 loader。

说道loader， 要先介绍一下webpack的大概运行流程

````

开始编译---->webapck默认配置--->创建normalModule--->使用resolve解析loader路径
                                   |
                                   |
                                   ↓
                                编译模块 ----> loader runner


````

loader 用法准则https://www.webpackjs.com/contribute/writing-a-loader/

## loader API 

1、缓存结果

webpack充分地利用缓存来提高编译效率

````js
this.cacheable();
````

2、异步

````js
// 让 Loader 缓存
module.exports = function(source) {
  var callback = this.async();
  // 做异步的事
  doSomeAsyncOperation(content, function(err, result) {
    if(err) return callback(err);
    callback(null, result);
  });
};

````

3、raw loader 

默认的情况源文件是以 UTF-8 字符串的形式传入给 Loader,设置module.exports.raw = true可使用 buffer 的形式进行处理

4、获得 Loader 的 options

````js

const loaderUtils = require('loader-utils');
module.exports = function(source) {
  // 获取到用户给当前 Loader 传入的 options
  const options = loaderUtils.getOptions(this);
  return source;
};

````

5、 返回其它结果

Loader有些场景下还需要返回除了内容之外的东西。

````js

module.exports = function(source) {
  // 通过 this.callback 告诉 Webpack 返回的结果
  this.callback(null, source, sourceMaps);
  // 当你使用 this.callback 返回内容时，该 Loader 必须返回 undefined，
  // 以让 Webpack 知道该 Loader 返回的结果在 this.callback 中，而不是 return 中 
  return;
};

````

````js

this.callback(
  // 当无法转换原内容时，给 Webpack 返回一个 Error
  err: Error | null,
  // 原内容转换后的内容
  content: string | Buffer,
  // 用于把转换后的内容得出原内容的 Source Map，方便调试
  sourceMap?: SourceMap,
  // 如果本次转换为原内容生成了 AST 语法树，可以把这个 AST 返回，
  // 以方便之后需要 AST 的 Loader 复用该 AST，以避免重复生成 AST，提升性能
  abstractSyntaxTree?: AST
);

````

6、同步与异步

````js

module.exports = function(source) {
  // 告诉 Webpack 本次转换是异步的，Loader 会在 callback 中回调结果
  var callback = this.async();
  someAsyncOperation(source, function(err, result, sourceMaps, ast) {
    // 通过 callback 返回异步执行后的结果
    callback(err, result, sourceMaps, ast);
  });
};

````

完整的loader api  

https://webpack.js.org/api/loaders/

中文： zhhttps://www.webpackjs.com/api/loaders/


## 编写babel-loader

需要安装以下几个模块 `npm install babel-core babel-preset-env -D`


````js
// babel-loader
const babelCore = require('babel-core')
module.exports = function (source) {
  const options = {
    presets: ['env'],
    sourceMap: true,
    filename: this.resourcePath.split('/').pop()
  }
  const result = babelCore.transform(source, options)
  return this.callback(null, result.code, result.map)
}

````

````js
// webopack-config

'use strict'
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './note7/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolveLoader: {
    alias: {
      'my-babel-loader': path.resolve(__dirname, './note7/bable-loader.js')
    }
  },
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /node_modules/, //排除跟包含
        include: path.resolve(__dirname, 'note7'),
        use: {
          loader: 'my-babel-loader',
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './note7/index.html',
      filename: 'index.html'
    })
  ]
} 

````

## 编写log-loader, 学习pitch

例如`a!b!c!module`, 正常调用顺序应该是`c、b、a`，但是真正调用顺序是 `a(pitch)、b(pitch)、c(pitch)、c、b、a`,如果其中任何一个`pitching loader`返回了值就相当于在它以及它右边的`loader`已经执行完毕

比如如果b返回了字符串"result b", 接下来只有a会被系统执行，且a的loader收到的参数是result b

loader根据返回值可以分为两种，一种是返回js代码（一个module的代码，含有类似module.export语句）的loader，还有不能作为最左边loader的其他loader

有时候我们想把两个第一种loader chain起来，比如style-loader!css-loader! 问题是css-loader的返回值是一串js代码，如果按正常方式写style-loader的参数就是一串代码字符串

为了解决这种问题，我们需要在style-loader里执行require(css-loader!resouce)

````js
// log-loader1.js
let loader = function (source, sourceMap, extra) {
  let cb = this.async()
  console.log('loader1')
  cb(null, source)
}

module.exports = loader

loader.pitch = function (remainingRequire, previousRequest, data) {
  console.log('loader1 pitch')
}

````


````js
// log-loader2.js
let loader = function (source, sourceMap, extra) {
  let cb = this.async()
  console.log('loader2')
  cb(null, source)
}

module.exports = loader

loader.pitch = function (remainingRequire, previousRequest, data) {
  console.log('loader2 pitch')
}

````



````js
// log-loader3.js
let loader = function (source, sourceMap, extra) {
  let cb = this.async()
  console.log('loader3')
  cb(null, source)
}

module.exports = loader

loader.pitch = function (remainingRequire, previousRequest, data) {
  console.log('loader3 pitch')
}

````

````js
// webpack.note8.js
{
  test: /\.js/,
  exclude: /node_modules/, //排除跟包含
  include: path.resolve(__dirname, 'note7'),
  use:[path.resolve('note7/log-loader1.js'), path.resolve('note7/log-loader2.js'), path.resolve('note7/log-loader3.js')]
}

````

最后会打印出

````
loader1 pitch
loader2 pitch
loader3 pitch
loader3
loader2
loader1

````

## 编写自己的样式处理loader

- css-loader 的作用是处理css中的 @import 和 url 这样的外部资源

- style-loader 的作用是把样式插入到 DOM中，方法是在head中插入一个style标签，并把样式写入到这个标签的 innerHTML里

- less-loader Compiles Less to CSS

- pitching-loader
- loader-utils

- !!

### 自定义less-loader

````js

let less=require('less');
module.exports=function (source) {
  let callback = this.async();
  less.render(source,(err,output) => {
    callback(err, `module.exports = ${JSON.stringify(output.css)}`);
  });
}

````

### 自定义css-loader

````js

function loader(source) {
  let reg = /url\((.+?)\)/g;
  let current;
  let pos = 0;
  let arr = [`let lists = [];`];
  while (current = reg.exec(source)) {
    let [matchUrl, p] = current;
    let index = reg.lastIndex - matchUrl.length;
    arr.push(`lists.push(${JSON.stringify(source.slice(pos, index))})`);
    pos = reg.lastIndex;
    arr.push(`lists.push("url("+require(${p})+")")`);
  }
  arr.push(`lists.push(${JSON.stringify(source.slice(pos))})`);
  arr.push(`module.exports = lists.join('')`);
  return arr.join('\r\n');
}
module.exports = loader;

````

### 自定义style-loader

````js

let loaderUtils=require("loader-utils");
function loader(source) {
  let script=(`
    let style = document.createElement("style");
    style.innerHTML = ${JSON.stringify(source)};
    document.head.appendChild(style);
  `);
  return script;
} 
//pitch里的参数可不是文件内容，而是文件的请求路径
//pitch request就是你要加载的文件路径 //index.less
loader.pitch = function (request) {
  let style = `
  var style = document.createElement("style");
  style.innerHTML = require(${loaderUtils.stringifyRequest(this, "!!" + request)});
  document.head.appendChild(style);
 `;
  return style;
}
module.exports = loader;

````

### 自定义file-loader

````js

const { getOptions, interpolateName } = require('loader-utils');
function loader(content) {
  let options=getOptions(this)||{};
  let url = interpolateName(this, options.filename || "[hash]", {content});
  url = url  + this.resourcePath.slice(this.resourcePath.lastIndexOf('.'));
  //发射一个文件 向输出里保存一个文件
  this.emitFile(url, content);
    return `module.exports = ${JSON.stringify(url)}`;
}
loader.raw = true;
module.exports = loader;

````

### 自定义url-loader

````js
let { getOptions } = require('loader-utils');
var mime = require('mime');
function loader(source) {
  let options=getOptions(this)||{};
  let { limit, fallback='file-loader' } = options;
  if (limit) {
    limit = parseInt(limit, 10);
  }
  const mimetype=mime.getType(this.resourcePath);
  if (!limit || source.length < limit) {
    let base64 = `data:${mimetype};base64,${source.toString('base64')}`;
    return `module.exports = ${JSON.stringify(base64)}`;
  } else {
    let fileLoader = require(fallback || 'file-loader');
    return fileLoader.call(this, source);
  }
}
loader.raw = true;
module.exports = loader;

````