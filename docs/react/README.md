## React 是什么

- React 是一个用于构建用户页面的前端框架
- 它主要特点包括组件化开发、虚拟 DOM、单向数据流、数据驱动视图更新等

## react hooks 的出现解决什么问题

- 解决函数组件没有状态和生命周期的问题
- 解决`状态复用`问题，class component 复用状态，需要通过高阶组件（HOC）来进行嵌套获取状态，嵌套多层时容易形成嵌套地狱不好维护，如果通过 hooks，不需要层层传递状态，直接调用相关的 hooks 函数就可以
- 解决`副作用`问题，在 class component 的生命周期场景中，容易聚集着大量不相关的副作用逻辑，而且难以拆解，难以维护。在 function component 中我们可以通过 useEffect 把副作用代码独立放在不同的 useEffect 中执行，更好维护

## function component 和 class component 的区别

- 语法不同
  - class component 继承 React.component，定义 render 属性，返回 jsx
  - function component 相对简单点，接收 props 返回 jsx
- 获取状态和生命周期的方式不同，class component 通过 this，function component 通过钩子函数
- function component 更容易做状态复用，class component 则通过嵌套高阶组件的方式，比较麻烦

## setState 是同步还是异步

- setState 是同步还是异步，跟 react 的版本和调用环境有关，在 react18 版本以下，非合成事件和生命周期中调用会表现为同步更新，同一时间多次调用 setState 会造成多次重渲染，因为此时数据更新不在 react 的批处理控制范围中（isBatchingUpdate 默认为 false，每次批处理完都会重置为 false），因此无法做到批处理更新，批处理的过程是异步的，会合并到一次渲染中去。在 react18 后，改进了批处理判断逻辑，实现自动批处理（利用 promise.then 和 queueMicroTask 微任务 api 来调度更新），不局限于合成事件和生命周期下的场景才进行批处理
- 批处理原理：把多次状态更新合并到一个更新队列中，在一次事件循环中统一处理
- 如果希望同步执行，可以通过 `flushSync` 这个 api 进行处理，强制触发同步更新

## react 的渲染过程、setState 触发更新发生了什么、useState 更新发生了什么

- setState（useState）会进入 react 的渲染流程
- react 渲染分为三个阶段：调度阶段、调和阶段 和 commit 阶段
- 调度阶段(Scheduling)
  - 包括创建 `update 对象`（新数据存 payload 属性上），放入 updatequeue 链表（环形链表），等待调度
  - `开始调度`后，根据任务优先级和时间分片(5ms)循环调度任务，每次到达分片时间，检查优先级执行更高优先级任务
- 调和阶段（Reconciliation/Render）
  - 从触发更新的节点回溯到根节点，并给每个经过的父节点的 childLanes 合并 lane 优先级，从根节点执行 workLoop 函数，开始递归逐层 diff，逐层标记变动的节点并生成新的 fiber 树
    - 回溯到根节点是因为不只有当前组件触发更新
    - 给每个父节点的 childLanes 赋值为了表示该父节点的子节点存在更新任务
    - 在调和中区分两种情况，mount 和 update
      - 如果是 mount 则直接标记 placement
      - 如果是 update 则进行 diff 过程，`标记`出需要增删改的 fiber 节点，赋值到 fiber.flags 属性上
- 提交阶段（Commit）
  - 递归遍历新 fiber 树，根据节点的 flags 属性来操作真实 dom，以及在合适的时机执行副作用和生命周期
  - commit 阶段是不可中断一口气同步完成的
- 最终 commit 阶段结束，完成本次渲染更新

