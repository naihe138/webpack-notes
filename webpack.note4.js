'use strict'
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
module.exports = {
  mode: 'development',
  entry: {
    home: './note3/index.js'
  },
  output: {
    filename: '[name].[hash:8].js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    modules: [path.resolve('node_module')], //当前目录解析
    // mainFields: ['style', 'main'], // 入口文件的名字，
    alias: { // 别名
      'bcss': 'bootstrap/dis/style.css'
    },
    extensions: ['js', 'css', 'json'] // 省略扩展名
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
    }),
    new webpack.DefinePlugin({
      DEV: JSON.stringify('dev'), // string dev
      FLAG: 'true', // true
      EXPORESSION: '1+1' // 表达式
    })
  ]
}