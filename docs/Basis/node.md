## node事件循环机制
node事件循环包含6个阶段：
- timers阶段：执行已经到期的timer(setTimeout、setInterval)回调
- I/O callbacks阶段：执行I/O（例如文件、网络）的回调
- idle,prepare阶段：node内部使用
- poll阶段：获取新的I/O事件, 适当的条件下node将阻塞在这里
- check阶段：执行setImmediate回调
- close callbacks阶段：执行close事件回调，比如TCP断开连接

?> 参考文献：[JavaScript中事件循环和Nodejs中事件循环](https://blog.csdn.net/u014465934/article/details/89176879?utm_medium=distribute.pc_relevant_t0.none-task-blog-BlogCommendFromMachineLearnPai2-1.compare&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-BlogCommendFromMachineLearnPai2-1.compare)

microtask会在事件循环的各个阶段之间执行，当一个macrotask阶段所有任务执行完毕，就会去执行microtask队列的任务。

### setImmediate
该方法用来把一些需要长时间运行的操作放在一个回调函数里,在浏览器完成后面的其他语句后,就立刻执行这个回调函数

### process.nextTick
定义出一个动作，并且让这个动作在下一个事件轮询的时间点上执行

实际上node中存在着一个特殊的队列，即nextTick queue。这个队列中的回调执行虽然没有被表示为一个阶段，当时这些事件却会在每一个阶段执行完毕准备进入下一个阶段时优先执行。当事件循环准备进入下一个阶段之前，会先检查nextTick queue中是否有任务，如果有，那么会先清空这个队列。与执行poll queue中的任务不同的是，这个操作在队列清空前是不会停止的。这也就意味着，错误的使用process.nextTick()方法会导致node进入一个死循环。。直到内存泄漏

同一个循环中，process.nextTick执行优先于setImmediate

###  三种观察者
setTimeout采用的是类似IO观察者，setImmediate采用的是check观察者，而process.nextTick()采用的是idle观察者
三种观察者的优先级顺序是：idle观察者 > io观察者 > check观察者

### 进程通信
  - 通过`stdin、stdout`传递json（标准的输入输出流通信，但无法跨机器）
  - `内置的IPC`机制通信（相比第一个种正规一些）
  - 使用套接字`socket`（不仅跨进程还能跨机器，但存在网络性能损耗）
  - `message queue` 通过增设一个中间层来通信 (rsmq、redis)

### 创建进程方式
 - `spawn` 返回一个基于`流`的子进程对象
 - `exec` 创建子`shell`去执行命令，用来直接执行shell命令
 - `execFile` 不通过shell来执行，要求传入可执行文件，去创建任意你指定的文件的进程
 - `fork` `spawn`的增强版，用来创建`Node进程`，最大的特点是父子进程自带通信机制（IPC管道）

https://www.cnblogs.com/eret9616/p/11105840.html

### cluster模块原理

- 创建主进程`master`
- `fork`多个子进程`worker`
- 调用`child_process`启动子进程返回主进程的`process对象`，当在主进程获取它后，就可以共享worker进程的消息能力，从而在资源隔离的条件下实现master和worker进程的`跨进程通讯`。

https://www.cnblogs.com/dashnowords/p/10958457.html
