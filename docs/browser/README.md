## 浏览器有哪些进程

- 浏览器主进程
- 渲染进程
  - JS 引擎线程
  - GUI 线程
  - 事件触发线程
  - HTTP 请求线程
  - 定时器线程
- GPU 进程
- 网络进程
- 第三方插件进程

## 介绍一下事件循环机制

- JS 是`单线程`的，为了不阻塞主线程代码执行，JS 引擎把代码分成`同步任务`和`异步任务`
- 同步任务交给 `JS 引擎`执行，异步任务交给`宿主环境`执行
  - 宿主环境（浏览器、node）提供一个多线程执行的环境，当异步任务执行完后把回调放入异步队列中等待合适的时机执行
- 当有代码执行时，先把同步任务代码放入执行栈中执行，执行完，从异步任务队列取出回调放入调用栈中执行，直到异步任务队列中的任务都执行完
- 以上重复从任务队列中取出任务去执行的过程就是事件循环
- 上面谈到的异步任务又分为宏任务和微任务
- `宏任务`主要包括：setTimeout、setInterval、IO（dom 事件监听）、请求、messageChannel、script 代码块等等
- `微任务`主要包括：Promise.then、Promise.catch、MutationObserver、queueMicrotask 等等，还有 node 中才有的 process.nextTick（会在所有微任务之前执行）
- 在宏任务和微任务代码执行时，会先从宏任务队列中取出回调，放入调用栈执行，然后收集微任务，宏任务执行完，从微任务队列中按先进先出的原则逐一取出放入执行栈中执行，直到清空微任务队列为止

### 为什么需要有微任务这个概念，可以从执行时机方面考虑？

- 微任务的引入是为了`解决`事件循环中`执行时机`的问题，确保异步操作的回调函数在宏任务执行完毕前得以执行，`提高响应性能和用户体验`。
- 微任务就是让当前事件循环轮次结束前有机会执行的异步任务机制
- 使用微任务避免不必要的 DOM 重绘和回流，从而提高页面性能，同时提供更细粒度的控制代码执行顺序。

## 介绍一下 URL 从输入到页面渲染的过程

- 用户在`地址栏`输入内容
- `浏览器主进程`解析，判断是关键词还是合法的 URL
- 如果是`关键词`，就交给搜索引擎进行搜索
- 如果是`合法的URL`，判断`缓存`是否过期，如果没过期则直接使用本地缓存
- 如果缓存过期就把 合法的 URL 交给`网络进程`发起 http，对资源进行请求
- 然后在发起 http 请求前，会先对请求进行`DNS解析`(浏览器 DNS 缓存、操作系统、路由器、ISP 服务器、根域名服务器)，获取目的 IP 地址
- 拿到 IP 后先进行 tcp 的`三次握手`建立连接，建立连接后再发起真正的 http 请求，如果是 `https` 请求，还会进行 `TLS` 的四次握手建立`加密通信`
- http 请求发出后，服务器响应请求，返回 html 文档，浏览器主进程把网络进程上的 html 文档通过 IPC 机制（管道通信技术）发送给`渲染进程`处理
- `渲染进程`拿到 html 文档后，从上到下，逐行解析，生成`dom树`，`样式计算`生成`cssom树`，遇到 js 就阻塞住先下载执行完再继续解析
- html 解析完成，合并 dom 树和 cssom 树生成 render`渲染树`
- render 渲染树根据树上可见元素的位置几何信息进行布局，生成`布局树`
- 然后对布局树`分层`，不同的图层独立`绘制`，绘制时生成`绘制列表`交给`合成线程`
- `合成线程`拿到绘制列表后，将图层`分块`（把一个图层分成多图块处理）
- 分块后，对可见的图块进行`光栅化`，把图块转换成`位图`，并利用 `GPU` 进行加速
- 最后合成线程把`位图合并成帧`，交给 GPU 绘制到屏幕上去
- 在经过`一段时间后`没有新的资源请求，经过 tcp 的`四次挥手`断开连接，释放连接资源
- 以上就是从输入到浏览器渲染的全过程

## 介绍一下 V8 垃圾回收机制 GC

