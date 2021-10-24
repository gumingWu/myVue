/**
 * 正常的watcher写法
 * watch: {
 *  str1(newVal, oldVal) {},
 *
 *  str2: {
 *    handler(newVal, oldVal) {},
 *    deep: true,
 *    immadiate: true
 *  }
 * }
 *
 * this.$watch('str3', (newVal, oldVal) => {}, {deep: true})
 */

/**
 * watcher当作观察者，他需要订阅数据的变动，当数据变动之后，通知他去执行某些方法
 * 本质就是一个构造函数，初始化的时候去执行get方法
 */

import { pushTarget, popTarget } from "./dep";

// 全局变量id，每次new Watcher都会自增
let id = 0;

export default class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm;
    this.exprOrFn = exprOrFn;
    this.cb = cb; // 回调函数，比如在watcher更新之前可以执行beforeUpdate方法，看了下其实就是，如果是对象就是handler，如果是函数就是该函数
    this.options = options; // 额外的选项
    this.id = id++; // watcher的唯一标识
    this.deps = []; // 存放dep的容器
    this.depId = new Set(); // 用来去重Dep

    // 如果是一个函数
    if (typeof exprOrFn === "function") {
      this.getter = exprOrFn;
    }

    // 实例化会默认调用get方法
    this.get();
  }

  get() {
    pushTarget(this); // 在调用方法前先把当前watcher实例推到全局Dep.target上
    this.getter();
    popTarget(); // 在调用方法之后把当前watcher实例从全局Dep.target移除
  }

  // 把dep放在deps里面，同时保证同一个dep只被保存到watcher一次，同一个watcher也只保存在dep一次
  addDep(dep) {
    let id = dep.id;
    if (!this.deps.has(id)) {
      this.depId.add(id);
      this.deps.push(dep);
      // 直接调用dep的addSub方法，把自己————watcher实例添加到dep的Subs容器
      dep.addSub(this);
    }
  }

  update() {
    this.get();
  }
}
