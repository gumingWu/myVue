import { observe } from "../core/observer";

let obj = {
  a: 1,
  b: 2,
};

let o = observe(obj);
obj.a;
obj.b = 22;
