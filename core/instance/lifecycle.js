import Watcher from "../observer/watch";
import { patch } from "../vdom/patch";

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this;
    // patch是渲染vnode为真实dom的核心
    patch(vm.$el, vnode);
  };
}

// 挂载组件实例入口
export function mountComponent(vm, el) {
  // 上一步是生成render函数，下一步是执行render生成虚拟dom
  // 最后再使用vm._update()把虚拟dom渲染到页面
  vm.$el = el;

  // _update和_render方法和_init方法一样都是定义在Vue原型上的方法
  // 引入watcher概念，这里注册一个渲染watcher，执行vm._update(vm._render())方法渲染视图
  let updateComponent = () => {
    console.log("刷新页面");
    vm._update(vm._render());
  };
  new Watcher(vm, updateComponent, null, true);
}