[effectlist 废弃了](https://github.com/BetaSu/just-react/issues/41)  
[深入讲解 React 中的 state 和 props 更新](https://juejin.cn/post/6929854562287222791#heading-11)

### commit 阶段

- `beforeMutation` 阶段（执行 dom 操作前）
  - 对于 CC，执行 getSnapshotBeforeUpdate，获取 dom 更新前的组件实例信息
  - 对于 FC，异步调度 useEffect 钩子
- `mutation` 阶段（执行 dom 操作）
  - 对于 CC，调用 componentWillUnmount
  - 对于 FC，同步执行 useLayoutEffect 的销毁函数
  - ref 更新
- `layout` 阶段（执行 dom 操作后）
  - 对于 CC，会调用 componentDidMount、componentDidUpdate、setState 回调
  - 对于 FC，会同步执行 useLayoutEffect 回调
- commit 阶段`结束后`
  - 同步执行 useEffect 的销毁函数
  - 接着同步执行 useEffect 的回调

### 数据存放位置

- hooks 的数据存放在 fiber 的 `memoizedState` 链表上，useEffect 放 updatequeue 列表上
- 一个组件上的多个 useState 会以链表的形式存储在组件 fiber 的 memoizedState 对象上

### 代码调用流程

- 如果是非并发特性触发的调度，会以同步更新的方式进行调度
- scheduleWorkOnFiber -> scheduleCallback（生成 task 任务）-> perform(concurrent)WorkOnRoot -> renderRoot -> workLoopSync | workLoopConcurrent(shouldYeild 判断分片) -> commitRoot

## react 合成事件(synthetic event)

- 原生事件是会把事件监听`直接绑定`在 dom 元素上
- 合成事件是 react `自己模拟`浏览器的 dom 事件流实现的一套`事件管理机制`，以及 react 会把这个合成事件绑定到 document 节点上，通过`事件委托`的方式，在子节点触发事件，让事件冒泡到 document 进而触发合成事件的逻辑
- 合成事件有两个好处
  - `抹平不同浏览器之间的事件处理差异`，不管是在什么浏览器环境下，都会以相同的方式处理事件
  - 不需要给过多的真实 dom 绑定事件，`减少内存占用`，提高性能
- 在 react17 以后合成事件有些改动，会把合成事件绑定在创建时的 fiber root 根节点上，这样可以兼容更多的应用场景（比如可以同时在项目运行多个 react 版本而不会相互影响，同时也方便微前端架构接入）
- 在合成事件中更改状态会触发`批处理机制`，合并多次状态更新而产生一次的组件重渲染

### react 合成事件做了哪些抹平差异的处理

- 大多数共通的事件，如 click（点击事件）、mouseover（鼠标事件）、keydown（键盘事件）
- `注册事件和取消事件`
  - IE8 及更低版本中使用 attachEvent 和 detachEvent，而其他现代浏览器使用 addEventListener 和 removeEventListener
- `触摸事件`
  - 如 touchstart、touchmove 和 touchend，在不支持触控的设备或不支持触摸事件的浏览器中可能不存在。
  - React 的合成事件对这类事件进行了包装，即便在不支持触摸的环境中，也能以一致的方式处理这类事件。
- `滚动事件`
  - scroll 事件在原生中不会冒泡
  - onScroll 会比较特殊，会直接把事件绑定在对应的节点上进行监听
- `键盘事件的属性`
  - IE 浏览器可能需要使用 event.keyCode 来判断，而其他现代浏览器推荐使用 event.key 或 event.code
  - React 的合成事件通过 SyntheticKeyboardEvent 则提供了一个统一的 API
- `事件的默认行为阻止`
  - 不同浏览器可能需要使用 event.preventDefault()或设置 event.returnValue = false
  - React 合成事件，只需要调用 event.preventDefault()
- `提供了一个统一的事件对象`（SyntheticEvent）
  - 它对原生事件对象进行了封装，确保在所有浏览器中都有相同的基础属性和方法，如 preventDefault、stopPropagation、target 等

### 合成事件和原生事件的执行顺序

- 谁先监听谁先执行，在 react 项目跑起来之前注册的监听事件会先执行，在项目跑起来以后，在组件内注册的原生事件会在合成事件执行完成后再执行原生事件
- 在 17 之前，react 中的合成事件都会在 document 节点的冒泡阶段执行
- 在 17 之后，分别在 root 节点的捕获和冒泡中执行对应阶段的合成事件

## Suspense

- Suspense 主要解决`异步组件`和`异步请求`的场景
- 可以让异步请求回来之前显示一个等待时的组件，等异步请求完再渲染实际的组件
- 通过 Suspense + Error Boundary 可以简化代码

## useState

- useState 是 react hook 的一个钩子函数，用于在`函数组件`中`创建状态`以及更新状态的
- useState `接收`一个参数进行数据的初始化，并`返回`一个数组，数组的第一项是只读状态，第二项是更新状态用的函数
- 当执行返回数组的第二个参数会引起组件的更新，如果`多次调用`在不同的 react 版本会有不同的表现，在 react18 版本以下，在合成事件和生命周期中是体现为异步更新的，在异步任务或一些原生方法中执行是同步更新的，在 react18 中所有场景都是默认异步`批处理`的

## useCallback 和 useMemo、React.memo 的区别

- 使用 useCallback 和 useMemo，主要用来防止不必要的 effect 执行、避免子组件的重渲染、避免重复计算
- useCallback `接收两个参数`，一个是`函数`，另一个是`依赖数组`，执行 useCallback 返回一个函数，如果依赖数组内的元素不发生变化，返回的函数也不会改变
- useMemo `接收两个参数`，一个是`函数`，另一个也是`依赖数据`，但返回跟 useCallback 不一样，会返回第一个函数执行 return 的结果，如果依赖数组不变，函数不会重新执行，返回的结果也不会改变
- React.memo 是一个`高阶组件`，`接收一个组件`作为参数`返回一个组件`，当组件的 props 发生变化时才会重新渲染，常用作需要缓存组件的场景
- useCallback 通常`配合 React.memo`使用避免子组件重渲染，以及作为依赖项传入 useEffect，配合使用
- useMemo 主要的使用场景是`缓存计算`复杂耗时的`结果`，减少重新计算

## useContext

- 消费上下文定义的 context 中的数据
- 优点
  - 方便做跨层级通信，不需要逐层传递数据
  - 使用了 useContext 的组件，在 context 的值发生变化时会自动重新渲染
- 缺点
  - 状态不好溯源
  - 过度渲染问题，我只用到了 context 其中的几个属性，但只要 context 变了，都会发生重渲染

## useEvent

- 一个 react 的新提案，该 hook 用于返回一个引用不变的函数，并且在函数执行时总能拿到最新的 props 和 state
- useEvent 能解决一些 useCallback 不好解决的问题
  - 比如我有个方法传递给子组件，方法内有用到一个 useState 定义的状态，当这个状态在反复变更时会导致 useCallback 返回的函数也反复变更，进而导致子组件不断地重渲染，造成性能问题
  - 比如传递给第三方事件监听的场景

## useEffect 和 useLayoutEffect 的区别

- useEffect 和 useLayoutEffect 都是 react hook 的钩子函数
- useEffect 和 useLayoutEffect 都接收一个函数和一个依赖数组
- 他们触发的时机不一样，useEffect 会在 commit 阶段发生之后异步执行，不会阻塞渲染（调度是在 commit 中调度，effect 链表是在 render 阶段生成）
- useLayoutEffect 会在 commit 阶段中同步执行，会阻塞渲染，跟 componentDidMount 和 componentDidUpdate 调用时机是一样的，clean 函数跟 componentWillUnmount 一样，都是同步调用的
- useEffect 的 clean 函数更像 componentDidUnmount 生命周期（react 没有这个生命周期）

## useRef、forwardRef、useImperativeHandle

- useRef 返回一个存储数据时不会引起组件重渲染的 ref 对象，通过.current 进行值的储存和取，该对象在组件的整个生命周期中持续存在
  - 常见的运用场景
    - 获取组件实例或真实的 dom
    - 保存不希望引起页面重渲染的数据
- forwardRef 是一个高阶组件（HOC），被包囊的函数组件能从第二个入参获取父级传进来的 ref 值，通过 ref 拿到子组件某个 dom 元素信息传递道父组件中
- useImperativeHandle 配合 forwardRef 使用，控制（自定义）暴露给父组件的属性

## react 中的 portal

- portal 是 react 提供的一种把子组件 dom 节点创建到父组件 dom 节点外的解决方案
- 因为 portal 生成的子组件还存在组件树中，所以子组件内触发的合成事件还是可以冒泡到父组件去，原生的冒泡方式就不行
- 常用于实现对话框、提示框等等场景

## react diff 算法

- react diff 目的就为了`高效更新 dom`
- react diff 有`三个策略`来优化传统的 diff
  - 第一只对`同层`节点比较
  - 第二只复用同类型下的子树（只对`同类型`下的节点进行 diff），不同类型重建
  - 第三给节点添加唯一 `key` 标识，提高 diff 准确性
- 通过以上这三个策略把传统的 diff `时间复杂度`从 On^3 降低到 On
- diff 的过程是`逐层比较`的，在每一层的比较中
- `第一步`是先从左到右`遍历`，找出可以`复用`的节点，并判断属性是否有变化而打上`更新标记`（判断复用：先判断组件类型、节点类型再到 key）
  - 当第一次遍历停止时，如果只剩下的旧节点，就给剩余旧节点打上删除标记
- `第二步`从不能复用的新节点开始第二轮遍历，遍历剩余的旧节点，创建`map 对象`（以 old fiber 节点的 key 作为 key，fiber 节点作为 value 进行保存）根据 key 以及新旧节点的位置信息，判断节点是否需要打上更新标记
  - 如果能找到，判断新节点在旧节点列表中的位置，是否发生了移动，如果需要移动则打上`placement标记`（通过一个 lastPlacedIndex 字段记录这些新节点在旧节点列表位置上的最大索引值）
  - 如果没有在 map 中找到旧节点，就给新节点打上新增标记（placement）
  - 最后遍历完新节点，再对 map 剩下的旧节点打上删除标记（deletion）
- 遍历结束后，有`多余`的旧节点则打上删除标记，有多余的新节点则打上新增标记
- `进入 commit 阶段`后，遍历新 fiber 树中被标记的节点信息，进行真实 dom 更新，最后完成渲染工作
- 以上就是 react 的 diff 过程
- react 的 diff 在某些场景下还存在一些性能问题
- 如在`把最后节点移动到最前`的场景下，react 会把前面的节点一个一个往后挪，其实更好的做法是把最后一个移到最前就可以
- 所以 vue 在这方面比 react 好，在 vue2 中通过`双端比较`的方式优化解决这个问题，并且在 vue3 中通过`最长递增子序列算法`，以及一些利用`静态模板`编译的能力，进一步提升 diff 性能（静态标记、静态提升、字符串预处理）
  - react 的 jsx 写法太灵活，以至于很难做编译时优化，所以很多时候需要开发者自己手动考虑优化
- 不过在大部分情况下 react 的 diff 还是没问题的，react 的 diff 是`可中断`的，如果出现性能问题也能通过启动`并发特性`来优化

注意：

- react 在有 fiber 以后的 diff，实际上是对旧 fiber（current fiber）以及从组件中通过 render 函数产生的虚拟 dom 数组（newChildren，由 babel 插件编译 jsx 代码生成 React.createElement 的形式）进行比较，然后生成新的 fiber 树（workInProgress）
- 在类型（type）和 key 的情况下会复用节点，然后检查节点属性(props)是否需要更新，如果需要更新则打上更新标记
- 当不配置 key 以及提供了 index 作为 key，效果是一样的，从而默认前后节点 key 始终相等，从而判断节点的 type 和 props 是要复用更新节点还是重建

[详解 react diff](https://juejin.cn/post/6844903973585944589#heading-7)

## fiber 数据结构有哪些字段

- `key` 唯一标识
- `tag` 标记不同的组件类型：class（类组件）、function（函数组件）、host（Dom Element）
- `flags` 标记节点的变更和副作用状态
  - Placement 插入、移动
  - Update DOM 属性、文本内容变更
  - Deletion 删除
  - ContentReset 标记需要重置文本的 HostComponent 节点
  - Callback 标记创建了更新对象并且更新对象有 callback 回调的类组件或者 HostRoot
  - Snapshot 标记实现了 getSnapshotBeforeUpdate 方法的类组件对应的 fiber 节点
  - Passive 标记调用了 useEffect 的函数组件（只作用于函数组件）
  - 参考：[彻底搞懂 React Fiber 副作用以及 Fiber Flags 常见操作](https://juejin.cn/post/7110917069155090445)
- `lanes` 优先级，31 位
- `type` 真实类型: div、span、img
- `return` 父节点
- `child` 子节点
- `sibling` 兄弟节点
- `updateQueue` 更新队列，执行一次 setState 就会往这个属性上挂一个新的更新, 每条更新最终会形成一个链表结构，最后做批量更新
  - 类组件，存的是 setState 的更新对象链表（环型链表）
  - 函数组件，存的是 useEffect 和 useLayoutEffect 的监听函数，一个环形链表，lastEffect 指向最后一个 Effect
  - host 组件，存的是需要更新的属性键值对，updateQueue 会是一个数组
- `memoizedState`
  - 类组件，当前的 state
  - 函数组件，hooks 链表
- `pendingProps` 新的 props
- `memoizedProps` 旧的 props
- `mode` 模式
  - NoContext(同步)
  - ConcurrentMode(并发模式)
  - StrictMode(严格模式，一般用于开发)
  - ProfileMode(分析模式，一般用于开发)

## 介绍下 fiber 架构

- fiber 的出现主要是为了解决在 render 阶段同步渲染，长时间占用主线程，造成页面卡顿无法交互的问题
- fiber 架构整体是一个`链表树`的数据结构，每个节点上包含了三个指针，分别指向他的兄弟节点、子节点以及父节点，可以方便回溯整个链表树
- 每一个 fiber 节点也是一个`执行单元`，在 react 的调度中（开启了并发模式下）构建新 fiber 树时，每 5ms 的时间分片让出主线程控制权，去执行更高优先级的任务，实现可中断渲染的机制，提高用户体验

注意：

- 当发生一次`重渲染`时，react 会根据`旧 fiber 树`(current tree)和 `render 函数生成的 JSX 对象数组`进行 diff 比较
- 在 react17 中，开启 concurrent model 并发模式（需要安装 react/@experimental、react-dom/@experimental 来支持并发模式, ReactDom.createRoot 开启）
- 在项目中，要开启 concurrent 模式才会进行时间分片调度，在 legacy 模式下任务还是不会被中断，更新还是会一次性完成
- 在 react18 中，通过某些具有并发特征的 api（比如：startTransition）开启时间分片！！（即一般情况下，render 阶段不会被打断）
- react 渲染分两个阶段：render 阶段和 commit 阶段，在 render 阶段中创建 fiber 树和 diff 算法标记变化的节点，进入 commit 阶段后执行变化修改真实 dom

## react scheduler 调度

- react 的调度通过浏览器的`MessageChannel`宏任务 api 以及`两个最小顶堆队列`，自己模拟实现了一个事件循环机制，让浏览器在一帧的`空闲时间`里执行多个任务
- 不同任务有不同的优先级，不同的`优先级`会转换成不同的`过期时间`，调度中会把过期和没过期的任务分别放在到不同的队列中按小到大排列等待执行
- 调度进行时每 `5ms` 检查一下分片时间，让浏览器有机会去执行更高优先级的任务，避免渲染阻塞
- react 调度中没有使用`requestIdleCallback` 主要考虑`兼容性`和`运行不稳定`等因素

react 的 scheduler 调度是独立的一个包，与 fiber 是解耦的

[React 工作循环](https://blog.csdn.net/weixin_44828588/article/details/126419000)

## react lane

- react lane 是一个`优先级模型`，用于控制渲染，让高优先级的更新任务优先执行
- 每个 fiber 节点上都有个 lanes 字段，由 `31 位`的二进制表示，不同的二进制位表示不同的优先级，位越小优先级越高
  - 在`调度`时，把`任务优先级`先转换成`事件优先级`，最后转换成`调度优先级`进行任务执行（解耦）
    - 转换定义：react/packages/react-dom-bindings/src/events/ReactDOMEventListener.js 411 行
  - 使用 lane 优先级存在`饥饿问题`（不断被高优先级插队，低优先级任务一直等），react 是通过判断任务的`过期时间`解决，当达到任务的过期时间则会放到调度的执行队列中立即同步不中断地执行完
- 在`不同的场景`下，有不同的优先级（事件、更新、任务、调度），互相转换，完成任务中断、调整执行等工作

### 介绍下 react 的优先级

- react 有四种优先级：事件优先级、更新优先级、任务优先级、调度优先级。根据不同场景有不同的优先级
  - 事件优先级（4）
    - 离散事件：click、keydown、focus 等
    - 连续事件：drag、scroll、mousemove 等
    - 普通事件：load、animation 等
    - 空闲事件：优先级最低，未知场景
  - 更新优先级（31 同任务优先级 update.lane）
  - 任务优先级（31 fiber.lane）
    - 细颗粒度控制
  - 调度优先级（5）
    - ImmediatePriority
    - UserBlockingPriority
    - NormalPriority
    - LowPriority
    - IdlePriority

[React 源码解读之优先级](https://juejin.cn/post/7032051193371164708)

## react 和 vue 应该怎么选型

- `团队角度`
  - 团队技术栈偏好
  - 发展前景
- `社区生态`
- `学习成本`
- `使用场景`
  - 项目规模
    - 大型多人项目选 react
    - 中小型项目选 vue
  - 高性能要求场景
    - [svelte](https://www.npmjs.com/package/svelte)（编译型框架）（像 vue）
      - 特点
        - 类 vue 语法，模板代码
        - 无虚拟 dom（virtual dom），利用编译的能力，分析代码，直接生成操作真实 dom 的代码
        - 包体积更小
        - 更加极致的性能
      - 工作原理
        - 在编译阶段，分析模板代码，分析状态和视图的依赖关系（根据变量赋值做脏数据收集），编译出纯粹的 dom 操作
        - 实现响应式（Reactivity）更新视图的核心：修改数据触发$$invalidate 方法，标记脏数据，在 microTask 中触发收集到的 dirty_component，一并更新 dom
      - 适用场景
        - h5 运营活动营销页
      - 缺点
        - 生态不够完善
        - api 不稳定
        - 迁移成本高
        - 复杂项目打包体积膨胀，没有优势
        - 没有大型项目案例
    - [solid-js](https://www.npmjs.com/package/solid-js)（运行时框架）(像 react)
      - 特点
        - jsx 语法
        - 无虚拟 dom（virtual dom），通过编译的能力，直接编译成原生 js
        - 包体积更小
      - 工作原理
        - 编译时分析代码，生成直接操作真实 dom 的代码
        - 通过 proxy 做数据挟持和依赖收集
        - 渲染函数只执行一次，并且重渲染时颗粒度更小，更精确地做到按需更新
- `语法层面`
  - vue 上手更简单，基于 `template` 的模板代码的写法，提供了很多 api 帮助开发者开发，比如指令 v-if、v-for、v-model 和插槽等用法
  - react 使用更灵活，基于 `jsx` 语法，更像 js 原生发
- `原理层面`
  - vue 是`自动档`，从框架上已经帮我们优化了许多场景，数据可变更新、自动双向绑定、自动依赖收集、自动过滤不需要更新的组件
  - react 是`手动档`，需要手动优化，单向数据流、数据不可变更新
    - 使用缓存组件
      - class 组件：PureComponent（shouldComponentUpdate 浅比较）
      - 函数组件：React.memo 高阶组件
    - 虽然 react 手动档编写代码麻烦，但是更灵活且更好维护
  - 在 vue 和 react 的`最新版本`中，都带来了一定的性能优化
    - 都支持 ts，react 比 vue 支持度更高
    - vue3 使用 proxy 代替 defineProperty、最长递增子序列、静态标记、静态提升等方式进行优化
    - react18 推出并发特性、自动批处理

[Svelte 响应式原理剖析 —— 重新思考 Reactivity](https://zhuanlan.zhihu.com/p/375309019?utm_id=0)

## react hooks 和 vue hooks 区别

- react hooks：函数式语法，为了保持简洁和纯函数，`保证调用顺序`，通过`链表`实现，每次重渲染都会重新执行一遍（不能在循环、条件或嵌套函数中使用）
- vue3 hooks： 叫组合式 api（composition api），基于响应式，vue 中的 hook 只会在 `setup 函数执行一次`，而且不需要保证调用顺序

## react 优化

- 优化前可以先通过 performance、React dev tools（React Profiler 分析组件渲染）、Redux dev tools 定位性能瓶颈
- 手段
  - `长列表加 key`
  - 使用`缓存` api
    - hook: useMemo React.memo
    - class: shouldComponentUpdate PureComponent
  - `升级 react18`
    - 并发特性
    - 自动批处理
  - `状态下放`，缩小状态更新的影响范围
  - 使用 Suspense
    - 优化数据请求场景，可以少写了显示 loading 那部分逻辑
    - 与 React.lazy 配合使用，动态导入组件，实现异步组件懒加载（避免单个组件过大加载过长，通过代码分割，延迟加载在初次渲染时未用到的组件）

## react16、react17、react18 各版本比较

- react16（2017-09-26）
  - `Hooks、Fiber`（16.8）
  - Suspense （16.6）
  - Context api(16.3)
  - Error boundary(16.0)
  - Portal(16.0)
- react17（2020-10-20）
  - react18 的`过渡版本`，没有特别大的改动
  - `去掉事件池`
  - 把`合成事件绑定`从 document 转移到 root 节点上
    - 由于点击事件注册在 document 上，之前部分业务通过 stopPropagation 停止冒泡行为是不会生效，现在进行了调整
  - `scroll 不再支持冒泡`
  - 使用`lane 模型`代替 expirationTime 模型
  - `不需要在模块中手动添加` import React，提供了新的 jsx 转换，框架自动完成
  - 去掉不安全的生命周期（willMount、willUpdate）
  - 提供实验性的并发模式（需格外装包）
- react18（2022-03-29）
  - 正式支持`并发模式`（concurrent），提出`useDeferredValue`、`useTransition`两个 api 来开启并发更新
  - `自动批处理`覆盖所有场景
  - SSR 支持流式渲染和选择性注水（注水的粒度取决于 Suspense 包含的范围，不需要等到所有组件加载完再进行注水）
- react19（未知）（5 月 15-16 召开发布会）
  - react compiler 编译优化
    - 提供自动化缓存功能，代替原来的手动记忆（React.memo、useMemo、useCallback），减少开发者心智负担
  - server action 服务器动作
    - 优化服务端组件的场景
  - offscreen 离屏渲染
    - 它允许 React 在一个隐藏的（offscreen）画布上预先渲染组件，当需要展示时，直接将其渲染到可视视图上，从而减少了用户看到内容逐渐出现的延迟
    - ReactDOM.createOffscreenRenderer

### useTransition

- 把任务标记成过渡更新任务，用于处理一段逻辑
- 特点
  - 执行后返回一个状态值和一个函数
  - 状态值 isPending，表示等待中
  - 函数是一个可以改变更新优先级的函数，调用后会给状态标记成 transition 优先级，这是个优先级很低的标记
- 应用场景
  - 数据加载
  - 动画过渡效果
- 用例
  ```js
  // 先进行一次同步渲染，然后再进行低优先级渲染
  const [isPending, startTransition] = useTransition();
  const someEventHandler = (event) => {
    startTransition(() => {
      // Mark updates as transitions
      setValue(event.target.value);
    });
  };
  return <HeavyComponent value={value} />;
  ```

### useDeferredValue

- 把任务标记成过渡优先级的任务，生产一个新的状态
- 特点
  - 接受一个任何类型的参数
  - 返回一个被延迟更新的值
  - useTransition + useEffect + useState
- 应用场景
  - 用户输入、搜索场景
  - 代替防抖截流
  - 父组件传子组件
- 用法：
  ```js
  const deferredValue = useDeferredValue(value);
  ```

### react18 的状态撕裂（tearing）问题

- 是什么
  - 在 react18 的并发场景下，先是用外部状态 A 渲染，然后某一时刻 react 渲染发生中断，外部状态变成了 B，再恢复渲染时用的是 B 值，导致了渲染结果不一致的情况
  - 这是一个外部状态管理库状态同步问题
- 解决办法
  - 使用 useSyncExternalStore 同步解决，当外部 store 数据发生变化，通知 react 以同步的方式重渲染，避免撕裂问题
    - useSyncExternalStore 接收两个参数
      - 外部 store 的订阅函数（用于往 store 上注册触发组件重渲染的逻辑）
      - 外部 store 的获取数据的方法
    - 为什么是同步更新
      - 如果还是并发更新，就会存在一个饥饿问题，那么还是不能避免地出现撕裂问题
  - 使用 react 原生提供的状态管理 api 自动解决撕裂问题

[Concurrent React for Library Maintainers](https://github.com/reactwg/react-18/discussions/70)
[如何理解 React 18 中的 useSyncExternalStore ?](https://www.zhihu.com/question/502917860)
[React 18 撕裂介绍](https://juejin.cn/post/6999778495077302302)
[React 的并发悖论](https://zhuanlan.zhihu.com/p/623324430)
[React 技术揭秘](https://react.iamkasong.com/)
