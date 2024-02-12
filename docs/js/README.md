## typeof null 返回什么，为什么？

- typeof null 会返回'object'；
- javascript 在开发第一版的时候遗留下来的问题；
- 数据存储在底层是以二进制的形式存储的，在判断类型的时候是按二进制的前三位来进行判断的；
- null 在表示成二进制的时候所有的位都是 0，然后对象的类型判断也是三个 0，正好 null 和 object 的冲突了；

## 0.1+0.2 为什么不等于 0.3？

- 双精度计算问题，计算时发生了`两次精度丢失`，js 中所有的数都是双精度浮点数(64 位)：符号位（1）+整数位（11）+小数位（52）
  - 第一次发生在小数转换成二进制时
    - 无限不循环小数
  - 第二次发生在两数相加时
- 解决办法
  - 先把数组乘以 10 转换成整数计算，计算完再转换回去

## var、let 和 const 的区别

- let 和 const 是 es6 出现的语法，var 和 let、const 都可以用来定义变量
- var 在全局定义时会被挂载到 `window` 对象上，let 和 const 不会
- var 定义的变量只有函数`作用域`，let 和 const 存在块级作用域
- var 定义的变量存在`变量提升`，let 和 const 则需要先定义再使用，因为存在暂时性死区会报错
- var 定义的变量还存在`变量覆盖`，let 和 const 不能重复定义，会报错
- const 的特性跟 let 差不多，最主要的区别是 const 在定义时需要`赋值`，不赋值会报错，在定义后的变量不能再次赋值，再次赋值也会报错

## Map 和 Set 的区别

- Map 和 Set 是 es6 的语法
- Map 是键值对的集合，Set 是值的集合，都支持枚举
- Map 的 key 可以存任何类型的值
- Set 的每一项也都是任何类型的值，不同的是每一项都是唯一不重复的

### Map 和 WeakMap 的区别

- Map 和 WeakMap 都是键值对的集合
- Map 的 key 可以存任何类型的值，WeakMap 的 key 只能存引用类型
- WeakMap 中当存储的这个引用类型的值在外部没有被引用时，会被 GC 回收，WeakMap 上存储的这一项也会相应地被去除掉
- Map 支持枚举，WeakMap 不支持枚举，因为 WeakMap 的 key 是弱引用不稳定，同时也没有 size 属性

## 介绍一下闭包

- 能访问外部作用域上的变量的`函数`就是闭包
- js 中通过`函数返回函数`产生闭包
- 通过闭包我们可以用来做数据的`缓存`，以及产生`局部变量`不受外界干扰
- 常见的运用`场景`有单例模式、防抖、函数柯里化的实现等等
- 当闭包不使用时应及时清除，避免导致`内存泄漏`、`内存溢出`等问题
  - 闭包要手动清除避免变量对象长时间驻留在内存上得不到垃圾回收机制清除，越积越多，最终导致
  - 内存泄漏：之前申请的内存`没有及时释放`
  - 内存溢出：申请内存时超过最大限度，`没有足够分配内存的空间`

## 介绍一下作用域

- 作用域是定义变量的一片区域，由定义时确定下来，作用域有全局作用域、函数作用域、块级作用域
- 多个作用域嵌套形成的查找`链条`叫作用域链，当我们要访问一个变量时，先从当前的作用域上找，然后逐层往上找，最后找到全局作用域如果都`没有`，则`报错`

## 介绍一下执行上下文

- 函数执行时各种变量、参数、作用域以及 this 值等`信息的集合`
- 通过执行上下文可以访问到作用域链和 this 等信息

## 原型的作用

- 原型是对象属性和方法的集合，每一个构造函数都一个 prototype 指向他的原型，每一个对象都有个`__proto__`指向他的原型
- js 实现面向对象的方式
- 通过原型可以判断一个实例的类型，原型的存在避免类型的丢失

## 介绍一下原型链

- 每个对象都有一个`__proto__`属性，默认情况下 proto 指向构造函数的`原型`（prototype），每个原型又有自己的 proto 属性指向他的自己原型，以此通过 proto 属性连接形成的一个`访问链条`就是原型链
- 当我要访问一个对象属性时，对象上不存则在 proto 上去找，一直找到最终 proto 指向的 null 为止，如果没有找到属性则返回 undefined
- 通过原型链实现继承

## js 代码运行的时候发生了什么

- js 是`解释型语言`，一边解释一边运行
- 代码运行时分为以下阶段：
  - `解析阶段`
    - 词法分析
    - 语法分析
    - 确定作用域链和变量提升
  - `编译阶段`
    - 预编译
    - 生成字节码
  - `执行阶段`
    - 创建执行上下文，放入调用栈执行
      - 包含：变量环境、作用域链、this 等
  - `垃圾回收`

