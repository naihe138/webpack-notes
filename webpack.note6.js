'use strict'
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const Happypack = require('happypack')
module.exports = {
  mode: 'development',
  entry: './note4/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    port: 3000,
    contentBase: './dist'
  },
  module: {
    // 不去解析jquery的的依赖关系，因为我们知道jQuery不会有其他依赖
    noParse: /jquery/,
    rules: [
      {
        test: /\.js/,
        exclude: /node_modules/, //排除跟包含
        include: path.resolve(__dirname, 'note4'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './note4/index.html',
      filename: 'index.html'
    }),
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, 'dist', 'manifest.json')
    })
  ]
} 