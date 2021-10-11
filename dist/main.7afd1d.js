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

/***/ "./core/compiler/codegen.js":
/*!**********************************!*\
  !*** ./core/compiler/codegen.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"generate\": () => (/* binding */ generate)\n/* harmony export */ });\n/**\r\n * 拿到生成好的 ast 之后 需要把 ast 转化成类似\r\n * _c('div',{id:\"app\"},_c('div',undefined,_v(\"hello\"+_s(name)),_c('span',undefined,_v(\"world\"))))\r\n * 这样的字符串\r\n */\r\nconst defaultTagRE = /\\{\\{((?:.|\\r?\\n)+?)\\}\\}/g; //匹配花括号 {{  }} 捕获花括号里面的内容\r\n\r\nfunction gen(node) {\r\n  // 判断节点类型\r\n  // 主要包含处理文本核心\r\n  // 源码这块包含了复杂的处理  比如 v-once v-for v-if 自定义指令 slot等等  咱们这里只考虑普通文本和变量表达式{{}}的处理\r\n\r\n  // 如果是元素类型\r\n  if (node.type == 1) {\r\n    //   递归创建\r\n    return generate(node);\r\n  } else {\r\n    //   如果是文本节点\r\n    let text = node.text;\r\n    // 不存在花括号变量表达式\r\n    if (!defaultTagRE.test(text)) {\r\n      return `_v(${JSON.stringify(text)})`;\r\n    }\r\n    // 正则是全局模式 每次需要重置正则的lastIndex属性  不然会引发匹配bug\r\n    let lastIndex = (defaultTagRE.lastIndex = 0);\r\n    let tokens = [];\r\n    let match, index;\r\n\r\n    while ((match = defaultTagRE.exec(text))) {\r\n      // index代表匹配到的位置\r\n      index = match.index;\r\n      if (index > lastIndex) {\r\n        //   匹配到的{{位置  在tokens里面放入普通文本\r\n        tokens.push(JSON.stringify(text.slice(lastIndex, index)));\r\n      }\r\n      //   放入捕获到的变量内容\r\n      tokens.push(`_s(${match[1].trim()})`);\r\n      //   匹配指针后移\r\n      lastIndex = index + match[0].length;\r\n    }\r\n    // 如果匹配完了花括号  text里面还有剩余的普通文本 那么继续push\r\n    if (lastIndex < text.length) {\r\n      tokens.push(JSON.stringify(text.slice(lastIndex)));\r\n    }\r\n    // _v表示创建文本\r\n    return `_v(${tokens.join(\"+\")})`;\r\n  }\r\n}\r\n\r\n// 处理attrs属性\r\nfunction genProps(attrs) {\r\n  let str = \"\";\r\n  for (let i = 0; i < attrs.length; i++) {\r\n    let attr = attrs[i];\r\n    // 对attrs属性里面的style做特殊处理\r\n    if (attr.name === \"style\") {\r\n      let obj = {};\r\n      attr.value.split(\";\").forEach((item) => {\r\n        let [key, value] = item.split(\":\");\r\n        obj[key] = value;\r\n      });\r\n      attr.value = obj;\r\n    }\r\n    str += `${attr.name}:${JSON.stringify(attr.value)},`;\r\n  }\r\n  return `{${str.slice(0, -1)}}`;\r\n}\r\n\r\n// 生成子节点 调用gen函数进行递归创建\r\nfunction getChildren(el) {\r\n  const children = el.children;\r\n  if (children) {\r\n    return `${children.map((c) => gen(c)).join(\",\")}`;\r\n  }\r\n}\r\n// 递归创建生成code\r\nfunction generate(el) {\r\n  let children = getChildren(el);\r\n  let code = `_c('${el.tag}',${\r\n    el.attrs.length ? `${genProps(el.attrs)}` : \"undefined\"\r\n  }${children ? `,${children}` : \"\"})`;\r\n  return code;\r\n}\r\n\n\n//# sourceURL=webpack://myVue/./core/compiler/codegen.js?");

/***/ }),

