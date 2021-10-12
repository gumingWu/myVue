import { observe } from "../observer";

// 注意顺序，比如会问到是否能在data中直接使用prop的值
// props->methods->data->computed->watch
export function initState(vm) {
  const opts = vm.$options;
  if (opts.props) {
    initProps(vm);
  }
  if (opts.methods) {
    initMethods(vm);
  }
  if (opts.data) {
    initData(vm);
  }
  if (opts.computed) {
    initComputed(vm);
  }
  if (opts.watch) {
    initWatch(vm);
  }
}

function initProps(vm) {}

function initMethods(vm) {}

function initData(vm) {
  let data = vm.$options.data;
  data = vm._data = typeof data === "function" ? data.call(vm) : data || {};

  // 把data代理到vm实例中，我们可以使用this.a来访问this._data.a
  const keys = Object.keys(data);
  let i = keys.length;
  while (i--) {
    const key = keys[i];
    proxy(vm, "_data", key);
  }

  // 对数据进行观察
  observe(data);
}

function initComputed(vm) {}

function initWatch(vm) {}

function proxy(object, sourceKey, key) {
  Object.defineProperty(object, key, {
    get() {
      return object[sourceKey][key];
    },
    set(newVal) {
      object[sourceKey][key] = newVal;
    },
  });
}
