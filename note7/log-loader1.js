let loader = function (source, sourceMap, extra) {
  let cb = this.async()
  console.log('loader1')
  cb(null, source)
}

module.exports = loader

loader.pitch = function (remainingRequire, previousRequest, data) {
  console.log('loader1 pitch')
}
