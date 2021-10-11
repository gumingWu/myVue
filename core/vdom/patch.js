// patch用来渲染和更新视图
// 根据传入的第一个参数的不同，来分辨是初次渲染还是更新操作
// 初次渲染的思路是根据vdom调用原生js方法生成真实dom，并替换掉el选项的位置
export function patch(oldVnode, vnode) {
  // 判断oldVnode是否一个真实元素
  // 初次渲染传入的vm.$el，就是真实dom
  // 如果不是初次渲染，而是更新视图，vm.$el就被替换成更新之前的老的虚拟dom
  const isRealElement = oldVnode.nodeType;
  if (isRealElement) {
    // 初次渲染逻辑
    const oldElm = oldVnode;
    const parentElm = oldElm.parentNode;

    // 将虚拟dom转换成真实dom
    let el = createElm(vnode);

    // 插入到老节点的下一个节点的前面，相当于插入老节点后面
    // 至于不能直接用appendChild，是为了不破坏替换的位置
    parentElm.insertBefore(el, oldElm.nextSibling);

    // 删除老节点
    parentElm.removeChild(oldVnode);
    return el;
  }
}

// 虚拟dom生成dom节点，就是调用原生方法
function createElm(vnode) {
  let { tag, data, key, children, text } = vnode;
  // 判断vdom是元素节点还是文本节点
  if (typeof tag === "string") {
    vnode.el = document.createElement(tag);
    updateProperties(vnode);

    children.forEach((child) => {
      vnode.el.appendChild(createElm(child));
    });
  } else {
    // 文本节点
    vnode.el = document.createTextNode(text);
  }

  return vnode.el;
}

// 解析虚拟节点属性
function updateProperties(vnode) {
  let newProps = vnode.data || {};
  let el = vnode.el; // 上面创建的真实节点
  for (let key in newProps) {
    if (key === "style") {
      // style需要特殊处理
      for (let styleName in newProps[key]) {
        el.style[styleName] = newProps[key][styleName];
      }
    } else if (key === "class") {
      el.className = newProps[key];
    } else {
      el.setAttribute(key, newProps[key]);
    }
  }
}
