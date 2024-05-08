## session 和 cookie 的区别

- `位置不同`：session 存储在服务器上，cookie 存储在客户端上
- `大小不同`: session 存储的大小受服务器内存的大小限制，cookie 受浏览器限制一般大小是 4k
- `内容不同`: session 存储在服务器上是以键值对集合的形式，cookie 是以字符串的形式
- `安全性`: session 存储在服务器上相对于 cookie 会安全一些，cookie 存在客户端上会有被盗取的风险
- `应用场景`: session 主要用于保存用户状态信息，把 sessionId 设置到 cookie 上存储到浏览器上，在每次请求的时候带上 sessionId，服务器再去根据 sessionId 完成身份验证；

## session 和 jwt 的区别

- session 和 jwt 都是`认证机制`
- session 把用户认证信息通过会话的形式存储在服务器上，jwt 把认证信息存储在 token 中，然后通过 cookie 或者 localstorage 的方式存储到客户端上
  - 存 cookie 不支持跨域，容易遭受 csrf 攻击
  - 存 localstorage 容易遭受 xss 攻击
- jwt 由三部分组成：头部、载荷、签名
  - 结构
    - base64(header).base64(payload).base64(signature)
      - header 头部
        - 支持的算法
        - 令牌类型
      - payload 载荷
        - sub 主题
        - exp 过期时间
      - signature 签名
        - SHA256(base64(header).base64(payload),secret)
          - secret 服务器密钥
  - 好处
    - `节省服务器资源`，因为服务器不需要存储用户的认证信息，只需要验签和检查 token 是否过期就可以；
  - 坏处
    - jwt 会暴露在客户端上，所以`不能存敏感数据`，而且在生成之后不能被修改，只能重新创建；
- jwt 更适合做单点登录的场景

### jwt 存 cookie 和 local storage 区别

- 存 cookie 方便子域之间共享
- 放 local storage 容易遭受 xss 攻击和 csrf 攻击，放 cookie 可以通过设置 httpOnly 和 sameSite 进行预防
- 在需要清理时，如果存 local storage 则在前端清理掉就可以，cookie 的话需要通过一次请求，在服务器中进行 cookie 的清除
- 如果 cookie 大小不足，也可以选择放 local storage

