import Vue from "../core/instance";

const options = {
  el: "#app",
  template: '<div id="app"><h1>这是初次渲染</h1><div>hi, {{name}}</div></div>',
  data() {
    return {
      a: 1,
      b: 2,
      name: "wjm",
    };
  },
};

const el = new Vue(options);
// console.log(el);

// setTimeout(() => {
//   el.name = "www";
//   el._update(el._render());
// }, 2000);