?>[JS 代码运行的时候发生了什么](https://juejin.cn/post/7269684436538114106)

## new 一个对象

- 创建一个空对象（Object.create({})）
- 把构造函数的原型链赋值到创建的空对象的`__proto__`属性上（`o. __proto__` = fn.prototype）
- 执行构造函数，把 this 指向空对象（fn.call(o,...args)）
- 针对执行的结果进行判断，如果是引用类型直接返回，如果是基本类型就返回上面那个对象（(typeof result === 'object'|| typeof result ==='function') ? result : o）

## js 有多少种数据类型

- 8 种
- undefined、null、boolean、number、string、symbol、bigint
- object（Function、Array、Date）

## 箭头函数和普通函数的区别

- 箭头函数的 this 指向定义时的外层对象，普通函数的 this 指向调用时的对象
- 箭头函数没有自己的 this ，this 是继承过来的，箭头函数中 this 不能直接被改变，调用 call、apply、bind 方法会执行，但是 this 的指向不会改变
- 箭头函数没有 arguments 对象
- 箭头函数没有 prototype 原型对象
- 箭头函数不能作为构造函数被 new 执行，会报错（is not a constructor）

```js
const obj = {
  a: function () {
    return () => {
      console.log(this);
    };
  },
};
const b = { ttt: 123 };
console.log(obj.a.call(b)()); // 输出 { ttt: 123 }
```

## promise 和 async await 的区别

- promise 和 async await 都是`处理异步代码`的方式
- async await 相对于 promise 代码`写法`更简洁优雅
- async await 是 generator 的语法糖，带有 async 关键字的函数执行后会返回一个 promise 实例，await 关键字要用于带有 async 关键字的函数内
- 在`异常处理`方面，async await 语法通过一个 try catch 就能同时捕获同步和异步产生的错误， promise 不能直接通过 try catch 捕获错误，需要通过 promise.catch 这个 api 去捕获错误

?>
**generator**

- generator 是一个带\*的函数
- 通过 yield 暂停代码
- 通过 .next() 执行代码的下一步
- 最后调用.done 完成

### Promise api

- Promise.all（所有成功才成功）
  - 如果其中一个发生拒绝，则返回一个包含这个拒绝原因的被拒绝的 promise，所有被兑现，则返回一个包含所有兑现结果数组的被兑现的 promise
- Promise.allSettled（各自独立）
  - 当所有 promise 被敲定，返回被兑现的 promise ，并带有每个 promise 结果的对象（status、value、reason）数组
- Promise.any（所有拒绝才拒绝）
  - 其中一个被兑现，则返回一个包含该兑现结果的被兑现的 promise，如果所有都被拒绝就返回一个包含拒绝原因数组的被拒绝 promise
- Promise.race（竞争）
  - 随第一个被敲定的 promise

## for in 和 for of 区别

- for in 是 es5 的语法，for of 是 es6 的语法
- for in 和 for of 都可以用于遍历数组
- 一般情况下 `for of 不支持遍历对象`，因为 for of 只能遍历拥有 Symbol.iterator（`迭代器`）属性的对象，Object 原生情况下没有迭代器，所以 for of 遍历对象会报错，给对象实现一个迭代器才可以使用 for of 进行遍历
- for in 用于遍历对象上的`可枚举属性`，还会把对象原型链上的可枚举属性遍历出来。如果不想遍历原型链上的属性的话，需要调用 hasOwnProperty 方法过滤一下
- 还有一个特性是 for in 在遍历数组时，每个遍历的`下标都是字符串`类型而不是数字类型

### 迭代器如何实现

- 通过 generator 可以实现一个迭代器，通过定义带星号（\*）的函数，里面定义个 for 循环，不断地去 yield
- for-of 循环每执行一次，就调用这个迭代器的 next 方法，每次调用会返回一个`结果对象`,这个结果对象有两个属性（value 和 done），value 表示每次 yield 关键字后面的值，done 用来表示是否结束，true 为结束
- 不能使用箭头函数来创建 generator（生成器）

## 如何取消 xhr 和 fetch 请求

- xhr（xmlhttprequest）通过 xhr 实例的 abort 方法进行请求取消，并且 readyState 值变成 0
- fetch 请求，通过 AbortController 实例的 abort 方法进行请求取消，并且 fetch 返回的 promise 实例的状态会变成 reject

### readyState 有多少种状态

- 5 种状态
  - 0 未初始化
  - 1 open()调用
  - 2 send()调用
  - 3 下载中
  - 4 完成

## fetch 和 xhr 的区别

- fetch 支持 `promise`，xhr 需要自己封装
- fetch 默认下，不管是同域还是跨域都不会带上 `cookie`（需要配置 credentials 属性为 include）
- fetch 不支持`进度事件`（addEventListener progress）
- fetch 和 xhr 都支持`中断请求`(AbortController signal)

## Proxy 和 Reflect

- Proxy 是创建一个代理对象，挟持自定义对某个对象的操作
- Reflect 是原生提供一些操作对象方法的内置对象，不能被 new
- 把一些原本放在 Object 上的明显属于内置语言的方式放到 Reflect 中更合理，比如 Object.defineProperty
- 把一些操作符用法变成函数行为，如 in、 delete
- 配合 Proxy 使用，通过 Reflect 执行默认行为操作对象

### receiver

- get(target, key, receiver)
- 指向当前的 proxy 对象或者继承下的对象
  - 比如是通过原型链访问的情况，那么在 getter 中拿到的 receiver 就是当前调用的对象
- 有点像 this，指向当前调用的对象
- 不管是 Proxy 还是 Reflect 传入的第三个参数都是为了改变 this 的指向

## 继承

- `原型链继承` 将父类的实例作为子类的原型
  - 缺点：所有实例共用同一个原型
    ```js
    function SupType() {}
    function SubType() {}
    SubType.prototype = new SupType();
    ```
- `构造函数继承` 在子类构造函数中调用父类的构造函数
  - 缺点：只能继承父类构造函数中定义的属性和方法，不能继承原型上的属性和方法
    ```js
    function SupType(prop) {
      this.prop = prop;
    }
    function SubType() {
      SupType.call(this, prop);
    }
    ```
- `组合式继承` 结合原型链和构造函数完成继承
  - 缺点：父类的构造函数执行了两遍
- `寄生式继承`（原型式继承） 不实例化父类，通过创建一个原型指向父原型的空对象，然后把子原型指向空对象
  - 缺点：子类不能向父类传参、共用同一个原型
    ```js
    function SupType() {}
    function SubType() {}
    function object(o) {
      function F() {}
      F.prototype = o;
      return new F();
    }
    function inheritPrototype(SupType) {
      const obj = object(SupType.prototype); // Object.create(SupType.prototype);
      prototype.prop = "xxx";
      prototype.fn = () => {};
      return obj;
    }
    SubType.prototype = inheritPrototype(SupType);
    ```
- `组合寄生式继承` 使用寄生式继承来继承父类的原型（把 constructor 和 prototype 拆开继承），然后再将过渡对象赋值给子类型的原型，解决组合式继承时父类调用两次问题
  - 优点
    - 只调一次父构造函数
    - 支持父类传参
    - 父类属性不会被共享
    ```js
    function SupType(prop) {
      this.prop = prop;
    }
    function SubType(prop) {
      SupType.call(this, prop);
    }
    function inheritPrototype(SubType, SupType) {
      const prototype = Object.create(SupType.prototype);
      prototype.constructor = SubType; // 修正 prototype 的 constructor 指向
      SubType.prototype = prototype;
    }
    inheritPrototype(SubType, SupType);
    new SubType("xxx");
    ```
- es6 的 class`extends`关键字方式继承
  ```js
  class SupType {}
  class SubType extends SupType {
    constructor() {
      super();
    }
  }
  ```

### es5 继承和 es6 继承的区别

- es5 继承时，会先创建子类的实例，再将父类的属性方法添加到子类上
- es6 继承时，会先创建父类的实例，通过调用 super 修改子类的 this

## get 和 post 的区别

- get 请求参数`放` URL 上，post 请求放 body 上（get 也能把数据放 body 上传输，post 也能把数据放 url 上传输）
- get 没有`长度`限制，post 有长度限制
- post 相对 get 跟`安全`一点
- get 请求是`幂等`的可以被缓存在浏览器历史中，post 请求不可以
- 在底层中，都基于 tcp 协议，get 请求发送一个 tcp 数据包，post 会发送两个 tcp 数据包
- 在应用场景中，get 一般用于去获取数据，post 一般用于提交数据

## axios 封装

- axios.create 创建实例，设置 url、timeout、headers 请求头
- 设置请求拦截器，添加身份验证逻辑
- 设置响应拦截器，处理错误码逻辑和数据格式化
- 封装 get、post 等其他请求

## 隐藏类

- 在 V8 引擎的对象解析原理中，在创建对象时，都会分配一个隐藏类，以便能快速找到对象属性所存储的内存地址
- 如果属性相同时，共用同一个隐藏类，节省内存，提高属性查找效率
- 属性不同时会新建新的隐藏类，频繁创建隐藏类会造成性能问题
- 优化建议
  - 尽量避免频繁动态添加属性和删除属性
  - 按照相同属性顺序创建对象