/***/ "./core/compiler/index.js":
/*!********************************!*\
  !*** ./core/compiler/index.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"compileToFunctions\": () => (/* binding */ compileToFunctions)\n/* harmony export */ });\n/* harmony import */ var _instance_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../instance/index */ \"./core/instance/index.js\");\n/* harmony import */ var _parse__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./parse */ \"./core/compiler/parse.js\");\n/* harmony import */ var _codegen__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./codegen */ \"./core/compiler/codegen.js\");\n/* harmony import */ var _instance_lifecycle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../instance/lifecycle */ \"./core/instance/lifecycle.js\");\n\r\n\r\n\r\n\r\n\r\n// 源码的位置在entry-runtime-with-compiler.js，和runtime-only版本做区分\r\n_instance_index__WEBPACK_IMPORTED_MODULE_0__[\"default\"].prototype.$mount = function (el) {\r\n  const vm = this;\r\n  const options = vm.$options;\r\n  el = document.querySelector(el);\r\n\r\n  // 如果不存在render属性\r\n  if (!options.render) {\r\n    let template = options.template;\r\n\r\n    // 如果不存在render和template，但存在el，直接把模板赋值到el所在的外层html结构，就是el本身，不是父元素\r\n    if (!template && el) {\r\n      template = getOuterHTML;\r\n    }\r\n\r\n    if (template) {\r\n      const render = compileToFunctions(template);\r\n      options.render = render;\r\n    }\r\n\r\n    return (0,_instance_lifecycle__WEBPACK_IMPORTED_MODULE_3__.mountComponent)(vm, el);\r\n  }\r\n};\r\n\r\nfunction getOuterHTML(el) {\r\n  if (el.outerHTML) {\r\n    return el.outerHTML;\r\n  } else {\r\n    const div = document.createElement(\"div\");\r\n    div.appendChild(el.cloneNode(true));\r\n    return div.innerHTML;\r\n  }\r\n}\r\n\r\n// 将template变成render函数\r\nfunction compileToFunctions(template) {\r\n  // 1. 将template变成ast语法树\r\n  // ast用来描述代码本身形成树结构，不仅可以描述html，也能描述css以及js语法\r\n  // 很多库都运用了ast，比如webpack，babel，eslint等\r\n  let ast = (0,_parse__WEBPACK_IMPORTED_MODULE_1__.parse)(template);\r\n\r\n  // 2. 优化静态节点，这里没实现\r\n  // if (options.optimize !== false) {\r\n  //   optimize(ast, options)\r\n  // }\r\n\r\n  // 3. 通过ast重新生成代码\r\n  // 类似_c('div',{id:\"app\"},_c('div',undefined,_v(\"hello\"+_s(name)),_c('span',undefined,_v(\"world\"))))\r\n  // _c代表创建元素 _v代表创建文本 _s代表文Json.stringify--把对象解析成文本\r\n  let code = (0,_codegen__WEBPACK_IMPORTED_MODULE_2__.generate)(ast);\r\n  let render = new Function(`with(this){return ${code}}`);\r\n  return render;\r\n}\r\n\n\n//# sourceURL=webpack://myVue/./core/compiler/index.js?");

/***/ }),

