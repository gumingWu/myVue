import { isPlainObject } from "../utils"
import { arrayMethods } from "./array"

class Observer {
  constructor(value) {
    this.value = value

    // 给每个可响应式数据添加不可枚举的__ob__属性，并指向Observer实例
    // 防止已被响应式处理的数据反复被处理
    Object.defineProperty(value, '__ob__', {
      value: this,
      enumerable: false,
      writable: true,
      configurable: true
    })

    if(Array.isArray(value)) {
      // 对数组做额外判断，通过重写数组原型方法对数组的七种方法进行拦截
      value.__proto__ = arrayMethods
      
      // 如果数组中还有数组，则需要递归判断
      this.observeArray(value)
    }
    this.walk(value)
  }

  walk(data) {
    // 对象上的所有属性依次进行观察
    let keys = Object.keys(data)
    for(let i=0; i<keys.length; i++) {
      let key = keys[i]
      let value = data[key]
      defineReactive(data, key, value)
    }
  }

  observeArray(items) {
    for(let i=0; i<items.length; i++) {
      observe(items[i])
    }
  }
}

export function defineReactive(data, key, value) {
  // 递归关键，如果value还是对象，会继续走一遍defineReactive层层遍历，直到value不是对象为止
  // 如果data中数据层次太深->性能会受到影响
  observe(value)

  Object.defineProperty(data, key, {
    get() {
      console.log('获取数据');
      return value
    },
    set(newVal) {
      console.log('设置数据');
      if(newVal === value) return
      value = newVal
    }
  })
}

export function observe(value) {
  // 如果传过来的是对象或数组，则进行劫持
  if(Array.isArray(value) || isPlainObject(value)) {
    return new Observer(value)
  }
}