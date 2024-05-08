## vue 渐进式

- vue 是一个渐进式的 js 框架，支持`逐步集成`我们需要的功能，满足越来越复杂的业务场景。比如一开始我只需要 vue 一些基础的页面渲染功能，后面我又可能需要路由进行跳转，集中的状态管理，以及 SSR 功能等等，vue 支持我们逐步地把这些功能集成到我们的项目中去

## vue 响应式

- 响应式是`数据驱动`视图更新的过程，对数据做`数据挟持`,vue2 通过 Object.defineProperty，vue3 通过 Proxy，在 getter 中做`依赖收集`，在 setter 中`通知视图`更新
- 从原理实现上，vue 定义了三种对象 observer、dep、watcher
  - 当数据在初始化时，创建 `observer` 对象，对数据进行`数据挟持`（观察者模式）并 创建 `dep` 依赖对象收集依赖（订阅发布模式）
    - dep 和 watcher 之间的关系
    - dev.subs 收集 watcher
    - watcher.deps 收集数据对应的 dep 对象
    - watcher.depIds 收集 dep 对象 id
    - dep 对象通过闭包方式存储
  - 每一个组件会对应一个视图，每个视图对应一个 `watcher`对象
  - 当页面渲染时，`调用`了数据上的 `get` 方法，此时会把当前的视图 watcher 会被添加到对应数据的 observer 对象上的 dep 依赖中，在下次数据更新时，`调用`了数据的 `set` 方法，进而调用了 dep 的 `notify` 方法通知 dep 上收集到的 watcher 触发组件的更新，进而触发视图的更新

### [watcher 为何反向收集 dep](https://juejin.cn/post/6995079895470571551)

- watcher 有三类：渲染、计算、监听
- 渲染 watcher 和监听 watcher 是为了方便 watcher 解除订阅，减少不必要的更新
- 计算 watcher 为了让依赖 data 的 dep 去收集渲染 watcher，因为 watcher 本身没有收集渲染 watcher

### vue 依赖收集

- 依赖收集是把视图 watcher 放到 data 数据对应的 dep 对象的`过程`
- 每个响应式数据上都有一个 dep 对象专门用来做依赖收集
- 当视图渲染时访问数据的 get 方法，触发依赖收集机制，数据上的 dep 依赖收集器会收集当前视图的 watcher 对象
- 当数据发生变化时，触发数据的 set 方法，通过 dep 对象通知对应的 watcher 进行视图更新
- 依赖收集是 vue 实现响应式数据驱动的一环

## vue 通信

- 父子：props $emit
- 跨级：provide inject
- 状态管理库：Vuex pinia
- 事件总线：EventBus
  - eventbus 原理
    - new Vue()
    - 发送 .$emit('eventName',data);
    - 监听 .$on('eventName',fn);
    - 注销 .$off('eventName');

## vue 的双向数据绑定

- 通过数据挟持和发布订阅模式实现
- 数据挟持 vue2 通过 object.defineproperty ，vue3 通过 proxy 去挟持数据，在数据的 getter 中收集依赖，在 setter 中通知视图更新
- 双向数据绑定可以简化处理代码逻辑，主要的应用场景有：表单上的处理、父子组件通信
- 主要用到的语法糖有 v-model
- 三种写法
  - 手写
    - 给子组件传入 modelValue 属性和 @update:modelValue 方法
    - 在子组件中调用 $emit('update:modelValue', xxx) 方法，更新父组件的传参
  - v-model 语法糖
  - defineModel
    - vue3.4 后才有，简化代码

### 数据绑定的方式

- 数据挟持+发布订阅模式
  - vue（Object.defineProperty/Proxy）
- 脏数据检测
  - angular（setInterval）

### 单向数据流

- 单向数据流指的是应用中的数据只能从父组件传递给子组件，并且不能在子组件中修改父组件传来过的值
- 优点：数据容易溯源和可控
- 缺点：代码量增多

### 双向数据流

- 双向数据流是指在子组件可以修改父组件的数据
- 优点：简化代码，适合表单场景
- 缺点：数据流向混乱不好调试

## vue 的生命周期

