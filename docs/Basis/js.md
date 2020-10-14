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

## 遇到的一些语法坑

### 箭头函数
- this，arguments，super 指向的对象并不是当前函数，而是定义时的函数的this，arguments，super
[箭头函数的坑](https://www.jianshu.com/p/568ddbc08313)

### promise问题
- promise有三个状态：pending、fulfilled、rejected。当状态变成后两者其中一个时，后面不会再次改变状态
- promise在内部状态变成fulfilled时才把then中的函数放入微任务队列中等待执行

!>[promise经典题](https://blog.csdn.net/qq_30811721/article/details/106849630)


## bind的特性
- 调用bind时，this指向函数的第一个参数，其余参数作为新函数的参数
- 当new运算符构造绑定函数时，则忽略第一个参数的值
- 第一个参数如果是任何原始值都会被转换成object
- 当第一个参数的值为null或undefined时，执行的作用域指向新函数的this

参考：[Function.prototype.bind()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
