// 数组的原型对象
const arrayProto = Array.prototype;

// 进行浅拷贝，不破坏封装的前提下，动态拓展功能
export const arrayMethods = Object.create(arrayProto);

let methodsToPath = [
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "reverse",
  "sort",
];

methodsToPath.forEach((method) => {
  arrayMethods[method] = function (...args) {
    // 保留原始方法的执行结果
    const result = arrayProto[method].apply(this, args);

    // this表示数据本身，比如{ a: [1,2,3] }，那么使用a.push(4)，this就是a，ob就是a.__ob__
    const ob = this.__ob__;

    let inserted;
    switch (method) {
      case "push":
      case "shift":
        inserted = args;
        break;
      case "splice":
        inserted = args.slice(2);
      default:
        break;
    }

    if (inserted) {
      ob.observeArray(inserted);
    }
    // 这里触发视图更新，ob指的是数组对应的Observer实例，我们在get的时候判断如果属性值还是对象
    // 那么就在Observer实例的dep收集依赖，所以这里是一一对应的可以直接更新
    ob.dep.notify();
    return result;
  };
});
