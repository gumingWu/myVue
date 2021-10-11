import { compileToFunctions } from "../core/compiler";

const template = "<div><p>adsadsa</p></div>";

const vnode = compileToFunctions(template);

console.log(vnode);
