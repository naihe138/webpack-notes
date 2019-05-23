## ES6转成es5

bable-loader把代码转成

`npm install babel-loader @babel/core @babel/preset-env -D`

支持装饰器和class等的语法插件

`@bable/plugin-proposal-class-properties @babel/plugin-proposal-decorators -D `

可以重复使用Babel注入的帮助程序代码，用来节省代码的插件。

`npm install --save-dev @babel/plugin-transform-runtime`

和@ babel / runtime作为生产依赖项（因为它是“运行时”）。

`npm install --save @babel/runtime`

es6语法垫片

`npm install --save @babel/polyfill`


详见配置如下配置

````js

{
  test: /\.js$/,
  use: {
    loader: 'bable-loader',
    options: { // 用es6转成 es5
      preset: [
        '@babel/preset-env'
      ],
      plugins: [
        '@bable/plugin-proposal-class-properties',
        '@babel/plugin-proposal-decorators',
        '@babel/plugin-transform-runtime'
      ]
    }
  },
  include: path.resolve(__dirname, 'src'),
  exclude: /node_modules/
},

````

### eslint

安装 
`npm install eslint eslint-loader`

详细配置见官网，需要配合`.eslintrc.json配置文件`

````js
{
  test: /\.js$/,
  use: {
    loader: 'eslint-loader',
    options: {
      enforce: 'pre' // 强制eslint先执行
    }
  }
},

````


### 第三方模块处理

`npm install jquery`

- expost-loader 暴露到window上

- providePlugin 给每个人都提供一个$

- 引入不打包（externals）


### webpack打包图片

`npm install url-loader` 

可以限制图片大小，转成base64

- 在js中创建图片引入, 用require

- 在css中引入,css-loader会解析的

- `<image src="/xx.png">`，需要 html-withimag-loader

