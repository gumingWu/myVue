import Vue from "../core/instance";

const options = {
  data() {
    return {
      a: 1,
      b: 2,
    };
  },
};

const el = new Vue(options);
console.log(el);
