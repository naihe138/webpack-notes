const { getOptions, interpolateName } = require('loader-utils');
function loader(content) {
    let options=getOptions(this)||{};
    let url = interpolateName(this, options.filename || "[hash]", {content});
    url = url  + this.resourcePath.slice(this.resourcePath.lastIndexOf('.'));
    //发射一个文件 向输出里保存一个文件
    this.emitFile(url, content);
    return `module.exports = ${JSON.stringify(url)}`;
}
loader.raw = true;
module.exports = loader;