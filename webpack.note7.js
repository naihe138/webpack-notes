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
