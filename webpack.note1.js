'use strict'
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
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
}