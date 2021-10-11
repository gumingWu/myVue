import { initMixin } from "./init";
import { lifecycleMixin } from "./lifecycle";
import { renderMixin } from "./render";

function Vue(options) {
  this._init(options);
}

// _init方法是挂载在Vue原型的方法 通过引入文件的方式进行原型挂载需要传入Vue
initMixin(Vue);

// 混入_render
renderMixin(Vue);

// 混入_update
lifecycleMixin(Vue);

export default Vue;
