## 介绍一下 nodejs

- 基于 V8 引擎，可以在服务器端运行 js 的环境
- 适合 I/O 密集型任务，不适合 CPU 密集型任务

## nodejs 特点

- `非阻塞 I/O`
  - cpu 可以去做别的事情
- `事件驱动`
  - 调用队列 + 事件循环
- `单线程`
  - I/O 多路复用

## 应用场景

- 高并发场景：聊天室、博客、论坛等应用
- BFF 层
- 前端工程化的工具

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

- 洋葱模型是一个中间件机制
- 以 `next` 调用作为`分割点`，同一个中间件会`进来两次`，在 next 前可以处理一次，next 后又可以处理一次
- next 前由外到里处理 request 的逻辑，next 后有里到外执行 response 逻辑
- 上游中间件通过 context 拿到下游中间件处理数据后的信息
- 洋葱模型使多个`中间件`配合工作`更加简单`流畅

### 洋葱模型实现和使用

- koa 利用一个数组存储中间件以及递归的方式实现洋葱模型
- 外部使用时传入 async 函数，并带有两个参数，context 和 next 函数
- 以 next 执行作为分界点，上部分逻辑先执行，下部分后执行

### 洋葱模型好处

- 相较于 express 没有回调地狱的问题，使用 async/await 语法，代码清晰
- 每个中间件按顺序执行
- 适合用于日志、统计等场景

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

- express 和 koa 是两个比较底层的 node 框架，egg 和 nest 是企业级框架，会有更多的`规范化代码写法`以及`开箱即用`的功能
- `express` 已经集成一些常用功能（比如路由、静态资源等），所以包会大一些，koa 相对轻量，没有内置太多中间件，需要另外安装
- `koa` 更轻量，而且支持完美`洋葱模型`，express 支持同步的洋葱不支持异步洋葱，在异步调用下，next 下方的逻辑可能会提前执行（关键在于 koa 的 next()调用后返回一个 promise，会等待这个 promise 执行，而 express 的 next()调用返回 void 不会返回 promise）
- express 和 koa 的核心都是`中间件`的链式调用
- `egg` 基于 Koa 封装的框架，集成了多进程模式（master、worker、agent）开发热更新、进程守护、路由、日志监控等等，开箱即用
- `Nest` 基于 TS，使用了大量的装饰器语法，开发体验类似于 Java 的 Springboot。除此之外，Nestjs 还提供了 GraphQL、WebSocket、各种 MQ 和微服务的解决方案，比较适合大型后端项目的开发。

## 把 node12 升级到 node18 带来的好处

- 使用更高版本的`V8 引擎`，更好的性能
- 使用更高版本的`OpenSSL`，提供更安全的密钥算法以及 ssl 协议
- 支持`monorepo`项管特性，用于一库多项目的项目管理解决方案（npm7 以后支持的功能）
- 支持`esmodule`代码组织方式（需要在 package.json 上配置 type=module）

## node 爆内存如何处理

- 收集报错信息
- 定位具体代码位置
- 分析原因
- 解决问题
  - 调整代码，不需要的内存变量及时释放
  - 设置 max-old-space-size 扩大运行内存
- 设置通知警告，及时处理

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
  - poll（I/O 操作，比如文件读写）
  - check（执行 setImmediate 回调）
  - close（关闭事件回调）
- 注意
  - 如果是同步代码开始，同步代码执行完毕，才进入 Event Loop，然后从 timer 开始到 check 阶段
  - process.nextTick 会在其他微任务之前先执行
    - nextTick 有自己的队列，优先级比 Promise 队列更高

## require 原理

- 路径分析
  - 内置模块
  - 相对路径
  - 绝对路径
  - 第三方模块
- 文件定位
- 编译导出

## Buffer 和流

- Buffer 用来存储和操作二进制数据，是一个类似于数组的对象，它的每个元素都是一个表示 8 位字节的整数
- stream 流，一种处理流式数据的接口，用于读取、写入、转换和操作数据流。比如读取文件，使用流我们可以一点一点来读取文件，每次只读取或写入文件的一小部分数据块，而不是一次性将整个文件读取或写入到内存中或磁盘中，这样做能够降低内存占用。
- 使用 stream 流读写更高效（fs.createReadStream）

## 什么是 ORM？Nodejs 的 ORM 框架有哪些？

- 操作数据库需要写很多 SQL 语句，`ORM 框架通过对 SQL 语句进行封装`。然后将数据库的表格和用户代码里的模型对象，进行映射，这样用户只需要调用模型对象的方法就能实现数据库的增删改查。
- Node.js 中比较流行的 ORM 框架有：
  - Sequelize：Sequelize 是一个基于 Promise 的 ORM 框架，支持 MySQL、PostgreSQL、SQLite 和 Microsoft SQL Server 等多种关系型数据库。它提供了丰富的 API，可以轻松地进行数据模型定义、查询构建、事务管理等操作。
  - TypeORM：TypeORM 是一个基于 TypeScript 的 ORM 框架，支持 MySQL、PostgreSQL、SQLite、Microsoft SQL Server 和 Oracle 等多种关系型数据库。它提供了基于装饰器的实体定义和关系映射，支持事务、查询构建和关系处理等高级功能。

## 有了解过分布式和微服务吗？

- 分布式就是把应用部署在多个机器上形成的集群
- 分布式的集群不仅带来了算力和并发能力，也带来了各种问题，这其中包括：分布式通信、分布式事务、分布式 id、分布式容错、负载均衡等。
- 所以就需要有各种中间件来解决这些问题，比如 Nginx、Zookeeper、Dubbo、MQ、RPC 等。
- 然后当项目规模进一步扩大的时候，不仅要考虑集群，还要考虑项目的拆分，这时候就要上微服务架构了。把一个大项目根据业务拆分成很多功能单一的模块，可以由不同的团队独立开发和部署。
- 比如一个直播平台，拆分成：用户、直播、支付、实时消息（实时聊天、弹幕、点赞）、推送服务（开播提醒、活动提醒）
- 比如一个电商的后台 API，可以拆分成用户服务、商品服务、订单服务、优惠券服务、广告服务，这些服务由不同的团队去维护。

[前端面试：Nodejs 面试题「2023」](https://zhuanlan.zhihu.com/p/631675868)
