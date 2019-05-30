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
      // {
      //   test: /\.js/,
      //   exclude: /node_modules/, //排除跟包含
      //   include: path.resolve(__dirname, 'note4'),
      //   use: {
      //     loader: 'babel-loader',
      //     options: {
      //       presets: [
      //         '@babel/preset-env',
      //         '@babel/preset-react'
      //       ]
      //     }
      //   }
      // },
      {
        test: /\.js/,
        exclude: /node_modules/, //排除跟包含
        include: path.resolve(__dirname, 'note4'),
        use: {
          loader: 'Happypack/loader?id=js'
        }
      },
      // {
      //   test: /\.css$/,
      //   use: ['style-loader', 'css-loader']
      // },
      {
        test: /\.css$/,
        use: 'Happypack/loader?id=css'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './note4/index.html',
      filename: 'index.html'
    }),
    // 当引用moment的时候，忽略掉引用locale相关的语言包
    // 这会就要自己去引入，避免全量引入语言包
    new webpack.IgnorePlugin(/\.\/locale/, /moment/),
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, 'dist', 'manifest.json')
    }),
    new Happypack({
      id: 'js',
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ]
          }
        }
      ]
    }),
    new Happypack({
      id: 'css',
      use: ['style-loader', 'css-loader']
    })
  ]
} 
