'use strict'
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  mode: 'development',
  entry: {
    home: './note3/index.js'
  },
  output: {
    filename: '[name].[hash:8].js',
    path: path.resolve(__dirname, 'dist')
  },
  watch: true, // 监听代码变化 实时编译
  watchOptions: {
    poll: 1000, // 每秒1000次
    aggreatementTimeout: 500, // 防抖作用
    ignored: /node_modules/, // 不需要监控那个文件
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './note3/index.html',
      filename: 'home.html',
      chunks: ['home']
    })
  ]
}