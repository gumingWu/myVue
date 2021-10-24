// dep和watcher是多对多的关系
// 每个属性都有自己的dep
let id = 0; // dep实例的唯一标识

// Dep也是一个构造函数，可以理解为观察者模式里的被观察者，
// 在subs里收集watcher，当数据变动时通知自身subs，所有的watcher更新
export default class Dep {
  constructor() {
    this.id = id++;
    this.subs = []; // 这是存放watcher的容器
  }

  depend() {
    // 如果当前存在watcher
    if (Dep.target) {
      Dep.target.addDep(this); // 把自身————dep实例存放到watcher里面
    }
  }

  notify() {
    // 依次执行subs里的watcher更新方法
    this.subs.forEach((watcher) => watcher.update());
  }

  addSub(watcher) {
    // 把watcher加入到自身的subs容器
    this.subs.push(watcher);
  }
}

// 是一个全局Watcher指向，初始状态是null
Dep.target = null;

// 栈结构存放Watcher
const targetStack = [];

export function pushTarget(watcher) {
  targetStack.push(watcher);
  Dep.target = watcher; // Dep.target指向watcher
}

export function popTarget() {
  targetStack.pop();
  Dep.target = targetStack[targetStack.length - 1]; // 出栈后拿上一个watcher
}
