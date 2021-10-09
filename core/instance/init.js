import { initState } from "./state"

export function initMixin(Vue) {
  Vue.prototype._init = function(options) {
    const vm = this

    vm.$options = options

    initState(vm)

    // 如果存在el属性，则进行模板渲染
    if(vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}