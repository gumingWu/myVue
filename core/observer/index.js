import { isPlainObject } from "../utils";
import { arrayMethods } from "./array";
import Dep from "./dep";

class Observer {
  constructor(value) {
    this.value = value;

    // 给每个可响应式数据添加不可枚举的__ob__属性，并指向Observer实例
    // 防止已被响应式处理的数据反复被处理
    Object.defineProperty(value, "__ob__", {
      value: this,
      enumerable: false,
      writable: true,
      configurable: true,
    });

    if (Array.isArray(value)) {
      // 对数组做额外判断，通过重写数组原型方法对数组的七种方法进行拦截
      value.__proto__ = arrayMethods;

      // 如果数组中还有数组，则需要递归判断
      this.observeArray(value);
    }
    this.walk(value);
  }

  walk(data) {
    // 对象上的所有属性依次进行观察
    let keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let value = data[key];
      defineReactive(data, key, value);
    }
  }

  observeArray(items) {
    for (let i = 0; i < items.length; i++) {
      observe(items[i]);
    }
  }
}

// 响应式处理，就是依赖收集和派发更新的核心，在数据被访问时，把我们定义好的渲染watcher放到dep的subs数组里，
// 同时把dep实例对象也放到渲染watcher里，数据更新时就可以通知dep的subs存储的watcher更新
export function defineReactive(data, key, value) {
  // 递归关键，如果value还是对象，会继续走一遍defineReactive层层遍历，直到value不是对象为止
  // 如果data中数据层次太深->性能会受到影响
  // childOb就是Observer实例
  let childOb = observe(value);

  let dep = new Dep(); // 为每个属性实例化一个Dep

  Object.defineProperty(data, key, {
    get() {
      // 页面取值时，可以把watcher收集到dep里面————依赖收集
      if (Dep.target) {
        // 如果有watcher，dep就会保存该watcher，同时watcher也会保存dep
        dep.depend();

        if (childOb) {
          // 这里表示，属性的值依然是一个对象，包含数组和对象，childOb指的是Observer实例，里面的dep进行依赖收集
          // 比如{a: [1,2,3]}，属性a对应的值是一个数组，观察数组的返回值就是对应数组的Observer实例
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }

      console.log("获取数据");
      return value;
    },
    set(newVal) {
      console.log("设置数据");
      if (newVal === value) return;
      value = newVal;
      dep.notify(); // 通知渲染watcher去更新————派发更新
    },
  });
}

export function observe(value) {
  // 如果传过来的是对象或数组，则进行劫持
  if (Array.isArray(value) || isPlainObject(value)) {
    return new Observer(value);
  }
}

function dependArray(value) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i];
    // e.__ob__表示e已经被响应式处理了，但是没有收集依赖
    // 所以把他们收集到自己的Observer实例的dep里面
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      // 如果数组里还有数组，就递归去收集依赖
      dependArray(e);
    }
  }
}
