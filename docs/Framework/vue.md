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
[描述组件渲染和更新过程](https://blog.csdn.net/qq_42072086/article/details/108006061)
[从 Vue 初始化到首次渲染生成 DOM 以及从 Vue 数据修改到页面更新 DOM 的流程](https://blog.csdn.net/Bule_daze/article/details/107905664)

## 组件在beforeMount和Mounted之间
new Watcher -> vm._render(创建虚拟vnode) -> vm._update -> vm.__patch__(比较新旧vnode，diff算法的核心)
在有compile的情况下
$mount -> compileToFunctions -> 生成render -> 挂载到options.render

## vue-cli2.0和3.0的对比分析
- `vue create` 是`vue-cli3.x`的初始化方式，目前模板是固定的，模板选项是可以自由配置的，具体配置参考[官方文档](https://cli.vuejs.org/zh/)
- `vue init` 是`vue-cli2.x`的初始化方式，可以使用github上的一些模板来初始化项目，webpack是官方推荐的标准模板
- 3.0建的项目用mini-css-extract-plugin代替extract-text-webpack-plugin。因为extract-text-webpack-plugin在webpack4.0+版本上运行有问题

## computed
this.lazy表示这个watcher是不是computedWatcher
this.dirty用来是否重新计算computed的值

## vue源码原理分析-观察者模式
[filename](../Utils/Polyfill/vue/observer.js ':include')

## vue源码原理分析-compile
https://www.jianshu.com/p/743166a8968c

## vue源码原理分析-vnode
https://mp.weixin.qq.com/s?__biz=MzUxNjQ1NjMwNw==&mid=2247484284&idx=1&sn=4b576e3c24a3a695221aaec6179fae84&chksm=f9a66960ced1e076d6bcb7d9450922ab9d232bc93f141b7756d0e8f1fd240a664c4f7453c17d&token=681836850&lang=zh_CN&scene=21#wechat_redirect

## vue-ssr

### nuxt
https://zh.nuxtjs.org/guide

### prerender
prerender-spa-plugin利用了puppeteer的爬取页面的功能。Puppeteer 是 Chrome 开发团队在 2017 年发布的一个 Node.js 包，用来模拟 Chrome 浏览器的运行。

### netlify

## vuepress
[中文文档](https://www.vuepress.cn/)

### vuepress的原理分析
markdown文件通过markdown-loader转换成vue，再通过vue-loader得到最终的html  
[深入浅出 vuepress](https://www.jianshu.com/p/c7b2966f9d3c)
