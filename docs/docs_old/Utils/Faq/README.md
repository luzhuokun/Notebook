## 常见问题 <!-- {docsify-ignore} -->

## 数组 flat 的模拟实现

[filename](./code/fackFlat.js ":include")

## 数组内元素逐一执行同一个异步函数

[filename](./code/asyncForeach.js ":include")

## new 的使用问题

```js
var a = function () {
  this.x = 111;
};
a.b = function () {
  this.y = 222;
};
new a(); // {x:111}
new a().b; // undefined
new a.b(); // {y:222}
```

## KMP 算法

[filename](./code/kmp.js ":include")

## 编码、摘要和加密的区别

- 编码 Ascoll Unicode Base64
- 摘要（不可逆加密） 生成哈希值 MD5 SHA
- 加密（对称、非对称）`对称` DES AES `非对称` RSC

### 解密失败时怎么知道不是正确的明文？

- 通过校验和、哈希等手段
- 加密时，不仅对明文进行加密，而是对明文+哈希进行加密

## AMD、CMD、ESM 和 CommonJS

- AMD（RequireJS）运行时异步加载，define(id?, dependencies?, factory)定义、require([dependencies], callback)导入
- CMD（Sea.js）运行时异步加载，define(id, factory)定义、require 导入
- Commonjs 是 nodejs 同步加载模块的方式，会阻塞后续代码运行的，浏览器不支持直接使用 Commonjs 引入模块，因为浏览器缺少四个变量（module、exports、require、global）
- ESM 是 es6 出的模块加载方案，是浏览器原生支持的，支持静态分析，编译时确定依赖关系
- UMD 是通用的模块加载方案，可以同时适配多种不同的模块加载方案

## mvc、mvp 和 mvvm 的区别

- mvc 包括模型、控制器和视图，在控制器里面操作模型和视图，模型和视图的逻辑耦合在一起
- mvvm 包括模型、视图模型和视图，通过视图模型来让模型和视图的逻辑解耦，并且引入双向绑定机制
- mvp 是 mvvm 的前身，也是解耦模型和视图，但没有双向绑定机制

## 箭头函数和 babel 造成的 this 调试问题

https://juejin.cn/post/6844904114074173448

## 记一个 element-ui 中 v-for 与 el-dialog 一起使用的问题

当 el-dialog 设置了 append-to-body 属性时，dialog 会被挂载到最外面的 body 元素上面去，导致其上方的 v-for 元素动态增加元素时会加不上去，因为 vue 框架的核心是在 insert 元素的时候是会找下一个元素进行 insertBefore 操作的。dialog 被挂到 body 上后就找不到他的 parentNode 了，就动态给 v-for 的元素加东西是加不上去了。
