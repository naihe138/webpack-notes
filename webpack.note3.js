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
  // 1、devtool: 'source-map',源码映射，会单独生成source-map，然后调试的时候， 出错了 会标识当前报错的列。 大而全
  // 2、devtool: 'eval-source-map', 不会产生单独文件， 但是产生行和列
  // 3、devtool: 'cheap-module-souce-map',不会产生列，但是是一个单独的文件，产生后可以保留起来可以用来调试
  // 4、devtool: 'cheap-module-eval-source-map'不会产生文件，集成在打包代码文件中，也不会产生列
  devtool: 'source-map',
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