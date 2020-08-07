## 在线AST抽象树生成网站
https://astexplorer.net/

## 事件循环机制
从一个主任务开始，当前执行栈执行完毕时会立刻先处理所有微任务队列中的事件，然后再去宏任务队列中取出一个事件。`同一次事件循环中，微任务永远在宏任务之前执行`

### 宏任务（macrotask）
setTimeOut、setInterval、setImmediate、I/O、各种callback、UI渲染、messageChannel等  
优先级：主代码块 > setTimeOut/setInterval > postMessage > setImmediate

### 微任务（microtask）
process.nextTick(node才有) 、Promise 、MutationObserver(浏览器才有) 、async(实质上也是promise)  
优先级：process.nextTick > Promise > MutationOberser

?> 参考文献：[详解JavaScript中的Event Loop（事件循环）机制](https://blog.csdn.net/qq_33572444/article/details/79106935?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.compare&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.compare)

当一个宏任务执行完就去完成微任务队列中所有microtask任务
