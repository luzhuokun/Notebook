## 在线AST抽象树生成网站
https://astexplorer.net/

## 基本数据类型

String、Number、Boolean、Underfind、Null、Symbol

## 引用数据类型

Object、Array、Date、Function、RegExp

## js引擎执行过程的三个阶段：
- 语法分析
- 预编译阶段
- 执行阶段

?>[JS引擎线程的执行过程](https://www.jianshu.com/p/0972f9ed4a8c)


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

## 浏览器事件循环机制
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

## Set和Map的对比

- Set是无重复的有序列表。不能直接对Set排序和访问，可以通过has来访问是有有此值
- Map是有序的键值对，键可以是任意的数据类型
- WeakSet和WeakMap都是弱引用，WeakSet中的值和WeakMap中的键只能是对象，当它是某个对象的仅存引用时，也不会屏蔽垃圾回收

参考：[Function.prototype.bind()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
