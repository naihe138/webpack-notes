const babelCore = require('babel-core')
module.exports = function (source) {
  const options = {
    presets: ['env'],
    sourceMap: true,
    filename: this.resourcePath.split('/').pop()
  }
  const result = babelCore.transform(source, options)
  return this.callback(null, result.code, result.map)
}