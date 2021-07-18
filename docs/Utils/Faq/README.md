## 面试题

[前端面试真题，会80%直接进大厂](https://bitable.feishu.cn/app8Ok6k9qafpMkgyRbfgxeEnet?from=logout&table=tblEnSV2PNAajtWE&view=vewJHSwJVd)

## 排序
### 快速排序
[filename](./code/quickSort.js ':include')

### 归并排序
[filename](./code/mergeSort.js ':include')

### 堆排序
[filename](./code/heapSort.js ':include')

### 冒泡排序
[filename](./code/bubbleSort.js ':include')

### 选择排序
[filename](./code/selectSort.js ':include')

### 插入排序
[filename](./code/insertSort.js ':include')

## 数组flat的模拟实现
[filename](./code/fackFlat.js ':include')

## 数组内元素逐一执行同一个异步函数
[filename](./test.js ':include')

## 不断减速的递归
[filename](./test1.js ':include')

## new的使用问题
```js
var a = function(){this.x=111};
a.b=function(){this.y=222};
new a; // {x:111}
new a().b; // undefined
new a.b(); // {y:222}
```

## 前端性能优化
- 针对链路（请求响应阶段）
  1. 减少http请求 设置http缓存、本地缓存和长连接
  2. 减少报文大小 开启gzip压缩
  3. 使用cookie或localstorage存储
  4. 使用cdn
  5. DNS缓存
  6. 使用http2.0协议
  7. 预加载
- 代码优化
  1. 使用webpack
  2. 减少dom操作，使用虚拟dom
  3. 防抖和节流
  4. 懒加载
  5. 雪碧图
  6. 骨架图
  7. 使用ssr或预渲染
- 建立性能监控系统
  - 利用window.performance和console.time进行分析统计
  - 要达到RAIL性能指标（响应在100ms内、动画帧在10ms内、尽量大的空闲时间、5s内完成页面Load）
  - 控制首屏白屏的时间，越短越好

!>[前端性能优化方案](https://www.cnblogs.com/coober/p/8078847.html)
!>[渲染性能优化手段](https://blog.csdn.net/fesfsefgs/article/details/105918451)

## 前端安全问题
 - xss（跨域脚本攻击）
 - csrf（跨域请求伪造）
 - 注意iframe的使用（可以让iframe只做显示，限制其发起请求和其他动作）(sandbox)
 - 注意引入的第三方库
 - 注意内容推断问题（img的src有执行script的能力）(设置X-Content-Type-Options:nosniff)
 - 注意本地数据泄露
## 编码、摘要和加密的区别
- 编码 Ascoll Unicode Base64
- 摘要（不可逆加密） 生成哈希值 MD5 SHA
- 加密（对称、非对称）`对称` DES AES `非对称` RSC

## AMD、CMD、ESM和CommonJS
https://www.cnblogs.com/chenwenhao/p/12153332.html
- CommonJS规范主要应用于nodejs，四个重要的环境变量为module、exports、require、global。exports只是module.exports的全局引用，实际使用时，用module.exports定义当前模块对外输出的接口（不推荐直接用exports）
- AMD规范采用异步方式加载模块，用require.config()指定引用路径，用definde()定义模块，用require()加载模块。
- CMD与ADM很类似，不同点在于AMD提前引入模块，CMD可以按需引入模块。
- ESM在ES6语法标准化后实现了模块功能，其模块功能语法主要包括export和import

## Common和ESM的区别
- Common输出的内容是浅拷贝的，ESM则是返回值的只读引用(不管是require或import，多次调用都返回同一个对象)
- Common在运行阶段加载模块，ESM在解析阶段生成接口并对外输出(因此在循环加载的时候，common只输出已经加载的部分代码，而esm会全部都能输出)

## 客户端渲染、服务器渲染（SSR）和预渲染（Prerendering）
- 在前后端分离的背景下，把渲染页面的工作放在前端中进行，如react、vue、angular等主流框架。
- 服务器渲染就是以前不分离的做法，把渲染页面的工作在后端进行，优势主要在于SEO和更快的内容显示，但是服务器渲染会加重服务器的负载，不过可以采用缓存策略降低负载。
- 预渲染则是在打包的时候打成多个HTML文件，如果你只是用来改善少数不经常改动的页面，则使用预渲染比服务器渲染更合适。[服务器端渲染 vs 预渲染](https://ssr.vuejs.org/zh/) [vue框架的预渲染实现问题](https://zhuanlan.zhihu.com/p/99318865)

## mvc和mvvm的区别
- mvc就是在controller中把model的数据赋值给view，view向controller发出动作指令，controller选择model驱动视图更新
- mvvm就是viewModel实现了数据的双向绑定，view和model不直接通信

## react和vue的比较
- JSX写法 template模版写法
- shouldComponentUpdate手动渲染
- react无指令和插槽
- 社区支持 官方支持

## 箭头函数和babel造成的this调试问题
https://juejin.cn/post/6844904114074173448

## 记一个element-ui中v-for与el-dialog一起使用的问题
当el-dialog设置了append-to-body属性时，dialog会被挂载到最外面的body元素上面去，导致其上方的v-for元素动态增加元素时会加不上去，因为vue框架的核心是在insert元素的时候是会找下一个元素进行insertBefore操作的。dialog被挂到body上后就找不到他的parentNode了，就动态给v-for的元素加东西是加不上去了。

## 防抖和节流
- 防抖在第一次触发事件时，不立即执行函数，延时一段时间再执行
- 节流则是让函数执行一次，然后在某个时间段内失效

## 微服务

- 路由系统 结合 MPA+SPA的优点 就是微服务
- 把重项目分离至多个小应用，通过 路由系统 连接各个独立的应用
