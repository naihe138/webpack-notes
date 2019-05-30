'use strict'
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  mode: 'development',
  entry: {
    home: './note4/index.js'
  },
  output: {
    filename: '[name].[hash:8].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: []
  },
  devServer: {
    port: 8081, // 端口号
    progress: true, // 打包进度
    contentBase: 'dist', // 指定那个运行目录
    proxy: {
      '/test': 'http://localhost:3000' // 如果是test开头一律转发到http://localhost:3000
    }
  },
  // devServer: {
  //   port: 8081, // 端口号
  //   progress: true, // 打包进度
  //   contentBase: 'dist', // 指定那个运行目录
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:3000',
  //       pathRewrite: {
  //         '/api': ''
  //       }
  //     }
  //   }
  // }, 
  plugins: [
    new HtmlWebpackPlugin({
      template: './note4/index.html',
      filename: 'index.html',
      chunks: ['home']
    })
  ]
}