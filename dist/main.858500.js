/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./core/observer/array.js":
/*!********************************!*\
  !*** ./core/observer/array.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"arrayMethods\": () => (/* binding */ arrayMethods)\n/* harmony export */ });\n// 数组的原型对象\r\nconst arrayProto = Array.prototype\r\n\r\n// 进行浅拷贝，不破坏封装的前提下，动态拓展功能\r\nconst arrayMethods = Object.create(arrayProto)\r\n\r\nlet methodsToPath = [\r\n  'push',\r\n  'pop',\r\n  'shift',\r\n  'unshift',\r\n  'splice',\r\n  'reverse',\r\n  'sort'\r\n]\r\n\r\nmethodsToPath.forEach(method => {\r\n  arrayMethods[method] = function(...args) {\r\n    // 保留原始方法的执行结果\r\n    const result = arrayProto[method].apply(this, args)\r\n\r\n    // this表示数据本身，比如{ a: [1,2,3] }，那么使用a.push(4)，this就是a，ob就是a.__ob__\r\n    const ob = this.__ob__\r\n\r\n    let inserted\r\n    switch(method) {\r\n      case 'push':\r\n      case 'shift':\r\n        inserted = args\r\n        break;\r\n      case 'splice':\r\n        inserted = args.slice(2)\r\n      default:\r\n        break;\r\n    }\r\n\r\n    if(inserted) {\r\n      ob.observeArray(inserted)\r\n    }\r\n    // 这里触发视图更新\r\n    return result\r\n  }\r\n})\n\n//# sourceURL=webpack://myVue/./core/observer/array.js?");

/***/ }),

/***/ "./core/observer/index.js":
/*!********************************!*\
  !*** ./core/observer/index.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"defineReactive\": () => (/* binding */ defineReactive),\n/* harmony export */   \"observe\": () => (/* binding */ observe)\n/* harmony export */ });\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ \"./core/utils/index.js\");\n/* harmony import */ var _array__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./array */ \"./core/observer/array.js\");\n\r\n\r\n\r\nclass Observer {\r\n  constructor(value) {\r\n    this.value = value\r\n\r\n    // 给每个可响应式数据添加不可枚举的__ob__属性，并指向Observer实例\r\n    // 防止已被响应式处理的数据反复被处理\r\n    Object.defineProperty(value, '__ob__', {\r\n      value: this,\r\n      enumerable: false,\r\n      writable: true,\r\n      configurable: true\r\n    })\r\n\r\n    if(Array.isArray(value)) {\r\n      // 对数组做额外判断，通过重写数组原型方法对数组的七种方法进行拦截\r\n      value.__proto__ = _array__WEBPACK_IMPORTED_MODULE_1__.arrayMethods\r\n      \r\n      // 如果数组中还有数组，则需要递归判断\r\n      this.observeArray(value)\r\n    }\r\n    this.walk(value)\r\n  }\r\n\r\n  walk(data) {\r\n    // 对象上的所有属性依次进行观察\r\n    let keys = Object.keys(data)\r\n    for(let i=0; i<keys.length; i++) {\r\n      let key = keys[i]\r\n      let value = data[key]\r\n      defineReactive(data, key, value)\r\n    }\r\n  }\r\n\r\n  observeArray(items) {\r\n    for(let i=0; i<items.length; i++) {\r\n      observe(items[i])\r\n    }\r\n  }\r\n}\r\n\r\nfunction defineReactive(data, key, value) {\r\n  // 递归关键，如果value还是对象，会继续走一遍defineReactive层层遍历，直到value不是对象为止\r\n  // 如果data中数据层次太深->性能会受到影响\r\n  observe(value)\r\n\r\n  Object.defineProperty(data, key, {\r\n    get() {\r\n      console.log('获取数据');\r\n      return value\r\n    },\r\n    set(newVal) {\r\n      console.log('设置数据');\r\n      if(newVal === value) return\r\n      value = newVal\r\n    }\r\n  })\r\n}\r\n\r\nfunction observe(value) {\r\n  // 如果传过来的是对象或数组，则进行劫持\r\n  if(Array.isArray(value) || (0,_utils__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(value)) {\r\n    return new Observer(value)\r\n  }\r\n}\n\n//# sourceURL=webpack://myVue/./core/observer/index.js?");

/***/ }),

/***/ "./core/utils/index.js":
/*!*****************************!*\
  !*** ./core/utils/index.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"isPlainObject\": () => (/* binding */ isPlainObject)\n/* harmony export */ });\n/**\r\n * Get the raw type string of a value, e.g., [object Object].\r\n */\r\nconst _toString = Object.prototype.toString;\r\n\r\n/**\r\n * Strict object type check. Only returns true\r\n * for plain JavaScript objects.\r\n */\r\nfunction isPlainObject(obj) {\r\n  return _toString.call(obj) === \"[object Object]\";\r\n}\r\n\n\n//# sourceURL=webpack://myVue/./core/utils/index.js?");

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _core_observer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/observer */ \"./core/observer/index.js\");\n\r\n\r\nlet obj = {\r\n  a: 1,\r\n  b: 2,\r\n};\r\n\r\nlet o = (0,_core_observer__WEBPACK_IMPORTED_MODULE_0__.observe)(obj);\r\nobj.a;\r\nobj.b = 22;\r\n\n\n//# sourceURL=webpack://myVue/./src/main.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.js");
/******/ 	
/******/ })()
;