[JSON Web Token 入门教程](https://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html)

## 单点登录（sso）

- 单点登录就是通过在一个认证服务器上完成登录，拿到认证信息，并通过认证信息访问子系统上受限的资源
- 实现单点登录有以下几种模式
  - `session + cookie 模式`
    - 在认证中心完成登录，把 sessionid 存到 cookie 上，让用户带到子系统去，子系统通过与认证中心交互，验证这个 sessionid 是否有效
    - 缺点
      - 需要有共同的父域，不够灵活
      - 认证中心需要维护大量的 session 会话
      - 子系统和认证系统需要频繁的交互，造成资源浪费
  - `单 token 模式`
    - 在认证中心完成登录，给用户返回一个 token，用户保存到本地，然后在访问子系统时带上，子系统判断 token 有效性（不需要认证中心）
      - 缺点
        - 认证中心失去了对用户的控制
  - `双 token 模式`
    - 用户重定向到认证中心，用户输入账号密码完成登陆，认证服务器返回两个 token（access_token 和 refresh_token）
    - 通过 access_token 获取子应用的受限资源
    - access_token 存在的时间比较短，当失效时通过 refresh_token 跟认证服务器交互，获取新的 access_token
    - 这样认证中心可以对 token 有一定的控制，而且也没有太多的内存和 cpu 损耗

[什么是单点登录？](https://github.com/febobo/web-interview/issues/91)

## 前端路由实现方案

- 使用前端路由的好处就是可以提高用户体验，在 url 变更后，不需要重新刷新页面，前端路由是 SPA 单页应用实现的重要环节
- 主要实现方案有三种，hash 模式、history 模式和 memory 模式
- `hash模式`
  - 通过 url hash（#号）来进行页面跳转，在改变#号后面的内容时，页面不会重新加载
    - location.hash/location.href 均可触发事件
  - 通过监听 `window.onhashchange` 事件，监听 url 的 hash 变化，从而触发组件的更新
- `history模式`
  - 通过 `history.pushState`/`history.replaceState` 进行页面的跳转
    - 这两个方法没有对应的事件监听，需要的话要自己手动实现。history 模式还需要后端配置，要把一些访问请求指向同一个静态 html 上，不然可能会有 404 的问题
  - 通过监听 `window.popState` 事件，监听浏览器的前进后退操作（history.go/back/forward），触发组件更新
- `memory模式`
  - 实现不依赖 url 的变化，把路由信息存到内存或者硬盘上，通过 location.localStorage 或者一些对象封装用法，memory 的应用场景相对于 hash 或 history 场景小一些，适合在一个主机内运行的场景

## 移动端页面适配方案

- pc 情况下，在高分辨率（2k、4k），如果屏幕尺寸一样，1px 的 css 像素是一样的，只是设备像素比不一样
- 设备像素比越高越清晰，图片需要根据这个设备像素比来调整，不然低分辨率在高 dpr 的设备上会显示模糊
- `静态布局`
  - 单位：px
  - 优点：设计简单
  - 缺点：不同尺寸屏幕的兼容性不好
- `流式布局`
  - 百分比
    - 整体利用页面空间，整体布局变化不大
- `自适应布局`
  - 不同分辨率，元素位置变化大小不变
- `弹性布局`
  - flex
  - grid
- `响应式布局`
  - 一套代码兼容多个平台
  - 实现方式
    - @media 媒体查询
      - @media screen and (max-width 768px)
    - 使用 rem 单位 + 弹性布局
      - 根据根节点的 font-size 来确定大小值
      - 只做宽度自适应，高度没有适应
      - 要在 html 头部加入一段 js 代码
      - font-size：设备宽度/设计稿宽度（750）px
      - 引入 postcss-px2rem 库，在开发时可以直接根据设计稿大小来直接设置 px，编译的时候会自动编译成 rem
    - [flexible](https://github.com/amfe/lib-flexible)（已过时）
      - 根据屏幕宽度动态计算 font-size 的值，把视口分成 10 等份，单位使用 rem
      - 优点：兼容性好
      - 缺点：不同 dpr 设备上显示有差异，在高分辨率下字体很大不协调
      - 模拟 viewport 功能，使用 viewport 代替
    - 使用 viewport 视口单位 vw/vh
      - vw/vh 基于视口（把视口宽度/高度分成 100 份）
      - 使用该方法可以规避 1px 问题
      - 通过 vmin/vmax 来做横竖屏适配
      - 引入 postcss-px-to-viewport 库，px 自动转 vw/vh
    - 小程序 rpx（把屏幕宽度分成 750 份）
- h5 适配主要使用了 rem+弹性布局 的方案来完成适配

[移动端法门：自适应方案和高清方案](https://www.51cto.com/article/706632.html)  
[2022 年移动端适配方案指南](https://juejin.cn/post/7046169975706353701#heading-0)

### retina 屏 1px 问题

- 原因：现在的很多设备分辨率都很高，因此一个逻辑像素会对应多个物理像素，由于设备 dpr（设备像素比）的不同，1px 在高 dpr 的设备上会显示得粗一些
- 解决办法
  - 直接使用 0.5px 像素（兼容性差）
  - transform: scale + 伪类（推荐）
  - 根据设备 dpr，设置 viewport meta 上的 scale 属性（推荐，一劳永逸，项目上使用的话直接写 1px 就可以，其他需要缩放使用 rem 单位）
  - 图片代替
  - box-shadow 模拟

## 前端 seo 优化

- 主要是设置好`tdk`
  - tittle（标题）、description（描述）、keywords（关键词）
  - 选择时，从相关性、竞争程度、搜索量这几个因素考虑
  - 通过`谷歌趋势`（Google Trends）、`百度指数`查看关键词的被搜索情况
  - 在选择关键词时，避免选择过于热门、竞争激烈的关键词，可以选择一些搜索量适中、竞争较小的关键词，并且能精确表示网站的词
- 保持页面结构清晰，使用`语义化标签`
- 优化 html `首屏渲染`，使用 SSR 技术等
- 简洁的网站结构便于`爬虫`
- 重要的内容不要用 js 输出，也尽量少使用 iframe，因为搜索引擎爬虫不会去读这些东西

## 常见的换肤解决方案

- 前端换肤主要是通过利用 js 动态地切换 css 样式，切换 css 样式方式可以是动态地改变标签的属性值或者 className（类名）
- 常见的实现方式有
  - `样式覆盖`
    - 主要是利用 css 样式优先级去完成样式的切换，但是这种写法每新增一种皮肤就会产生大量冗余的样式代码，维护成本非常的高
  - `sass变量`、`less变量`
    - 主要的原理就是通过设置一些公共的属性，然后动态地写入到对应的样式表中，这样在我们新增皮肤时就只需要新增这些公共定义的属性值就可以，相比上面大量冗余的样式代码要好维护的多。在定义好 sass 变量、less 变量后，通过他们的预编译服务进行转换，转换成 css 代码嵌入到 html 中使用
  - `css变量`
    - 这种方式的执行原理跟`sass变量`或者`less变量`差不多，也是定义一些公共的属性然后动态地传入，但是他是原生属性，不需要预编译，直接写浏览器是支持的，`css变量`在某些场景下比`sass变量`他们更好用(比如在媒体查询中 sass 变量无法重新定义)，但可能一些旧的浏览器会有兼容性问题，可以通过引 css-vars-ponyfill 库进行解决
- 对于换肤的实现方案上，面对有非常多的皮肤的情况，如果都存在一个文件上的代码就会非常大，维护起来就会比较麻烦，那我们可以通过`不同的皮肤以不同的文件名称命名`，然后通过 js 动态地加载进来
- 针对一些`资源`(比如图片)需要换肤的场景，我们可以通过上面这种特定皮肤文件命名方式，然后通过 js 动态地引入进来

?>
[前端换肤的 N 种方案，请收下](https://juejin.cn/post/6844904122643120141#heading-6)

## css 样式隔离方案

- css 样式隔离主要是解决 css 只有全局作用域、样式冲突问题
- css 样式隔离现在常见的方案有以下几种：
  - `命名规范`
    - 避免样式冲突的问题，代表：BEM 规范(block、element、modifier)，维护成本高
  - `css modules`
    - 通过编译的手段把类名转换成全局唯一的类名
    - 然后在使用时通过`对象访问的方式`（styles.xx）来使用这些样式
    - 存在问题
      - 需要定义额外的样式文件，容易出现删除时删不干净的情况
      - 可读性不太好
  - `scoped css`
    - vue 通过 vue-loader 实现的`scoped`隔离方案，在编译时，给组件上每一个标签添加一个唯一的 scopedId 属性，并且以这个 id 属性给样式注入属性选择器[data-v-xxxx]，两者配合下做到样式隔离（scoped 中的/deep/用法，主要是可以把属性选择器不设在嵌套样式的最后一层，而是提前在某一层中设置，然后就可以控制子组件中的样式）
  - `css in js`
    - 通过 js 的方式来管理 css，`css in js`的方案是在 js 实际运行时`动态`地解析生成样式，生成唯一的标识，并且把唯一标识注入到组件的元素的 class 类名上，然后通过 style 标签的方式动态地把样式表插入到 html 的 head 头标签中去生效。跟 css module 的方案比的话性能可能会略差一些，但是在灵活度和使用体验上要比 css modules 方案好，css in js 的解决方案有：styled-components（使用时通过`标签模板`写法进行调用以及传递变量方法）
    - 好处
      - 在代码组织方面，可以让 css 代码和 js 代码写到一块去，更符合组件化开发的思想
      - 不需要额外的样式文件，更容易维护，避免成为遗留的垃圾文件
      - 也可以不需要内敛样式（inline styles）的方式来完成样式的自定义
      - 学习成本相对来说低一点点，他可以配合 js 的语法，实现更灵活的样式，css modules 会有很多高级的用法
    - 坏处
      因为是运行时创建的样式，性能方面比起编译时生成方式，要逊色一些
    - StyleX 同时支持运行时和编译时，如果有一些变量输入的话是运行时的，一些是静态的代码是放到编译的时候生成，性能上是有一些提升的
      - 目前使用 styled-component 也没有特别大的性能瓶颈，或许再等他成熟一点
  - `原子化css`
    - tailwind、unocss
    - 预设大量可复用的 css 样式
    - 不适合太多个性化样式的项目，适合 CMS 后台，不适合 C 端应用
  - `shadow dom`
    - 是 web Components 中的一员，浏览器原生支持，创建一个不受外界干扰的 dom 树，样式只会有 shadow dom 里面的元素生效。但由于这种隔离特性，有些全局弹窗的场景会不太适用

?>
[基于 iframe 的全新微前端方案](https://cloud.tencent.com/developer/article/1919034)
[手写 Css-Modules 来深入理解它的原理](https://www.51cto.com/article/707429.html)  
[深度探索 styled-components 工作原理](https://zhuanlan.zhihu.com/p/336348713)

## 微前端方案选型

- 解决`巨石应用`问题，把巨石应用`拆分`成多个小应用，每个小应用`独立`开发和部署
- 微前端主要解决`css 隔离`、`js 隔离`以及`通信`问题
- 现在市面上也有许多微前端解决方案可以选择，比如 qiankun（阿里）、micro-app（京东）、garfish（字节）、wujie（腾讯）、EMP（欢聚）等等
  - [qiankun](https://www.npmjs.com/package/qiankun)
    - 基于 `single-spa`的二次封装，single-spa 提供了`路由`以及`子应用入口`方法，qiankun 在此基础上实现了 css 隔离、js 隔离、通信以及资源预加载等功能
  - [wujie](https://www.npmjs.com/package/wujie)
    - 基于 `webComponent` + `iframe`
      - 通过 shadow dom 做样式隔离
      - js 放在 iframe 中运行，实现了子应用 window、document、location、history 的完全解耦和隔离
      - 底层采用 proxy + Object.defineproperty 的方式对 iframe 中对 dom 操作代理挟持
    - 优点
      - 接入成本低，开箱即用，没有 qiankun 那么多问题要手动解决（支持 vite）
      - 代码入侵性也少
  - `iframe`
    - 优点
      - `简单易用`，无需特殊配置就能原封不动地嵌入到页面中
      - `隔离方便`，通过 iframe 做到 css、js 和 dom 的完全隔离
      - `多应用激活`，页面上可以摆放多个 iframe 来组合业务
    - 缺点
      - `dom的隔离严重`，弹窗只能在 iframe 内部展示，无法覆盖全局
      - `通信困难`，通过 postmessage 通信（序列化、异步、兼容性）
      - `路由状态丢失`，刷新一下，iframe 的 url 状态就丢失了（不保活）
      - `浏览器前进后退状态丢失`，iframe 会被刷新重置
      - `没有保活机制`，子应用重新载入时要重新读取文件
      - `白屏时间太长`，对于 SPA 应用应用来说无法接受
      - `用户体验不好`，滚动条等外观问题要处理
      - 不利于 `seo`
      - `抢占下载资源`（主页面），阻塞主页面的 onload 事件，与主页面共享连接池，影响主页面资源的下载
  - [micro-app](https://www.npmjs.com/package/@micro-zoe/micro-app)
    - 基于 `webComponent`（自定义元素、shadow dom、html 模板），对于不支持 webComponent 没有降级处理
  - [emp](https://www.npmjs.com/package/@efox/emp)
    - 基于 webpack5 的`module federation`（模块联邦，提供跨项目共享模块的能力）
    - css 隔离和 js 隔离自己通过第三方实现
    - 优点：去中心化，不需要基座
    - 缺点：对 webpack 强依赖
  - [garfish](https://www.npmjs.com/package/garfish)
    - 基于 `shadow down` + 快照/proxy
  - 下载量
    - qiankun(11110)
    - micro-app(2649)
    - garfish(783)
    - wujie(687)
    - emp(47)
- 每个框架各有特色，但从原理上看用到的技术点都差不多
- 出于对团队技术栈、社区生态、学习成本考虑，还是选择 qiankun 比较好

[将微前端做到极致](https://zhuanlan.zhihu.com/p/551206945)

### qiankun 原理

- 介绍
  - qiankun 是一个基于 `single-spa` 二次封装的微前端库
  - single-spa 提供了`路由`和`子应用入口`(暴露三个方法：初始化、挂载和卸载)的加载方式
  - qiankun 在此基础上实现了 `css 隔离`、`js 隔离`、`通信`、`资源预加载`等功能
    - `css 隔离`
      - 类似 scoped（实验性）
      - shadow dom（严格模式）
        - react17
    - `js 沙箱`
      - 通过 function 给子应用的 js 代码包了一层，代码跑在一个单独的作用域里面完成隔离
      - 然后对 window 隔离，采用了不同的方式
        - `LegacySandbox`（单例代理沙箱）
          - 单例模式直接代理了原生 window 对象，记录原生 window 对象的增删改查，原理跟快照沙箱差不多，只是不用对属性进行 diff，性能相对更好一些，但是不支持多个子应用运行
        - `ProxySandbox`（多实例代理沙箱）
          - 给每个子应用创建 fakeWindow 对象，然后通过代码的方式，增删改都在 fakewindow 对象上做，不影响最外层的 window，从而保证多个实例之间属性互不影响
        - `SnapshotSandbox`（快照沙箱 降级方案）
          - 在激活子应用时，记录 window
          - 在子应用失活时，还原 window，以及保存子应用对 window 的修改，在下一次子应用激活时添加回去
    - `通信`
      - actions（通过 initGlobalState，是一个观察者模式）
      - props
      - vuex/redux
      - storage（持久化）
    - `路由`
      - 通过监听 hashchange 事件
      - 监听 popstate 事件
    - `资源预加载`
      - 通过在浏览器空闲时触发 requestIdleCallback 回调，通过 fetch 方法请求资源（手动模式通过 prefetchApps 触发，路由监听模式通过在 start 时传入 prefetch 属性触发）
- 加载方式
  - 在加载子应用时，qiankun 以 html 作为入口，通过正则的方式分析整个 html 结构，加载其中所需的外部资源并完成子应用渲染，并默认以最后一个 script 标签来寻找生命周期函数。（js entry 是通过 js 方式加载所有静态资源，缺点是所有资源都打包到一个 js 上，无法进行分离）
- 如何运行
  - qiankun 有`两种运行模式`，路由监听（registerMicroApps+start）和手动渲染（loadMicroApp），路由监听只支持同一时间运行一个子应用，手动渲染模式支持同时运行多个子应用
- 缺点
  - 复杂度增高，对项目代码有一定的侵入性修改
  - 部分场景的样式问题，比如弹窗的场景：弹窗挂到 body 上样式会丢失需要手动解决
- 解决 qiankun 问题
  - `不支持vite`
    - 原因：vite 加载模块代码是以 import 原生语法来做的，qiankun 加载子应用的时候会包一层函数来执行，这样 import 在函数里面执行就会报错，因此不支持，需要把 import 语法变成异步导入的方式
    - 子应用引入 vite-plugin-qiankun 插件来解决
  - `弹窗样式失效`
    - 解决方式：
      - 改写 document.body 的 appendChild 方法， 把弹窗添加到子应用的 shadow dom 根节点上
      - 使用 qiankun 提供的实验性 api，但会出现全局样式污染
      - 关闭样式隔离，但是会出现全局样式污染
      - 设置行内样式
  - `找不到子应用入口`
    - 原因
      - script 标签配 entry 属性
      - body 最底的 script 标签不是入口文件，没有找到那些入口方法
      - window 上也没有子应用的入口代码
    - 解决方式
      - 通过在 webpack 的 output 配置中设置 libraryTarget 为 umd，把入口内容挂载到 window 上
    - 详细说明
      - 找不到入口的原因是在 webpack4 的时候，入口 script 会放到 body 的最底部，webpack5 默认情况下会把 script 放到 head 上并设置 defer 属性进行加载，而 qiankun 找子应用入口的兜底逻辑是从子应用的 html 最底部的 script 找入口函数，因为 webpack5 最底的 script 不是入口文件而导致找不到入口的情况，因此我们可以通过在 htmlwebpackplugin 插件上设置 inject 等于 body 属性，让入口 script 插到底部，但是不能完全保证入口文件在 body 的底部，因此我们还可以利用 qiankun 从 window 上找入口的机制，通过对 webpack 进行设置来实现，就是对 webpack 的 output 属性上的 library 设置成项目的名称，以及 libraryTarget 设置成 umd，把包打包成 umd 包，通过 umd 包加载的方式来解决问题
  - `内存泄漏`
    - 由于父组件的更新导致子应用不断地重复实例化，然后又没有及时地手动销毁子应用实例，导致内存泄漏，在组件销毁时要及时地在 unmount 钩子函数里销毁实例
  - `沙箱逃逸`
    - `window.addEventListener`，设置监听函数
    - `window.parent`，可以在沙箱的执行上下文中通过该方法拿到外层的全局对象
    - `原型链`，通过某个变量的原型链向上查找，从而达到篡改全局对象的目的（obj.constructor.prototype.toString）
    - `Symbol.unscopables`，设置了 true 会对 with 进行无视，沿着作用域进行向上查找
  - `开发时热更新失效`
    - 域名指向了基座应用，需要手动配置 web socket 的 hostname 指向子应用的域名，默认不配置会指向到主应用的域名去，导致热更新失效
  - `资源 404`
    - 动态载入的脚本、样式、图片等地址不正确，没有指向子应用而指向了主应用
    - 在子应用入口代码处，通过 qiankun 初始化时注入的`__INJECTED_PUBLIC_PATH_BY_QIANKUN__`字段
    - 通过在子应用的入口代码附近加入以下代码：`__webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;`
    - 代码运行时会自动加上`__webpack_public_path__`指向的前缀
  - `跨域`
    - 在子应用中配置跨域请求头(cors)
  - react 批更新失效
    - 误以为 executionContext 是 BatchContext，flushSyncCallbackQueue 导致同步更新
    - react18 以下通过 unstable_batchedUpdates 手动强制触发批量更新
- 其他问题
  - qiankun 默认情况下不支持 vite 作为子应用(不支持设置 publicPath)，需要通过 vite-plugin-qiankun 插件支持
  - esm 模块导出下， js 隔离失效，window 始终指向全局的 window 不是沙盒的 window
  - 如果需要区分微应用加载还是正常模式加载，可以通过 qiankun 在 window 上注入的 `__POWERED_BY_QIANKUN__` 属性来判断

[彻底解决 qiankun 找不到入口的问题](https://juejin.cn/post/7137511561161080845)

### qiankun 寻找入口的方式

- 带有 entry 属性的 script
- 以最后一个 script 作为入口
- 在 window 上寻找入口(`window[library]`)，要微应用的 name 和 webpack 的 output.library 设为一致

## 多种状态库选型

- 使用状态库就是为了`解决状态统一管理`的问题
- 据我了解，目前的状态库可以分成四类：`单向数据流`（代表：context、redux、zustand）、`响应式`（mobx、pinia、vuex）、`原子化`（recoil、jotai）、`状态机`（xstate）不同的状态库有不同的特点
  - [context](https://zh-hans.react.dev/learn/passing-data-deeply-with-context)
    - 使用
      - class: createContext + .Provider + .Consumer/(static contextType + this.context)
      - hooks: createContext + .Provider + useContext
    - [`原理`](https://segmentfault.com/a/1190000043479062#item-4-5)
      - 通过 createContext `创建` context 对象
      - 通过 context 的 Provider 方法接收一个 value 属性，赋值到 `context._currentValue` 上
      - 通过 Consumer 或者 useContext 去`消费` value 属性并把 context 添加到当前 fiber 的 dependencies 上，便于后续 value 发生变化时找到消费组件，标记 lane，执行重渲染逻辑
    - 优点
      - 简单易用，适合数据结构简单的业务场景
      - 适合做一些简单的跨组件通信
    - 缺点
      - 不能只消费 value 中部分的值，只要消费了 context 对象就一定会发生重渲染。（如果只想消费部分值则应该把 value 拆分成多个 Context）
      - Provider 嵌套地狱
      - 没有中间件机制和时间回溯功能，能用但不完美
  - [redux](https://www.redux.org.cn/)
    - 使用
      - class: createStore(reducer, initialState) + Provider + connect（订阅 store，根据 mapStateToProps 返回值决定重渲染）
      - hooks: createStore(reducer, initialState) + Provider + useSelector（订阅 store，根据返回值决定重渲染） + useDispatch
      - `combineReducers` 对 reducer 进行拆解与组合，当 dispatch 时所有的 reducer 都会走一遍
    - 原理
      - `累加器`+`订阅发布模式`实现
      - 首先创建一个 store，通过 dispatch 触发 action，把 action 提交到 reducer 中，通过`累加器`的方式逐一遍历多个 reducer，根据 action type 来返回新的 store（immutable 每次都产生不可变数据）
      - 当 store 中的数据发生变化时，通过`发布-订阅模式`触发订阅的组件重渲染
      - 在使用中，通过 context 下发 store 数据，子组件通过 connect(mapStateToProps, mapDispatchToProps)(MyComponent) 高阶组件或 useSelector 对 store 数据进行获取和订阅（组件挂载时订阅、卸载时取消订阅），当数据发生变化时触发视图更新
      - redux 默认只支持同步调用，通过 middleware 中间件来实现异步
      - [Redux 源码解析，从 0 到 1](https://zhuanlan.zhihu.com/p/390599207)
    - 优点
      - `单向数据流`（flux 设计思想）
      - `不可变数据结构`，状态可预测
      - 支持`时间旅行`，方便调试
      - 可以通过`中间件机制`扩展，比如：异步、日志、时间旅行(Redux DevTools)
      - 适合中大型复杂应用开发
    - 缺点
      - 配置比较复杂，概念比较多，学习成本高
    - 相关库
      - `redux-thunk`
        - redux 推出的一个异步解决方案，通过 redux 的中间件（middleware）扩展 dispatch 的能力，
        - 原理：在原 dispatch 基础封装了一层，重写 redux 的 dispatch 方法，让 dispatch 可以支持接收一个函数，在函数内执行异步的逻辑
        - 好处
          - 异步逻辑和状态管理更集中，获取和存储 redux 的数据统一放到 thunk 函数中处理，代替原来在组件上做异步操作（异步请求），让异步代码跟组件解耦
            - 让异步代码放到 thunk 函数中处理，并且在函数中 dispatch 不同的 action
            - 在 thunk 函数中也可以方便地拿到 store 数据处理，不需要外部传入
      - `redux-saga`
        - 使用 generator 写法，适应更复杂的异步场景
        - 通过大量副作用 api：call、pull、takeEvery、takeLatest 来管理异步任务
        - Redux-saga 提供了强大的流程控制工具，可以方便地处理复杂的异步流程，如并发、竞态条件、取消请求等
      - [`redux-toolkit`](https://cn.redux.js.org/redux-toolkit/overview)
        - redux 官方推荐的开发工具库，简化配置优化体验，集成 thunk（异步）、query（请求、缓存）、immer（已内置，可以更方便地处理不可变数据，只改变必要的属性，减少不必要的重渲染）
        - configureStore createSlice createAsyncThunk createSelector createEntityAdapter
        - 对比：`Dva` （单向数据流、model（类似 toolkit 的 slice 用法）、router 封装）（现在也处于不维护状态了，最后一个正式包也停在了 2019 年）
      - [`redux-toolkit-query`](https://redux-toolkit.js.org/rtk-query/overview)
        - 开箱即用，集成了数据获取、缓存、状态管理，简化异步数据处理
        - 优点：适合面向 C 端的复杂交互场景
        - 与 react-query 对比，react-query 专注于数据请求，rtkq 管理状态和数据请求
        - RTK query 没有设置过期时间的配置，react-query 才有，不过 rtkq 也有个缓存过期自动清除的机制，react-query 能设置这个时间，rtkq 不能
  - [zustand](https://www.npmjs.com/package/zustand)
    - 使用
      - create(({set,get})=>{todos}) 通过 set 触发更新
      - 在子组件中使用 useStore 自带 selector 和 shallow 比较
    - 原理
      - 跟 redux 很像，都是单向数据流、数据不可变
    - 优点
      - 不需要提供 context、connect、provider，对业务的侵入小
      - 没有 action、reducer 复杂的概念
      - 支持多 store
      - 全面拥抱 hooks、函数式、ts
    - 缺点
      - 不支持 class 组件，需要通过高阶组件封装
      - 没有基于 reducer 更新数据，通过更灵活的方式实现
      - 整体生态还不够完善
  - [mobx](https://npmjs.com/package/mobx)
    - 使用
      - 定义一个类 class 包装，通过 observable 把属性变成可观察属性，通过 action 把方法标记动作方法，通过 computed 标记派生属性，通过 observer 把组件变成响应式组件
    - 原理
      - 数据可变
      - `响应式`（Object.defineProperty、Proxy，MVVM 思想）
    - 优点
      - 代码相对 redux 更简洁
      - `装饰器语法`
      - 精确更新，性能更好
      - 直接支持异步
      - 支持多 store 管理
    - 缺点
      - 多 store 之间数据联动处理起来会比较麻烦
      - 状态更新自由，不够直观，项目复杂之后较混乱不好维护
      - 由于数据可变模型，状态难回溯，不便于调试，与 react 的设计思想相反
  - [pinia](https://www.npmjs.com/package/pinia)
    - 使用
      - createPinia defineStore useStore
    - 原理
      - 单向数据流
      - 基于数据可变
      - 响应式
    - 优点
      - `去除 mutation`，只有 state，getters，actions；action 支持同步异步
      - 简单易用上手快，完美支持 ts 和 vue3
      - 支持多 store
    - 缺点
      - 暂不支持时间旅行和编辑功能
  - [recoil](https://www.npmjs.com/package/recoil)
    - 使用
      - recoilRoot（支持多个） 、atom、selector
      - useRecoilState(读/写)，useRecoilValue(读)，useSetRecoilState(写)
    - 原理
      - atom 原子化
      - flux 思想
      - 订阅发布模式
      - 一个与 react 正交的树（recoil tree）
    - 优点
      - `不需要考虑 store 的结构组织`
      - `读写分离`
      - 精确更新组件
      - Facebook 旗下的工作室出品
  - [jotai](https://www.npmjs.com/package/jotai)
    - 使用
      - Provider atom（多个共享）
      - useAtom(读/写)，useAtomValue(读)，useSetAtom(写)
    - 原理
      - 发布订阅 + weakmap 存储
      - atom 原子化
    - 优点
      - recoil 的简化版
        - Atom + Hook + Context
      - 支持多个 atom 组合派生新的 atom
  - [xstate](https://www.npmjs.com/package/xstate)
    - 使用
      - createMachine useMachine context/action/send
    - 原理
      - 基于`有限状态机`(状态模式)，针对状态进行封装，暴露行为。使用者不需要感知状态的变化
    - 优点
      - `状态驱动`
      - 微软出品
    - 缺点
      - 复杂，上手难度大（状态机概念多）
      - 自行封装 context，完成组件间共享状态
- 出于对`团队技术栈`、`维护成本`、`学习成本`考虑，还是优先选择 redux 和 mobx，其他库虽然都有自己的亮点，还不是很稳定，使用的人也不多，出了问题不好解决
- 我们团队中的项目主要还是以 redux 为主，redux 支持中间件、时间旅行，而且社区非常活跃，生态完善、 npm 下载量最多，即使遇到问题也能更好定位和快速解决

['一文带你全面体验八种状态管理库'](https://juejin.cn/post/7197309324275318843?searchId=2023082215440523A5C8544A78CD6351E8#heading-6)
[React Query 原理与设计](https://juejin.cn/post/7169515109172609032#heading-6)

## 如何在项目中封装组件

- `根据功能划分不同的组件`，公共组件、业务组件、页面组件，分别放入不同的文件目录进行管理
  - 公共组件，主要放一些与业务无关，比较通用基础的组件，比如表单、列表、轮播图、文件上传、excel 导入导出等等
  - 业务组件，存放一些与业务相关但会在多个页面组件中使用的组件
  - 页面组件，页面进来时主要渲染的组件
- 在组件的开发中，要`定义 props 入参以及 types 类型检测`，在组件中定义好需要接收的参数，并对入参做差错判断，以及考虑好组件的扩展问题和性能问题
- 针对公共组件的开发，可以`使用工具协助开发调试`
  - react-styleguidist（我司）
  - storybook
  - vitepress
  - dumi
- 针对公共组件和业务组件`撰写使用README.md`文件，列出功能点以及用例说明，`方便协作`
- 业务组件一般从公共组件中进行继承，页面组件又是从业务组件那继承使用，尽量地把组件复用起来，`减少冗余代码`
- 写单元测试，确保稳定性
  - jest
- 最后发布上线，投入使用

## 大文件上传下载方案

- `上传`
  - 大文件的上传中，如果文件很大，上传会非常的缓慢，而且还存在中途中断前功尽弃的问题，所以我们可以使用分片上传的方式，把中断的影响降到最低。
  - 首先我们上传文件前，先通过在页面中设置 type 为 file 的 input 标签接收一个文件，监听 onchange 事件，获取 file 对象，然后`通过 file 对象上的 slice 方法`对文件进行切割产生多个`二进制数据`，然后通过浏览器的 XMLHttpRequest 或者 fetch 方法上传到后台，在后台完成拼接处理。以上就是大文件`分片上传`的一些细节。
  - 大文件的`断点续传`实现，主要是通过后端返回已有的切片名称列表进行区分。在前端上传切片前，先通过一个接口请求获取后端已有的切片名称数组，前端根据这份名单过滤掉已经上传的切片，然后上传剩下未上传的切片。（前端如果需要中断的话可以采用 xhr 实例上的 abort 方法进行中断）
  - 大文件的`秒传`实现，主要是通过把文件的唯一 hash 值实现，把这个文件 hash 值告诉后端，后端如果能通过这个文件 hash 找到已存在的文件，则 UI 上直接显示上传成功的状态就可以，这样就可以实现秒传功能。
  - 在开发文件上传时遇到两个问题
    - 第一个是如果文件特别大，计算文件的 hash 会非常缓慢，如果放在主线程上执行会非常耗时，因此通过`web worker`开启多个子线程去计算文件的 hash 值，当计算完成后通过 postmessage 再把 hash 传回来，就能很好地解决主线程阻塞的问题。
    - 第二点是在服务器合并分片的时候，如果采用 Buffer 缓存区的方式进行文件读写的话会消耗大量的内存，而且还可能出现内存泄漏等问题，因此我采用`stream`流的方式一段一段地读取文件数据进行合并，以此来解决一次过读取文件带来的问题。
- `下载`
  - 面对大文件下载的场景，我们可以采取以下的措施
  - 第一个是我们可以对文件进行`压缩`并采用 gzip 进行传输
  - 当文件压缩后还是很大，我们就可以采用第二种措施，使用`chunked分块传输`的方式进行请求（transfer-encoding: chunked）
  - 但 chunked 分块传输会存在中途中断就无法恢复的问题，我们可以采取`range范围请求`的方式进行传输，range 不仅支持断点续传，还支持多重范围请求让客户端可以并行地请求多段数据（通过 content-range: bytes start-end/size）

[字节跳动面试官：请你实现一个大文件上传和断点续传](https://juejin.cn/post/6844904046436843527)
[大文件合并方式]()https://www.cnblogs.com/goloving/p/12825973.html

## 长列表渲染方案

- 对于长列表渲染的场景，我们一般情况下都会采用`分页`的手动来解决，但是随着加载的数据越来越多，卡顿会越来越明显，特别是在性能比较差的电脑上
- 因此我们可以使用虚拟列表`按需加载`的方式对长列表渲染进行优化
- 虚拟列表的实现是通过`只渲染可视区`内的元素，不渲染可视区外的元素
- 在实现上，我们定义了`三个区域`：可视区、占位区、渲染区
- 根据每一项高度计算占位区的总高度，让可视区产生`滚动条`，然后通过监听可视区的`onscroll`事件，根据 scrollTop / getBoundingClientRect 的值，计算渲染区内数据的`开始索引`、`结束索引`以及`向上偏移量`，通过开始和结束索引计算要显示的数据，根据偏移量把渲染区挪到可视区内正确的显示位置
- 以上就实现了简单版的虚拟列表，但在我们实际开发中会遇到很多项目`高度不确定`的情况，因此我们要进一步优化实现
- 我们通过给每一项元素添加一个 `ResizeObserver` 实例进行监听，监听高度的变化然后把真实的高度覆盖到预设的高度上，并且我们还通过一个数组去保存每一项的`高度`和`位置`信息，这样方便我们后面进行对每一项的计算和重渲染，并且在找每一项高度位置信息时通过`二分法查找`（Ologn）进一步优化性能，以上就是对高度不确定情况的优化实现
- 针对虚拟列表快速滚动的`白屏`问题，我们可以通过对渲染区的上下边界多添加一些`缓存数据`或者使用`骨架屏`解决，使用缓存数据还是会存在一定的问题，使用骨架屏会牺牲一点点性能，但是带来的用户体验会更好

?>
时间分片：使用 setTimeOut/rAF 的方式一帧渲染一部分 dom，但也是只能解决第一次渲染时白屏卡顿的问题，但最终还是会渲染出大量的 dom 影响滚动的流畅问题

## CSR、SSG、SSR、ISR 区别

- `CSR` 客户端渲染（client side rendering）
  - 原理
    - 在基础 html 模板上，通过 js 动态地渲染页面，不利于 seo 以及首屏出现白屏
  - 好处
    - 适合复杂的多页面交互场景
- `SSG` 静态站点生成（预渲染）（static side generation）
  - 原理
    - 在构建阶段完成对 html 的拼接，输出静态 html 页面
  - 好处
    - 无需动态渲染
    - 维护成本低
  - 缺点
    - 不适合频繁的页面内容更新
  - 适用场景
    - 少量页面需要 seo
    - 内容不经常发生改变，对所有用户都只要展示一样内容的页面场景
- `SSR` 服务器渲染（server side rendering）
  - 原理
    - 在服务器上直接执行 js 代码，把 react、vue 等框架编写的组件渲染拼接成完整的 html，然后把这个已经包含所有初始状态数据并且已填充好内容的 HTML 交给客户端直接渲染
    - 因此在服务端完成了大部分的渲染工作，无需等待 js 下载解析再动态渲染页面，极大缩短白屏时间
  - 好处
    - 更短的白屏时间，更快的内容到达时间
    - 利于 seo
  - 坏处
    - 消耗服务器资源
    - 增加维护成本
  - 适用场景
    - 大量 SEO 场景
    - 需要展示一些动态数据的页面场景
  - 场景问题
    - `HTML 体积过大`
      - 流式渲染（基于流式传输 chunked 分片下载）（调用 renderToPipeableStream）
    - `注水脱水原理`
      - 脱水：在服务器环境上，让组件树转换成静态的 html 片段（调用 ReactDOMServer.renderToString），用于后续浏览器直接渲染
      - 注水：在浏览器环境复原整个组件树，把虚拟 dom 和已存在的真实 dom 节点关联起来，并且进行事件绑定（执行同构方法 ReactDOM.hydrate），恢复响应式交互功能
    - `同构原理`
      - 同一份（react）代码即运行在服务端，又运行在客户端，在服务端完成页面结构生成（脱水），在客户端绑定事件（注水）
- `ISR` 增量静态再生（增量式网站渲染）（increment static）
  - 在 SSG 的基础上，加入 server 的逻辑，当页面失效时，在后台重新生成静态页面，生产完全前先用旧的
- 相关工具库
  - puppeteer
    - 手动封装
  - nextjs
    - 不仅能做 ssr 也能做 spa
  - nuxtjs
  - umi
    - umi 更像一个业务框架，很多开箱即用的功能

### nuxtjs 服务器渲染（ssr）实现原理

- nuxtjs 是一个基于 vue 支持 SSG、SSR 构建的框架，在编译构建（打包）阶段，nuxtjs 生成两份代码，一份在服务器运行，一份在客户端运行，当用户访问页面时，服务器解析路由，查找对应的组件，通过服务器生成 html 文件返回，在客户端上通过 js 激活页面上的元素，通过 vue 接管 html 上的元素
  - asyncData 运行在构建静态页面或者服务器渲染，组件生成之前
  - 启动 SSG：npm run generate 构建静态页面
- 在开发 ssr 开发需要注意：
  - `部分语法`需要区分环境，比如 window，浏览器才有的语法，需要通过 nuxtjs 提供的 process.client 判断环境
  - `部分第三方依赖包`不支持 ssr，也需要区分环境，nuxtjs 提供<ClientOnly>组件进行包裹
  - `高流量访问`的问题，因为 ssr 是需要服务器支持的，所以会`给服务器带来一定的负荷`，需要做好负载均衡，以及可以采用容器化的技术比如 docker（k8s）去保证项目正常运行

## 接入腾讯云直播 sdk

- 工作内容
  - 通过 TXDeviceManager（设备）获取麦克风权限
  - 采集本地音频、视频流
  - 初始化 TXLivePusher，调用 startPush 推流
  - TXLivePusherObserver（监听事件）
  - TXAudioEffectManager（音频）
  - TXVideoEffectManager（视频）
- 遇到的问题及解决
  - 推流失败
  - 播放失败
  - 通过查阅腾讯的文档解决

[Web 推流流程](https://cloud.tencent.com/document/product/267/97826)  
[直播 SDK 接口文档](https://cloud.tencent.com/document/product/454/56498)  
[Web（TCPlayer）拉流](https://cloud.tencent.com/document/product/454/7503)  
[Web 推流 SDK API](https://cloud.tencent.com/document/product/267/92713)

## 多人房连麦场景分析

- 通过斗鱼 sdk 对接 [webRTC](https://webrtc.org/?hl=zh-cn) 服务，实现多人房连麦功能
- sdk 功能
  - 连麦（加入频道）
  - 调整音量大小
  - 静音、全频道静音
- 工作流程
  - 首先通过本地授权`采集`音频和视频流
  - 第二步`初始化`斗鱼`rtc_sdk`，创建 RTCPeerConnection 对象，接着通过信令服务器交换会话信息建立连接
  - 第三步加入`频道`，然后进行推流
  - 第四步听过监听，接收远端流合并到本地流的轨道中，完成`混流`
  - 最后下麦断流，离开频道
- 遇到的问题
  - 在斗鱼 sdk 没有提供监听声纹变化的方法，因此自己手动封装，在本地流中轮训计算不同用户的声纹变化，解决不能监听音量变化的问题，完成用户说话时，UI 头像出现波纹变化的需求
    - 通过 ScriptProcessorNode 监听 audio process event，处理接收的每一个声道每一个样本
    - 轮循不同的用户本地流读取声纹变化信息
    - MediaStream 一个媒体流，一个流包含多个轨道 MediaStreamTrack，如视频、音频轨道
      - [createScriptProcessor](https://developer.mozilla.org/zh-CN/docs/Web/API/BaseAudioContext/createScriptProcessor)

[JS 本地媒体流 合并、录制、下载/上传](https://juejin.cn/post/6844904120277532679#heading-3)  
[MediaStreamTrack](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaStreamTrack)  
[MediaStream](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaStream)

### 混流

- 把一个 stream 流上的轨道 addTrack 到另一个流上

### webRTC 场景分析

- Mesh 模式
  - p2p 端到端传输
  - 场景：适合少量用户场景
- Mixer 模式
  - 在服务器上混合多个用户的流成单个流再分发给用户
  - 场景：多人视频会议
- router 模式
  - 本地混流，服务器只做转发
  - 场景：多人连麦场景

[WebRTC 多人音视频聊天架构及实战](https://blog.csdn.net/zhanglei5415/article/details/122064773)  
[多人聊天室的 WebRTC 实现方案](https://blog.csdn.net/hekuinumberone/article/details/114666239)

### 其他问题

- [Function.name](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/name)

  - 仅在创建时指定名称，当在被重新赋值到某个对象属性下时 name 失效
    ```js
    const t = {};
    t.a = function (e) {};
    console.log(t.a.name); // 输出：''
    ```

function.name 仅在创建时有值，当被赋值到某个对象属性下时 name 失效（存在兼容性问题）
在 sdk 不支持声纹获取的情况（不支持 ws 拿用声纹变化和状态），从本地流提取其他用户的声音信息，通过浏览器原生暴露的方法

## 公共组件库开发

<!-- todo lzk -->

- 诉求：公司业务是一个面向 C 端的产品，现成的组件库不能完全满足我们的需求，需要自己进行封装，满足不同的 UI 需求和业务需求
- 参考业内方案：element-ui、ant-design
- 解决问题
  - 组件设计（表单、列表、弹窗、按钮、选择器、输入框、轮播、卡片等等）
    - 实现高内聚、低耦合的组件
      - 定义 props 入参
      - 做好 types 类型推导
      - 通信（满足单向数据流原则）
      - 样式
  - 调试
    - 创建 `README.md` 文件，列出功能点和使用样例
    - 引入 styleguidist 组件，根据 markdown 文件生成使用 demo 文档
      - 选择原因：对项目代码入侵小，配置少，使用简单
      - 组件库开发工具选型
        - [storybook](https://www.npmjs.com/package/storybook)
        - [react-styleguidist](https://www.npmjs.com/package/react-styleguidist)
        - [vitepress](https://www.npmjs.com/package/vitepress)
        - [dumi](https://www.npmjs.com/package/dumi)
        - [让编写组件不因文档发愁](https://juejin.cn/post/6948415815494418439)
  - 测试
    - 单元测试（jest），写测试用例，保证组件的质量和稳定
  - 发布
    - npm 私有化部署
  - 使用
    - 以 npm 模块包导入到项目中，然后通过按需引入的方式进行使用
    - 每个组件会有相应的使用文档和 demo，可以方便地参考使用
  - 维护
    - 版本迭代（考虑兼容性）

## 介绍一下你是如何做权限管理

- 权限管理包括前端和后端，如果只靠后端交互体验可能不够好，如果单靠前端不安全
  - 后端权限实现
    - 数据库设计：用户表、角色表、权限表（包含菜单、路由、接口、按钮权限信息）
    - 拦截每次请求，判断用户角色和权限，如果权限不足则不能访问相关的资源
  - 前端权限包括
    - 用户角色（游客、普通用户、普通管理员、超级管理员）
    - 权限控制
      - 菜单控制
      - 路由控制
        - 静态路由
          - 无需权限控制的路由
        - 动态路由
          - react
            - 通过 react-router-dom Switch 包囊，根据下发的路由来动态渲染 Route 组件
            - react 没有路由守卫，通过`手动封装` AuthRoute `高阶组件`来实现权限控制
          - vue
            - 通过 vue-router `addRoutes` 方法，动态添加路由
            - 通过路由守卫 route `beforeEach` 来做权限控制
      - 接口控制
      - 按钮控制
    - 拦截路由请求和接口请求，判断用户角色权限，如果没权限可以让用户重定向到登录页或者提示用户权限不足
    - 在每次请求时，如果是 session 机制则带上相关的 cookie 到后端去进行判断，如果是 token 机制则在 header 头上带过去给后端做权限判断

## 对 webpack 和 node 版本的一次升级工作

- 升级原因
  - `追求极致构建速度`，webpack5 提供的一些新特性对整个构建会带来一定的提升
  - `日后维护的考虑`，webpack4 已经停止维护了不利于后续维护，如果业务上用到一个库需要 webpack5 版本以上，那就没有办法支持了
- 在升级过程中主要解决以下问题
  - `各种依赖包的升级替换`
    - 逐一检查每个依赖包的 package.json 上的 peerDependencies 属性和 engines 属性来安装指定版本依赖包
      - 比如 node-sass，每个 node-sass 对应的 node 版本都不一样，需要安装指定的版本
    - 使用官方提供的依赖包替换第三方依赖包解决
  - webpack5 带来的`break change`，配置用法调整
    - 根据官方提供的`升级（迁移）指南`，来进行一步一步地调整代码解决
  - 还有一个比较`棘手`的问题：有个包太老旧没人维护而且不支持 webpack5，需要找平替的方案，同时要做好测试工作保证不影响现有功能的正常运行
    - serviceworker-webpack-plugin，用来做消息推送
- 最终通过 3 个星期的努力完成升级，`升级后`，直播平台的构建时间从 3 分多钟优化到 3 分钟以内
- 最后在完成这次升级工作后也做了一些`复盘`，就是我们项目上很多地方都没好单元测试工作，因此在做一些功能进行迭代升级时，是存在很大风险的，我们心里也没底，如果没有测试人员的配合我们也很难落地。因此考虑以后向核心模块`加入更多的单元测试`，这样不仅能`减少`测试人员的`人力成本投入`，保证功能稳定性，`降低`功能升级的`心智负担`（推进有难度，时间成本，对业务也要有一定的了解）
- 遗留问题
  - node 升级 18，但是`部署环境的系统不支持`，加上 `webpack4 也不支持 node17 版本以上`，那就先用着 node16 了
  - 部署环境上有几个系统依赖包不支持需要更新，但更新系统依赖包可能会导致系统崩溃，造成的严重后果
    - 报错 node: /lib/x86_64-linux-gnu/libc.so.6: version `GLIBC_2.28' not found (required by node)
  - webpack4 不支持高版本的 openSSL3.0（也不是不行，可以通过配置让 node 使用旧版 openssl 启动就可以）

### webpack 新特性

- 默认 tree shaking 启动、`持久化缓存`、`资源模块`、支持模块联邦等等特性

### node 新特性

- 内部使用更高版本的 `V8 引擎`、使用更高版本的 `OpenSSL 通信库`、内部`核心模块`的代码优化、以及`支持 esmodule` 写法、`支持 monorepo` 项管方式等等

### 升级时遇到的其他问题

- Husky6.0 一个 break change，低于 6 版本会安装所有的钩子方法，作者出于性能考虑放弃了直接在 package.json 上写配置
- @babel/preset-typescript 是没有 ts 类型检测的，因为 babel 会把 ts 直接转成 js 解析
- 在 esm 中使用 module.exports exports.xxx 语法报错，需要通过 babel 去转，尽量不要混用 esm 和 cjs
- 多个模块的循环引用问题，提取循环依赖的代码到另外的文件再分别引入，或者对部分代码延迟执行处理，对于一些并不影响项目正常运行的循环引用进行保留，通过配置 eslint 跳过循环引用检查
- 升级后导致 qiankun 找不到应用入口的问题，通过把 webpack 配置输出 umd 包配合 qiankun 的加载机制解决

## 热更新优化

- 卡顿现象
  - 100+ h5 活动页面，当我更新一个文件时，webpack 重新编译总是卡在 94%不动，需要等待 10 多秒才编译完成
- 分析手段
  - 通过 speed-measure-webpack-plugin 分析插件的耗时，发现 html-wepback-plugin 耗时非常高
  - 通过在启动命令中加入 --profile 命令，分析 asset optimization 耗时
- 根本原因
  - html-wepback-plugin 插件存在性能问题，多入口造成 webpack 的 emit 阶段钩子函数里的代码逻辑重复执行了多遍，没有做好缓存机制
  - 当某个 chunk 内的文件更新时，其他所有的 chunk 入口都会跟着改变，webpack 的 emit 阶段（chunk 分包构建时）代码都会重复执行一遍从而造成性能问题
- 优化措施
  - 通过`动态配置`的方式，只编译加载我想要开发的那个页面的模块文件
    - 弊端：在多人维护的场景下，极容易造成提交记录的冲突。（每个开发者更改自己的 config 配置，然后提交到 git 产生冲突）
  - `更换html插件`，使用 html-webpack-plugin-for-multihtml，但后来没维护了
    - 策略：优化 webpack 的 emit 阶段执行时间，主要增加了判断和缓存功能
    - 弊端：在 2019 年 6 月后已经停止维护，被 html-webpack-plugin 4 替代
  - （推荐）`升级 html-webpack-plugin 到版本4 以上`(2020 年发布)，版本 4 以上优化了本地开发时多页面的 HMR 热更新问题
    - 策略：让 emit 阶段代码仅执行一次
    - 成效：优化到 3 秒以内
  - 其他优化
    - 开发环境关闭 ts 检查
    - 在开发环境中，像分包策略插件、压缩插件、css 抽离插件这些插件可以关闭，这些优化手段会影响打包速度，可以生产时再打开
    - 把 sourcemap 设置成 cheap-module-eval-source-map，平衡调试和构建速度
    - 升级 webpack 版本或更换构建工具 vite、parcel（要考虑迁移成本）
      - vite：支持冷启动，不需要打包编译
      - parcel：以 html 作为入口编译的构建工作，parcel 编译时利用多核多线程
    - 使用更轻量的应用框架
      - svelte
      - solid

[html-webpack-plugin 4.x 对多模板下热重载缓慢问题的修复](https://juejin.cn/post/6844903961527336968#heading-7)
[Webpack 多页应用 HMR 卡住问题](https://juejin.cn/post/6844903828844707848)

## 需求复盘会

- 梳理从需求分析、设计、实现、测试以及上线后反馈等各环节进行回顾和总结的过程，通过复盘持续优化和改进
  - 确定需求复盘的目标和范围
  - 收集数据（需求变更次数、代码质量问题、线上用户反馈）
  - 梳理总结问题
  - 针对问题提出改进方案
  - 制定实施计划
  - 确保改进方案落地
  - 最终将复盘结果归档
- `提升开发效率`
  - 构建工具优化
    - 优化 webpack 编译（关闭 ts 检查）
    - 考虑使用 vite 替换 webpack
    - webpack 升级
    - h5 多页面项目开发卡顿问题
  - 封装公共组件
- `减少 bug 的产生`
  - 开会时会一起过一遍 jira 平台上面的 bug，问一下 bug 产生的原因，以及如何改进（需求理解不到位导致功能上出现问题）
  - 添加合适的单元测试和错误代码检查减少 bug 出现的可能
  - 增加 code review 频次
- `收集跨部门沟通问题`，减少沟通成本
  - 与产品
    - `需求不够清晰`（一句话、跟之前一样）
      - 新增一个新类型的礼物（聊天气泡、挂件）
    - 进入开发阶段`临时加需求、改需求`
      - 工作量没有超，酌情处理
      - 如果改动大，需要另外排期，可以把他放入下一个开发版本中做
      - 改进：以后开发就需要注意一些技术点，一些功能实现要预留扩展（比如有些按钮要做权限控制）
  - 与 UI 设计
    - 设计稿尺寸`标注`不清晰
    - `交互`效果不明确，只有文字描述，一句话概括
  - 与后端
    - `接口设计文档不清晰`（拒绝进入联调，向上反馈）
      - 接口字段定义不清晰、不够语义化、错别字（有的大小写，有的下划线）等问题
      - 接口结构变动
      - 枚举值定义不清晰
    - `前后端分工不明确增加工作量`
      - 后端没有做过滤和`分页`直接返回（数据没有过万，前端自己做分页）
      - 在一个需求里，希望一个`单独的接口`获取所有的数据，但后端觉得通过多个接口请求更合理，无疑增加了前端的复杂性
      - 一起玩功能，在用户付款后，通过前端`轮训`的方式去获取支付完成信息（改成 websocket 更合理）
      - 在 cms 场景中，让前端自己从列表中取数据跳转详情页（让前端自己组装数据带过去）
      - 异常处理，没有商量好错误信息格式和展示
    - `没有做好数据检验`，出了问题时相互甩锅
  - 与测试
    - p0 问题比较多
      - 写单元测试保证代码质量
      - 确保需求文档清晰，减少因需求理解偏差导致的严重问题
      - 增加 code review 频次
      - 提高开发人员技术水平和态度
    - 偶现问题难复现解决（录屏、增加打点）

### code review

- code review 代码评审主要提高代码质量
- 建议：项目负责人（一天 or 两天）一次、整个团队一周一次
- 好处
  - `提高代码质量`
    - 对于同一段业务代码，由于可能看待问题的角度不同，评审者可能会比开发者更容易发现其中的问题，或是找到更有效的解决方案
    - 然后对同一段代码，探讨更好的代码写法，比如能不能抽取一些公共的组件来减少重复性代码，或者使用一些设计模式去优化一些写法之类的
  - `统一代码规范`
  - `改善`早期时间紧迫设计`不合理`的功能
  - 团队成员相互间`快速了解业务`
    - 在别人没空处理或者离职的时候，也能快速地接手业务
- 坏处
  - 会影响开发进度，代码可能会出现反复更改的情况
  - 团队成员意愿不高

[关于 Code Review 的一些思考总结](https://zhuanlan.zhihu.com/p/64062570)

### 技术分享

- copilot 插件使用分享（AI 写代码，代码自动补全）
- 探讨新的构建工具 turbopack
- react18 新特性使用

## 从 0 到 1 搭建一个项目

- 全流程把控数据看板前端项目的落地
- 基于 mildom 项目组的运营人员和老板，希望可以有一个内部的可视化数据平台来直观地看运营数据，在这样的`项目背景`下，我承担起数据看板项目的主要搭建工作
- 首先从`项目立项`开始，跟其他部门同事开会讨论，确定需求目标
  - 梳理业务
  - 工时预估、排期
  - 设立开发里程碑
- `技术调研和技术选型`，选择合适的前端框架、可视化库、状态库和 UI 库
  - 当时选型 react+echarts+redux 状态库来进行系统搭建
  - 同时通过 monorepo 来同时管理 web 端和 h5 端项目
- `撰写技术设计文档`，梳理业务，合理`拆分功能模块`（基础模块、业务模块分别存放）
  - 架构设计
    - 整体架构图
      - 数据层
        - 前后端接口对接方式
        - 数据格式转换
        - 错误处理机制
      - 状态层
        - 通过全局管理状态（rtkq）
      - 组件层
        - 基础组件
        - 业务组件（图表、排行榜、tab 页）
        - 组件清单
      - 布局层
        - 响应式布局
      - 视图层
    - 数据流向
    - 交互通信
    - 性能优化
    - 构建部署
  - 功能清单（在线、开播、收礼、送礼、充值、实时刷新、排行榜（主播收礼排行榜、用户送礼排行榜））
  - 交互流程图（用户登录、系统展示各种图表、点击筛选过滤展示筛选过滤后的内容、切换 tab、切换语言、登出系统）
  - 时序图
    - 钉钉登录场景（用户-后台-钉钉）
    - 用户切换排行榜 tab（用户-后台）
    - 用户根据条件筛选数据（用户-后台）
- 前期工作准备好后，`进入开发流程`
  - `建立 git 仓库`
  - 根据 gitflow 流程`协同开发`
  - `统一编码规范和检查机制`，通过 git 钩子在代码提交时进行检测，保证代码质量
  - 以及`解决`开发中遇到的`重难点`，包括
    - `解决页面适配问题`
      - 适配 1920×1080（1080P 高清屏）、2560×1440（2k 屏）、3840X2160（4k 屏）不同的设备屏幕
      - 参考不同的业内方案，最终选择媒体查询+rem 单位方案，这个方案也是最适合我们的项目，从实现的难易程度和扩展性也是最好
      - 采取方案：媒体查询+rem 单位，通过 css3 的媒体查询（@media screen and (max-width 768px)）根据不同的分辨率设置不同的 html 根节点的 font-size，页面上元素使用 rem 作为单位
      - 其他方案：vm、scale 缩放等手段
    - `图表封装优化问题`
      - 项目中大量使用了不同的图表，为了方便使用，我封装了 echarts 组件，按需引入 echart 组件和图表。
        - 封装一个具体宽高的 dom 容器，在挂载阶段初始化 echarts 实例。
        - 定义图表的 option 属性，调用 setOption 渲染图表，同时监听 option 变化，重新调用 setOption 渲染图表，图表 option 由外传入，组件内接收使用。
        - 封装好组件后，使用者只需要传入图表 option 就可以渲染图表，非常方便。
        - 在实际开发中，整个项目图表的配置有很多内容是一样的，比如 x 轴、y 轴、tooltip 等。
        - 为了复用这些配置，我定义了一个 commonOption，内部存放了他们的公共配置，然后组件接收一个 option 属性，我会将 commonOption 和 option 进行深度合并，生成一个 option 进行图表的渲染，合并中我还使用了 lodash 的 merge 和 deepClone 方法进行数据合并，避免数据冲突问题
      - 功能
        - 柱状图（观看人数分布情况、观众属性分布）
        - 折线图（在线观看人数、累计观看人数、开播人数、新增用户数、送礼人数、金币收入、充值收入）
          - 近 1 小时、近 24 小时、3 天、7 天、30 天数据
        - 饼状图（开播类目占比、礼物收益占比、充值占比）
        - 热力图（不同地区观看人数分布）
      - 自定义样式
        - echarts 提供了丰富的自定义样式选项，如：整体样式、轴、图例、数据标签、提示框，还能自定义主题
          - textStyle:{color:'#fff',fontSize:14} // 文本样式
      - 优化
        - 利用 webWorker 去计算复杂的图表数据（热力图、地理信息图上的数据非常庞大）
        - `切换`组件及时销毁 echarts 实例，减少内存泄漏的风险
        - `按需`异步加载图表组件，并展示过渡动画，提升体验（减少同一时间做大量渲染工作）
        - `简化`图表样式和动画效果，大量的样式设置会导致渲染性能下降。可以适当减少或简化图表的样式设置，只保留必要的设置，提高性能
        - 与产品和后端商量，`增加`数据筛选、数据聚合展示图表的方式，降低绘制压力
        - 寻找性能更优的图表库（echarts 性能问题很难解决）
    - `制定一整套比较完善的接口请求到统一存储的解决方案`，我从三个方面进行考虑和设计：稳定性、安全性、性能
      - `稳定性`
        - 请求重试机制（拦截，重新请求 3 次）
        - 错误处理机制（拦截，Error boundary 组件、页面友好提示）
        - 错误上报（sentry）
      - `安全性`
        - 对返回结果进行拦截并设置默认值，预防字段丢失造成程序出错（通过 typescript 的装饰器，封装不同的数据类型设置不同的默认值，对结果进行统一转换）
        - 权限控制（拦截）
      - `性能`（减少 http 请求，降低服务器压力）
        - 请求结果集中管理（更好实现定时更新逻辑、更精确更新图表组件）
          - 引入 [rtk-query](<(https://redux-toolkit.js.org/rtk-query/overview)>) 帮助我把接口请求结果和 redux 状态管理结合起来，把请求结果集中缓存到 store 上
            - 通过网上调研查找有效的解决方案，也是分别了解到几个库（比如：react-query 和 rtk-query），react-query 侧重于接口管理，rtk-query 则更符合我希望对接口结果的管理到 store 上的诉求
            - 使用 rtk-query 有以下几点好处
              - 使用 rtk-query 提供的 hooks 可以获取请求在不同阶段的各种状态值，不需要手动去写；（接口请求时需要处理 loading、success、error 等情况）
              - 把接口请求的结果统一缓存到 store，多次调用只会发出一次请求，有效解决接口重复调用问题；
              - rtk-query 还支持时间旅行，方便调试；
            - rtk-query 使用
              - 首先定义 const baseApi = createApi({...});
              - 然后把 baseApi.reducer 赋值给 configureStore 如：configureStore({[baseApi.reducerPath]:baseApi.reducer});
              - const { useGetUVDayQuery } = baseApi.injectEndpoints(endpoint:(builder)=>({getUVIncDay: builder.query()}));
              - toolkit 中的一个 api 叫 createSlice，封装了创建 reducer、action creators 和 action types
              - 支持通过中间件和拦截器优雅的处理异常信息
            - 思考点
            - 使用 rtk-query 需要考虑迁移成本、强制使用 redux 状态库、学习成本
            - 这种实时性比较强的页面，不需要 ssr 技术
        - 去重机制（url 和参数作为唯一 key）
        - 缓存机制（设置有效时间）
        - 并发控制机制（限制数量，请求队列，订阅发布）
        - 对请求进行聚合（后端聚合、前端搭建 bff 层进行聚合）
      - 最终通过合理的代码梳理和相关的保障措施，极大减少不必要的 http 请求，减轻服务器压力，确保项目从接口请求到集中存储的稳定运行
- 在开发完成后，配置 gitlab-ci 和 Jenkins `完成部署`工作
- 最终经过一个多月的努力完成项目上线
- 上线后也去做了一些`复盘`，复盘后也是进一步做了一些改进和优化
  - 引入 web-vitals 和尝试使用 sentry 收集页面性能和异常告警
  - 通过 react18 的并发特性进一步优化用户频繁输入、视图切换的场景
  - 以及针对一些核心模块和方法，`补充单元测试`，增强项目的健壮性
    - 图表渲染结果是否符合预期（样式、横坐标、纵坐标）
    - 定时更新任务（3 分钟一次）
    - 对数据格式转换适配
      - 后端返回的数据需要整理成 echarts 的入参规则（饼状图、柱状图、折线图）
      - 往往 echarts 的入参规则比较复杂繁琐，横坐标、纵坐标的数据都要拆分开来入参
    - 时间格式转换
    - 数据本地持久化缓存

## 单元测试

- 目的
  - `排除故障`，减少 bug 的产生
  - `保证逻辑统一`，在对代码不熟悉的情况下，可以确保组件在更改后还能正常的适应原来的功能
  - `提高代码质量`，考虑到组件不容易测试，把组件变得独立且更加可重用
  - `起到很好的说明文档作用`，对于代码不熟悉的人，可以通过查看测试用例明白组件的工作意图
- 工具库
  - jest
    - describe 将多个相关的测试组合在一起的块
    - it 运行测试的方法
    - expect 断言，判断一个值是否满足条件
  - react-test-renderer 快照测试，先记录一次组件的快照结果，然后每次测试都拿最新的组件结果跟记录结果比较
  - testing-library 对 dom 结构测试、事件测试
  - jest-canvas-mock 对 canvas 做单元测试，会有 canvas 报错，需要配置 jest.config.js 中的 setupFiles 来进行解决
    - `['<rootDir>/jest/setup.js', 'jest-canvas-mock']`
- 核心
  - 断言(expect 函数)，判断一个值是否满足条件
  - 判断相等，toBe or toEqual
- 场景
  - 同步代码检测
    - 请求返回的数据格式封装，数据格式统一采用驼峰，并设置默认值
    - 持久化（礼物配置、特效）
    - 时间格式转换
  - 异步代码检测
    - 实时数据更新
  - 组件检测
    - echarts（使用 jest-canvas 库去测）
  - DOM 元素检测

[Jest + React 单元测试最佳实践](https://www.cnblogs.com/dtux/p/17119560.html)

## 前端性能优化

- 我在`首屏`（骨架屏、分包）、`构建`（webpack 升级、热更新优化）、`代码业务层面`（虚拟列表、qiankun 旧项目迁移、封装公共组件库）方面都做过不少优化
- 首屏这里，之前产品那边反馈说进入首页有白屏现象希望我们这边可以优化一下
- 我针对产品的反馈，自己本地也去尝试打开，对我们的首页展开问题调查，去定位造成卡顿和白屏的原因
- 同时在本地也通过 lighthouse 去分析页面的性能，发现 FCP 指标为 2.6s，超过阀值，确实是需要进行一定的优化
- 当时我从`绘制渲染`（ssr、骨架屏、图片懒加载、虚拟列表）、`网络请求`（cdn、gzip、升级 http 版本）、`资源获取`（分包、提取 css、离线缓存）、`接口请求`（合并请求、bff 层）、`js 代码逻辑运算`（webworker）等方面对白屏现象进行排查考虑，同时也去网上调研相关的一些解决方案
- 发现原来我们项目上确实在很多方面都存在优化的空间，也是使用了其中一些方案去对我现在的项目进行优化
- 首先通过给首页加入骨架屏方案，FCP 指标从 2.6s 降至 1.8s，优化了 0.8 秒
- 然后通过对业务代码进行分析，发现有很多代码（比如像一些通知相关的、活动弹窗、每日打卡等业务模块，然后还有一些第三方的依赖包）其实是跟首屏无关的。通过一定的分包策略和按需加载的方式把这部分的代码从首页代码中分离出去，从而减少首屏包大小。在完成分包后 FCP 指标从 1.8s 优化至 0.8s，优化了 1 秒左右（js：852k（2.6mb）->36k（113k）;html：17k；）
- 上线后，线上用户平均大概在 1s 左右，相对比之前大部分用户在 3s 左右，也是优化了 2s 多

### 问题排查

- 收集用户反馈，根据用户反馈寻找关键线索
  - 可以让用户录屏、或者安装一些插件
- 查看用户上报日志
- 模拟用户环境、复现
- 检查是渲染问题、资源加载问题、还是接口请求超时问题、js 代码执行报错问题
  - 资源请求
    - 超时
  - 接口请求
    - 接口请求超时
    - dns
  - 业务代码报错
    - 代码报错
  - 渲染报错
    - 兼容性

### 优化策略和手段

- 在定位问题中，我们可以通过一些工具去分析出发生性能瓶颈的地方
  - lighthouse
    - 性能模型
    - 性能指标
    - 场景：首屏加载
  - performance
    - 可以做`全方位性能评估`，包括记录一段时间内网络请求、资源加载、渲染、函数调用、垃圾回收等信息
    - 可以通过分析`火焰图`和函数调用栈，找出`CPU 占用`时间长的函数，定位 source 源码
    - 针对长 task 帧优化缩短，或者拆分成更小的任务帧渲染
    - 场景：捕获在一段时间内页面变化的性能报告
    - 核心 api：performance.timing（已弃用） 通过 performance.getEntriesByType("navigation") 代替
  - memory
    - 记录内存占用情况
    - 针对不同时间段下的`内存快照`，找出造成`内存泄漏`的对象
    - 场景：页面崩溃
  - network
    - 分析网络请求
    - 资源加载大小和时间
    - 场景：网络、资源等问题
  - react devtools
    - Components 方便组件调试，查看组件信息，显示 props、state 信息等
    - Profiler 收集性能测量数据，统计组件的渲染时间
  - redux devtools
  - vue devtools
    - components（组件信息）、timelines（时间旅行）、performance、自动集成支持 routes、vuex、pinia
  - webpagetest.org 模拟世界各地不同的网络访问来检测出性能问题
- 不同的`优化方向`，比如在网络请求、资源加载、图片、css、重绘重排，打包编译、首屏、vue/react 项目、包管理工具以及一些跟业务场景相关的优化
  - `网络请求`
    - 升级 `http版本` 如 http2（头部压缩、二进制分帧、多路复用、优先级、服务器推送）、http3（QUIC 做传输层代替 tcp）
    - 还有使用 `CDN` 加速资源访问
      - CDN 是一个内容分发网络，网络资源缓存到全球各地边缘的节点上，当用户访问资源时，DNS 服务器把请求重定向到离用户最近的边缘节点上获取资源
      - 使用 CDN 可以提高资源的访问速度、减轻服务器压力、提供智能的负载均衡
    - 配置 accept-encoding: `gzip` 请求头进行压缩传输
  - `资源加载`
    - 给部分 script 标签设置`async/defer`，异步加载 js 不阻塞渲染
    - 设置`预加载属性`的 link 标签，放到 html 的 head 头中
      - prefetch（提前下载下个页面资源）
        - 通过开发者工具的 network 面板，查看设置了 prefetch 的资源请求是否有发起以及响应，并且在跳至下一个页面时查看该资源是否已经被缓存
      - preload（调整优先级下载当前页面资源）
      - preconnect（提前建立 TCP 连接，这里包含了 DNS 解析过程，如果多个域名都提前进行 tcp 可能反而出现性能问题，这也是为什么还有 dns-prefetch 这个属性）
      - dns-prefetch（提前进行 DNS 解析） 等等
    - 利用 `indexDB` 缓存大量数据（图片、二进制 blob 数据）
  - `图片`
    - 雪碧图
    - 压缩
    - base64 编码
    - 懒加载
  - `重绘重排`
    - 提升合成层
      - will-change
      - transform
    - 动画通过 requestAnimationFrame
  - `打包构建`
    - webpack
      - 升级版本
        - 针对多个项目的 webpack 和 node 版本进行升级
        - 以规模最大的那个项目为例，8000 多个模块，把打包体积从 80 多 M，优化到 60 多 M，打包时间从 6 分多钟优化到 5 分钟以内
      - 加速编译（多线程、持久化缓存、资源模块、去 ts、设置合理 sourcemap）
        - 多线程
        - 持久化缓存
        - 关闭 ts 检查
        - 使用 swc 代替 babel
        - 合理配置 sourcemap 生成
      - 减少包体积
        - 启动 tree shaking
        - 压缩
        - 分包
          提取 css
    - vite
      - 通过配置 build.rollupOptions.output.manualChunks 手动分包优化，解决 chunk 碎片问题
  - `首屏`
    - 骨架屏
    - 懒加载（图片、业务弹窗）
    - 预渲染、服务端渲染、增量式网站渲染
      - 使用 nextjs、nuxtjs 构建应用
  - `打包工具`
    - pnpm 节约硬盘资源、多次安装速度快、解决幽灵依赖问题
  - `项目代码`
    - 对列表组件的每一项添加`唯一key`的方式，提升 diff 算法效率和`就地复用`的有效性
    - `缓存组件`，减少重渲染
      - react: React.memo、useCallback、useMemo
      - vue: keep-alive、computed
    - `升级版本`
      - react18
        - 使用并发特性 useDeferredValue、useTransition
        - 自动批处理
        - 支持 SSR 流式渲染和选择性注水（颗粒度为 Suspense 包着的组件）
      - vue3
        - composition api（组合式 api）
        - proxy 代替 Object.defineproperty
    - 通用的优化
      - 抽取`公共组件`复用
      - `suspense` 优化异步请求、异步加载组件场景
      - 对输入框输入或者多次点击触发的事件使用 debounce `防抖`
      - 对页面快速滚动使用 throttle `截流`
      - `慎用 context 以及 redux`公共状态库，如果组件重渲染的代价很大，则应该通过 props 的方式传递数据进来然后通过 React.memo 优化
      - `组件卸载`时，要及时清除`定时器`和`事件监听`
      - 利用 `web worker` 计算耗时任务，不阻塞主线程运行
  - `业务场景`
    - 虚拟列表
    - 大文件上传
    - 多页面编译优化

### 前端性能模型（RAIL）

- RAIL 是一个以用户为中心的`性能模型`，由 Google Chrome 团队于 2020.6 发布
- 字段定义：
- `Response` 响应用户操作 100ms 以内
- `Animation` 动画一帧 16ms 以内
- `Idle` 空闲时间尽量大
- `Load` 5s 内加载完可交互的页面，3s 内出现页面

### 前端性能指标

- `LCP`（Largest Contentful Paint）页面最大内容绘制时间
  - 衡量`加载感官体验`
  - 关注元素（文本、img、svg、video、背景图）的渲染情况
  - 时间：2.5s 4s
  - 计算方式：通过创建 performanceObserver，监听 largest-contentful-paint 类型的事件，入参 entry 的 startTime 属性值就是 LCP 的值
  - 优化措施
    - `图片`（图片渲染流程：渲染进程通过 cpu 对图片解压->GPU 辅助生成位图->合并成新帧渲染到页面上）
      - 压缩
      - 换格式
        - webp 是谷歌推出的一种图片格式,它的优点就是同等画面质量下,体积比 jpg、png 这些少了 25%以上
        - jpeg 是一种常见的图像压缩格式，它采用了有损压缩的方法，可以将原始图像文件压缩成较小的文件，从而减少存储空间和传输时间
        - png 是一种采用无损压缩算法的位图格式，支持索引、灰度、RGB 三种颜色方案以及 Alpha 通道等特性
      - 懒加载
    - `js`
      - 压缩
      - 通过制定合适的分包策略，分离出首页非必需用到代码，再按需加载进来项目
        - 通过配置 externals 属性 或者 使用 DllPlugin 两种方案
    - `css`
      - 内联关键 CSS，这样浏览器无需等待额外的 CSS 文件下载完成就可以开始渲染页面内容
    - `资源加载`
      - 使用 cdn
      - 使用 http2.0 版本
    - `使用 SSR、SSG 渲染方案`
    - `优化关键渲染路径资源`
      - 合理放置 css 和 js 的位置
      - 设置 async 和 defer 异步加载非首屏必要的 js
- `FID`（First Input Delay）首次输入延迟时间
  - 衡量页面的`可交互体验`，在页面呈现一部分时就可以进行交互，交互的方式可以是点击按钮、链接或输入框，得到浏览器响应的时间
  - 时间：100ms 300ms
  - 优化措施
    - 优化 js 运行，减少长时间占用主线程，考虑使用 requestIdleCallback（空闲时执行）、webworker（多线程）
- `CLS` (Cumulative Layout Shift) 累计布局偏移分数
  - 衡量`视觉稳定性`
  - 时间：0.1s 0.25s
  - 计算方式：通过创建 performanceObserver，监听 layout-shift 类型的事件获取，计算视图中可见元素在两帧之间改变的影响分数和距离分数的乘积就是 CLS 值
  - 优化措施
    - 预留图片、视频、广告的尺寸，减少布局抖动
    - 尽早加载 css 和字体文件
- `FP`（First Paint）第一个像素点出现的时间、`FCP`（First Contentful Paint）第一个内容渲染时间
  - 衡量`白屏时间`（如果只有一个 loading 图标，）
  - 内容指：文本、图片、canvas 等
  - 时间：2s、4s
  - 计算方式：通过 performance 的 api 找到 name 为 first-paint / first-contentful-paint 对象，其中 startTime 的时间就是 FP/FCP 时间
  - 优化措施
    - 骨架屏
    - 其他跟 LCP 优化差不多
- TTI（Time to Interactive）可交互时间，从页面加载到可以响应用户操作的时间
- TBT（Total Blocking Time）总阻塞时间，FCP + TTI 总和
- TTFB（Time to First Byte）首字节时间，测量用户浏览器接收页面的第一个字节的时间
  - 时间：800ms 1800ms
- SI（Speed Index）速度指标，页面可视区内容显示的平均时间
  - 时间：3.4s 5.8s
- FMP（First Meaningful Paint）首次有意义内容绘制（已弃）

## 前端异常监控解决方案

- 为了能及时发现线上问题并解决，保证项目的稳定运行，我们需要建立一个前端异常监控系统对项目进行实时的监控
- 一般来说建立前端异常监控分为`四个部分`，采集、上报、存储、分析、告警
  - 采集优化（数据压缩、精简上报内容、采样过滤、合并多个上报、设优先级处理、服务器清洗）
- `常见的前端错误`有：代码语法错误、promise 错误、ajax 请求错误、资源加载错误、跨域错误、iframe 错误、卡顿崩溃等
  - 对于一些可能会出现错误的代码，可以通过设置 `try catch` 进行捕获，如果是 promise 可以通过.catch 方式捕获
  - 但在项目运行中，有些错误我们无法预知，所以需要一个兜底的手动进行监听，可以通过设置 `window.onerror` 去进行监听，通过设置 window.onerror 可以有效地捕获语法错误以及部分异步任务的错误，如 setTimeout、setInterval 等，但捕获不了资源加载错误
  - 那么对于 promise 中 reject 出来的错误，没有通过.catch 方法处理的话，我们可以通过 `window.addEventListener('unhandledrejection')`来进行捕获
  - 针对于资源加载错误无法在 window.onerror 冒泡阶段被捕获但支持捕获阶段可以被捕获的特点，通过设置 `window.addEventListener('error',()=>{},true)`，传入第三个参数为 true，在捕获阶段进行监听捕获
  - 在 vue 项目中，我们可以通过给 `Vue.config.errorHandler` 设置监听方法捕获 vue 项目中产生的错误
  - 在 react 项目中，我们可以通过 class component 设置 `componentDidCatch` 方法来进行错误监听，react 中的错误边界（error boundary）组件也是通过这个生命周期方法进行设计的（错误边界：一个 react 组件，捕获子组件树发生的错误，并显示一个后备 UI，避免用户直接看到错误信息）
  - 针对 iframe 中发生错误的场景，我们通过 `window.iframes[0]`取得 iframe 的实例，然后在这个实例上设置 `.onerror` 事件进行监听
  - 针对跨域的情况，如果是标签的`资源请求`跨域，则在标签上加入 `crossorigin` 属性解决；如果是`请求跨域`的情况，需要设置跨域相关的一些请求头来允许跨域，并且需要后端的配合
  - 针对卡顿崩溃的错误，根据页面崩溃时不会触发 onbeforeunload 事件的特点，以及 server worker 在页面关闭时不会立即关闭的特点，采用 `onbeforeunload + service worker计算心跳` 的方式进行收集。
    - 通过进入页面时设置心跳，利用 postmessage API 传递心跳给 service worker，在一定时间内能接受到心跳就是页面还存活，然后正常关闭页面在 onbeforeunload 事件中触发告诉 service worker 正常关闭清楚状态，如果在一段时间后没有接收到页面传过来心跳就认为页面崩溃了，进行错误上报。
    - 崩溃上报这里，先前是想利用 sessionstorage 或者 localstorage 通过一个变量保存两种状态（进入、离开），然后在用户下次进入页面的时候判断状态值来进行统计的。但这两个方案都存在弊端，有些崩溃的情况会统计不到或者统计紊乱。比如说如果采用 sessionstorage 的话，在用户发生崩溃时，一般情况下都会立即关闭页面重新打开，一般不会刷新页面，当再打开就统计不到了，因为 sessionstorage 在关闭标签页时就会被销毁掉；如果采用 localstorage 方案的话，在用户打开一个页面不关闭再打开多个时，都会当作一次 crash（崩溃）来处理，因为 localstorage 是基于同源共享的，所以多个页面是共享状态的
  - 说完采集就说一下上报，现在常见的`数据上报`有三种：
    - `ajax` 请求（在 unload 方法同步等待执行，如果异步的话有可能在页面关闭时取消掉）
    - 动态加载 `img` 标签，设置 src（阻塞主线程，延时页面关闭）
    - `beacon` 信标，这是一个浏览器的原生 api，通过 navigator.sendBeacon 发送，他是一个用于 post 传输少量数据的异步请求
  - 在不考虑兼容性的情况，使用 beacon 信标进行发送应该是目前最好的方案，使用 ajax 和 img 都会有延迟关闭页面的问题，使用 beacon 可以在页面关闭时也能继续异步的上报数据，不需要阻塞页面关闭也可以发送成功
- 在分析阶段中，我们还需要使用 `sourcemap` 对代码进行解析，因为项目上的代码都是经过打包工具转码压缩过的，代码已经面目全非看不懂了，所以我们需要 sourcemap 进行解析，sentry 支持两种上传方式一种是通过命令行方式手动导入，另一种是通过 webpack 插件的形式，在打包时自动上报（在打包完成后自动的发送到 sentry 后台指定目录地址上）
- 在告警方面的话，我们限制了某些错误就不发送警告，某些错误超过一定数量再发送警告，常见的有一些超时错误等等。接入钉钉机器人进行通知
- 以上就是我公司使用的一套异常监控的解决方案

?>
[如何监控网页崩溃](https://blog.csdn.net/weixin_47143210/article/details/105644479?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_baidulandingword~default-0-105644479-blog-127614226.pc_relevant_default&spm=1001.2101.3001.4242.1&utm_relevant_index=2)
[基于 Sentry 的前端监控系统搭建](https://blog.csdn.net/walid1992/article/details/126938445)
[阿里 UC 百亿级 PV 的前端监控平台实践](https://zhuanlan.zhihu.com/p/79978987?hmsr=joyk.com&utm_medium=referral&utm_source=joyk.com)

## 部署 sentry 的一次经历

- sentry 是一个支持私有化部署的性能异常监控平台，在使用 sentry 时，引入 sdk 会自动帮我们收集性能指标数据、异常告警数据、还可以设置不同的告警策略提示用户
- `部署`
  - 从 git 上拉代码，然后通过 docker compose 通过单点集群的方式把整个 sentry 项目跑起来（自动创镜像）
- `持久化缓存`
  - docker 有两种方式实现持久化缓存：数据卷（volumes）、绑定挂载（bind mounts）
  - 通过 docker 数据卷（volumes）将宿主机的目录挂载到容器目录中，更方便多个容器共享
  - 通过绑定挂载，可以访问宿主机任意位置，灵活但不方便移植
- `告警策略`
  - 匹配告警等级
    - 致命错误(Critical/Fatal)
      - 系统崩溃无法运行
      - 资源加载失败
      - 脚本加载失败
    - 严重错误（Severe/High）
      - 部分功能无法运行
      - 由于某些原因展示错误页面
      - api 请求失败
      - 重要的 DOM 元素渲染出错
      - 核心数据处理逻辑错误
    - 警告（warning）
      - 影响用户体验
    - 提示（info）
      - 不影响用户体验的
      - 用户行为日志、页面切换、资源加载延迟
    - 调试（debug）
      - 分析问题
  - 错误第一次出现
  - 达到一定的错误总数
  - 出错用户数达到一定量
  - 吞吐量（频率）（一段时间内接收到错误数量达到某个阀值）
  - 通过标签对错误进行分类
- `通知方式`
  - 邮箱
  - web hook
    - 钉钉
- `横向对比`
  - sentry、webfunny、fundebug、frontJs、阿里 ARMS
  - sentry 支持私有化部署、告警系统、支持异常监控、性能监控
  - 主要还是成本的考虑，基本能满足需求
- `遇到的问题`
  - 在项目里使用了 qiankun 微应用，然后主应用和子应用都接入了 sentry，在上报的时候无法区分项目的问题，子应用的报错也会记录到主应用中，存在上报错乱的问题
    - 记录错误的原因是：Sentry 是通过覆写 window.onerror、window.unhandledrejection 的方式初始化异常捕获逻辑。之后不管是哪个应用发生异常，都最终会触发 onerror、unhandledrejection 的 callback 而被 Sentry 感知，然后上报到 dsn 指定的项目中。而且 Sentry 的 init 代码不管是放在主应用中，还是放在子应用里面，都没有质的改变，所有被捕获的异常还是会一股脑的上报到某个项目中，无法自动区分
    - 解决方式
      - 1.子应用都不使用 sentry，全部交给主应用去上报。这样的话，主应用和子应用的所有异常都会在一起块，这样也不行
      - 2.通过 sentry 官方提供的解决方案来解决，就是设置元数据和使用 transport 自定义多路传输来解决
        - 简单理解，就是通过在编译的时候给子应用`设置元数据`（moduleMetadata）就是设置一些可以标识子应用的特征值，然后再通过 sentry 提供的 transport api，其实就是在发起请求前根据元数据来进行过滤，让子应用的错误不要在主应用的 sentry 上面去上报这样子
- `场景`
  - 资源请求超时、接口请求超时（加入重试机制，还是失败，提示用户，上报监控系统）
  - localstorage 存储过载（梳理业务，逐一排查，发现是礼物资源太大，选用 indexDB 来存）
- `应对日志过多磁盘不足的问题`
  - 缩短日志存储时长（默认 90 天）
  - 对数据库进行手动清理（postgresql）

[nonolive sentry](https://sentry.nonolive.com/)
[前端异常监控平台之 Sentry 落地](https://zhuanlan.zhihu.com/p/547221214?utm_id=0)
[前端异常监控之 Sentry 的部署和使用](https://www.cnblogs.com/gaoyanbing/p/17583311.html)
[Sentry 开发者贡献指南](https://www.cnblogs.com/hacker-linner/p/15696648.html)
[Sentry React](https://docs.sentry.io/platforms/javascript/guides/react/)
[使用 Sentry 做异常监控 - 如何优雅的解决 Qiankun 下 Sentry 异常上报无法自动区分项目的问题 ?](https://juejin.cn/post/7139452175088320520#2-1)

### 数据存储过载如何处理

- 考虑到资源有限：定时清理数据、调整上报频率

## 对于低代码的理解

- 特点
  - 降低开发成本，在网页上通过拖拽的方式，整合出一个页面，然后通过打包构建发布上线
- 功能清单
  - 物料库
  - 组装页面
  - 集成第三方服务
  - 打包编译
  - 版本控制
  - 部署
- 优点
  - 降低建站的难度
  - 极大减少重复性工作
- 缺点
  - 不适用于复杂业务，需要更多自定义开发的场景实现困难
  - 存在 xss 攻击的风险

## 连续对同一个接口发起异步请求，后发的先到如何解决

- 在发下一个的时候，对前一个接口请求给 cancel 取消掉
- 发送的时候带一个 hash，服务器返回的时候带回来，前端再比对这个 hash
- 通过闭包，外部定义个变量来计数，请求的时候把这个变量当作参数传入，然后在服务器返回的时候进行对比

## 浏览器兼容性问题解决

- css 兼容性问题及解决方案
  - 不同浏览器标签`默认样式`不一致（如：有些 p 标签的 padding 值不一样）
    - 解决方案：重置 css，引入 Normalize.css 消除默认样式
  - 部分样式需要加`样式前缀`（如：Chrome 和 Safari 用-webkit-，Firefox 用-moz-，IE 用-ms-）
    - 解决方案：使用 PostCSS、autoprefixer 插件
- js 兼容性问题及解决方案
  - 低版本浏览器`不支持 es6+功能`
    - 解决方案：使用 babel 转换成 es5 代码，引入 polyfill 去支持缺少的功能，抹平差异
  - 事件监听
  - IE8 及更低版本中使用 attachEvent，而其他现代浏览器使用 addEventListener
  - 事件属性
    - window.event（有些浏览器没有）
- 移动端兼容性问题及解决方案
  - 难看的点击高亮效果（-webkit-tap-highlight-color:rgba(0,0,0,0)）
  - 适配顶部跟底部的安全区域（safe-area-inset-top/safe-area-inset-bottom）
  - ios 不支持 mediasource api
- 检测
  - `使用跨浏览器测试工具`，browserStack、CrossBrowserTesting 来模拟测试网站在不同浏览器上的效果
  - 人为端到端测试
  - 单元测试

## 富文本编辑器开发

- 给 div 设置 contenteditable 属性为 true，
- Selection 对象，代表页面中的文本选区，可能横跨多个元素
  - 功能
    - 定位光标位置
    - 给选中的文字/元素加样式
    - 添加、修改、删除选中元素
  - onselectionchange，当选区发生变化时触发
- Range 对象，表示一个包含节点与文本节点的文档片段
- selection 和 range 区别
  - Selection 对象通常用于处理用户选择的文本，比如获取选中文本的内容、修改选中文本的样式或内容等，而且 Selection 对象包含一个或多个 Range 对象，就是说选中了多个文档片段。
  - Range 对象可以用于对文本进行操作，比如删除、替换、插入文本等，还可以用于获取文本范围的信息，比如获取范围内的文本、获取范围的开始和结束节点等
