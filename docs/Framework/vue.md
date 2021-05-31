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

## vue源码目录结构
https://img1.sycdn.imooc.com/5af654f700019a7711171333.png

## vnode类型
- 注释节点 emptyNode
  一般注释节点只有两个属性`text`和`isComment`
- 文本节点 textNode
  文本节点只`text`属性
- 元素节点
  一般有`tag`、`data`、`context`、`children`
- 组件节点
  独有属性：`componentInstance`（组件实例）、`componentOptions`（组件节点的选项参数，包括propsData、tag和children）
- 函数式节点
  独有属性：`functionalContext`、`functionalOptions`
- 克隆节点
  `isCloned`为true

注意：
- `$parent` 存的是组件外壳节点，链路上不包含抽象组件
- `$vnode` 只有组件实例才有，$vnode存放的也是外壳节点，链路上包含全部的组件
- `_vnode` 当前节点，包含全部vnode，后续用于patch阶段比较新旧

[VNode - 源码版](https://mp.weixin.qq.com/s?__biz=MzUxNjQ1NjMwNw==&mid=2247484284&idx=1&sn=4b576e3c24a3a695221aaec6179fae84&chksm=f9a66960ced1e076d6bcb7d9450922ab9d232bc93f141b7756d0e8f1fd240a664c4f7453c17d&scene=21#wechat_redirect)

## createComponent
  创建`组件外壳节点`,保存组件构造函数，保存父组件给子组件的关联数据
  https://zhuanlan.zhihu.com/p/68518662

## 组件在beforeMount和Mounted之间
$mount -> mountComponent -> new Watcher -> updateComponent -> vm._render(创建虚拟vnode) -> vm._update -> vm.__patch__(比较新旧vnode，diff算法的核心) -> 渲染真实dom


## observer
- 避免重复绑定
- 挂载到对象或者数组的__ob__上，用于观察某些方法触发
(todo)

## 用到Watcher的地方
- 组件component实例、computed、watch
- newDeps、newDepIds是用于记录当前本轮数据getter的dep收集
- deps、depsIds是记录上一轮数据getter的dep收集
- deps、depsIds、newDeps、newDepsId用于给数据中dep排重，防止重复订阅
- 如果在newDeps和deps都没有给当前数据的dep订阅过当前这个watcher，那就给当前的dep订阅上去当前这个watcher
- queueWatcher接收组件渲染watcher和组件上的watch属性上的watcher，不接收computed watcher，computed watcher遇到dep.notify的时候立马把this.dirty变成true

## computed
- this.lazy为true表示这个watcher是不是computedWatcher，不会立即调用this.get去设this.value，而是等第一次使用这个值再去watcher.evaluate求this.value，并把this.dirty设为false
- this.dirty用来是否重新计算computed的值，当computedwatcher调用update（对应数据变更，触发dep.notify）的时候会把dirty设为true
- computed收集到的deps会在evaluate后，执行watch.depend，把computed订阅的dep再给watcher订阅一遍
- computed上watcher更新主要是把this.dirty设为true，然后当组件watcher重新渲染的时候再重新计算求值

[怎么个依赖法](https://zhuanlan.zhihu.com/p/67443167)

## slot插槽
- 在创建vnode的时候，$slot存着父组件分发过来的插槽vnode集合，$scopedSlots存着创建对应vnode的函数
- 子组件调用initInternalComponent把父组件拥有的相关配置赋值给子组件的配置上面去
（todo）

## vue-loader
 - 分离组件中的template、style、script
 - 生成render函数，用于后续生成Vnode
 - 生成vuecomponent构造函数等

## keep-alive
- keep-alive是一个`抽象组件`，`不会渲染`真实的dom，不会出现在`父组件链`上，缓存不活动的组件实例，而不是销毁他们。
- 当缓存的组件超出上限时，运用`LRU缓存策略`去掉最久未使用的组件实例

## insertedVnodeQueue
  - 在patch的时候收集所有需要insert到页面的组件Vnode，在insert中触发mounted hook
  - https://blog.csdn.net/qq_42072086/article/details/108385632

## vue源码原理分析-观察者模式
[filename](../Utils/Polyfill/vue/observer.js ':include')

## vue源码原理分析-compile编译
- parse生成AST
- optimize优化静态节点
- generate生成render函数字符串
https://www.jianshu.com/p/743166a8968c

## vue源码原理分析-vnode
https://mp.weixin.qq.com/s?__biz=MzUxNjQ1NjMwNw==&mid=2247484284&idx=1&sn=4b576e3c24a3a695221aaec6179fae84&chksm=f9a66960ced1e076d6bcb7d9450922ab9d232bc93f141b7756d0e8f1fd240a664c4f7453c17d&token=681836850&lang=zh_CN&scene=21#wechat_redirect

## 异步更新
  - 当组件上的数据发生变化时，触发dep的notify通知组件watcher更新，但组件不会立即重渲染，而是把watcher放入queue队列中去，在同一个事件循环中发生所有的数据变更。
  - 通过has对象来对watcher去重
  - 为了避免频繁地更新组件，频繁地操作dom

### queueWatcher
  - 在flush执行的期间，如果有新的watcher进来则放到queue队列中更新，如果是已经更新过的watcher，那就放到队列最后再进行更新
### flushSchedulerQueue
  - 对queueWatcher根据id排队，先更新父再更新子，因为如果父被销毁，后面关联的子就可以不更新了
## nextTick
- 在下次dom更新循环结束之后触发延时回调，dom的更新是异步的，当有数据发生变化时把数据变化的watcher存进一个队列中。同一个watcher只存一次（避免dom的重复计算渲染），在下一个事件循环tick中，尝试使用promise.then执行异步队列，如果环境不支持则使用MutationObserver、setImmediate、setTimeout代替

## v-model
  - 不能直接对父组件传来过的值进行双向绑定，可以watch+v-model来进行父子孙三个数据绑定

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
- 如果只是想对js代码转换，可以使用rollup(不支持热模块替换，但treeshaking比webpack做得好)
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
- `diff算法`在比对children多个子节点上，都会进行新旧节点的前头和后头是否相等的比对，采用最长递增子序列算法来减少dom的移动，提高性能。
- `静态标记`patchflag让重渲染的时候跳过这些静态节点

https://blog.csdn.net/weixin_37352936/article/details/108873370?utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-2.control&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-2.control

?>
[vue3.0新特性](https://blog.csdn.net/weixin_44420276/article/details/101621169)
[组合式 API 征求意见稿](https://composition-api.vuejs.org/zh/)
[Vue 3 开发文档](https://lgdsunday.blog.csdn.net/article/details/107643745?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.compare&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.compare)
[Vue 3 Virtual Dom Diff源码阅读](https://segmentfault.com/a/1190000038654183)

## vue3.0为什么不使用时间分片
- 时间分片为了解决cpu任务繁重问题(超过100ms)，把任务切割至多个小任务，等浏览器空闲的时候去干
- 如果是cpu任务不繁重，但是在一次事件循环周期后要操作大量的dom更新，那使用时间分片也没用
- vue框架做了`响应式跟踪`，而且`模版`开发模式比react的jsx渲染函数更容易`静态分析`更容易`优化`（防止不必要的子组件重渲染），因此一般情况vue只需要`重渲染一个组件`，子组件不需要重新渲染，而对于react来说可能会重`渲染多个组件`
- vue相比react对`cpu的消耗`会更少，react使用了大量的`fiber架构`，增加了额外的复杂度加重cpu运算

[为什么Vue3不使用时间切片](https://juejin.cn/post/6844904134945030151)

## vue骨架屏
https://blog.csdn.net/RowanIT3/article/details/103182774/

## Vue2无法监听对象、数组某些情况的变动
- `Object.defineProperty`可以对数组的属性进行监听的，但是有个致命的缺陷就是不能监听数组的添加和删除，vue出于`性能`的成本和回报的考虑，所有没有做对数组的每项属性监听了。
- `Object.defineProperty`无法对`对象属性`的添加和删除监听，需要手动对添加和删除进行监听
- 由于受javascript限制，Vue 不能检测到以下`数组`的变动：
  - 利用索引直接设置数组项，如：arr[0]=1
  - 直接修改数组的长度,如：arr.length=3
- vue2对`数组`变动的监听就是通过`重写`数组对象的一些方法

## vue2.0没有对Map和Set做响应式

## Vue Dep.target为什么需要targetStack来管理？
https://segmentfault.com/q/1010000010095427

## Vue循环引用组件问题
  - 因为在webpack打包的时候组件A和B之间相互引用，形成了循环，所以不知道谁才是起点。
  - 可以利用异步组件解决
[循环引用](https://cn.vuejs.org/v2/guide/components-edge-cases.html#%E7%BB%84%E4%BB%B6%E4%B9%8B%E9%97%B4%E7%9A%84%E5%BE%AA%E7%8E%AF%E5%BC%95%E7%94%A8)

## Vue不断循环updated更新组件问题
  举例当一个数据x在template中使用时，会被当前的组件watcher订阅，当数据发生变化时通知watcher执行render重渲染，然后执行updated钩子，如果updated钩子中又去改变这个x值，那么又会把当前的watcher放入更新队列中，因此不断循环至到循环上限报错。

## 大文件分片上传、秒传及断点续传

- 使用xhr发送multipart/formData数据
- 文件分片
  - e.target.flies[0].slice进行切割
- 断点续传 
  - xmlhttprequest的abort暂停切片上传
  - 根据后端返回的切片名，前端跳过已经上传成功的切片
- 秒传 
  - 根据文件hash判断上传过的文件直接提示上传成功
- 使用spark-md5 
  - 读取所有的文件切片，然后递归执行spark-md5的方法，最后求出文件的hash值（使用webworker去算不阻塞主线程）
  - 不能直接对整个文件做hash，内存占用高、阻塞主线程、而且会出现不同文件出现相同的hash值
- 遇到的问题
  - 在做断点续传的时候会出现文件进度条`倒退`现象，这个现象出现是因为我中断上传的时候把正在发起上传的分片都清掉了，然后再次发起上传的时候要从0开始，因为上传切片是并发的，在中断之后应该由后端来告诉我哪些传完哪些没传完，进度要重新算一遍，所以中断时候的进度条状态要保存下来，之后续传的时候再判断大于这个进度条状态再去更新进度条视图
  - 计算大文件的md5时非常耗时，那把md5的计算放到web-worker子进程中去计算，计算好了通过postmessage回传回来，然后就再继续文件上传
  - 用steam流读写代替Buffer读写，省内存效果高。（一读一写一删） `fs.creatWriteStream`可以使用第二个参数start控制把流传到正确的位置，以此来实现并发写入(暂时来看不可行)

https://www.cnblogs.com/xiahj/p/vue-simple-uploader.html
https://juejin.cn/post/6844904046436843527
https://www.cnblogs.com/goloving/p/12825973.html
