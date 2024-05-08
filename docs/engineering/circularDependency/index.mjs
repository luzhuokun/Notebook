import { a } from "./a.mjs";

// 出现循环引用的情况下
// require 只能访问到模块已经执行并导出的属性，访问不到还没运行并还没导出的属性
// import 被循环引用的模块时，不会再次进入被循环引用的模块，而是会到模块的引用，但此时被循环引用的模块没执行完，直接访问属性会报错，打印：ReferenceError: Cannot access 'a' before initialization
