'use strict'

// note1 抽离样式
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCss = require('optimize-css-assets-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin');
module.exports = {
  mode: 'production', // 模式，默认两种 production development
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
  optimization: { // 优化项
    minimizer: [
      new TerserJSPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCss({})
    ]
  },
  module: { // 模块
    rules: [ // 规则
      {
        // css loader负责解析
        // style-loader 负责把css查到header中
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        // 处理less 文件
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader', // @import 解析
          'postcss-loader',
          'less-loader' // less -->css
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './note1/index.html', // 模板
      filename: 'index.html', // 文件名
      hash: true // hash戳。缓存等的问题
    }),
    new MiniCssExtractPlugin({
      filename: 'main.css'
    })
  ]
}