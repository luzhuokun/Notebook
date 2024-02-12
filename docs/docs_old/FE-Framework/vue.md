!>
[vue 官方文档](https://react.docschina.org)  
[vue-cli 官方文档](https://cli.vuejs.org)  
[10 分钟快速精通 rollup.js 打包](https://www.imooc.com/article/264074)

## vue 的生命周期

### 为什么会有生命周期

让我们可以控制 vue 实例不同阶段的过程

## 组件渲染和更新过程

- new Vue -> \_init -> initState -> initData -> new Observer -> new Dep、Object.defineProperty
  -> initComputed
  -> initWatch
  -> initProps
  -> initMethods
  ...

- -> $mount -> new Watcher(生成渲染视图 watcher)
- 初始化 watcher 的时候，给 Dep.target 打上标识，然后调用 get 方法法进行页面渲染的同时，把 watcher 和数据 data 通过 Dep 建立起依赖

[从 Vue 初始化到首次渲染生成 DOM 以及从 Vue 数据修改到页面更新 DOM 的流程](https://blog.csdn.net/Bule_daze/article/details/107905664)

## vue 源码目录结构

https://img1.sycdn.imooc.com/5af654f700019a7711171333.png

## vnode 类型

- 注释节点 emptyNode
  一般注释节点只有两个属性`text`和`isComment`
- 文本节点 textNode
  文本节点只`text`属性
- 元素节点
  一般有`tag`、`data`、`context`、`children`
- 组件节点
  独有属性：`componentInstance`（组件实例）、`componentOptions`（组件节点的选项参数，包括 propsData、tag 和 children）
- 函数式节点
  独有属性：`functionalContext`、`functionalOptions`
- 克隆节点
  `isCloned`为 true

注意：

- `$parent` 存的是组件外壳节点，链路上不包含抽象组件
- `$vnode` 只有组件实例才有，$vnode 存放的也是外壳节点，链路上包含全部的组件
- `_vnode` 当前节点，包含全部 vnode，后续用于 patch 阶段比较新旧

[VNode - 源码版](https://mp.weixin.qq.com/s?__biz=MzUxNjQ1NjMwNw==&mid=2247484284&idx=1&sn=4b576e3c24a3a695221aaec6179fae84&chksm=f9a66960ced1e076d6bcb7d9450922ab9d232bc93f141b7756d0e8f1fd240a664c4f7453c17d&scene=21#wechat_redirect)

## createComponent

创建`组件外壳节点`,保存组件构造函数，保存父组件给子组件的关联数据
https://zhuanlan.zhihu.com/p/68518662

## 组件在 beforeMount 和 Mounted 之间

`$mount -> mountComponent -> new Watcher -> updateComponent -> vm.\_render(创建虚拟 vnode) -> vm.\_update -> vm.**patch**(比较新旧 vnode，diff 算法的核心) -> 渲染真实 dom`

## observer

- 避免重复绑定
- 挂载到对象或者数组的**ob**上，用于观察某些方法触发

## 用到 Watcher 的地方

- 组件 component 实例、computed、watch
- newDeps、newDepIds 是用于记录当前本轮数据 getter 的 dep 收集
- deps、depsIds 是记录上一轮数据 getter 的 dep 收集
- deps、depsIds、newDeps、newDepsId 用于给数据中 dep 排重，防止重复订阅
- 如果在 newDeps 和 deps 都没有给当前数据的 dep 订阅过当前这个 watcher，那就给当前的 dep 订阅上去当前这个 watcher
- queueWatcher 接收组件渲染 watcher 和组件上的 watch 属性上的 watcher，不接收 computed watcher，computed watcher 遇到 dep.notify 的时候立马把 this.dirty 变成 true

## computed

- this.lazy 为 true 表示这个 watcher 是不是 computedWatcher，不会立即调用 this.get 去设 this.value，而是等第一次使用这个值再去 watcher.evaluate 求 this.value，并把 this.dirty 设为 false
- this.dirty 用来是否重新计算 computed 的值，当 computedwatcher 调用 update（对应数据变更，触发 dep.notify）的时候会把 dirty 设为 true
- computed 收集到的 deps 会在 evaluate 后，执行 watch.depend，把 computed 订阅的 dep 再给 watcher 订阅一遍
- computed 上 watcher 更新主要是把 this.dirty 设为 true，然后当组件 watcher 重新渲染的时候再重新计算求值

[怎么个依赖法](https://zhuanlan.zhihu.com/p/67443167)

## insertedVnodeQueue

- 在 patch 的时候收集所有需要 insert 到页面的组件 Vnode，在 insert 中触发 mounted hook
- https://blog.csdn.net/qq_42072086/article/details/108385632

## vue 源码原理分析-观察者模式

[filename](../Utils/Polyfill/vue/observer.js ":include")

## vue 源码原理分析-compile 编译

- parse 生成 AST
- optimize 优化静态节点
- generate 生成 render 函数字符串
  https://www.jianw.com/p/743166a8968c

## vue 源码原理分析-vnode

https://mp.weixin.qq.com/s?__biz=MzUxNjQ1NjMwNw==&mid=2247484284&idx=1&sn=4b576e3c24a3a695221aaec6179fae84&chksm=f9a66960ced1e076d6bcb7d9450922ab9d232bc93f141b7756d0e8f1fd240a664c4f7453c17d&token=681836850&lang=zh_CN&scene=21#wechat_redirect

## 异步更新

- 当组件上的数据发生变化时，触发 dep 的 notify 通知组件 watcher 更新，但组件不会立即重渲染，而是把 watcher 放入 queue 队列中去，在同一个事件循环中发生所有的数据变更。
- 通过 has 对象来对 watcher 去重
- 为了避免频繁地更新组件，频繁地操作 dom

### queueWatcher

- 在 flush 执行的期间，如果有新的 watcher 进来则放到 queue 队列中更新，如果是已经更新过的 watcher，那就放到队列最后再进行更新

### flushSchedulerQueue

- 对 queueWatcher 根据 id 排队，先更新父再更新子，因为如果父被销毁，后面关联的子就可以不更新了

## vue-ssr

本指南专注于，使用 Node.js server 的服务器端单页面应用程序渲染  
[vue ssr 指南](https://ssr.vuejs.org/zh/)

## hydrate

在 vue 的源码中看到的，估计是用在 SSR 服务端渲染时候，经过 hydrate 将一些事件绑定和 vue 状态等注入到输出的静态页面上面去
[Vue.js 服务端渲染(SSR)不完全指北](https://zhuanlan.zhihu.com/p/84835469)

## vue-cli2.0 和 3.0 的对比分析

- `vue create` 是`vue-cli3.x`的初始化方式，目前模板是固定的，模板选项是可以自由配置的，具体配置参考[官方文档](https://cli.vuejs.org/zh/)
- `vue init` 是`vue-cli2.x`的初始化方式，可以使用 github 上的一些模板来初始化项目，webpack 是官方推荐的标准模板
- 3.0 建的项目用 mini-css-extract-plugin 代替 extract-text-webpack-plugin。因为 extract-text-webpack-plugin 在 webpack4.0+版本上运行有问题

## netlify

一个可以帮助我们自动发布 github 的平台  
[使用 netlify 发布自己的静态网站项目](https://www.jianshu.com/p/1d47bea6e728)

## vuepress

Vue 驱动的静态网站生成器  
[中文文档](https://www.vuepress.cn/)

### vuepress 的原理分析

markdown 文件通过 markdown-loader 转换成 vue，再通过 vue-loader 得到最终的 html  
[深入浅出 vuepress](https://www.jianshu.com/p/c7b2966f9d3c)

## Vite

Vite 是一个基于 ESModule 打包的构建工具，通过原生支持的 ESModule 语法进行模块的导入和导出，在`开发阶段`省去了打包编译的时间，并且使用 esbuild 做预处理优化（把一些不是 ESM 格式的模块`转成 ESM 格式`；把多个 ESM 模块组合成一个，`减少 http 请求`的发起），在`生产阶段`使用 rollup 进行编译打包，性能方面跟调优后的 webpack 相差无几无几

### 特点

- 快速的冷启动
- 即时的模块热更新
- 真正的按需编译

### Vite 原理

- 利用浏览器原生支持 esmodule，遇到 import 语法就发起一个 http 请求去加载文件
- vite 启动一个 koa 服务器拦截这些请求，在后端对相关请求的文件做一定的处理（分解与整合，比如将 Vue 文件拆分成 template、style、script 三个部分），并以 esmodule 的格式返回给浏览器

### Vite 与 webpack 比较

- Vite 相比 webpack 在开发阶段省去了编译打包的时间，充分利用浏览器原生的 esm 特性（webpack 需要整合多个资源到一个 bundle 才能供给使用）
- Vite 打包使用 esbuild，esbuild 是由 go 语言开发的，充分利用高并发和编译语言的能力

### vue-composition-api

- `ref`把基本类型的数据转换成响应式对象，并转换生成的对象只有 value 属性。
- `reactive`把对象转换成响应式对象。
- `toRefs`将 reactive 创建的响应式对象，转化成为普通的对象，并把对象内的属性都变成响应式数据。

[Vue 组合式 API](https://composition-api.vuejs.org/zh/)

## Vue2 无法监听对象、数组某些情况的变动

- `Object.defineProperty`可以对数组的属性进行监听的，但是有个致命的缺陷就是不能监听数组的添加和删除，vue 出于`性能`的成本和回报的考虑，所有没有做对数组的每项属性监听了。
- `Object.defineProperty`无法对`对象属性`的添加和删除监听，需要手动对添加和删除进行监听
- 由于受 javascript 限制，Vue 不能检测到以下`数组`的变动：
  - 利用索引直接设置数组项，如：arr[0]=1
  - 直接修改数组的长度,如：arr.length=3
- vue2 对`数组`变动的监听就是通过`重写`数组对象的一些方法

### vue2.0 没有对 Map 和 Set 做响应式

### Vue Dep.target 为什么需要 targetStack 来管理？

https://segmentfault.com/q/1010000010095427

## Vue 循环引用组件问题

- 因为在 webpack 打包的时候组件 A 和 B 之间相互引用，形成了循环，所以不知道谁才是起点。
- 可以利用异步组件解决
  [循环引用](https://cn.vuejs.org/v2/guide/components-edge-cases.html#%E7%BB%84%E4%BB%B6%E4%B9%8B%E9%97%B4%E7%9A%84%E5%BE%AA%E7%8E%AF%E5%BC%95%E7%94%A8)

## Vue 不断循环 updated 更新组件问题

举例当一个数据 x 在 template 中使用时，会被当前的组件 watcher 订阅，当数据发生变化时通知 watcher 执行 render 重渲染，然后执行 updated 钩子，如果 updated 钩子中又去改变这个 x 值，那么又会把当前的 watcher 放入更新队列中，因此不断循环至到循环上限报错。

## 大文件分片上传、秒传及断点续传

- 使用 xhr 发送 multipart/formData 数据
- 文件分片
  - e.target.flies[0].slice 进行切割
- 断点续传
  - xmlhttprequest 的 abort 暂停切片上传
  - 根据后端返回的切片名，前端跳过已经上传成功的切片
- 秒传
  - 根据文件 hash 判断上传过的文件直接提示上传成功
- 使用 spark-md5
  - 读取所有的文件切片，然后递归执行 spark-md5 的方法，最后求出文件的 hash 值（使用 webworker 去算不阻塞主线程）
  - 不能直接对整个文件做 hash，内存占用高、阻塞主线程、而且会出现不同文件出现相同的 hash 值
- 遇到的问题
  - 在做断点续传的时候会出现文件进度条`倒退`现象，这个现象出现是因为我中断上传的时候把正在发起上传的分片都清掉了，然后再次发起上传的时候要从 0 开始，因为上传切片是并发的，在中断之后应该由后端来告诉我哪些传完哪些没传完，进度要重新算一遍，所以中断时候的进度条状态要保存下来，之后续传的时候再判断大于这个进度条状态再去更新进度条视图
  - 计算大文件的 md5 时非常`耗时`，那把 md5 的计算放到 web-worker 子进程中去计算，计算好了通过 postmessage 回传回来，然后就再继续文件上传
  - Buffer 需要一次性读取到内存上（如果数据过大读写会很慢，甚至出现内存泄漏），所以用 steam 流一段一段地读写代替 Buffer，省内存效果高。（一读一写一删） `fs.creatWriteStream`可以使用第二个参数 start 控制把流传到正确的位置，以此来实现并发写入(暂时来看不可行)

## vue-router

### hash 模式

- 改变 url 上的#后面的 hash 值，页面不会刷新，不会向服务器发起请求
- 通过监听 window.onhashchange 事件，达到跳转页面的效果

### history 模式

- 调用 html5 的 history api 方法（forward、back、go、pushState、replaceState）
- 监听 window.onpopstate 事件

### vue-router 的一些问题

- 3.0.2 版本没有 addRoute 属性，并且不支持路由覆盖，如果只是动态改变路由的话，使用 addRoutes 就行。如果要动态改变路由上的信息的话，有两条路子可以：1、把需要动态的路由通过 addRoutes 添加。2、重新 new 一个 router 路由替换旧的 router 上的 matcher 属性。

## vue 局部引入 css 的问题

- 需要通过<style scoped src="../test.css">方式来局部进入（看情况使用，不然会造成代码冗余）
- import '../test.css' 和 <style scoped > @import '../test.css'; </style> 都会进行全局引入