/***/ "./core/compiler/parse.js":
/*!********************************!*\
  !*** ./core/compiler/parse.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"parse\": () => (/* binding */ parse)\n/* harmony export */ });\n/**\r\n * 利用正则 匹配 html 字符串 遇到开始标签 结束标签和文本 解析完毕之后生成对应的 ast\r\n * 并建立相应的父子关联 不断的 advance 截取剩余的字符串 直到 html 全部解析完毕 咱们\r\n * 这里主要写了对于开始标签里面的属性的处理--parseStartTag\r\n */\r\nconst ncname = `[a-zA-Z_][\\\\-\\\\.0-9_a-zA-Z]*`; // 匹配标签名，比如abc-123\r\nconst qnameCapture = `((?:${ncname}\\\\:)?${ncname})`; //匹配特殊标签 形如 abc:234 前面的abc:可有可无\r\nconst startTagOpen = new RegExp(`^<${qnameCapture}`); // 匹配标签开始 形如 <abc-123 捕获里面的标签名\r\nconst startTagClose = /^\\s*(\\/?)>/; // 匹配标签结束  >\r\nconst endTag = new RegExp(`^<\\\\/${qnameCapture}[^>]*>`); // 匹配标签结尾 如 </abc-123> 捕获里面的标签名\r\nconst attribute =\r\n  /^\\s*([^\\s\"'<>\\/=]+)(?:\\s*(=)\\s*(?:\"([^\"]*)\"+|'([^']*)'+|([^\\s\"'=<>`]+)))?/; // 匹配属性  形如 id=\"app\"\r\nlet root, currentParent; //代表根节点 和当前父节点\r\n// 栈结构 来表示开始和结束标签\r\nlet stack = [];\r\n// 标识元素和文本type\r\nconst ELEMENT_TYPE = 1;\r\nconst TEXT_TYPE = 3;\r\n\r\n// 生成ast方法\r\nfunction createASTElement(tagName, attrs) {\r\n  return {\r\n    tag: tagName,\r\n    type: ELEMENT_TYPE,\r\n    children: [],\r\n    attrs,\r\n    parent: null,\r\n  };\r\n}\r\n\r\n// 对开始标签进行处理\r\nfunction handleStartTag({ tagName, attrs }) {\r\n  let element = createASTElement(tagName, attrs);\r\n  if (!root) {\r\n    root = element;\r\n  }\r\n  currentParent = element;\r\n  stack.push(element);\r\n}\r\n\r\n// 对结束标签进行处理\r\nfunction handleEndTag(tagName) {\r\n  // 栈结构 []\r\n  // 比如 <div><span></span></div> 当遇到第一个结束标签</span>时 会匹配到栈顶<span>元素对应的ast 并取出来\r\n  let element = stack.pop();\r\n  // 当前父元素就是栈顶的上一个元素 在这里就类似div\r\n  currentParent = stack[stack.length - 1];\r\n  // 建立parent和children关系\r\n  if (currentParent) {\r\n    element.parent = currentParent;\r\n    currentParent.children.push(element);\r\n  }\r\n}\r\n\r\n// 对文本进行处理\r\nfunction handleChars(text) {\r\n  // 去掉空格\r\n  text = text.replace(/\\s/g, \"\");\r\n  if (text) {\r\n    currentParent.children.push({\r\n      type: TEXT_TYPE,\r\n      text,\r\n    });\r\n  }\r\n}\r\n\r\n// 解析标签生成ast核心\r\nfunction parse(html) {\r\n  while (html) {\r\n    // 查找<\r\n    let textEnd = html.indexOf(\"<\");\r\n    // 如果<在第一个 那么证明接下来就是一个标签 不管是开始还是结束标签\r\n    if (textEnd === 0) {\r\n      // 如果开始标签解析有结果\r\n      const startTagMatch = parseStartTag();\r\n      if (startTagMatch) {\r\n        // 把解析好的标签名和属性解析生成ast\r\n        handleStartTag(startTagMatch);\r\n        continue;\r\n      }\r\n\r\n      // 匹配结束标签</\r\n      const endTagMatch = html.match(endTag);\r\n      if (endTagMatch) {\r\n        advance(endTagMatch[0].length);\r\n        handleEndTag(endTagMatch[1]);\r\n        continue;\r\n      }\r\n    }\r\n\r\n    let text;\r\n    // 形如 hello<div></div>\r\n    if (textEnd >= 0) {\r\n      // 获取文本\r\n      text = html.substring(0, textEnd);\r\n    }\r\n    if (text) {\r\n      advance(text.length);\r\n      handleChars(text);\r\n    }\r\n  }\r\n\r\n  // 匹配开始标签\r\n  function parseStartTag() {\r\n    const start = html.match(startTagOpen);\r\n\r\n    if (start) {\r\n      const match = {\r\n        tagName: start[1],\r\n        attrs: [],\r\n      };\r\n      //匹配到了开始标签 就截取掉\r\n      advance(start[0].length);\r\n\r\n      // 开始匹配属性\r\n      // end代表结束符号>  如果不是匹配到了结束标签\r\n      // attr 表示匹配的属性\r\n      let end, attr;\r\n      while (\r\n        !(end = html.match(startTagClose)) &&\r\n        (attr = html.match(attribute))\r\n      ) {\r\n        advance(attr[0].length);\r\n        attr = {\r\n          name: attr[1],\r\n          value: attr[3] || attr[4] || attr[5], //这里是因为正则捕获支持双引号 单引号 和无引号的属性值\r\n        };\r\n        match.attrs.push(attr);\r\n      }\r\n      if (end) {\r\n        //   代表一个标签匹配到结束的>了 代表开始标签解析完毕\r\n        advance(1);\r\n        return match;\r\n      }\r\n    }\r\n  }\r\n  //截取html字符串 每次匹配到了就往前继续匹配\r\n  function advance(n) {\r\n    html = html.substring(n);\r\n  }\r\n  //   返回生成的ast\r\n  return root;\r\n}\r\n\n\n//# sourceURL=webpack://myVue/./core/compiler/parse.js?");

/***/ }),

