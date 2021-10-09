import Vue from '../instance/index'
import { parse } from './parse'
import { generate } from './codegen'

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

// 将template变成render函数
function compileToFunctions(template) {
  // 1. 将template变成ast语法树
  // ast用来描述代码本身形成树结构，不仅可以描述html，也能描述css以及js语法
  // 很多库都运用了ast，比如webpack，babel，eslint等
  let ast = parse(template)

  // 2. 优化静态节点，这里没实现
  // if (options.optimize !== false) {
  //   optimize(ast, options)
  // }

  // 3. 通过ast重新生成代码
  // 类似_c('div',{id:"app"},_c('div',undefined,_v("hello"+_s(name)),_c('span',undefined,_v("world"))))
  // _c代表创建元素 _v代表创建文本 _s代表文Json.stringify--把对象解析成文本
  let code = generate(ast)
  let render = new Function(`with(this){return ${code}}`)
  return render
}