let path = require('path')

module.exports = {
  mode: 'development',
  entry: './note4/test.js',
  output: {
    filename: 'test.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'ab',
    libraryTarget: 'umd' // commenjs umd var this ...
  }
}