- 垃圾回收机制是一种自动的`内存管理`机制，释放内存中不再使用的对象，避免`内存泄漏`
- 在 V8 的垃圾回收机制中，根据`代际假说`（大部分对象存活时间短，不死的对象会存活得更久）和`分代回收`的思想进行设计，把内存分成`新生代`和`老生代`，新生代存储存活时间短、占用空间少的对象，老生代则存储存活时间长、空间占用大的对象，不同的内存空间采用不同的清除策略
- 在新生代空间中，主要采用`scavenger`算法（清道夫，基于 copy 算法）和`可达性`算法，首先把新生代空间分成两半，一半叫 from space 处于使用状态，另一半叫 to space 处于空闲状态，对 from 空间上的对象进行可达性分析，从 GC ROOT 对象 出发找出可达对象，复制到 to 空间去，然后回收掉 from 空间，接着把 from 和 to 空间的身份互换，等待下一次垃圾回收
- 为了避免某些对象一直存在新生代的空间上，V8 引擎提供了`晋升机制`，当满足以下两个条件其中之一就从新生代迁移到老生代去
  - 第一点是在复制时`已经经历`过一次新生代垃圾回收的存活对象
  - 第二点是在进行复制时，to 空间`使用率`超过 25% （25%比例是为了让下次新对象有足够的空间可以分配）
- 在老生代中，主要采用`标记-清除`和`标记-整理`算法进行回收
- 在进行一次老生代的垃圾回收时（标记-整理的效率不高，在空间不足以对新生代晋升过来的对象进行分配时才进行标记-整理）
- 首先进行`标记-清除`算法，从 GC ROOT 对象（作为所有活动对象的起点）开始遍历，给活动对象打上标记，清除没有被标记的非活动对象
- 在清除完成后，会产生许多不连续的内存空间，随后采用`标记-整理`算法，把对象逐一移到内存的一端进行整理直至有序
- 老生代的垃圾回收是一个比较缓慢的过程，而且垃圾回收还会占用主线程，回收完才会交还主线程，如果长时间占用主线程会造成`全停顿`现象，阻塞页面渲染以及用户交互
- 所以针对`全停顿`问题，V8 引擎通过`增量回收`和`并行回收`等策略进行进一步的优化，极大降低停顿的时间，减弱对用户的影响

> ? 按官方说法，以 1.5G 的垃圾回收堆内存为例，V8 做一次小的垃圾回收需要 50ms 以上，做一次非增量式垃圾回收甚至需要 1s 以上。

### 常见的垃圾回收实现方式

- 常见的垃圾回收机制的实现方式有`引用计数`和`标记清除`，引用计数存在`循环引用`无法释放的问题，所以大部分以标记清除实现为主，V8 引擎也有用到标记清除

### 为什么新生代和老生代使用的算法不一样

- `复制算法`利用空间换时间的策略，在数据不多的情况下，性能表现好，但在老生代中使用不是那么合适，因为老生代中存储的对象都是一些存活时间比较长，空间占用大的对象，如果还采用复制算法不仅复制花费时间比较长，还浪费大量的空间

### 垃圾回收的触发条件

- 栈内存空间：在函数执行完，出栈时就会被释放掉
- 堆内存空间：在关闭页面时、分配空间快满（不足以给一个对象分配新空间）

## JS 内存管理

- js 中主要把内存分为`栈内存`和`堆内存`
- 栈内存是线性结构，适合存储固定大小的数据，分配空间和销毁空间可以很快，只要移动一下指针就可以。栈结构满足后进先出的原则，索引很适合用于管理函数调用，函数调用时会产生的一些变量以及上下文，当有函数调用时进行入栈操作，当函数调用结束时就出栈，释放掉内存
- 面对闭包的情况，js 在预编译的词法分析阶段，分析该函数是否为闭包，如果是闭包就把部分变量分配到堆内存上
- 堆内存主要存储一些大小不固定，占用空间大的数据，因此针对堆内存需要设计比较复杂的内存回收机制去维护

## 介绍下浏览器的事件委托

- 事件委托通过浏览器事件流中的`冒泡`机制实现
- 通过事件委托，把原本在子元素触发的事件在父级元素上触发
- 使用事件委托的好处就是节省内存，然后就是在添加新元素时不用再给子元素添加监听事件
- react 通过事件委托实现合成机制，通过事件合成机制，消除各个平台差异（在 react16 之前会把事件监听挂载到 document 上，16 之后就挂载到根 root 节点上，好处就是方便后面微前端的接入）

### 介绍一下浏览器的事件流

- 浏览器的事件流分为三个阶段：捕获阶段、冒泡阶段、目标阶段
- 当我在一个 dom 上触发了一个 click 事件时，浏览器会从 html 根节点开始触发 click 事件，一直到当前的 dom，然后从当前的 dom 再向他的父级触发 click 事件，直至 html 根节点

