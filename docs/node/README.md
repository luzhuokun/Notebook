## child_process

- child_process 是用于衍生子进程的 node 模块
- `exec` 通过 `shell 命令`的方式执行，并支持返回一个最大 200k 的 buffer 数据（数据传输有限）
- `spawn` 通过启动一个新的`子进程`，在该进程里执行指令（适合传输大数据了、文件、图片）
- `fork` 也是通过一个新的子进程去运行指令，是 spawn 的特殊形式，fork `不仅创建`了一个`子进程`，还建立了一个`通信管道`（win 具名管理，linux 通过 socket），用于进程间通信

## 创建子进程（多进程）的方式

- `child_process.fork`
  - fork 创建子进程的同时，还会自动创建一个通信管理，window 系统下是用具名管道实现，Linux 是用的 socket（不走网络通过拷贝的方式） 的方式实现
- `cluster 模块`
  - 底层通过 `child_process` 的 `fork` 方法创建进程，不仅创建进程还提供了自动`根据 CPU 数量`创建子进程，以及`负载均衡`的能力

## 洋葱模型

- 同一个中间件会`进来两次`，上游中间件通过 context 拿到下游中间件处理数据后的信息
- 以 `next` 调用作为`分割点`，next 前由外到里处理 request 的逻辑，next 后有里到外执行 response 逻辑
- 洋葱模型使多个`中间件`配合工作`更加简单`流畅

### 洋葱模型实现和使用

- koa 利用一个数组存储中间件以及递归的方式实现洋葱模型
- 外部使用时传入 async 函数，并带有两个参数，context 和 next 函数
- 以 next 执行作为分界点，上部分逻辑先执行，下部分后执行

### 洋葱模型好处

- 相较于 express 没有回调地狱的问题，使用 async/await 语法，代码清晰
- 每个中间件按顺序执行
- 适合用于日志、统计等场景

## nodejs 特点

- 非阻塞 I/O
  - cpu 可以去做别的事情
- 事件驱动
  - 调用队列 + 事件循环
- 单线程
  - I/O 多路复用

## express 的中间件

- 应用中间件
  - app.get('/',(req,res,next)=>{})
  - app.post
  - app.use
- 路由中间件
  - const router = express.Router()
  - router.use
- 错误中间件
  - app.use((err,req,res,next)=>{})

## express koa egg nest 区别

- express 已经`集成`一些常用功能（比如路由、静态资源等），所以包会大一些，koa 相对轻量，没有内置太多中间件，需要另外安装
- express 和 koa 的核心都是`中间件`的链式调用
- koa 完美支持`洋葱模型`，express 支持同步的洋葱不支持异步洋葱，在异步调用下，next 下方的逻辑可能会提前执行（关键在于 koa 的 next()调用后返回一个 promise，会等待这个 promise 执行，而 express 的 next()调用返回 void 不会返回 promise）
- express 和 koa 是两个`底层框架`，egg 和 nest 是`企业级框架`，会有更多的`规范化代码写法`以及`开箱即用`的功能
- egg 拥有一个`插件系统`，基于 koa 实现，并且集成了多进程模式（master、worker、agent）开发热更新、进程守护、路由、日志监控等等，开箱即用
- egg 对 ts 支持不行，npm 的下载量不高，社区活跃度，维护人少，是阿里的一个项目，经历裁员风波，后续没有什么人维护
- Nest 可以随意切换到其他库，目前使用 nest 的人越来越多

## 把 node12 升级到 node18 带来的好处

- 使用更高版本的`V8 引擎`，更好的性能
- 使用更高版本的`OpenSSL`，提供更安全的密钥算法以及 ssl 协议
- 支持`monorepo`项管特性，用于一库多项目的项目管理解决方案（npm7 以后支持的功能）
- 支持`esmodule`代码组织方式（需要在 package.json 上配置 type=module）

## nodejs 性能监测

- CPU
  - 负载
    - os.loadavg 采样 CPU 平均负载
  - 使用率
    - os.cpus 采集 cpu 信息，计算空闲时间和总花费时间的比值
  - v8-profiler
    - 导出 CPU 分析文件，放入 chrome 中，找出哪个函数占用大量的 CPU 时间
- 内存
  - process.memoryUsage 获取内存使用情况
  - heapdump、v8-profiler 导出内存快照，通过 chrome devtool
- 进程崩溃
  - coredump + lldb
- 阿里云有提供比较成熟的 node 性能监测平台,alinode

[Node.js 精进（9）——性能监控](https://zhuanlan.zhihu.com/p/608553021?utm_id=0)  
[v8-profiler-next](https://www.npmjs.com/package/v8-profiler-next)

## 介绍一下 nodejs 的事件循环

- 分为 6 个阶段，每个阶段都有一个队列，存储要执行的回调
  - timer（定时器）
  - pending（系统相关，比如端口监听）
  - idle，prepare（系统内部）
  - poll（I/O 操作，比如文件读写）（）
  - check（执行 setImmediate 回调）
  - close（关闭事件回调）

## require 原理

- 路径分析
  - 内置模块
  - 相对路径
  - 绝对路径
  - 第三方模块
- 文件定位
- 编译导出