/***/ "./core/instance/index.js":
/*!********************************!*\
  !*** ./core/instance/index.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _init__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./init */ \"./core/instance/init.js\");\n\r\n\r\nfunction Vue(options) {\r\n  this._init(options)\r\n}\r\n\r\n(0,_init__WEBPACK_IMPORTED_MODULE_0__.initMixin)(Vue)\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Vue);\n\n//# sourceURL=webpack://myVue/./core/instance/index.js?");

/***/ }),

/***/ "./core/instance/init.js":
/*!*******************************!*\
  !*** ./core/instance/init.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"initMixin\": () => (/* binding */ initMixin)\n/* harmony export */ });\n/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./state */ \"./core/instance/state.js\");\n\r\n\r\nfunction initMixin(Vue) {\r\n  Vue.prototype._init = function(options) {\r\n    const vm = this\r\n\r\n    vm.$options = options\r\n\r\n    ;(0,_state__WEBPACK_IMPORTED_MODULE_0__.initState)(vm)\r\n\r\n    // 如果存在el属性，则进行模板渲染\r\n    if(vm.$options.el) {\r\n      vm.$mount(vm.$options.el)\r\n    }\r\n  }\r\n}\n\n//# sourceURL=webpack://myVue/./core/instance/init.js?");

/***/ }),

/***/ "./core/instance/lifecycle.js":
/*!************************************!*\
  !*** ./core/instance/lifecycle.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"mountComponent\": () => (/* binding */ mountComponent)\n/* harmony export */ });\n// 挂载组件实例入口\r\nfunction mountComponent(vm, el) {\r\n  // 上一步是生成render函数，下一步是执行render生成虚拟dom\r\n  // 最后再使用vm._update()把虚拟dom渲染到页面\r\n  vm.$el = el;\r\n\r\n  // _update和_render方法和_init方法一样都是定义在Vue原型上的方法\r\n  vm._update(vm._render());\r\n}\r\n\n\n//# sourceURL=webpack://myVue/./core/instance/lifecycle.js?");

/***/ }),

/***/ "./core/instance/state.js":
/*!********************************!*\
  !*** ./core/instance/state.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"initState\": () => (/* binding */ initState)\n/* harmony export */ });\n/* harmony import */ var _observer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../observer */ \"./core/observer/index.js\");\n\r\n\r\n// 注意顺序，比如会问到是否能在data中直接使用prop的值\r\n// props->methods->data->computed->watch\r\nfunction initState(vm) {\r\n  const opts = vm.$options\r\n  if(opts.props) {\r\n    initProps(vm)\r\n  }\r\n  if(opts.methods) {\r\n    initMethods(vm)\r\n  }\r\n  if(opts.data) {\r\n    initData(vm)\r\n  }\r\n  if(opts.computed) {\r\n    initComputed(vm)\r\n  }\r\n  if(opts.watch) {\r\n    initWatch(vm)\r\n  }\r\n}\r\n\r\nfunction initProps(vm) {}\r\n\r\nfunction initMethods(vm) {}\r\n\r\nfunction initData(vm) {\r\n  let data = vm.$option.data\r\n  data = vm._data = \r\n    typeof data === 'function' ? \r\n      data.call(vm) :\r\n        data || {}\r\n  \r\n  // 把data代理到vm实例中，我们可以使用this.a来访问this._data.a\r\n  const keys = Object.keys(data)\r\n  let i = keys.length\r\n  while(i--) {\r\n    const key = keys[i]\r\n    proxy(vm, '_data', key)\r\n  }\r\n\r\n  // 对数据进行观察\r\n  (0,_observer__WEBPACK_IMPORTED_MODULE_0__.observe)(data)\r\n}\r\n\r\nfunction initComputed(vm) {}\r\n\r\nfunction initWatch(vm) {}\r\n\r\nfunction proxy(object, sourceKey, key) {\r\n  Object.defineProperty(object, key, {\r\n    get() {\r\n      return object[sourceKey][key]\r\n    },\r\n    set(newVal) {\r\n      object[sourceKey][key] = newVal\r\n    }\r\n  })\r\n}\n\n//# sourceURL=webpack://myVue/./core/instance/state.js?");

/***/ }),

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _core_compiler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/compiler */ \"./core/compiler/index.js\");\n\r\n\r\nconst template = \"<div><p>adsadsa</p></div>\";\r\n\r\nconst vnode = (0,_core_compiler__WEBPACK_IMPORTED_MODULE_0__.compileToFunctions)(template);\r\n\r\nconsole.log(vnode);\r\n\n\n//# sourceURL=webpack://myVue/./src/main.js?");

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