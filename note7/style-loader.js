let loaderUtils=require("loader-utils");
function loader(source) {
  console.log(11111)
  let script=(`
    let style = document.createElement("style");
    style.innerHTML = ${JSON.stringify(source)};
    document.head.appendChild(style);
  `);
  return script;
} 
//pitch里的参数可不是文件内容，而是文件的请求路径
//pitch request就是你要加载的文件路径 //index.less
loader.pitch = function (request) {
  let style = `
  var style = document.createElement("style");
  style.innerHTML = require(${loaderUtils.stringifyRequest(this, "!!" + request)});
  document.head.appendChild(style);
 `;
  return style;
}
module.exports = loader;