import Vue from '../instance/index'

// 源码的位置在entry-runtime-with-compiler.js，和runtime-only版本做区分
Vue.prototype.$mount = function(el) {
  const vm = this
  const options = vm.$options
  el = document.querySelector(el)

  // 如果不存在render属性
  if(!options.render) {
    let template = options.template

    // 如果不存在render和template，但存在el，直接把模板赋值到el所在的外层html结构，就是el本身，不是父元素
    if(!template && el) {
      template = getOuterHTML
    }

    if(template) {
      const render = compileToFunctions(template)
      options.render = render
    }
  }
}

function getOuterHTML(el) {
  if(el.outerHTML) {
    return el.outerHTML
  } else {
    const div = document.createElement('div')
    div.appendChild(el.cloneNode(true))
    return div.innerHTML
  }
}

// 将template变成render
function compileToFunctions(template) {

}