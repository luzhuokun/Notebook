## 在线AST抽象树生成网站
https://astexplorer.net/

## 基本数据类型
String、Number、Boolean、Underfind、Null、Symbol
[细说 JavaScript 七种数据类型](https://www.cnblogs.com/onepixel/p/5140944.html)
[js中的数据、内存和变量](https://blog.csdn.net/Wayne1998/article/details/80458439)

## 数组array
- 数组内所有元素`相同类型`
- 分配一块`连续的内存存储`
- 通过`索引`计算`存储地址`快速地找到数据

!> 注意：js的数组比较特殊
- 元素不同类型
- 长度不固定

### v8引擎区分快数组和慢数组
- 一般建立快数组，分配一块连续的内存空间并预留一些空间扩充
- 快慢数组间可以相互转行，当快数组扩容的数量大于1024就变慢数组，慢数组缩容至原来的50%以下就变慢数组

## 引用数据类型

Object、Array、Date、Function、RegExp

## js引擎执行过程的三个阶段：
- 语法分析
- 预编译阶段
- 执行阶段

?>[JS引擎线程的执行过程](https://www.jianshu.com/p/0972f9ed4a8c)

## Blob二进制文件对象
存放二进制数据
- File继承Blob对象，浏览器将Blob存储在内容或者磁盘上，如果Blob非常大是不能直接存到内存上的，会缓存到磁盘上
https://www.cnblogs.com/tianma3798/p/13582341.html

## ArrayBuffer和Blob
- 都是用于存储二进制数据
- ArrayBuffer可以进行读写，Blob可读不可写
- ArrayBuffer和Blob可以相互转换

## 原型
在javascript中，每个函数都有一个prototype属性，这个属性执行函数的原型对象

## 原型链

每个实例对象都有一个__proto__私有属性（这个私有属性指向构造函数的原型对象），每一个原型对象都有自己的原型对象，当我们试图寻找一个对象的属性时，会层层向上访问每个原型对象直到一个对象的原型对象为null（根据定义，null没有原型，因此他作为这个原型链的最后一环）。

## 继承

### 原型链继承
子类原型指向父类实例，把Sub.prototype指向（new Sup 对象）or（通过Object.create(Sup.prototype)）  

?>
[继承与原型链](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)  
[js继承的几种方式](https://zhuanlan.zhihu.com/p/37735247)
`Object.create`定义：创建一个新对象，并把这个新对象的__proto__指向提供过来的对象  
(注意坑位：用此方法创建的对象没有继承Object，因此Object上的方法他都拿不到)

## 浏览器事件循环机制
`主线程`把`同步任务`放到`调用栈`中执行，把不同的`异步任务`分别放入`microtask微任务队列`和`macrotask宏任务队列`中去，待`调用栈`空闲时执行`任务队列`中的事件，先把`microtask微任务队列`里所有的`微任务`执行，然后从`macrotask队列`中取一个`宏任务`执行，执行完后, 取出所有的`microtask`执行，如此重复就是`浏览器事件循环`。  

### 宏任务（macrotask）
setTimeOut、setInterval、setImmediate、I/O、各种callback、UI渲染、messageChannel、ajax(XMLHttpRequest)等  
优先级：主代码块 > setTimeOut/setInterval > postMessage > setImmediate

### 微任务（microtask）
process.nextTick(node才有) 、Promise 、MutationObserver(浏览器才有) 、async/await(promise的语法糖)  
优先级：process.nextTick > Promise > MutationOberser

?> 参考文献：[详解JavaScript中的Event Loop（事件循环）机制](https://blog.csdn.net/qq_33572444/article/details/79106935?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.compare&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.compare)

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

## Set和Map的对比

- Set是无重复的有序列表。不能直接对Set排序和访问，可以通过has来访问是有有此值
- Map是有序的键值对，键可以是任意的数据类型
- WeakSet和WeakMap都是弱引用，WeakSet中的值和WeakMap中的键只能是对象，当它是某个对象的仅存引用时，也不会屏蔽垃圾回收

参考：[Function.prototype.bind()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)

## 执行上下文
- 一段代码的执行就会产生一个执行上下文，执行上下文用于跟踪代码的运行情况，执行上下文被保存到一个stack栈中，当代码执行到尾部时就弹出stack

## 作用域
- 作用域在函数执行的时候产生，包含了变量、常数、函数等定义和赋值信息。
- 作用域包括：全局作用域、函数作用域、块级作用域

### 作用域链
当要寻找一个对象时，当前的作用域上找不到这个对象就会往上一个作用域去找，直到往全局作用域去找
