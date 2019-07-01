'use strict'
const path = require('path')
const FileListPlugin = require('./note8/file-list-plugin.js')
module.exports = {
  mode: 'development',
  entry: './note8/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {},
  plugins: [
    new FileListPlugin()
  ]
} 
