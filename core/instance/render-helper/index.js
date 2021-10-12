import Vnode from "../../vdom";

export function installRenderHelpers(target) {
  target._c = createElement;
  target._v = createTextNode;
  target._s = toStringify;
}

// 创建虚拟dom节点
function createElement(tag, data = {}, ...children) {
  let key = data.key;
  return new Vnode(tag, data, key, children);
}

// 创建虚拟dom文本
function createTextNode(text) {
  return new Vnode(undefined, undefined, undefined, undefined, text);
}

// 如果模板里面是一个对象，需要stringify处理
function toStringify(val) {
  return val === null
    ? ""
    : typeof val === "object"
    ? JSON.stringify(val)
    : val;
}
