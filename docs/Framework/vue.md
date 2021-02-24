!>
[vue官方文档](https://react.docschina.org)  
[vue-cli官方文档](https://cli.vuejs.org)  
[10分钟快速精通rollup.js打包](https://www.imooc.com/article/264074)  

## vue响应式原理
vue通过数据劫持和发布订阅者模式，利用Object.defineProperty劫持data上各个属性上的setter和getter，当数据发生变化时，通知数据依赖的watcher订阅者，触发相应的监听回调

## vue的生命周期

### 每个生命周期的特点
``beforeCreate`` 数据观测和初始化事件都未开始，data、watcher和methods都还不存在
``created`` 实例创建之后被调用，该阶段可以访问到data，数据观测相关的东西都存在了，但dom还没有被挂载
``beforeMount`` dom挂载之前，相关的render函数在这之后首次被执行
``mounted`` 在挂载完dom之后被调用
``beforeDestroy`` 实例销毁前调用，实例仍然可用
``destroyed`` 实例销毁后调用，指令、监听事件、所有子实例都被销毁
``beforeUpdate`` dom更新之前
``updated`` dom更新之后
``activated`` 被keep-alive缓存的组件激活时调用
``deactivated`` 被keep-alive缓存的组件停用时调用

### 为什么会有生命周期
让我们可以控制vue实例不同阶段的过程

## 组件渲染和更新过程

- new Vue -> _init -> initState -> initData -> new Observer -> new Dep、Object.defineProperty
                                -> initComputed
                                -> initWatch
                                -> initProps
                                -> initMethods
                                ...

- -> $mount -> new Watcher(生成渲染视图watcher)
- 初始化watcher的时候，给Dep.target打上标识，然后调用get方法法进行页面渲染的同时，把watcher和数据data通过Dep建立起依赖

[从 Vue 初始化到首次渲染生成 DOM 以及从 Vue 数据修改到页面更新 DOM 的流程](https://blog.csdn.net/Bule_daze/article/details/107905664)

## 组件在beforeMount和Mounted之间
$mount -> mountComponent -> new Watcher -> updateComponent -> vm._render(创建虚拟vnode) -> vm._update -> vm.__patch__(比较新旧vnode，diff算法的核心) -> 渲染真实dom

## 用到Watcher的地方
- 组件component实例、computed、watch

## computed
this.lazy表示这个watcher是不是computedWatcher
this.dirty用来是否重新计算computed的值

## slot插槽
- 在render生成Vnode的过程
- 子组件调用initInternalComponent把父组件拥有的相关配置赋值给子组件的配置上面去
（todo）

## vue源码原理分析-观察者模式
[filename](../Utils/Polyfill/vue/observer.js ':include')

## vue源码原理分析-compile
https://www.jianshu.com/p/743166a8968c

## vue源码原理分析-vnode
https://mp.weixin.qq.com/s?__biz=MzUxNjQ1NjMwNw==&mid=2247484284&idx=1&sn=4b576e3c24a3a695221aaec6179fae84&chksm=f9a66960ced1e076d6bcb7d9450922ab9d232bc93f141b7756d0e8f1fd240a664c4f7453c17d&token=681836850&lang=zh_CN&scene=21#wechat_redirect

## nextTick
- nextTick利用异步把数据变化操作放到microtask微任务队列中去执行，同时让同一个watcher多次触发变成只触发一次，减少不必要的dom操作，如果执行环境不支持microtask微任务的方法，则退化采用setTimeout(fn,0)那些macrotask宏任务方法
- wm.nextTick简单来说就是在DOM更新完成后执行异步回调

## vue的diff算法核心
- 递归地比较同层级的vnode，不会跨层级比较
- 新的vnode和旧的vnode比较，如有变化通过patch方法直接给真实dom补丁
`todo`

## vue-ssr
本指南专注于，使用 Node.js server 的服务器端单页面应用程序渲染  
[vue ssr 指南](https://ssr.vuejs.org/zh/)

## hydrate
在vue的源码中看到的，估计是用在SSR服务端渲染时候，经过hydrate将一些事件绑定和vue状态等注入到输出的静态页面上面去
[Vue.js服务端渲染(SSR)不完全指北](https://zhuanlan.zhihu.com/p/84835469)

## vue-cli2.0和3.0的对比分析
- `vue create` 是`vue-cli3.x`的初始化方式，目前模板是固定的，模板选项是可以自由配置的，具体配置参考[官方文档](https://cli.vuejs.org/zh/)
- `vue init` 是`vue-cli2.x`的初始化方式，可以使用github上的一些模板来初始化项目，webpack是官方推荐的标准模板
- 3.0建的项目用mini-css-extract-plugin代替extract-text-webpack-plugin。因为extract-text-webpack-plugin在webpack4.0+版本上运行有问题

## nuxt
一个基于 Vue.js 的服务端渲染应用框架,开箱即用  
[nuxt.js 指南](https://zh.nuxtjs.org/guide)

## prerender
如果你只是用来改善少数营销页面的SEO，那么你可能需要预渲染。在构建时 (build time) 简单地生成针对特定路由的静态 HTML 文件。  
- prerender-spa-plugin利用了puppeteer的爬取页面的功能。
- Puppeteer 是 Chrome 开发团队在 2017 年发布的一个 Node.js 包，用来模拟 Chrome 浏览器的运行。

## netlify
一个可以帮助我们自动发布github的平台  
[使用netlify发布自己的静态网站项目](https://www.jianshu.com/p/1d47bea6e728)

## vuepress
Vue 驱动的静态网站生成器  
[中文文档](https://www.vuepress.cn/)

### vuepress的原理分析
markdown文件通过markdown-loader转换成vue，再通过vue-loader得到最终的html  
[深入浅出 vuepress](https://www.jianshu.com/p/c7b2966f9d3c)

## Rollup
Rollup 是一个 JavaScript 模块打包器，对代码模块使用新的标准化格式。
[官方文档](https://www.rollupjs.com/)

### rollup和webpack使用场景分析
- rollup多用于js库构造，而webpack更多用于前端工程
- 如果只是想对js代码转换，可以使用rollup
- 如果代码中涉及css、html和复杂的代码拆分合并工作，则用webpack
[rollup和webpack使用场景分析](https://www.jianshu.com/p/60070a6d7631)

## Vite
Vite是一个由原生ESM驱动的Web开发构建工具。在开发环境下基于浏览器原生ES import开发，在生产环境下基于Rollup打包。  
特点：
- 快速的冷启动
- 即时的模块热更新
- 真正的按需编译

个人认为Vite是vue-cli的一个替代手脚架，vue-cli走的是webpack那一套，vite走的是rollup ESM那一套，更利用原生的能力  
?>[有了 vite，还需要 webpack 么？](https://zhuanlan.zhihu.com/p/150083887?from_voters_page=true)


### vue-composition-api
- `ref`把基本类型的数据转换成响应式对象，并转换生成的对象只有value属性。
- `reactive`把对象转换成响应式对象。
- `toRefs`将reactive创建的响应式对象，转化成为普通的对象，并把对象内的属性都变成响应式数据。

[Vue 组合式 API](https://composition-api.vuejs.org/zh/)

## vue3.0与vue2.0对比
- `options-api`代码风格声明的数据和逻辑处理的代码都是散落在不同地方的，当组件越来越复杂的时候，代码耦合在一起不容维护和复用。`composition-api`代码风格是根据逻辑相关性组织代码，代码可以更好的复用和解耦。 [vue2中Options API 和 vue3中Composition API 的对比](https://blog.csdn.net/fesfsefgs/article/details/106572929)
- `provide`和`inject`方案代替`vuex`

?>
[vue3.0新特性](https://blog.csdn.net/weixin_44420276/article/details/101621169)
[组合式 API 征求意见稿](https://composition-api.vuejs.org/zh/)
[Vue 3 开发文档](https://lgdsunday.blog.csdn.net/article/details/107643745?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.compare&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.compare)

## 骨架图
https://blog.csdn.net/RowanIT3/article/details/103182774/

## Vue2无法监听对象、数组某些情况的变动
- `Object.defineProperty`可以对数组的属性进行监听的，但是有个致命的缺陷就是不能监听数组的添加和删除，vue出于`性能`的成本和回报的考虑，所有没有做对数组的每项属性监听了。
- `Object.defineProperty`无法对`对象属性`的添加和删除监听，需要手动对添加和删除进行监听
- 由于受javascript限制，Vue 不能检测到以下`数组`的变动：
  - 利用索引直接设置数组项，如：arr[0]=1
  - 直接修改数组的长度,如：arr.length=3
- vue2对`数组`变动的监听就是通过`重写`数组对象的一些方法

## Vue Dep.target为什么需要targetStack来管理？
https://segmentfault.com/q/1010000010095427

## 大文件分片上传、秒传及断点续传
https://www.cnblogs.com/xiahj/p/vue-simple-uploader.html
