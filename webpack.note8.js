'use strict'
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './note7/index.1.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /node_modules/, //排除跟包含
        include: path.resolve(__dirname, 'note7'),
        use:[path.resolve('note7/log-loader1.js'), path.resolve('note7/log-loader2.js'), path.resolve('note7/log-loader3.js')]
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
