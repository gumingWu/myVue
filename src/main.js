import Vue from "../core/instance";

const options = {
  el: "#app",
  template: '<div id="app">这是初次渲染测试</div>',
  data() {
    return {
      a: 1,
      b: 2,
    };
  },
};

const el = new Vue(options);
// console.log(el);