## cookie 常见字段及其用法

- httpOnly: 设置为 true 时，阻止 js 读取 cookie，可以有效预防 xss 攻击
- sameSite: None,Lax(默认),strict，用于预防 csrf 攻击
  - none: 不管是否跨域都发送 cookie
  - lax（宽松模式）: 只支持部分 get 请求发送 cookie，比如 a 标签 href 链接、get 表单、预加载请求 prerender
  - strict（严格模式）: 跨域请求的情况下完全不发送 cookie
- secure: 设置为 true 时，只能是 https 请求才会带上 cookie
- domain: 设置.xxx.com 父级域名时，子域名也能共享 cookie，通过这种方式可以实现单点（sso）登录
- expires/max-age: 设置过期时间

## 浏览器的安全问题

- 浏览器的安全问题主要包括：xss、csrf、sql 注入、中间人攻击
- `xss 攻击`
  - 全称 cross site scripting 跨站脚本攻击，攻击者通过在 html 上`执行恶意脚本代码`，盗取用户信息
  - 常见的 xss 攻击有三种类型：存储型、反射型、dom 型
    - `存储型`是通过把恶意代码`存储到了服务器`上，用户访问时就遭受攻击
    - `反射型`是通过把恶意代码放到 url 上，通过`服务器解析url`然后把恶意代码插入到 html 上
      - 利用 script 标签
    - `dom型`是通过把恶意代码放到 url 上，通过 `js解析`执行了恶意代码
      - eval、new Function 可以执行字符串中的 js 代码（避免使用，或过滤掉其中的敏感操作，比如对 cookie 的操作）
  - 预防 xss 攻击的常见措施有以下三种
    - 对`用户输入`和`页面输出`做`转义过滤`处理
      - 主要针对"<"、">"，"&"、"/“和“””的字符进行转义
    - 对`cookie`上的敏感信息设置`httpOnly`处理
    - 添加`csp`（内容安全策略）请求头，相当于添加白名单的方式限制资源来源
  - 引起 xss 攻击的写法
    - innerHTML、outerHTML、document.write()、v-html、dangerouslySetInnerHTML
    - href、onclick、onerror、onload、onmouseover
    - eval、setTimeout、setInterval
- `csrf攻击`
  - 全称 cross site request forgery 跨站伪造请求攻击，在用户不知情的情况下，`冒充用户发起请求`，造成用户损失
    - 通过利用受害者与网络的经过身份验证的会话来实现的，攻击者让受害者的浏览器向目标网络发送请求，执行受害者没打算执行的操作
    - 用户在 a 网站登录，然后用户访问了恶意的 b 网站，在 b 网站拿着用户 a 网站的 cookie 信息在 a 网站上做一些非法的事情
  - 预防手段
    - `referrer`，判断用户的来源
    - `csrf token`（token 要设置有效时间和限制使用次数）
      - 特点
        - 发生在第三方域名
        - 攻击者不能获取 cookie 只能使用（通过设置 cors 请求头或 cookie 设置 sameSite 预防）
      - 方式
        - `session会话验证`
          - 访问页面时，把 token 注入到页面中
          - 在发起请求（提交表单）带上 token
          - 在后端把带上的 token 和 session 上的 token 进行比较
        - `双重cookie验证`
          - 在用户访问网站时，向请求域名注入一个 cookie
          - 在前端向后端发起请求时，取出 cookie，并添加到 URL 的 header 头或参数中
          - 然后在后端验证 cookie 中的字段与 URL 的 header 请求头或参数中的字段是否一致
      - 加强
        - token 设置有效时间、使用次数
        - 确保页面没有 xss 攻击泄露
    - 设置 cookie 的 `sameSite` 属性为 strict
      - sameSite 有三种设值，分别是严格、宽松和 none，浏览器默认是宽松模式，当把 sameSite 设置成严格或者宽松模式就能有效防止 csrf 攻击了，但是会对一些页面统计产生一些影响，因为很多消息上报通过 img 标签去做的，在设置了 sameSite 的情况下不会带上 cookie 信息
- `sql 注入攻击`
  - 原理
    - 攻击者利用 sql 语句拼接执行的漏洞，执行恶意的 sql 语句，非法盗窃、修改、删除数据信息
  - 防御
    - 输入校验和过滤，转义非法字符
    - 参数化查询，避免直接拼接用户输入的信息
    - 使用 ORM 库（Sequelize、TypeORM）
