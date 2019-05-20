'use strict'
const path = require('path')
module.exports = {
  mode: 'development', // 模式，默认两种 production development
  entry: './note1/index.js', // 入口
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'note1/dist')
  }
}