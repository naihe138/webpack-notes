let { getOptions } = require('loader-utils');
var mime = require('mime');
function loader(source) {
  let options=getOptions(this)||{};
  let { limit, fallback='file-loader' } = options;
  if (limit) {
    limit = parseInt(limit, 10);
  }
  const mimetype=mime.getType(this.resourcePath);
  if (!limit || source.length < limit) {
    let base64 = `data:${mimetype};base64,${source.toString('base64')}`;
    return `module.exports = ${JSON.stringify(base64)}`;
  } else {
    let fileLoader = require(fallback || 'file-loader');
    return fileLoader.call(this, source);
  }
}
loader.raw = true;
module.exports = loader;