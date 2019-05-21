(function (modules) { // webpackBootstrap
	// 定义一个缓存的模块
	var installedModules = {};
	// 实现一个自己的require的函数
	function __webpack_require__(moduleId) {
		// 检查是否有缓存
		if (installedModules[moduleId]) {
			return installedModules[moduleId].exports;
		}
		// 创建一个新的模块，并且放到缓存里面
		var module = installedModules[moduleId] = {
			i: moduleId,
			l: false,
			exports: {}
		};
		// 执行模块函数
		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
		// 设置时候执行过的标志
		module.l = true;
		// 返回模块内容
		return module.exports;
	}
	// 加载入口模块并且返回出去
	return __webpack_require__(__webpack_require__.s = "./note1/index.js");
})
/************************************************************************/
({
	"./note1/a.js": (function (module, exports) {
		eval("module.exports = 'helle world'\n\n//# sourceURL=webpack:///./note1/a.js?");
	}),
	"./note1/index.js": (function (module, exports, __webpack_require__) {
		eval("\nlet str = __webpack_require__(\"./note1/a.js\")\nconsole.log(str)\n\n//# sourceURL=webpack:///./note1/index.js?");
	})
});