- `中间人攻击`
  - 原理
    - 在通信双方不知情的情况下，拦截、窃取、篡改通信双方的消息，造成严重的影响
  - 预防
    - 客户端层面
      - 使用 HTTPS 通信，使用最新的 TLS 版本来通信
      - 不要忽略浏览器上安全证书的警告
      - 尽量不要使用不安全的 wifi 设备
    - 服务器层面
      - 服务器保证私钥不要泄露
      - 关注服务器漏洞，
      - 在路由器或防火墙上限制端口开放，预防被扫描攻击
      - 做好日志监控和警告

[前端安全系列（二）：如何防止 CSRF 攻击？](https://tech.meituan.com/2018/10/11/fe-security-csrf.html)

## 浏览器缓存有哪些

- `本地缓存`
  - cookie（4k）
  - sessionStorage（5M 各浏览器不同）
  - localStorage（5M 各浏览器不同）
  - indexDB（基本没限制）（支持异步、索引，存储格式：字符串 or 二进制）
- `service worker`离线缓存
  - 运行在后台的线程，可以拦截和处理页面发出的网络请求
  - 通过 cacheStorage 存储资源
  - 用途：支持离线
- `http 缓存`（强缓存和协商缓存）
  - 浏览器缓存分为`强缓存`和`协商缓存`
  - 强缓存就是在不发送请求的情况，在浏览器本地判断是否继续使用缓存的过程，主要用到两个字段：`expires` 和 `cache-control`
  - 协商缓存就是通过客户端和服务器通过请求协商，客户端是否继续使用本地缓存的过程，主要用到两个字段：`last-modified` 和 `etag`
  - 强缓存中的 `expires` 是 http1.0 出的，表示一个服务器的绝对时间，如果客户端的系统时间不准确（人为修改或系统时间同步有问题），那么会出现判断出错的情况，所以在 http1.1 中新增了 `cache-control` 来弥补 expires 的缺陷，cache-control 通过设置 max-age=xx 秒来表示资源多少秒后过期
    - cache-control 属性：pulic（允许中间服务器缓存）、private（只在目标服务器缓存）、max-age、no-cache（不使用本地缓存走协商缓存逻辑）、no-store（不使用本地缓存也不走协商缓存，直接返回最新资源）
  - 协商缓存中的 `last-modified `是指资源最后一次的修改时间，只能精确到秒，如果一个资源在一秒内发生改变，那用 last-modified 是感知不到的，所以需要使用 `Etag` 属性进行判断，Etag 是资源的唯一标识，但是生成这个唯一标识会有一定的开销，所以在实际使用的时候需要权衡利弊再进行使用
  - 当我们访问一个资源时，首先进行强缓存的判断，如果缓存没有过期，就直接使用本地缓存，如果过期，就发起请求，走协商缓存逻辑，在服务器上判断资源是否发生修改，如果发生了修改，就返回资源并响应 200 状态码，如果没有修改，就响应 304 状态码，并让浏览器继续使用本地缓存

### 浏览器缓存存储位置

- memory cache（内存）
- service worker cache（基于 web worker，增加了离线缓存功能，独立的线程运行，还能实现请求拦截、通知推送等功能）
- disk cache（磁盘）
- push cache（针对 http2.0 下服务器推送的资源缓存，缓存时间大概 5 分钟，当上面的三种缓存没有命中再判断当前缓存）

### memory cache 和 disk cache

由浏览器决定使用哪个 cache,策略应该是根据文件大小和频繁使用程度、内存使用率  
[浏览器是根据什么决定「from disk cache」与「from memory cache」](https://www.zhihu.com/question/64201378?sort=created)

## GPU 硬件加速的理解

- 浏览器通过把部分元素提升到`合成层`，交给 GPU 处理，有效提高渲染性能，但滥用 GPU 加速会造成性能问题，因为开启 GPU 加速时会有性能消耗和内存消耗
- 常见开启 GPU 硬件加速的 css 有
  - transform: translate3d、translateZ
  - opacity
  - filter（滤镜）
  - video、canvas 标签
  - 以及 will-change 设置为 opacity、filter、transform、left、top、right、bottom 等，通过设置 will-change 提前告知浏览器会发生的变化

## webkit 和 v8 区别

- webkit（苹果公司研发） 是一个浏览器`渲染引擎`，主要负责渲染的相关工作和 JS 解析工作
- V8 是一个 `JS 引擎`，由 Google 团队 自主研发的 js 引擎，接管 webkit 的 js 解析工作
- V8 引擎性能更好，主要体现在他拥有一个高效的`垃圾回收机制`，以及在执行代码前会把部分代码编译成`机器码`再执行，从而提升运行速度
- 在 `Chrome` 浏览器中主要用 webkit 做渲染，V8 做 JS 解析
- 在 `Safari` 浏览器中都使用 webkit 进行渲染，以及自带的 Jscore 作为 js 引擎

## V8 的理解

- V8 的命名，把自己比作 V8 发动机引擎一样性能好
- V8 为什么快
  - 把代码编译成`字节码`，由 V8 解释器执行
  - 把频繁执行的代码编译成`机器码`直接执行（进一步优化）
    - 机器码可以直接交给 CPU 运行，字节码不能直接运行需要解释器来执行
    - 机器码运行速度快，字节码容易跨平台，扩展性和可移植性好
- 看过的 V8 源码
  - 垃圾回收机制
    - 通过 C++ 实现
  - sort 实现
    - 5.6 以前通过 js 实现，小于 10 通过二分`插入排序`，大于 10 使用`快速排序`，大于 1000 优化快速排序（不稳定）
      - 每 200 个元素左右取一个值，然后在这些值里面再去取中间值再进行快速排序
    - 7.0 版本以后通过 torque 实现，使用 `timSort 排序`（插入排序和归并排序的结合）
      - 先对数组进行合理分区，然后保证每个分区内的数据单调增或单调减，最后把每个分区的数据合并成最终的有序数组

[V8 垃圾回收源码](https://chromium.googlesource.com/v8/v8.git/+/refs/heads/main/src/heap/heap.cc)  
[V8 sort 源码](https://chromium.googlesource.com/v8/v8.git/+/refs/heads/main/third_party/v8/builtins/array-sort.tq)  
[V8 源码解析之 Array.prototype.sort](https://juejin.cn/post/6844903953964990471)  
[V8 源码地址](https://chromium.googlesource.com/v8/v8.git)  
[V8 Torque 用户手册](https://v8.js.cn/docs/torque/)

## 什么是跨域

- 定义
  - 当一个页面发出一个请求，请求中的`域名、协议、端口`与页面 URL 不一致就是跨域
- 影响
  - 浏览器存在`同源策略`，限制跨域请求的接收
- 如何解决
  - 设置 CORS 请求头
    - 预检请求字段
      access-control-allow-origin: http://api.bob.com  
      access-control-allow-credentials: true  
      access-control-expose-headers: FooBar
      access-control-max-age: xxx 秒
    - CORS 请求又分为简单请求和非简单请求，非简单请求会预先发一个 OPTIONS 预检请求
      - 简单请求必须满足 1、方法只能是 head、get、post。2、头信息包括 Accept、Accept-Language、Content-Language、Content-Type:只限于 application/x-www-form-urlencoded、multipart/form-data、text/plain
      - 非简单请求会先发出 OPTIONS 请求进行预检，满足跨域条件再发送实际请求
      - 简单请求其实是满足普通 HTML Form 发出的请求，比如表单的 method 如果指定为 POST ，可以用 enctype 属性指定用什么方式对表单内容进行编码，合法的值就是前述这三种。
  - JSONP
    - 通过 script 支持跨域请求，把函数名称 callback 传递给服务器，服务器把函数名和数据组装到一起返回给客户端，客户端通过动态加载 script 来获取到跨域的数据
    - jsonp 只支持 get 请求，不支持 post
  - 代理
    - 设置 nginx 反向代理，让请求和页面 URL 处于同一个域名、协议、端口之下
      - nginx 常见的匹配规则
        - 匹配规则
          - location
            - =/ 精确匹配
            - / 一般匹配
            - ^~ 前缀匹配
            - 精确匹配 > 前缀匹配 > 正则匹配 > 一般匹配 > 通用匹配
        - 重定向
          - rewrite / https://www.test.com permanent;
            - 永久重定向 permanent 301
            - 临时重定向 redirect 302
        - 反向代理
          - proxy_pass https://www.test.com;
        - 配置证书
          - ssl on; 开启 SSL
          - ssl_certificate; 证书存储地址
            - 数字证书，交给客户端本地校验提取服务器公钥的
          - ssl_certificate_key; 证书的 key 存储地址
            - 私钥，用来解密客户端传输过来的密文的
    - 配置 http2.0 遇到的问题
      - openssl 版本过低，通过 yum update openssl 升级
      - 配置 ssl 证书，浏览器限制 http2.0 要运行在 https 之下
