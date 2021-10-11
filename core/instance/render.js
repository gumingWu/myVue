import { installRenderHelpers } from "./render-helper";

/**
 * 主要在原型定义了_render 方法 然后执行了 render 函数 我们知道模板
 * 编译出来的 render 函数核心代码主要 return 了 类似于
 * _c('div',{id:"app"},_c('div',undefined,_v("hello"+_s(name)),_c('span',undefined,_v("world"))))
 * 这样的代码 那么我们还需要定义一下_c _v _s 这些函数才能最终转化成为虚拟 dom
 */

export function renderMixin(Vue) {
  // 注册render通用方法
  installRenderHelpers(Vue.prototype);

  Vue.prototype._render = function () {
    const vm = this;
    // 获取模板编译的render函数
    const { render } = vm.$options;
    // 使用render函数生成vnode
    const vnode = render.call(vm);

    return vnode;
  };
}