- vue 的生命周期就是从 vue 实例`创建`到`销毁`的过程，主要包括初始化、模版编译、挂载、更新、销毁等阶段
- `beforeCreate` 数据观测和初始化事件都未开始，data、watcher 和 methods 都还不存在
- `created` 实例创建之后被调用，该阶段可以访问到 data，数据观测相关的东西都存在了，但 dom 还没有被挂载
- `beforeMount` dom 挂载之前，相关的 render 函数在这之后首次被执行
- `mounted` 在挂载完 dom 之后被调用
- `beforeDestroy` 实例销毁前调用，实例仍然可用
- `destroyed` 实例销毁后调用，指令、监听事件、所有子实例都被销毁
- `beforeUpdate` dom 更新之前
- `updated` dom 更新之后
- `activated` 被 keep-alive 缓存的组件激活时调用
- `deactivated` 被 keep-alive 缓存的组件停用时调用

## computed 和 watch 的区别

- computed 和 watch 都是一个 watcher 对象
- computed 是对一些计算结果的缓存，computed 函数中的元素如果发生改变，当前的 computed 也会重新执行
- watch 是用于监听某个数据的变化执行函数
- 默认情况下 computed 会在组件初始化的时候执行一次（收集 computed 中依赖的数据），watch 不会，但 watch 可以通过设置 immediate 属性让 watch 在初始化的时候执行一次
- 默认情况下如果 watch 的是一个对象，这个对象中的属性发生变化是不会触发 watch 函数执行的，如果需要监听对象属性变化可以通过添加 deep 属性

## 什么是动态路由

- 根据不同的`路由参数`来生成不同的路由，路由参数通过冒号（:）xxx 来定义，在组件内通过 $route.params 来获取路由参数的值

## 什么是路由懒加载

- `在需要时`才动态地加载组件和模块，而不是应用启动时就加载所有组件模块
- 通过 es6 的 import() 动态模块语法和 webpack 提供的 require.ensure 来实现懒加载

## 什么是路由守卫

- 路由守卫是一种对路由进行控制和管理的机制，通过路由守卫可以实现权限控制、错误处理等操作
- 路由守卫包括：全局守卫、路由独享守卫、组件守卫

## 介绍一下 slot 插槽

- 通过在子组件上设置 slot 标签占位，然后在父组件中往这个占位标签上添加标签元素进行渲染，通过插槽可以拿到子组件的信息
- slot 插槽有三种类型：默认插槽、具名插槽、作用域插槽

## vue data 为什么返回一个 function

- 在 Vue 中，组件是可以复用的，如果 data 是一个对象，那么在多个组件实例之间共享同一份引用，会导致数据互相影响
- 通过让 data 是一个函数，确保每次创建组件实例时都会返回一个新的数据对象，从而避免组件间的数据污染

## vue 的依赖注入

- 通过 `provide/inject` 实现依赖注入
- provide 提供被注入的值
- inject 获取注入的值
- 注入的值非响应式，但是属性会保留响应式

## nextTick

- nextTick 在 dom 更新后执行传入的回调，接收一个函数并返回一个 promise
- 通过`异步队列`收集 watcher，同一个 watcher 被触发多次只会放入一次，防止重复更新
- 异步队列（数组）尝试通过 Promise.then 执行，如果环境不支持则采用 Mutation Observer api 、setTimeout 代替

## keep-alive

- keep-alive 是一个`抽象组件`，`不会渲染`真实的 dom，不会出现在`父组件链`上，缓存不活动的组件实例，而不是销毁他们。
- keep-alive 组件接收两个字段`include 和 exclude`，根据组件的 `name` 来判读是否需要缓存
- 当缓存的组件超出 max 定义的上限时，运用`LRU缓存策略`去掉最久未使用的组件实例
- 被 keep-alive 包囊的组件会触发 activated 和 deactivated `生命周期`

## vue-loader

- 拆分组件中的 模板（template）、脚本（script）、样式（style）
- 生成 render 函数，用于后续生成 Vnode
- 生成 vuecomponent 构造函数等

[vue-loader 原理分析]https://zhuanlan.zhihu.com/p/355401219

## vue3 新特性

- 在使用上
  - 新增了组合式（composition）api，参考 react 的 hook
  - 支持 ts 语法
- 在响应式上
  - 通过 proxy 代替 Object.defineProperty，解决无法监听对象、数组属性新增删除问题
