let less = require('less')

module.exports = function (source) {
  let callback = this.async()

  less.render(source, {filename: this.resource}, (err, output) => {
    callback(err, `module.exports = ${JSON.stringify(output.css)}`)
  })
}