- 在原理上
  - 最长递增子序列算法
    - 最大程度地找到不需要移动的节点，移动尽量少的节点
  - 静态提升
    - 把静态节点提取到渲染函数外定义
    - 在更新时（重复渲染时），直接复用不需要重新创建虚拟 dom，提升性能和减少内存占用
  - 静态标记（反直觉）
    - 标记出动态节点，打上 patch flag 标记
    - diff 时只比较这些被标记的节点，提升性能
  - 预字符串处理
    - 把连续多个静态节点合并成一个字符串，并生成一个 Static 类型的 VNode，减少创建虚拟节点，减少内存占用

[Vue3.0 性能提升主要是通过哪几方面体现的？](https://vue3js.cn/interview/vue3/performance.html)

## vue2 diff 算法

- vue2 diff 采用`双端比较`的方式，定义四个指针分别指向新旧节点的开头和结尾节点
- 分别从新旧开、新旧尾、新尾旧开、新开旧尾开始匹配，逐步向中间缩小匹配范围
- 当匹配不到时，遍历剩余的旧节点，以节点的 key 作为 key，value 是节点的位置索引值，从这个 map 对象去找复用节点的索引值，如果能找到就复用，并把旧节点列表上的旧节点设置为 undefined（为了后续匹配时跳过这个已经被复用的节点）
- 如果在 map 上找不到旧节点索引值，则对新节点进行新增操作
- 经过几次循环比对后，有剩余旧节点，就对剩余的旧节点删除掉
- 当有剩余的新节点，就对剩余的新节点进行新增操作

## vue3 diff 算法

- 通过`双端比较`+`最长递增子序列`算法实现
- 根据新旧节点的位置关系，构建位置映射表，`构建新旧节点位置映射表`（存储时索引值都+1，因为 0 用来表示节点新增）
  - 当前最远位置=0、移动标识=false，这两个标识来确定是否有节点发生了移动
- 构建最长递增子序列，通过`二分查找`和`贪心算法`，以及构建`前驱索引数组`回溯修正结果数组（记录每个元素的前一个节点在原数组中的索引值，用于最终矫正结果列表中的值），得到最长递增子序列数组
- 最后对新节点`从后往前`遍历，移动、新增、删除不存在于最长递增子序列的节点

[vue3 最长递增子序列详解](https://juejin.cn/post/7081621840187097119)

### 求最长递增子序列长度

- `动态规划`
  - 以第 i 个元素为结尾的最长递增子序列的长度（第 i 个元素必选）
  - 状态转移方程: `dp[i] = max(dp[j] + 1, dp[i])` ，条件：`0<=j<i 且 nums[i] > nums[j]`
  - 时间复杂度: O(n^2)
  - 空间复杂度: O(n)
- `贪心`+`二分查找`
  - 贪心
    - 让选择的元素尽可能小
    - 目标值大于末尾元素就放入收集列表中，小于则`替换`收集列表中`第一个大`于当前目标值的元素
  - 二分查找
    - 找出收集列表中`第一个大`于目标值的元素进行替换
  - 时间复杂度: O(nlog2n)
  - 空间复杂：O(n)
- `前驱索引数组`矫正元素偏差
  - 在每次遍历构建最长递增子序列（索引）数组的过程中
  - 同时用一个 p 数组去记录当前在结果（索引）数组的前一个位置的索引值
  - 该记录的索引值是放入结果（索引）数组时最后一个的值

## vue3 为什么不使用 Fiber(时间分片)

- fiber 的出现主要解决虚拟 dom 计算长时间占用主线程的`高 CPU 计算耗时`问题，会造成页面卡顿无法交互等情况（渲染帧超过 16ms）
- 加入 fiber 时间分片会`带来一定成本`，比如：包体积增大、架构复杂度提高
- 大部分情况下 vue3 的`性能开销`都要比 react 小
  - vue3 相对于 react`更新组件更精确`，基于依赖收集机制
  - vue3 默认在框架层做了大量`性能优化`，不需要手动设置
    - `响应式`方面，并且在 vue3 中通过 proxy 代替 defineProperty 挟持整个对象，性能更好
    - `diff` 方面：使用`最长递增子序列`算法，进一步优化 diff 时间
    - `预编译(AOT)`方面：静态提升、静态标记、预字符串处理，透过 vue 的 template 语法
- 在`权衡利弊`后，作者尤雨溪觉得不是那么值得，后面有需要再考虑

[为什么 vue3 不使用时间切片](https://juejin.cn/post/6844904134945030151)

### 造成卡顿掉帧的原因

- `高 cpu 时间`，超过 16ms 一帧的运算时间，长时间占用主线程运算，js 是单线程的
- `大量原生 DOM 重渲染`

### 为什么使用 proxy 代替 defineProperty

- proxy 能`挟持整个对象`, defineProperty 只能对属性进行挟持，性能更好
- proxy 能检测到对象`属性的添加和删除`, defineProperty 做不到
- proxy 能解决`数组监听`问题，之前无法监听数组的添加删除

## 对 setup 的理解

- setup 是 vue3 中的一个新配置项，`新语法糖`，是一个函数，在 setup 函数中使用 composition api
- setup 代替了 `beforeCreate` 和 `created` 生命周期，完成数据初始化工作
- setup 函数支持返回`对象`和 `render 函数`，返回 render 代替 template 模版写法，可以更加灵活地渲染
  - script setup 最终编译成 render 函数
  - script setup 中不支持直接返回 render 函数，需要通过普通 script export default 设置 setup 返回函数的形式实现

## vue3 渲染流程

- createApp 创建组件实例
- 初始化 prop 和 slot
- 执行 setup 函数（代替 beforeCreate 和 created 生命周期），初始化响应式数据
- 处理 setup 函数的运行结果（返回一个 render 函数或者响应式对象），决定走 render 渲染函数还是走 template 模板渲染逻辑
- 挂载组件，生成虚拟 dom
- 渲染真实 dom

https://zhuanlan.zhihu.com/p/596102026?utm_id=0

## Vue.extend 和 Vue.component 的区别

- Vue.extend `创建构造器`，等待实例化挂载到任意元素上，方便扩展和复用（继承）
  - extends 合并规则和 mixins 一致，data、methods、template 同名被组件定义的覆盖；watch、生命周期同名共存，以组件定义的优先调用；
  - vue3 支持 Vue.component（注册全局组件），不再支持 Vue.extend 用法，可以通过 createApp 代替
  - vue3 的 composition api 不建议使用 extends、mixins（不会处理 setup() 钩子的合并），建议使用组合式函数（useXXXX 自定义，注意只能用在 setup 函数中）
  - 用法
    ```js
    // 创建构造器，接收组件的初始化配置，继承vue的基础配置
    var Profile = Vue.extend({
      template: "<p>{{firstName}} {{lastName}} aka {{alias}}</p>",
      data: function () {
        return {
          firstName: "Walter",
          lastName: "White",
          alias: "Heisenberg",
        };
      },
    });
    // 创建 Profile 实例，并挂载到一个元素上。
    new Profile().$mount("#mount-point");
    ```
- Vue.component `全局注册组件`，设置组件名称，注册后全局使用
  ```js
    // 注册组件，传入一个扩展过的构造器
    Vue.component('my-component', Vue.extend({ /* ... */ }))
    // 注册组件，传入一个选项对象 (自动调用 Vue.extend)
    Vue.component('my-component', { /_ ... _/ })
    // 获取注册的组件 (始终返回构造器)
    var MyComponent = Vue.component('my-component')
  ```
- 使用场景
  - 消息弹窗（支持同时弹多个）
  - 对话框
  - 通知提示

[【Vue 源码探究】Vue.extend 和 VueComponent 的关系](https://juejin.cn/post/7197230639145631804)

### mixins 弊端

- `命名冲突`
- `依赖关系混乱`复杂且难以跟踪，使用 provide/inject 代替
- `逻辑复用`难以维护，使用高阶函数、composition api （hook）代替

## ref 和 reactive 区别

- ref 可以接受任何值, 把接收的值放到一个 value 属性上
  - 创建 RefImpl 对象，通过 class 的 getter 和 setter 语法挟持 value 属性
- reactive 只能接收对象
  - 创建 Proxy 对象挟持数据
- reactive 写法更简洁一些，但是有局限性
